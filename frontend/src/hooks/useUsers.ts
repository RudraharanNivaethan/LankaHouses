import { useCallback, useEffect, useState } from 'react'
import { getUsers } from '../services/superAdminService'
import type { User, UserRole } from '../types/auth'

interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export function useUsers(roleFilter?: UserRole) {
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getUsers({ role: roleFilter, page })
      setUsers(res.data)
      setPagination(res.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }, [roleFilter, page])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { users, pagination, page, setPage, isLoading, error, refetch: fetch }
}
