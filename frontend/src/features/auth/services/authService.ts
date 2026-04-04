import type { LoginFormData, RegisterFormData, AuthApiResponse } from '../types'

const API_BASE = '/api/auth'

async function request<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error ?? data.message ?? 'Something went wrong')
  }

  return data as T
}

export async function loginUser(payload: LoginFormData): Promise<AuthApiResponse> {
  return request<AuthApiResponse>(`${API_BASE}/login`, payload)
}

export async function registerUser(payload: RegisterFormData): Promise<AuthApiResponse> {
  return request<AuthApiResponse>(`${API_BASE}/register`, payload)
}
