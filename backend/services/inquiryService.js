import Inquiry from '../models/Inquiry.js';
import Property from '../models/Property.js';
import { AppError, HTTP_STATUS } from '../utils/errorUtils.js';
import { escapeRegexLiteral } from '../validation/search/mongoSafeSearchQuery.js';

const INQUIRY_SEARCH_FIELDS = ['title', 'message', 'adminReply'];

function buildInquirySearchClause(search) {
  const trimmed = typeof search === 'string' ? search.trim() : '';
  if (!trimmed) return undefined;
  const tokens = trimmed.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return undefined;
  const perToken = tokens.map((token) => ({
    $or: INQUIRY_SEARCH_FIELDS.map((field) => ({
      [field]: new RegExp(escapeRegexLiteral(token), 'i'),
    })),
  }));
  return perToken.length === 1 ? perToken[0] : { $and: perToken };
}

function buildPagination(page, limit) {
  const pageNum  = page  ?? 1;
  const limitNum = limit ?? 20;
  return { pageNum, limitNum, skip: (pageNum - 1) * limitNum };
}

function buildPaginatedResult(inquiries, total, pageNum, limitNum) {
  return {
    inquiries,
    total,
    page:       pageNum,
    limit:      limitNum,
    totalPages: Math.ceil(total / limitNum),
  };
}

export const createGeneralInquiry = async (userId, { title, message }) => {
  return Inquiry.create({
    userId,
    inquiryType: 'GENERAL',
    title,
    message,
  });
};

export const createPropertyInquiry = async (userId, propertyId, { title, message }) => {
  const property = await Property.findById(propertyId);
  if (!property) {
    throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND);
  }
  return Inquiry.create({
    userId,
    propertyId,
    inquiryType: 'PROPERTY',
    title,
    message,
  });
};

export const listUserInquiries = async (userId, { inquiryType, status, search, page, limit }) => {
  const filter = { userId };
  if (inquiryType) filter.inquiryType = inquiryType;
  if (status)      filter.status      = status;

  const searchClause = buildInquirySearchClause(search);
  if (searchClause) {
    if (searchClause.$and) filter.$and = searchClause.$and;
    else filter.$or = searchClause.$or;
  }

  const { pageNum, limitNum, skip } = buildPagination(page, limit);
  const [inquiries, total] = await Promise.all([
    Inquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Inquiry.countDocuments(filter),
  ]);

  return buildPaginatedResult(inquiries, total, pageNum, limitNum);
};

export const findUserInquiryById = async (userId, inquiryId) => {
  const inquiry = await Inquiry.findOne({ _id: inquiryId, userId });
  if (!inquiry) {
    throw new AppError('Inquiry not found', HTTP_STATUS.NOT_FOUND);
  }
  return inquiry;
};

export const listAdminInquiries = async ({ inquiryType, status, userId, propertyId, search, page, limit }) => {
  const filter = {};
  if (inquiryType) filter.inquiryType = inquiryType;
  if (status)      filter.status      = status;
  if (userId)      filter.userId      = userId;
  if (propertyId)  filter.propertyId  = propertyId;

  const searchClause = buildInquirySearchClause(search);
  if (searchClause) {
    if (searchClause.$and) filter.$and = searchClause.$and;
    else filter.$or = searchClause.$or;
  }

  const { pageNum, limitNum, skip } = buildPagination(page, limit);
  const [inquiries, total] = await Promise.all([
    Inquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Inquiry.countDocuments(filter),
  ]);

  return buildPaginatedResult(inquiries, total, pageNum, limitNum);
};

export const findAdminInquiryById = async (inquiryId) => {
  const inquiry = await Inquiry.findById(inquiryId);
  if (!inquiry) {
    throw new AppError('Inquiry not found', HTTP_STATUS.NOT_FOUND);
  }
  return inquiry;
};

export const replyToInquiry = async (inquiryId, adminReply) => {
  const inquiry = await Inquiry.findById(inquiryId);
  if (!inquiry) {
    throw new AppError('Inquiry not found', HTTP_STATUS.NOT_FOUND);
  }
  if (inquiry.status === 'REPLIED') {
    throw new AppError('Inquiry has already been replied to', HTTP_STATUS.CONFLICT);
  }
  inquiry.adminReply = adminReply;
  inquiry.repliedAt  = new Date();
  inquiry.status     = 'REPLIED';
  await inquiry.save();
  return inquiry;
};

export const closeInquiry = async (inquiryId) => {
  const inquiry = await Inquiry.findById(inquiryId);
  if (!inquiry) {
    throw new AppError('Inquiry not found', HTTP_STATUS.NOT_FOUND);
  }
  inquiry.status = 'CLOSED';
  await inquiry.save();
  return inquiry;
};
