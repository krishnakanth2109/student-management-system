import express from 'express';
import Student from '../models/Student.js';
import Curriculum from '../models/Curriculum.js'; 
import { verifyFaculty } from '../middleware/auth.js';

const router = express.Router();

// ==========================================
// STUDENT ROSTER ROUTE
// ==========================================

// Get all students for the Faculty's Class Roster
// Ensure this is imported

// Get Dashboard Statistics for the Logged-in Faculty
router.get('/dashboard-stats', verifyFaculty, async (req, res) => {
  try {
    // 1. Total Enrolled Students
    const totalStudents = await Student.countDocuments(); 

    // 2. Curriculum Metrics for this specific Faculty member
    const myCurriculum = await Curriculum.find({ facultyId: req.user.id });
    const totalChaptersUploaded = myCurriculum.length;

    // 3. Group Chapters by Subject for the Line Chart
    const chaptersBySubject = await Curriculum.aggregate([
      { $match: { facultyId: req.user.id } },
      { $group: { _id: "$subjectName", count: { $sum: 1 } } },
      { $project: { subject: "$_id", chapters: "$count", _id: 0 } }
    ]);

    // 4. Get the 3 most recently added chapters
    const recentActivity = await Curriculum.find({ facultyId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('subjectName chapterName createdAt');

    res.status(200).json({
      totalStudents,
      totalChaptersUploaded,
      chaptersBySubject,
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching faculty stats', error: error.message });
  }
});
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