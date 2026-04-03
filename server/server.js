import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import studentRoutes from './routes/studentRoutes.js'; 
import facultyRoutes from './routes/facultyRoutes.js'; 

dotenv.config();

const app = express();

// Required if you are hosting your backend on a service like Render, Railway, or Heroku
// This allows the secure cookies to be sent through their reverse proxies.
app.set('trust proxy', 1);

// Middleware
app.use(express.json());

// --- UPDATED CORS CONFIGURATION ---
const allowedOrigins = [
  'http://localhost:5173', 
  'https://student-management-system-kk.netlify.app' // Make sure there is NO trailing slash at the end
];

app.use(cors({ 
  origin: allowedOrigins, 
  credentials: true 
}));

// --- UPDATED SESSION CONFIGURATION ---
app.use(session({
  secret: process.env.SESSION_SECRET || 'mysecretessionkey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour
    httpOnly: true,
    // MUST be true for cross-origin cookies (production). False for localhost.
    secure: process.env.NODE_ENV === 'production', 
    // MUST be 'none' for cross-origin (Netlify to Backend). 'lax' for localhost.
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
  }
}));

// Database connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB Connected successfully'))
  .catch((err) => console.log('❌ DB Connection Error:', err));

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes); 
app.use('/api/faculty', facultyRoutes); 

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});