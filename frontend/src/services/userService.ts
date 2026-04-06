import type { User } from '../types/auth'

const API_BASE = '/api/user'

interface UpdateProfilePayload {
  name?: string
  phone?: string
}

interface UpdateProfileResponse {
  success: boolean
  data: User
}

async function patch<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (!res.ok) {
    const msgs: string[] =
      Array.isArray(data.errors) && data.errors.length > 0
        ? data.errors
        : [data.error ?? data.message ?? 'Something went wrong']
    throw new Error(msgs.join(' · '))
  }

  return data as T
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<UpdateProfileResponse> {
  return patch<UpdateProfileResponse>(`${API_BASE}/profile`, payload)
}
