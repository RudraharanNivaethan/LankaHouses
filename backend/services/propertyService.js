import Property from '../models/Property.js';
import { AppError, HTTP_STATUS } from '../utils/errorUtils.js';

export const createPropertyRecord = async (data) => {
  const property = await Property.create(data);
  return property;
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

export const updatePropertyRecord = async (id, updates) => {
  const property = await Property.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  );
  if (!property) {
    throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND);
  }
  return property;
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
