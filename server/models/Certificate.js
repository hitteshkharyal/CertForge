import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipientData: {
    type: Map,
    of: String, // Dynamic key-value pairs (field name → value)
    required: true,
  },
  certificateId: {
    type: String,
    required: true,
    unique: true,
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for verification lookups
certificateSchema.index({ certificateId: 1 });
// Index for user's certificates
certificateSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Certificate', certificateSchema);
