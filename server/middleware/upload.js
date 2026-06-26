import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File filter — only images
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'), false);
  }
};

const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== 'your_api_key';

let storage;

if (isCloudinaryConfigured) {
  console.log('📁 File storage: Cloudinary');
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'certificate_automation',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
  });
} else {
  console.log('📁 File storage: Local disk (uploads/)');
  console.log('   ⚠️  Set CLOUDINARY_* env vars for cloud storage');
  
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  ['templates', 'signatures', 'stamps'].forEach(dir => {
    const dirPath = path.join(uploadsDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let subDir = 'templates';
      if (file.fieldname === 'signature') subDir = 'signatures';
      else if (file.fieldname === 'stamp') subDir = 'stamps';
      cb(null, path.join(uploadsDir, subDir));
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  });
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export default upload;
