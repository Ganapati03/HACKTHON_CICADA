import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  examTitle: { type: String, required: true },
  score: { type: Number, required: true },
  percentage: { type: Number, required: true },
  answers: { type: Map, of: String },
  aiFeedback: { type: String, default: null },
  tabSwitches: { type: Number, default: 0 },
  completedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Result = mongoose.model('Result', resultSchema);
