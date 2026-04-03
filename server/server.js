import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import path from 'path';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import studentRoutes from './routes/studentRoutes.js'; 
import facultyRoutes from './routes/facultyRoutes.js'; 

dotenv.config();

const app = express();

// 1. Trust Proxy (REQUIRED for Render/Heroku to allow secure cookies)
app.set('trust proxy', 1);

// 2. Middleware
app.use(express.json());

// 3. ENHANCED CORS CONFIGURATION
const allowedOrigins = [
  'http://localhost:5173', 
  'https://student-management-system-kk.netlify.app'
];

app.use(cors({ 
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('netlify.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 4. PRODUCTION-READY SESSION CONFIGURATION
app.use(session({
  secret: process.env.SESSION_SECRET || 'mysecretessionkey',
  resave: false,
  saveUninitialized: false,
  proxy: true, // Required for secure cookies behind a proxy like Render
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    httpOnly: true,
    // 🔥 VERY IMPORTANT FOR PRODUCTION:
    secure: process.env.NODE_ENV === 'production', 
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
  }
}));

// 5. Static Folder for uploads (Optional, if you still use local storage)
app.use('/uploads', express.static('uploads'));

// 6. Database connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB Connected successfully'))
  .catch((err) => {
    console.error('❌ DB Connection Error:', err.message);
    process.exit(1); // Stop server if DB fails
  });

// 7. Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes); 
app.use('/api/faculty', facultyRoutes); 

// 8. Health Check Route (Good for Render monitoring)
app.get('/health', (req, res) => res.send('Server is running...'));

// 9. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});