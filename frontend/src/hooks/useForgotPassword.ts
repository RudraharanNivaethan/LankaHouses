import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { sendPasswordResetEmail } from 'firebase/auth'
import { firebaseAuth } from '../config/firebase'
import { forgotPasswordSchema } from '../schemas/auth'
import type { ForgotPasswordSchema } from '../schemas/auth'

function mapFirebaseForgotError(code: string): string {
  switch (code) {
    case 'auth/too-many-requests':
      return 'Too many requests. Please wait a moment before trying again.'
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

export function useForgotPassword() {
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const [serverError, setServerError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = form.handleSubmit(async (data) => {
    setServerError(null)
    setIsLoading(true)
    try {
      await sendPasswordResetEmail(firebaseAuth, data.email)
      // Always show success — avoids leaking whether an email is registered
      setIsSuccess(true)
    } catch (err) {
      const code = (err as { code?: string }).code ?? ''
      if (code === 'auth/user-not-found' || code === 'auth/invalid-email') {
        // Treat silently to avoid email enumeration
        setIsSuccess(true)
      } else if (code.startsWith('auth/')) {
        setServerError(mapFirebaseForgotError(code))
      } else {
        setServerError('Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  })

  return { form, onSubmit, serverError, isSuccess, isLoading }
}
