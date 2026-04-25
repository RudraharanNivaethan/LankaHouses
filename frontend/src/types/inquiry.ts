import type { PaginationInfo } from './property'

export type InquiryType   = 'GENERAL' | 'PROPERTY'
export type InquiryStatus = 'PENDING' | 'REPLIED' | 'CLOSED'

export interface InquiryRecord {
  _id: string
  userId: string
  propertyId?: string | null
  inquiryType: InquiryType
  title: string
  message: string
  status: InquiryStatus
  adminReply?: string | null
  repliedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface InquiryApiResponse {
  success: boolean
  data: InquiryRecord
}

export interface InquiriesListApiResponse {
  success: boolean
  data: InquiryRecord[]
  pagination: PaginationInfo
}

export interface InquiryQueryParams {
  inquiryType?: InquiryType
  status?: InquiryStatus
  userId?: string
  propertyId?: string
  search?: string
  page?: number
  limit?: number
}

export interface MyInquiryQueryParams {
  inquiryType?: InquiryType
  status?: InquiryStatus
  page?: number
  limit?: number
}

export interface CreateInquiryPayload {
  title: string
  message: string
}

export interface AdminReplyPayload {
  adminReply: string
}
