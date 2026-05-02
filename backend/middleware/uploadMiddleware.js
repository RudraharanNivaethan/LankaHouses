import multer from 'multer';
import crypto from 'crypto';
import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';

import { uploadImageBuffer } from '../utils/cloudinary.js';
import { AppError, formatErrorResponse, logError } from '../utils/errorUtils.js';

// Configuration for image uploads - easily modifiable for future scalability
const UPLOAD_CONFIG = {
  MAX_IMAGES: 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  MIME_TYPES: {
    'image/jpeg': 'jpg',
    'image/jpg':  'jpg',
    'image/png':  'png',
    'image/webp': 'webp',
    'image/avif': 'avif'
  },
  IMAGE_RESIZE: {
    WIDTH:        800,
    HEIGHT:       600,
    QUALITY:      85,
    OUTPUT_FORMAT: 'jpeg',
    PROGRESSIVE:  true,
    STRIP_METADATA: true
  }
};

const MIME_TYPES = UPLOAD_CONFIG.MIME_TYPES;

// Configure multer storage (memory only — no local disk writes)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (typeof file.mimetype === 'string' && MIME_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, WEBP, and AVIF files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
    files: UPLOAD_CONFIG.MAX_IMAGES
  }
});

// Helper retained for compatibility (no-op with memory storage)
const cleanupFiles = async () => {};

/**
 * Creates an AppError that carries upload-specific code and details.
 * formatErrorResponse exposes code in all envs, details only in dev.
 */
const makeUploadError = (code, message, statusCode = 400) => {
  const err = new AppError(message, statusCode);
  err.code = code;
  err.details = {
    maxFileSize:  UPLOAD_CONFIG.MAX_FILE_SIZE,
    maxFiles:     UPLOAD_CONFIG.MAX_IMAGES,
    allowedTypes: Object.keys(UPLOAD_CONFIG.MIME_TYPES)
  };
  return err;
};

const sendUploadError = (res, code, message, statusCode = 400) => {
  const { statusCode: sc, response } = formatErrorResponse(
    makeUploadError(code, message, statusCode)
  );
  return res.status(sc).json(response);
};

// Middleware to enforce that a file MUST be present (for Create)
export const requireImage = (req, res, next) => {
  if (!req.file) {
    return sendUploadError(res, 'NO_FILE_PROVIDED', 'Product image is required');
  }
  next();
};

export const validateImage = async (req, res, next) => {
  if (!req.file) return next();

  if (Array.isArray(req.files) && req.files.length > UPLOAD_CONFIG.MAX_IMAGES) {
    await cleanupFiles(req);
    return sendUploadError(res, 'TOO_MANY_FILES', `Only ${UPLOAD_CONFIG.MAX_IMAGES} images allowed`);
  }

  try {
    if (!Buffer.isBuffer(req.file.buffer)) {
      await cleanupFiles(req);
      return sendUploadError(res, 'INVALID_FILE_DATA', 'Invalid file data received');
    }

    const fileType = await fileTypeFromBuffer(req.file.buffer);

    if (!fileType || typeof fileType.ext !== 'string' || !Object.values(MIME_TYPES).includes(fileType.ext)) {
      await cleanupFiles(req);
      return sendUploadError(res, 'INVALID_FILE_TYPE', 'Invalid file type detected. Only JPG, JPEG, PNG, WEBP, and AVIF are allowed.');
    }
    next();
  } catch (err) {
    await cleanupFiles(req);
    return sendUploadError(res, 'FILE_PROCESSING_ERROR', 'Invalid file format or corrupted file');
  }
};

export const uploadProductImage = upload.single('image');

export const processImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const inputBuffer = req.file.buffer;

    if (!Buffer.isBuffer(inputBuffer) || inputBuffer.length === 0) {
      throw new Error('Invalid or empty file buffer');
    }

    const processedBuffer = await sharp(inputBuffer)
      .resize(UPLOAD_CONFIG.IMAGE_RESIZE.WIDTH, UPLOAD_CONFIG.IMAGE_RESIZE.HEIGHT, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: UPLOAD_CONFIG.IMAGE_RESIZE.QUALITY,
        progressive: UPLOAD_CONFIG.IMAGE_RESIZE.PROGRESSIVE
      })
      .withMetadata(!UPLOAD_CONFIG.IMAGE_RESIZE.STRIP_METADATA)
      .toBuffer();

    const randomName = crypto.randomBytes(16).toString('hex');
    const publicId = `product_${randomName}`;

    const uploaded = await uploadImageBuffer(processedBuffer, {
      public_id: publicId
    });

    req.file.cloudinaryUrl = uploaded.secure_url;
    req.file.cloudinaryPublicId = uploaded.public_id;
    req.file.mimetype = `image/${UPLOAD_CONFIG.IMAGE_RESIZE.OUTPUT_FORMAT}`;
    req.file.filename = `${publicId}.jpg`;
    req.file.buffer = processedBuffer;

    next();
  } catch (error) {
    logError(error, { req, context: 'processImage' });
    return sendUploadError(
      res,
      'IMAGE_PROCESSING_ERROR',
      `Failed to process image: ${error.message}`
    );
  }
};

// Error handling middleware for multer errors
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    let message = 'File upload error';
    let statusCode = 400;

    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        message = `File too large. Maximum size allowed is ${Math.round(UPLOAD_CONFIG.MAX_FILE_SIZE / (1024 * 1024))}MB`;
        break;
      case 'LIMIT_FILE_COUNT':
        message = `Too many files. Only ${UPLOAD_CONFIG.MAX_IMAGES} image${UPLOAD_CONFIG.MAX_IMAGES > 1 ? 's' : ''} allowed`;
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected field name. Use "image" for single upload or "images" for multiple uploads';
        break;
      case 'LIMIT_PART_COUNT':
        message = 'Too many parts in the request';
        break;
      default:
        message = `Upload error: ${error.message}`;
    }

    return sendUploadError(res, error.code, message, statusCode);
  }

  if (error.message) {
    return sendUploadError(res, 'UPLOAD_VALIDATION_ERROR', error.message);
  }

  next(error);
};

export const productUploadBundle = [
  uploadProductImage,
  handleUploadError,
  validateImage,
  processImage
];

export { UPLOAD_CONFIG };

// ─── Property multi-image upload ─────────────────────────────────────────────

export const requireImages = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return sendUploadError(res, 'NO_FILES_PROVIDED', 'At least one property image is required');
  }
  next();
};

export const validateImages = async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();

  try {
    for (const file of req.files) {
      if (!Buffer.isBuffer(file.buffer)) {
        return sendUploadError(res, 'INVALID_FILE_DATA', 'Invalid file data received');
      }

      const fileType = await fileTypeFromBuffer(file.buffer);
      if (!fileType || typeof fileType.ext !== 'string' || !Object.values(MIME_TYPES).includes(fileType.ext)) {
        return sendUploadError(res, 'INVALID_FILE_TYPE', 'Invalid file type detected. Only JPG, JPEG, PNG, WEBP, and AVIF are allowed.');
      }
    }
    next();
  } catch (err) {
    return sendUploadError(res, 'FILE_PROCESSING_ERROR', 'Invalid file format or corrupted file');
  }
};

export const resizeImages = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    req.processedImages = [];
    return next();
  }

  try {
    req.processedImages = await Promise.all(
      req.files.map(async (file) => {
        if (!Buffer.isBuffer(file.buffer) || file.buffer.length === 0) {
          throw new Error('Invalid or empty file buffer');
        }

        const processedBuffer = await sharp(file.buffer)
          .resize(UPLOAD_CONFIG.IMAGE_RESIZE.WIDTH, UPLOAD_CONFIG.IMAGE_RESIZE.HEIGHT, {
            fit:      'cover',
            position: 'center',
          })
          .jpeg({
            quality:     UPLOAD_CONFIG.IMAGE_RESIZE.QUALITY,
            progressive: UPLOAD_CONFIG.IMAGE_RESIZE.PROGRESSIVE,
          })
          .withMetadata(!UPLOAD_CONFIG.IMAGE_RESIZE.STRIP_METADATA)
          .toBuffer();

        const publicId = `property_${crypto.randomBytes(16).toString('hex')}`;
        return { buffer: processedBuffer, publicId };
      })
    );

    next();
  } catch (error) {
    logError(error, { req, context: 'resizeImages' });
    return sendUploadError(
      res,
      'IMAGE_PROCESSING_ERROR',
      `Failed to process image: ${error.message}`
    );
  }
};

export const uploadPropertyImages = upload.array('images', UPLOAD_CONFIG.MAX_IMAGES);

export const propertyUploadBundle = [
  uploadPropertyImages,
  handleUploadError,
  validateImages,
  resizeImages,
];

// ─── Generic factory (kept for future scalability) ────────────────────────────

export const createUploadMiddleware = (fieldName = 'image', maxImages = UPLOAD_CONFIG.MAX_IMAGES) => {
  if (typeof fieldName !== 'string' || fieldName.length === 0) {
    throw new Error('fieldName must be a non-empty string');
  }
  if (typeof maxImages !== 'number' || maxImages < 1 || !Number.isInteger(maxImages)) {
    throw new Error('maxImages must be a positive integer');
  }

  const instance = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
      files: maxImages
    }
  });

  return maxImages === 1 ? instance.single(fieldName) : instance.array(fieldName, maxImages);
};
