import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  ipAddress: { type: String, default: null },
  userAgent: { type: String, default: null },
  location: { type: String, default: null },
  country: { type: String, default: null },
  page: { type: String, required: true },
  referrer: { type: String, default: null },
  sessionId: { type: String, default: null },
  sessionDuration: { type: Number, default: 0 }, // in seconds
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  timestamp: { type: Date, default: Date.now },
});

export const Visitor = mongoose.model('Visitor', visitorSchema);
