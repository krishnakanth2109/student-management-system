import express from 'express';
import bcrypt from 'bcryptjs';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Fee from '../models/Fee.js'; 
import Course from '../models/Course.js'; 
import Document from '../models/Document.js'; // 🔥 IMPORTED DOCUMENT MODEL
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// ==========================================
// COURSE ROUTES
// ==========================================

// Add a New Course to the system
router.post('/add-course', verifyAdmin, async (req, res) => {
  try {
    const { courseName, duration, department } = req.body;
    
    const existingCourse = await Course.findOne({ courseName });
    if (existingCourse) return res.status(400).json({ message: 'Course already exists' });

    const newCourse = new Course({ courseName, duration, department });
    await newCourse.save();
    
    res.status(201).json({ message: 'Course created successfully', course: newCourse });
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
});

// Get All Courses (For frontend dropdowns)
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ courseName: 1 });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// ==========================================
// STUDENT ROUTES
// ==========================================

// Add Student with full details and hashed default password
router.post('/add-student', verifyAdmin, async (req, res) => {
  try {
    const { firstName, lastName, email, course, phoneNumber, address, gender } = req.body;
    
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) return res.status(400).json({ message: 'Student email already exists' });

    // Give them a default password of "password123"
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const newStudent = new Student({ 
      firstName, 
      lastName, 
      email, 
      course, 
      phoneNumber, 
      address, 
      gender, 
      password: hashedPassword 
    });
    
    await newStudent.save();
    res.status(201).json({ message: 'Student registered successfully! Default password is: password123' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding student', error: error.message });
  }
});

// Get All Students
router.get('/students', verifyAdmin, async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students' });
  }
});

// ==========================================
// FACULTY ROUTES
// ==========================================

// Add Faculty with hashed default password
router.post('/add-faculty', verifyAdmin, async (req, res) => {
  try {
    const { fullName, department, email } = req.body;
    
    const existingFaculty = await Faculty.findOne({ email });
    if (existingFaculty) return res.status(400).json({ message: 'Faculty email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const newFaculty = new Faculty({ fullName, department, email, password: hashedPassword });
    await newFaculty.save();
    
    res.status(201).json({ message: 'Faculty added successfully! Default password is: password123' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding faculty', error: error.message });
  }
});

// Get All Faculty
router.get('/faculty', verifyAdmin, async (req, res) => {
  try {
    const faculty = await Faculty.find().sort({ createdAt: -1 });
    res.status(200).json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching faculty' });
  }
});

// ==========================================
// FEE ROUTES
// ==========================================

// Assign Fee to a specific student
router.post('/assign-fee', verifyAdmin, async (req, res) => {
  try {
    const { studentId, academicYear, semester, tuitionFee, labFee, libraryFee, dueDate } = req.body;
    
    const newFee = new Fee({ 
      studentId, 
      academicYear, 
      semester, 
      tuitionFee, 
      labFee, 
      libraryFee, 
      dueDate 
    });
    
    await newFee.save();
    res.status(201).json({ message: 'Fee assigned successfully to student' });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning fee', error: error.message });
  }
});

// ==========================================
// DOCUMENT ROUTES (Admin Verification)
// ==========================================

// Get All Uploaded Documents (Populate with student name)
router.get('/documents', verifyAdmin, async (req, res) => {
  try {
    const documents = await Document.find()
      .populate('studentId', 'firstName lastName _id') // Gets student details tied to document
      .sort({ createdAt: -1 });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents', error: error.message });
  }
});

// Update Document Status (Verify/Reject)
router.put('/documents/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body; // Status will be "Verified" or "Rejected"
    const document = await Document.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    if (!document) return res.status(404).json({ message: 'Document not found' });
    
    res.status(200).json({ message: `Document marked as ${status}`, document });
  } catch (error) {
    res.status(500).json({ message: 'Error updating document status', error: error.message });
  }
});

export default router;