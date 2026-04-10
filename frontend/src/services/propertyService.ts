import type { PropertyApiResponse } from '../types/property'

const API_BASE = '/api/property'

export async function createProperty(formData: FormData): Promise<PropertyApiResponse> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  const data = await res.json()

  if (!res.ok) {
    const msgs: string[] =
      Array.isArray(data.errors) && data.errors.length > 0
        ? data.errors
        : [data.error?.message ?? data.error ?? 'Something went wrong']
    throw new Error(msgs.join(' · '))
  }

  return data as PropertyApiResponse
}
