import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import studentRoutes from './routes/studentRoutes.js'; // <-- ADD THIS
import facultyRoutes from './routes/facultyRoutes.js'; // <-- 1. ADD IMPORT
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Allow frontend

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'mysecretessionkey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour
    httpOnly: true,
  }
}));

// Database connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB Connected successfully'))
  .catch((err) => console.log('❌ DB Connection Error:', err));

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes); // <-- ADD THIS
app.use('/api/faculty', facultyRoutes); // <-- 2. ADD THIS LINE
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});