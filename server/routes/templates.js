import { Router } from 'express';
import {
  createTemplate,
  getTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate,
  uploadSignature,
  uploadStamp,
} from '../controllers/templateController.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

// All routes require authentication
router.use(auth);

router.post('/', upload.single('template'), createTemplate);
router.get('/', getTemplates);
router.get('/:id', getTemplate);
router.put('/:id', updateTemplate);
router.delete('/:id', deleteTemplate);
router.post('/:id/upload-signature', upload.single('signature'), uploadSignature);
router.post('/:id/upload-stamp', upload.single('stamp'), uploadStamp);

export default router;
