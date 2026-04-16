import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { firebaseAuth } from '../config/firebase'
import { loginSchema } from '../schemas/auth'
import { firebaseExchange } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { getPostAuthDestination } from '../utils/authRedirect'
import type { LoginFormData } from '../types/auth'

function mapFirebaseLoginError(code: string): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password.'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later or reset your password.'
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.'
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.'
    default:
      return 'Login failed. Please try again.'
  }
}

export function useLogin() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const { refreshUser } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const onSubmit = form.handleSubmit(async (data) => {
    setServerError(null)
    setIsLoading(true)
    try {
      const credential = await signInWithEmailAndPassword(firebaseAuth, data.email, data.password)
      const idToken = await credential.user.getIdToken()
      await firebaseExchange(idToken)
      const me = await refreshUser()
      navigate(getPostAuthDestination(me, searchParams), { replace: true })
    } catch (err) {
      const code = (err as { code?: string }).code ?? ''
      if (code.startsWith('auth/')) {
        setServerError(mapFirebaseLoginError(code))
      } else {
        setServerError(err instanceof Error ? err.message : 'Login failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  })

  return { form, onSubmit, serverError, isLoading }
}
