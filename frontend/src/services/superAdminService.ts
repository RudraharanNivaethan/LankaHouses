import type {
  UsersApiResponse,
  UserRoleStatsApiResponse,
  UserRoleStats,
  CreateAdminPayload,
  CreateAdminApiResponse,
  User,
  UserRole,
} from '../types/auth'

const API_BASE = '/api/superadmin'

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

async function post<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
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

export interface GetUsersParams {
  role?: UserRole
  search?: string
  page?: number
  limit?: number
}

export async function getUsers(params: GetUsersParams = {}): Promise<UsersApiResponse> {
  const query = new URLSearchParams()
  if (params.role)   query.set('role', params.role)
  if (params.search) query.set('search', params.search)
  if (params.page)   query.set('page', String(params.page))
  if (params.limit)  query.set('limit', String(params.limit))

  const qs = query.toString()
  return get<UsersApiResponse>(`${API_BASE}${qs ? `?${qs}` : ''}`)
}

export async function getUserStats(): Promise<UserRoleStats> {
  const res = await get<UserRoleStatsApiResponse>(`${API_BASE}/stats`)
  return res.data
}

export async function createAdmin(
  payload: CreateAdminPayload,
): Promise<User> {
  const res = await post<CreateAdminApiResponse>(`${API_BASE}/admins`, payload)
  return res.data
}
