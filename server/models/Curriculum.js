import mongoose from 'mongoose';

const curriculumSchema = new mongoose.Schema({
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  subjectName: { type: String, required: true },
  chapterNumber: { type: String, required: true },
  chapterName: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Curriculum', curriculumSchema);