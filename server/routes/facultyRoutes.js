import express from 'express';
import Student from '../models/Student.js';
import Curriculum from '../models/Curriculum.js'; 
import { verifyFaculty } from '../middleware/auth.js';

const router = express.Router();

// ==========================================
// STUDENT ROSTER ROUTE
// ==========================================

// Get all students for the Faculty's Class Roster
router.get('/students', verifyFaculty, async (req, res) => {
  try {
    // Fetches students from the DB (only returning necessary fields)
    const students = await Student.find({}, 'firstName lastName email course _id');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching class roster', error: error.message });
  }
});

// ==========================================
// CURRICULUM ROUTES
// ==========================================

// Add a new chapter to the syllabus
router.post('/curriculum', verifyFaculty, async (req, res) => {
  try {
    const { subjectName, chapterNumber, chapterName } = req.body;
    
    const newChapter = new Curriculum({
      facultyId: req.user.id, // Extracted from the verified JWT token
      subjectName,
      chapterNumber,
      chapterName
    });
    
    await newChapter.save();
    res.status(201).json({ message: 'Chapter added successfully!', chapter: newChapter });
  } catch (error) {
    res.status(500).json({ message: 'Error adding curriculum', error: error.message });
  }
});

// Get Faculty's own uploaded curriculum
router.get('/curriculum', verifyFaculty, async (req, res) => {
  try {
    // Find chapters created by this specific faculty member, sorted by Subject and Chapter
    const curriculum = await Curriculum.find({ facultyId: req.user.id })
      .sort({ subjectName: 1, chapterNumber: 1 });
      
    res.status(200).json(curriculum);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching curriculum', error: error.message });
  }
});

export default router;