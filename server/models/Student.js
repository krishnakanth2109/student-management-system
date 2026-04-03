import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  course: { type: String, required: true },
  phoneNumber: { type: String }, // New Field
  address: { type: String },     // New Field
  gender: { type: String },      // New Field
  password: { type: String, required: true },
  role: { type: String, default: 'STUDENT' }
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);