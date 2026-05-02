import { v2 as cloudinary } from 'cloudinary';
import { getEnvSuffix } from './env.js';

const env = getEnvSuffix();

const CLOUDINARY_CLOUD_NAME = process.env[`CLOUDINARY_CLOUD_NAME_${env}`];
const CLOUDINARY_API_KEY    = process.env[`CLOUDINARY_API_KEY_${env}`];
const CLOUDINARY_API_SECRET = process.env[`CLOUDINARY_API_SECRET_${env}`];

const missing = [
  ['CLOUDINARY_CLOUD_NAME', CLOUDINARY_CLOUD_NAME],
  ['CLOUDINARY_API_KEY',    CLOUDINARY_API_KEY],
  ['CLOUDINARY_API_SECRET', CLOUDINARY_API_SECRET],
].filter(([, v]) => !v).map(([k]) => `${k}_${env}`);

if (missing.length) {
  throw new Error(`Missing Cloudinary config: ${missing.join(', ')}. Check your .env file.`);
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key:    CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const uploadImageBuffer = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'lankahouses', ...options },
      (err, result) => {
        if (err) reject(err);
        else     resolve(result);
      }
    );
    stream.end(buffer);
  });

export const deleteImageByPublicId = (publicId) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (err, result) => {
      if (err) reject(err);
      else     resolve(result);
    });
  });
