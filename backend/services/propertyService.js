import Property from '../models/Property.js';
import { AppError, HTTP_STATUS } from '../utils/errorUtils.js';
import { uploadImageBuffer, deleteImageByPublicId } from '../utils/cloudinary.js';

const uploadImagesToCloudinary = async (processedImages) => {
  const uploaded = [];
  try {
    for (const img of processedImages) {
      const result = await uploadImageBuffer(img.buffer, { public_id: img.publicId });
      uploaded.push({ url: result.secure_url, publicId: result.public_id });
    }
    return uploaded;
  } catch (error) {
    await Promise.allSettled(
      uploaded.map((img) => deleteImageByPublicId(img.publicId))
    );
    throw new AppError('Failed to upload images. Please try again.', HTTP_STATUS.INTERNAL_ERROR);
  }
};

const rollbackUploadedImages = async (uploaded) => {
  if (uploaded.length > 0) {
    await Promise.allSettled(
      uploaded.map((img) => deleteImageByPublicId(img.publicId))
    );
  }
};

export const createPropertyRecord = async (data, processedImages = []) => {
  const uploaded = await uploadImagesToCloudinary(processedImages);
  const images = uploaded.map((img) => img.url);

  try {
    const property = await Property.create({ ...data, images });
    return property;
  } catch (error) {
    await rollbackUploadedImages(uploaded);
    throw error;
  }
};

export const listProperties = async ({ district, province, type, listingType, status, furnished, minPrice, maxPrice, page, limit }) => {
  const filter = {};

  if (district)    filter.district    = district;
  if (province)    filter.province    = province;
  if (type)        filter.type        = type;
  if (listingType) filter.listingType = listingType;
  if (furnished !== undefined) filter.furnished = furnished;
  filter.status = status ?? 'active';

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }

  const pageNum  = page  ?? 1;
  const limitNum = limit ?? 20;
  const skip     = (pageNum - 1) * limitNum;

  const [properties, total] = await Promise.all([
    Property.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Property.countDocuments(filter),
  ]);

  return {
    properties,
    total,
    page:       pageNum,
    limit:      limitNum,
    totalPages: Math.ceil(total / limitNum),
  };
};

export const findPropertyById = async (id) => {
  const property = await Property.findById(id);
  if (!property) {
    throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND);
  }
  return property;
};

export const updatePropertyRecord = async (id, updates, processedImages = []) => {
  let uploaded = [];

  if (processedImages.length > 0) {
    uploaded = await uploadImagesToCloudinary(processedImages);
    updates.images = uploaded.map((img) => img.url);
  }

  try {
    const property = await Property.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!property) {
      throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND);
    }
    return property;
  } catch (error) {
    await rollbackUploadedImages(uploaded);
    throw error;
  }
};

export const removeProperty = async (id) => {
  const property = await Property.findByIdAndUpdate(
    id,
    { $set: { status: 'removed' } },
    { new: true }
  );
  if (!property) {
    throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND);
  }
  return property;
};
