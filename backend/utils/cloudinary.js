import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
