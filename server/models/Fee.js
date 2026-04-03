import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  academicYear: { type: String, required: true },
  semester: { type: String, required: true },
  tuitionFee: { type: Number, required: true },
  labFee: { type: Number, default: 0 },
  libraryFee: { type: Number, default: 0 },
  amountPaid: { type: Number, default: 0 },
  status: { type: String, enum: ['Unpaid', 'Partial', 'Paid'], default: 'Unpaid' },
  dueDate: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model('Fee', feeSchema);