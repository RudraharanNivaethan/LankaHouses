import { formatErrorResponse } from '../utils/errorUtils.js';
import {
  createPropertyRecord,
  listProperties,
  findPropertyById,
  assertPropertyVisibleToViewer,
  updatePropertyRecord,
  removeProperty,
  addPropertyImages,
  deletePropertyImage,
  countListingsByStatus,
} from '../services/propertyService.js';

export const createProperty = async (req, res) => {
  try {
    const property = await createPropertyRecord(req.body, req.processedImages);
    return res.status(201).json({ success: true, data: property });
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    return res.status(statusCode).json(response);
  }
};

export const getAdminListingStats = async (_req, res) => {
  try {
    const counts = await countListingsByStatus();
    return res.status(200).json({ success: true, data: counts });
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    return res.status(statusCode).json(response);
  }
};

export const getProperties = async (req, res) => {
  try {
    const result = await listProperties({
      ...req.validatedQuery,
      viewerIsAdmin: req.user?.role === 'admin',
    });
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
    assertPropertyVisibleToViewer(property, req.user?.role);
    return res.status(200).json({ success: true, data: property });
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    return res.status(statusCode).json(response);
  }
};

export const updateProperty = async (req, res) => {
  try {
    const { property, modified } = await updatePropertyRecord(
      req.validatedParams.id,
      req.body,
    );
    return res.status(200).json({
      success: true,
      data:    property,
      meta:    { modified },
    });
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

export const addImages = async (req, res) => {
  try {
    const property = await addPropertyImages(req.validatedParams.id, req.processedImages);
    return res.status(200).json({ success: true, data: property });
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    return res.status(statusCode).json(response);
  }
};

export const deleteImage = async (req, res) => {
  try {
    const property = await deletePropertyImage(req.validatedParams.id, req.validatedParams.imageIndex);
    return res.status(200).json({ success: true, data: property });
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    return res.status(statusCode).json(response);
  }
};
