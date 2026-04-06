import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateProfileSchema } from '../schemas/auth'
import { updateProfile } from '../services/userService'
import { useAuth } from '../context/AuthContext'
import type { UpdateProfileSchema } from '../schemas/auth'

export function useUpdateProfile() {
  const { user, refreshUser } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name ?? '',
      phone: user?.phone ?? '',
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    setServerError(null)
    setIsSuccess(false)
    setIsLoading(true)
    try {
      const payload: { name?: string; phone?: string } = {}
      if (data.name)  payload.name  = data.name
      // Send phone even if empty string so the user can explicitly clear it
      if (data.phone !== undefined) payload.phone = data.phone || undefined

      await updateProfile(payload)
      await refreshUser()
      setIsSuccess(true)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to save. Please try again.')
    } finally {
      setIsLoading(false)
    }
  })

  return { form, onSubmit, serverError, isSuccess, isLoading }
}
