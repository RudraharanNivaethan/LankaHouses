import Property from '../models/Property.js';
import { AppError, HTTP_STATUS } from '../utils/errorUtils.js';
import { uploadImageBuffer, deleteImageByPublicId } from '../utils/cloudinary.js';

const MAX_IMAGES = 10;

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
  const images = uploaded.map((img) => ({ url: img.url, publicId: img.publicId }));

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
  let oldImages = [];

  if (processedImages.length > 0) {
    const existing = await Property.findById(id);
    if (!existing) {
      throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND);
    }
    oldImages = existing.images;

    uploaded = await uploadImagesToCloudinary(processedImages);
    updates.images = uploaded.map((img) => ({ url: img.url, publicId: img.publicId }));
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

    if (oldImages.length > 0) {
      Promise.allSettled(
        oldImages.map((img) => deleteImageByPublicId(img.publicId))
      ).catch(() => {});
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

export const addPropertyImages = async (id, processedImages = []) => {
  const property = await Property.findById(id);
  if (!property) {
    throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND);
  }

  const currentCount = property.images.length;
  if (currentCount + processedImages.length > MAX_IMAGES) {
    throw new AppError(
      `Cannot add ${processedImages.length} image(s). Property already has ${currentCount} image(s) and the maximum is ${MAX_IMAGES}.`,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const uploaded = await uploadImagesToCloudinary(processedImages);
  const newImages = uploaded.map((img) => ({ url: img.url, publicId: img.publicId }));

  try {
    const updated = await Property.findByIdAndUpdate(
      id,
      { $push: { images: { $each: newImages } } },
      { new: true, runValidators: true }
    );
    return updated;
  } catch (error) {
    await rollbackUploadedImages(uploaded);
    throw error;
  }
};

export const deletePropertyImage = async (id, imageIndex) => {
  const property = await Property.findById(id);
  if (!property) {
    throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND);
  }

  if (imageIndex >= property.images.length) {
    throw new AppError(
      `Image index ${imageIndex} is out of bounds. Property has ${property.images.length} image(s).`,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  if (property.images.length <= 1) {
    throw new AppError(
      'Cannot delete the last image. A property must have at least one image.',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const image = property.images[imageIndex];

  await deleteImageByPublicId(image.publicId);

  property.images.splice(imageIndex, 1);
  await property.save();

  return property;
};
