import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import Document from '../models/Document.js';
import Fee from '../models/Fee.js';
import Faculty from '../models/Faculty.js';
import { verifyStudent } from '../middleware/auth.js';
import Curriculum from '../models/Curriculum.js'; // <-- Import at the top

dotenv.config();
const router = express.Router();

// --- Configure Cloudinary ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'college_student_documents',
    allowed_formats: ['jpg', 'png', 'pdf', 'jpeg']
  }
});
const upload = multer({ storage });


// ==========================================
// DOCUMENT ROUTES (Cloudinary)
// ==========================================

router.post('/documents/upload', verifyStudent, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const newDoc = new Document({
      studentId: req.user.id,
      documentType: req.body.documentType || 'Other',
      fileName: req.file.originalname,
      fileUrl: req.file.path // Cloudinary returns the live URL in req.file.path
    });

    await newDoc.save();
    res.status(201).json({ message: 'Document uploaded successfully', document: newDoc });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

router.get('/documents', verifyStudent, async (req, res) => {
  try {
    const documents = await Document.find({ studentId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch documents', error: error.message });
  }
});

// ==========================================
// FACULTY & FEE ROUTES (Unchanged)
// ==========================================
router.get('/instructors', verifyStudent, async (req, res) => {
  try {
    const instructors = await Faculty.find({}, 'fullName department email');
    res.status(200).json(instructors);
  } catch (error) { res.status(500).json({ message: 'Error fetching instructors', error: error.message }); }
});

router.get('/fees', verifyStudent, async (req, res) => {
  try {
    const fees = await Fee.find({ studentId: req.user.id });
    let totalDue = 0;
    fees.forEach(f => { totalDue += ((f.tuitionFee + f.labFee + f.libraryFee) - f.amountPaid); });
    res.status(200).json({ fees, totalDue });
  } catch (error) { res.status(500).json({ message: 'Failed to fetch fees', error: error.message }); }
});

router.post('/fees/pay/:feeId', verifyStudent, async (req, res) => {
  try {
    const { amount } = req.body;
    const fee = await Fee.findOne({ _id: req.params.feeId, studentId: req.user.id });
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });

    const totalFeeAmount = fee.tuitionFee + fee.labFee + fee.libraryFee;
    const remainingBalance = totalFeeAmount - fee.amountPaid;

    if (amount > remainingBalance) return res.status(400).json({ message: 'Payment exceeds balance' });

    fee.amountPaid += Number(amount);
    if (fee.amountPaid === totalFeeAmount) fee.status = 'Paid';
    else if (fee.amountPaid > 0) fee.status = 'Partial';

    await fee.save();
    res.status(200).json({ message: 'Payment successful', fee });
  } catch (error) { res.status(500).json({ message: 'Payment failed', error: error.message }); }
});
router.get('/curriculum', verifyStudent, async (req, res) => {
  try {
    // Populate faculty name so student knows who teaches it
    const curriculum = await Curriculum.find().populate('facultyId', 'fullName').sort({ subjectName: 1, chapterNumber: 1 });
    res.status(200).json(curriculum);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch curriculum', error: error.message });
  }
});

export default router;