import Certificate from '../models/Certificate.js';
import Template from '../models/Template.js';
import { generateCertificateId } from '../utils/generateId.js';

// @desc    Generate a single certificate record
// @route   POST /api/certificates/generate
export const generateCertificate = async (req, res, next) => {
  try {
    const { templateId, recipientData } = req.body;

    if (!templateId || !recipientData) {
      return res.status(400).json({ message: 'Template ID and recipient data are required.' });
    }

    // Verify template belongs to user
    const template = await Template.findOne({
      _id: templateId,
      userId: req.user._id,
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found.' });
    }

    const certificateId = generateCertificateId();

    const certificate = await Certificate.create({
      templateId,
      userId: req.user._id,
      recipientData,
      certificateId,
    });

    res.status(201).json(certificate);
  } catch (error) {
    next(error);
  }
};

// @desc    Generate bulk certificate records
// @route   POST /api/certificates/bulk-generate
export const bulkGenerateCertificates = async (req, res, next) => {
  try {
    const { templateId, recipients } = req.body;

    if (!templateId || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ message: 'Template ID and recipients array are required.' });
    }

    // Verify template belongs to user
    const template = await Template.findOne({
      _id: templateId,
      userId: req.user._id,
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found.' });
    }

    // Create certificate records for all recipients
    const certificates = await Certificate.insertMany(
      recipients.map(recipientData => ({
        templateId,
        userId: req.user._id,
        recipientData,
        certificateId: generateCertificateId(),
      }))
    );

    res.status(201).json({
      count: certificates.length,
      certificates,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify a certificate (public endpoint)
// @route   GET /api/certificates/verify/:certificateId
export const verifyCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({
      certificateId: req.params.certificateId,
    }).populate('templateId', 'name');

    if (!certificate) {
      return res.status(404).json({
        verified: false,
        message: 'Certificate not found. This certificate ID is invalid.',
      });
    }

    res.json({
      verified: true,
      certificate: {
        certificateId: certificate.certificateId,
        templateName: certificate.templateId?.name || 'Unknown',
        recipientData: Object.fromEntries(certificate.recipientData),
        issuedAt: certificate.issuedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's certificates
// @route   GET /api/certificates
export const getCertificates = async (req, res, next) => {
  try {
    const { templateId } = req.query;
    const filter = { userId: req.user._id };
    if (templateId) filter.templateId = templateId;

    const certificates = await Certificate.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('templateId', 'name');

    res.json(certificates);
  } catch (error) {
    next(error);
  }
};
