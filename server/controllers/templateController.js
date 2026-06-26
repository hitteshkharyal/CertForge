import path from 'path';
import fs from 'fs';
import Template from '../models/Template.js';

// Check if Cloudinary is configured
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== 'your_api_key';

let cloudinary = null;
if (isCloudinaryConfigured) {
  const mod = await import('../config/cloudinary.js');
  cloudinary = mod.default;
}

/**
 * Convert file info from multer to a URL.
 * - Cloudinary storage: req.file.path is already a URL
 * - Disk storage: req.file.path is a filesystem path → convert to /uploads/... URL
 */
const getFileUrl = (file) => {
  if (!file) return null;
  // Cloudinary: file.path is a full https:// URL
  if (file.path && file.path.startsWith('http')) {
    return file.path;
  }
  // Disk storage: convert absolute path to relative /uploads/... URL
  const uploadsIndex = file.path.replace(/\\/g, '/').indexOf('/uploads/');
  if (uploadsIndex !== -1) {
    return file.path.replace(/\\/g, '/').substring(uploadsIndex);
  }
  return file.path;
};

// @desc    Create a new template
// @route   POST /api/templates
export const createTemplate = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a template image.' });
    }

    const template = await Template.create({
      userId: req.user._id,
      name: req.body.name || 'Untitled Template',
      templateImageUrl: getFileUrl(req.file),
      templateImagePublicId: req.file.filename || null,
    });

    res.status(201).json(template);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all templates for current user
// @route   GET /api/templates
export const getTemplates = async (req, res, next) => {
  try {
    const templates = await Template.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-canvasJSON');

    res.json(templates);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single template
// @route   GET /api/templates/:id
export const getTemplate = async (req, res, next) => {
  try {
    const template = await Template.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found.' });
    }

    res.json(template);
  } catch (error) {
    next(error);
  }
};

// @desc    Update template (fields, canvas state, positions)
// @route   PUT /api/templates/:id
export const updateTemplate = async (req, res, next) => {
  try {
    const template = await Template.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found.' });
    }

    const allowedUpdates = [
      'name', 'fields', 'canvasJSON',
      'signaturePosition', 'stampPosition',
      'templateWidth', 'templateHeight',
      'canvasWidth', 'canvasHeight',
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        template[field] = req.body[field];
      }
    });

    await template.save();
    res.json(template);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an image — from Cloudinary if configured, or from local disk.
 */
const deleteImage = async (publicId, url) => {
  if (cloudinary && publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (e) {
      console.warn('Cloudinary delete failed:', e.message);
    }
  } else if (url && !url.startsWith('http')) {
    // Local file — attempt to delete
    try {
      const serverDir = path.resolve(path.dirname(new URL(import.meta.url).pathname.substring(1)), '..');
      const filePath = path.join(serverDir, url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (e) {
      console.warn('Local file delete failed:', e.message);
    }
  }
};

// @desc    Delete template
// @route   DELETE /api/templates/:id
export const deleteTemplate = async (req, res, next) => {
  try {
    const template = await Template.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found.' });
    }

    await deleteImage(template.templateImagePublicId, template.templateImageUrl);
    await deleteImage(template.signatureImagePublicId, template.signatureImageUrl);
    await deleteImage(template.stampImagePublicId, template.stampImageUrl);

    await Template.deleteOne({ _id: template._id });
    res.json({ message: 'Template deleted.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload signature image for template
// @route   POST /api/templates/:id/upload-signature
export const uploadSignature = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a signature image.' });
    }

    const template = await Template.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found.' });
    }

    // Delete old signature if exists
    await deleteImage(template.signatureImagePublicId, template.signatureImageUrl);

    template.signatureImageUrl = getFileUrl(req.file);
    template.signatureImagePublicId = req.file.filename || null;
    await template.save();

    res.json(template);
  } catch (error) {
    next(error);
  }
};

// @desc    Upload stamp image for template
// @route   POST /api/templates/:id/upload-stamp
export const uploadStamp = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a stamp image.' });
    }

    const template = await Template.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found.' });
    }

    // Delete old stamp if exists
    await deleteImage(template.stampImagePublicId, template.stampImageUrl);

    template.stampImageUrl = getFileUrl(req.file);
    template.stampImagePublicId = req.file.filename || null;
    await template.save();

    res.json(template);
  } catch (error) {
    next(error);
  }
};
