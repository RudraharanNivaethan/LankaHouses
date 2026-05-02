import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { firebaseAuth } from '../config/firebase'
import { registerSchema } from '../schemas/auth'
import { firebaseRegister } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import type { RegisterFormData } from '../types/auth'
import { getFirebaseErrorMessage, getClientErrorMessage } from '../utils/errorMessages'

export function useRegister() {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', phone: '', password: '' },
  })

  const { refreshUser } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = form.handleSubmit(async (data) => {
    setServerError(null)
    setIsLoading(true)
    let firebaseCreated = false
    try {
      const credential = await createUserWithEmailAndPassword(firebaseAuth, data.email, data.password)
      firebaseCreated = true
      const idToken = await credential.user.getIdToken()
      await firebaseRegister(idToken, data.name, data.phone || undefined)
      // Post-login navigation is owned by RedirectIfAuthenticated.
      await refreshUser()
    } catch (err) {
      const code = (err as { code?: string }).code ?? ''
      if (code.startsWith('auth/')) {
        setServerError(getFirebaseErrorMessage(code))
      } else if (firebaseCreated) {
        // Firebase user was created but backend failed — surface the backend error
        setServerError(getClientErrorMessage(err))
      } else {
        setServerError(getClientErrorMessage(err))
      }
    } finally {
      setIsLoading(false)
    }
  })

  return { form, onSubmit, serverError, isLoading }
}
