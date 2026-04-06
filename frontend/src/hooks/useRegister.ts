import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { firebaseAuth } from '../config/firebase'
import { registerSchema } from '../schemas/auth'
import { firebaseRegister } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { ROUTES } from '../constants/routes'
import type { RegisterFormData } from '../types/auth'

function mapFirebaseRegisterError(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/weak-password':
      return 'Password is too weak. Use at least 12 characters with mixed case, numbers and symbols.'
    case 'auth/invalid-email':
      return 'Invalid email address.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.'
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.'
    default:
      return 'Registration failed. Please try again.'
  }
}

export function useRegister() {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', phone: '', password: '' },
  })

  const { refreshUser } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = form.handleSubmit(async (data) => {
    setServerError(null)
    setIsLoading(true)
    let firebaseCreated = false
    try {
      const credential = await createUserWithEmailAndPassword(firebaseAuth, data.email, data.password)
      firebaseCreated = true
      const idToken = await credential.user.getIdToken()
      await firebaseRegister(idToken, data.name, data.phone || undefined)
      await refreshUser()
      navigate(ROUTES.HOME)
    } catch (err) {
      const code = (err as { code?: string }).code ?? ''
      if (code.startsWith('auth/')) {
        setServerError(mapFirebaseRegisterError(code))
      } else if (firebaseCreated) {
        // Firebase user was created but backend failed — surface the backend error
        setServerError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
      } else {
        setServerError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  })

  return { form, onSubmit, serverError, isLoading }
}
