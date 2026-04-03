import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  documentType: { type: String, required: true }, // e.g., Aadhaar, 10th Memo
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true }, // Cloudinary URL
  status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('Document', documentSchema);