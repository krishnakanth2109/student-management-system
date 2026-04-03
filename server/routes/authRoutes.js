import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import Student from '../models/Student.js'; // <-- IMPORTED
import Faculty from '../models/Faculty.js'; // <-- IMPORTED

const router = express.Router();

// 1. REGISTER ROUTE (Admin Only)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();

    const newCollectionName = `admin_settings_${newAdmin._id}`;
    await mongoose.connection.db.createCollection(newCollectionName);

    const token = jwt.sign({ id: newAdmin._id, role: newAdmin.role }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '1h' });
    req.session.token = token;
    res.status(201).json({ message: 'Registered successfully', token, role: newAdmin.role });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// 2. UNIVERSAL LOGIN ROUTE (Admin, Student, Faculty)
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    let user;
    
    // Determine which database collection to search based on the dropdown selected!
    if (role === 'ADMIN') {
      user = await Admin.findOne({ email });
    } else if (role === 'STUDENT') {
      user = await Student.findOne({ email });
    } else if (role === 'FACULTY') {
      user = await Faculty.findOne({ email });
    } else {
      return res.status(400).json({ message: 'Invalid role selected' });
    }

    if (!user) return res.status(404).json({ message: `No ${role.toLowerCase()} found with this email` });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '1h' });
    
    req.session.token = token;
    res.status(200).json({ message: 'Login successful', token, role: user.role });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;