import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // <-- ADDED
  role: { type: String, default: 'FACULTY' }  // <-- ADDED
}, { timestamps: true });

export default mongoose.model('Faculty', facultySchema);