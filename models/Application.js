import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  jobTitle: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  position: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  resumeCloudinaryId: { type: String, default: null },
  aiScore: { type: Number, default: null },
  aiAnalysis: { type: String, default: null },
  status: { type: String, enum: ['Under Review', 'Interview Scheduled', 'Selected', 'Rejected'], default: 'Under Review' },
  interviewDate: { type: Date, default: null },
  appliedDate: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Application = mongoose.model('Application', applicationSchema);
