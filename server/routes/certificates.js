import { Router } from 'express';
import {
  generateCertificate,
  bulkGenerateCertificates,
  verifyCertificate,
  getCertificates,
} from '../controllers/certificateController.js';
import auth from '../middleware/auth.js';

const router = Router();

// Public verification endpoint (no auth required)
router.get('/verify/:certificateId', verifyCertificate);

// Protected routes
router.post('/generate', auth, generateCertificate);
router.post('/bulk-generate', auth, bulkGenerateCertificates);
router.get('/', auth, getCertificates);

export default router;
