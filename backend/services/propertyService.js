import Property from '../models/Property.js';
import { AppError, HTTP_STATUS } from '../utils/errorUtils.js';
import { uploadImageBuffer, deleteImageByPublicId } from '../utils/cloudinary.js';
import { escapeRegexLiteral } from '../validation/search/mongoSafeSearchQuery.js';

const MAX_IMAGES = 10;

/** Must match `updatePropertySchema` + Property model — only these keys are applied from the request body */
const UPDATABLE_PROPERTY_FIELDS = [
  'title',
  'price',
  'type',
  'listingType',
  'bedrooms',
  'bathrooms',
  'parkingSpaces',
  'furnished',
  'yearBuilt',
  'noOfFloors',
  'area',
  'landSize',
  'address',
  'district',
  'province',
  'description',
  'contactNumber',
  'status',
];

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

/** Compare current Mongoose value to validated incoming value (handles number/string drift). */
const fieldValueUnchanged = (current, incoming) => {
  if (incoming === current) return true;
  if (current == null && incoming == null) return true;
  if (typeof current === 'number' && typeof incoming === 'number') return current === incoming;
  if (typeof current === 'boolean' && typeof incoming === 'boolean') return current === incoming;
  if (typeof current === 'string' && typeof incoming === 'string') return current === incoming;
  if (
    (typeof current === 'number' || typeof current === 'string') &&
    (typeof incoming === 'number' || typeof incoming === 'string')
  ) {
    const a = Number(current);
    const b = Number(incoming);
    return !Number.isNaN(a) && !Number.isNaN(b) && a === b;
  }
  return false;
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

const TEXT_SEARCH_FIELDS = ['title', 'address', 'district', 'province', 'description'];

/** Whitespace-separated tokens: each token must match at least one text field (AND across tokens). */
function buildTextSearchClause(trimmedSearch) {
  const tokens = trimmedSearch.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return undefined;
  const perToken = tokens.map((token) => ({
    $or: TEXT_SEARCH_FIELDS.map((field) => ({
      [field]: new RegExp(escapeRegexLiteral(token), 'i'),
    })),
  }));
  if (perToken.length === 1) return perToken[0];
  return { $and: perToken };
}

/** Counts by status for admin dashboard (no pagination). */
const SUGGEST_MAX = 10;

/**
 * Returns up to `limit` autocomplete suggestion strings for the given query.
 * Matches against property titles and districts (case-insensitive substring).
 * Results are deduplicated and sorted alphabetically.
 */
export const getPropertySuggestions = async (q, limit = 8) => {
  if (!q || !q.trim()) return [];
  const rx = new RegExp(escapeRegexLiteral(q.trim()), 'i');
  const cap = Math.min(limit, SUGGEST_MAX);

  const [titles, districts] = await Promise.all([
    Property.distinct('title',    { title:    rx, status: 'active' }),
    Property.distinct('district', { district: rx, status: 'active' }),
  ]);

  const merged = [...new Set([...titles, ...districts])];
  merged.sort((a, b) => a.localeCompare(b));
  return merged.slice(0, cap);
};

export const countListingsByStatus = async () => {
  const [activeListings, soldListings, removedListings] = await Promise.all([
    Property.countDocuments({ status: 'active' }),
    Property.countDocuments({ status: 'sold' }),
    Property.countDocuments({ status: 'removed' }),
  ]);
  return { activeListings, soldListings, removedListings };
};

export const listProperties = async (
  {
    district,
    province,
    type,
    listingType,
    status,
    furnished,
    search,
    minPrice,
    maxPrice,
    page,
    limit,
  },
  { viewerIsAdmin = false } = {},
) => {
  const filter = {};

  if (district)    filter.district    = district;
  if (province)    filter.province    = province;
  if (type)        filter.type        = type;
  if (listingType) filter.listingType = listingType;
  if (furnished !== undefined) filter.furnished = furnished;
  filter.status = viewerIsAdmin ? (status ?? 'active') : 'active';

  const trimmedSearch = typeof search === 'string' ? search.trim() : '';
  const textClause = buildTextSearchClause(trimmedSearch);
  if (textClause) {
    if (textClause.$and) filter.$and = textClause.$and;
    else filter.$or = textClause.$or;
  }

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

export const findPropertyById = async (id, { viewerIsAdmin = false } = {}) => {
  const property = await Property.findById(id);
  if (!property) {
    throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND);
  }
  if (!viewerIsAdmin && property.status !== 'active') {
    throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND);
  }
  return property;
};

export const updatePropertyRecord = async (id, validatedBody) => {
  const property = await Property.findById(id);
  if (!property) {
    throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND);
  }

  const requestedScalarUpdate = UPDATABLE_PROPERTY_FIELDS.some(
    (key) => Object.prototype.hasOwnProperty.call(validatedBody, key) && validatedBody[key] !== undefined,
  );

  if (!requestedScalarUpdate) {
    throw new AppError(
      'No fields to update. Send property fields as JSON (images are added or removed via separate endpoints).',
      HTTP_STATUS.BAD_REQUEST,
    );
  }

  let scalarChanged = false;
  for (const key of UPDATABLE_PROPERTY_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(validatedBody, key)) continue;
    const val = validatedBody[key];
    if (val === undefined) continue;
    const cur = property.get(key);
    if (!fieldValueUnchanged(cur, val)) scalarChanged = true;
    property[key] = val;
  }

  if (!scalarChanged) {
    return { property, modified: false };
  }

  await property.save({ validateBeforeSave: true });

  return { property, modified: true };
};

export const removeProperty = async (id) => {
  const property = await Property.findByIdAndUpdate(
    id,
    { $set: { status: 'removed' } },
    { returnDocument: 'after' }
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
      { returnDocument: 'after', runValidators: true }
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
