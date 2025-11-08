import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
  questions: [
    {
      id: { type: Number, required: true },
      question: { type: String, required: true },
      options: [{ type: String }],
      correctAnswer: { type: Number, required: true },
    }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  aiGenerated: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Draft', 'Closed'], default: 'Active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Exam = mongoose.model('Exam', examSchema);
