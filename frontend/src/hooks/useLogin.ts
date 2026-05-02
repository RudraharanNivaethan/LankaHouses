import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { firebaseAuth } from '../config/firebase'
import { loginSchema } from '../schemas/auth'
import { firebaseExchange } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import type { LoginFormData } from '../types/auth'
import { getFirebaseErrorMessage, getClientErrorMessage } from '../utils/errorMessages'

export function useLogin() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const { refreshUser } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = form.handleSubmit(async (data) => {
    setServerError(null)
    setIsLoading(true)
    try {
      const credential = await signInWithEmailAndPassword(firebaseAuth, data.email, data.password)
      const idToken = await credential.user.getIdToken()
      await firebaseExchange(idToken)
      // Post-login navigation is owned by RedirectIfAuthenticated; simply
      // updating auth state here triggers the centralized redirect.
      await refreshUser()
    } catch (err) {
      const code = (err as { code?: string }).code ?? ''
      if (code.startsWith('auth/')) {
        setServerError(getFirebaseErrorMessage(code))
      } else {
        setServerError(getClientErrorMessage(err))
      }
    } finally {
      setIsLoading(false)
    }
  })

  return { form, onSubmit, serverError, isLoading }
}
