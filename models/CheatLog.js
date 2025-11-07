import mongoose from 'mongoose';

const cheatLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  candidateName: { type: String, required: true },
  examTitle: { type: String, required: true },
  violations: [{ type: String }],
  aiProbability: { type: Number, default: 0 },
  aiAnalysis: { type: String, default: null },
  severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  reviewed: { type: Boolean, default: false },
  action: { type: String, default: null },
  detectedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const CheatLog = mongoose.model('CheatLog', cheatLogSchema);
