import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String, default: null },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, default: 'General' },
  tags: [{ type: String }],
  imageUrl: { type: String, default: null },
  imageCloudinaryId: { type: String, default: null },
  seoSummary: { type: String, default: null },
  views: { type: Number, default: 0 },
  status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Blog = mongoose.model('Blog', blogSchema);
