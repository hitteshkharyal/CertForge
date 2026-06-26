import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  x: { type: Number, default: 100 },
  y: { type: Number, default: 100 },
  fontSize: { type: Number, default: 24 },
  fontFamily: { type: String, default: 'Inter' },
  fontColor: { type: String, default: '#1a1a2e' },
  fontWeight: { type: String, default: 'normal' },
  fontStyle: { type: String, default: 'normal' },
  textAlign: { type: String, default: 'center' },
  width: { type: Number, default: 200 },
  height: { type: Number, default: 40 },
}, { _id: false });

const templateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Template name is required'],
    trim: true,
    maxlength: [200, 'Template name cannot exceed 200 characters'],
  },
  templateImageUrl: {
    type: String,
    required: [true, 'Template image is required'],
  },
  templateImagePublicId: {
    type: String, // Cloudinary public_id for deletion
  },
  signatureImageUrl: {
    type: String,
    default: null,
  },
  signatureImagePublicId: {
    type: String,
    default: null,
  },
  stampImageUrl: {
    type: String,
    default: null,
  },
  stampImagePublicId: {
    type: String,
    default: null,
  },
  fields: [fieldSchema],
  canvasJSON: {
    type: String, // Fabric.js serialized canvas state
    default: null,
  },
  // Image overlay positions stored separately for PDF generation
  signaturePosition: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    width: { type: Number, default: 150 },
    height: { type: Number, default: 80 },
    angle: { type: Number, default: 0 },
    opacity: { type: Number, default: 1 },
  },
  stampPosition: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    width: { type: Number, default: 100 },
    height: { type: Number, default: 100 },
    angle: { type: Number, default: 0 },
    opacity: { type: Number, default: 1 },
  },
  templateWidth: { type: Number, default: 0 },
  templateHeight: { type: Number, default: 0 },
  canvasWidth: { type: Number, default: 0 },
  canvasHeight: { type: Number, default: 0 },
}, {
  timestamps: true,
});

// Index for fast user queries
templateSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Template', templateSchema);
