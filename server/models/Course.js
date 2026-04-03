import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true, unique: true },
  duration: { type: String, required: true }, // e.g., "4 Years"
  department: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);