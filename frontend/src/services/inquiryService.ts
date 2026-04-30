import type {
  InquiryApiResponse,
  InquiriesListApiResponse,
  InquiryQueryParams,
  MyInquiryQueryParams,
  CreateInquiryPayload,
  AdminReplyPayload,
} from '../types/inquiry'

const USER_API_BASE  = '/api/inquiries'
const ADMIN_API_BASE = '/api/admin/inquiries'

function extractErrorMessage(data: Record<string, unknown>): string {
  const msgs: string[] =
    Array.isArray(data.errors) && data.errors.length > 0
      ? data.errors
      : [((data.error as Record<string, unknown>)?.message as string) ?? (data.error as string) ?? 'Something went wrong']
  return msgs.join(' · ')
}

export async function createGeneralInquiry(payload: CreateInquiryPayload): Promise<InquiryApiResponse> {
  const res = await fetch(`${USER_API_BASE}/general`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = (await res.json()) as Record<string, unknown>
  if (!res.ok) throw new Error(extractErrorMessage(data))
  return data as unknown as InquiryApiResponse
}

export async function createPropertyInquiry(
  propertyId: string,
  payload: CreateInquiryPayload,
): Promise<InquiryApiResponse> {
  const res = await fetch(`${USER_API_BASE}/property/${propertyId}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = (await res.json()) as Record<string, unknown>
  if (!res.ok) throw new Error(extractErrorMessage(data))
  return data as unknown as InquiryApiResponse
}

export async function getMyInquiries(query: MyInquiryQueryParams = {}): Promise<InquiriesListApiResponse> {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') params.append(key, String(value))
  }
  const url = params.toString() ? `${USER_API_BASE}/my?${params}` : `${USER_API_BASE}/my`
  const res = await fetch(url, { credentials: 'include' })
  const data = (await res.json()) as Record<string, unknown>
  if (!res.ok) throw new Error(extractErrorMessage(data))
  return data as unknown as InquiriesListApiResponse
}

export async function getMyInquiryById(inquiryId: string): Promise<InquiryApiResponse> {
  const res = await fetch(`${USER_API_BASE}/my/${inquiryId}`, { credentials: 'include' })
  const data = (await res.json()) as Record<string, unknown>
  if (!res.ok) throw new Error(extractErrorMessage(data))
  return data as unknown as InquiryApiResponse
}

export async function getAdminInquiries(query: InquiryQueryParams = {}): Promise<InquiriesListApiResponse> {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') params.append(key, String(value))
  }
  const url = params.toString() ? `${ADMIN_API_BASE}?${params}` : ADMIN_API_BASE
  const res = await fetch(url, { credentials: 'include' })
  const data = (await res.json()) as Record<string, unknown>
  if (!res.ok) throw new Error(extractErrorMessage(data))
  return data as unknown as InquiriesListApiResponse
}

export async function getAdminInquiryById(inquiryId: string): Promise<InquiryApiResponse> {
  const res = await fetch(`${ADMIN_API_BASE}/${inquiryId}`, { credentials: 'include' })
  const data = (await res.json()) as Record<string, unknown>
  if (!res.ok) throw new Error(extractErrorMessage(data))
  return data as unknown as InquiryApiResponse
}

export async function replyToInquiry(
  inquiryId: string,
  payload: AdminReplyPayload,
): Promise<InquiryApiResponse> {
  const res = await fetch(`${ADMIN_API_BASE}/${inquiryId}/reply`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = (await res.json()) as Record<string, unknown>
  if (!res.ok) throw new Error(extractErrorMessage(data))
  return data as unknown as InquiryApiResponse
}

export async function closeInquiry(inquiryId: string): Promise<InquiryApiResponse> {
  const res = await fetch(`${ADMIN_API_BASE}/${inquiryId}/close`, {
    method: 'PATCH',
    credentials: 'include',
  })
  const data = (await res.json()) as Record<string, unknown>
  if (!res.ok) throw new Error(extractErrorMessage(data))
  return data as unknown as InquiryApiResponse
}
