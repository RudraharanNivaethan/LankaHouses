import type {
  PropertyApiResponse,
  PropertiesListApiResponse,
  PropertyQueryParams,
  DeletePropertyApiResponse,
  AdminListingStatsApiResponse,
} from '../types/property'
import type { AddPropertySchema } from '../schemas/property'

const API_BASE = '/api/property'

function extractErrorMessage(data: Record<string, unknown>): string {
  const msgs: string[] =
    Array.isArray(data.errors) && data.errors.length > 0
      ? data.errors
      : [((data.error as Record<string, unknown>)?.message as string) ?? (data.error as string) ?? 'Something went wrong']
  return msgs.join(' · ')
}

function assertPropertySuccess(data: Record<string, unknown>): void {
  if (data.success !== true) {
    throw new Error(extractErrorMessage(data))
  }
}

export async function createProperty(formData: FormData): Promise<PropertyApiResponse> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data))
  return data as PropertyApiResponse
}

export async function getAdminListingStats(): Promise<AdminListingStatsApiResponse> {
  const res = await fetch(`${API_BASE}/stats/listings`, { credentials: 'include' })
  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data))
  return data as AdminListingStatsApiResponse
}

export async function getProperties(query: PropertyQueryParams = {}): Promise<PropertiesListApiResponse> {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') params.append(key, String(value))
  }

  const url = params.toString() ? `${API_BASE}?${params}` : API_BASE
  const res = await fetch(url, { credentials: 'include' })
  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data))
  return data as PropertiesListApiResponse
}

export async function getPropertyById(id: string): Promise<PropertyApiResponse> {
  const res = await fetch(`${API_BASE}/${id}`, { credentials: 'include' })
  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data))
  return data as PropertyApiResponse
}

/** Text fields only — images use `appendPropertyImages` / `removePropertyImage`. */
export async function updateProperty(id: string, payload: AddPropertySchema): Promise<PropertyApiResponse> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = (await res.json()) as Record<string, unknown>
  if (!res.ok) throw new Error(extractErrorMessage(data))
  assertPropertySuccess(data)
  return data as unknown as PropertyApiResponse
}

/** POST /api/property/:id/images — appends to the gallery (does not replace). */
export async function appendPropertyImages(id: string, files: File[]): Promise<PropertyApiResponse> {
  if (files.length === 0) throw new Error('Select at least one image to upload.')

  const formData = new FormData()
  for (const f of files) {
    formData.append('images', f)
  }

  const res = await fetch(`${API_BASE}/${id}/images`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  const data = (await res.json()) as Record<string, unknown>
  if (!res.ok) throw new Error(extractErrorMessage(data))
  assertPropertySuccess(data)
  return data as unknown as PropertyApiResponse
}

/** DELETE /api/property/:id/images/:imageIndex — cannot remove the last image (server rule). */
export async function removePropertyImage(id: string, imageIndex: number): Promise<PropertyApiResponse> {
  const res = await fetch(`${API_BASE}/${id}/images/${imageIndex}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  const data = (await res.json()) as Record<string, unknown>
  if (!res.ok) throw new Error(extractErrorMessage(data))
  assertPropertySuccess(data)
  return data as unknown as PropertyApiResponse
}

export async function deleteProperty(id: string): Promise<DeletePropertyApiResponse> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data))
  return data as DeletePropertyApiResponse
}
