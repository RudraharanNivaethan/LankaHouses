import type { LoginFormData, RegisterFormData, AuthApiResponse, MeApiResponse, User } from '../types'

const API_BASE = '/api/auth'

// Backend validation errors shape: { success: false, error: string, errors?: string[] }
// Backend controller errors shape:  { success: false, error: string }
async function post<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const data = await res.json()

  if (!res.ok) {
    // Surface all backend validation messages when present; otherwise fall back to error field
    const msgs: string[] =
      Array.isArray(data.errors) && data.errors.length > 0
        ? data.errors
        : [data.error ?? data.message ?? 'Something went wrong']
    throw new Error(msgs.join(' · '))
  }

  return data as T
}

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error ?? 'Request failed')
  }

  return res.json() as Promise<T>
}

export async function loginUser(payload: LoginFormData): Promise<AuthApiResponse> {
  return post<AuthApiResponse>(`${API_BASE}/login`, payload)
}

export async function registerUser(payload: RegisterFormData): Promise<AuthApiResponse> {
  return post<AuthApiResponse>(`${API_BASE}/register`, payload)
}

export async function logoutUser(): Promise<AuthApiResponse> {
  return post<AuthApiResponse>(`${API_BASE}/logout`)
}

export async function getMe(): Promise<User> {
  const res = await get<MeApiResponse>(`${API_BASE}/me`)
  return res.data
}
