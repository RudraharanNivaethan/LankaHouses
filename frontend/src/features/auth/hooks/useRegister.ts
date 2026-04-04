import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { registerSchema } from '../schemas'
import { registerUser } from '../services/authService'
import { ROUTES } from '../../../constants/routes'
import type { RegisterFormData } from '../types'

export function useRegister() {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', phone: '', password: '' },
  })

  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = form.handleSubmit(async (data) => {
    setServerError(null)
    setIsLoading(true)
    try {
      await registerUser(data)
      navigate(ROUTES.LOGIN)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  })

  return { form, onSubmit, serverError, isLoading }
}
