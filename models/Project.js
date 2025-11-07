import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  fullDescription: { type: String, required: true },
  tags: [{ type: String }],
  image: { type: String, default: null },
  imageCloudinaryId: { type: String, default: null },
  aiSummary: { type: String, default: null },
  status: { type: String, enum: ['Active', 'Archived'], default: 'Active' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Project = mongoose.model('Project', projectSchema);
