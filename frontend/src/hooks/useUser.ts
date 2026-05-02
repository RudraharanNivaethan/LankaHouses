import { useEffect, useState } from 'react'
import { getUserById } from '../services/superAdminService'
import type { User } from '../types/auth'
import { getClientErrorMessage } from '../utils/errorMessages'

export function useUser(id: string | undefined) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setIsLoading(false)
      return
    }

    let cancelled = false

    setIsLoading(true)
    setError(null)

    getUserById(id)
      .then((data) => {
        if (!cancelled) setUser(data)
      })
      .catch((err) => {
        if (!cancelled)
          setError(getClientErrorMessage(err))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  return { user, isLoading, error }
}
