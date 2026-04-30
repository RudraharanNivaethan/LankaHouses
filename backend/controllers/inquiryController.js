import { formatErrorResponse } from '../utils/errorUtils.js';
import {
  createGeneralInquiry  as svcCreateGeneral,
  createPropertyInquiry as svcCreateProperty,
  listUserInquiries,
  findUserInquiryById,
  listAdminInquiries,
  findAdminInquiryById,
  replyToInquiry        as svcReply,
  closeInquiry          as svcClose,
} from '../services/inquiryService.js';

export const createGeneralInquiry = async (req, res) => {
  try {
    const inquiry = await svcCreateGeneral(req.user.id, req.body);
    return res.status(201).json({ success: true, data: inquiry });
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    return res.status(statusCode).json(response);
  }
};

export const createPropertyInquiry = async (req, res) => {
  try {
    const inquiry = await svcCreateProperty(req.user.id, req.validatedParams.propertyId, req.body);
    return res.status(201).json({ success: true, data: inquiry });
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    return res.status(statusCode).json(response);
  }
};

export const getUserInquiries = async (req, res) => {
  try {
    const result = await listUserInquiries(req.user.id, req.validatedQuery);
    return res.status(200).json({
      success: true,
      data:       result.inquiries,
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

export const getUserInquiryById = async (req, res) => {
  try {
    const inquiry = await findUserInquiryById(req.user.id, req.validatedParams.inquiryId);
    return res.status(200).json({ success: true, data: inquiry });
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    return res.status(statusCode).json(response);
  }
};

export const getAdminInquiries = async (req, res) => {
  try {
    const result = await listAdminInquiries(req.validatedQuery);
    return res.status(200).json({
      success: true,
      data:       result.inquiries,
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

export const getAdminInquiryById = async (req, res) => {
  try {
    const inquiry = await findAdminInquiryById(req.validatedParams.inquiryId);
    return res.status(200).json({ success: true, data: inquiry });
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    return res.status(statusCode).json(response);
  }
};

export const replyToInquiry = async (req, res) => {
  try {
    const inquiry = await svcReply(req.validatedParams.inquiryId, req.body.adminReply);
    return res.status(200).json({ success: true, data: inquiry });
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    return res.status(statusCode).json(response);
  }
};

export const closeInquiry = async (req, res) => {
  try {
    const inquiry = await svcClose(req.validatedParams.inquiryId);
    return res.status(200).json({ success: true, data: inquiry });
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    return res.status(statusCode).json(response);
  }
};
