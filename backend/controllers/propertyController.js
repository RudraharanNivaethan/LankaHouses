import { formatErrorResponse } from '../utils/errorUtils.js';
import {
  createPropertyRecord,
  listProperties,
  findPropertyById,
  updatePropertyRecord,
  removeProperty,
} from '../services/propertyService.js';

export const createProperty = async (req, res) => {
  try {
    const images   = req.uploadedImages ?? [];
    const property = await createPropertyRecord({ ...req.body, images });
    return res.status(201).json({ success: true, data: property });
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    return res.status(statusCode).json(response);
  }
};

export const getProperties = async (req, res) => {
  try {
    const result = await listProperties(req.validatedQuery);
    return res.status(200).json({
      success: true,
      data:       result.properties,
      pagination: {
        total:      result.total,
        page:       result.page,
        limit:      result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    return res.status(statusCode).json(response);
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const property = await findPropertyById(req.validatedParams.id);
    return res.status(200).json({ success: true, data: property });
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    return res.status(statusCode).json(response);
  }
};

export const updateProperty = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.uploadedImages && req.uploadedImages.length > 0) {
      updates.images = req.uploadedImages;
    }
    const property = await updatePropertyRecord(req.validatedParams.id, updates);
    return res.status(200).json({ success: true, data: property });
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    return res.status(statusCode).json(response);
  }
};

export const deleteProperty = async (req, res) => {
  try {
    await removeProperty(req.validatedParams.id);
    return res.status(200).json({ success: true, message: 'Property removed successfully' });
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    return res.status(statusCode).json(response);
  }
};
