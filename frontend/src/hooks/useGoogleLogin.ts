import { useState } from 'react'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { firebaseAuth } from '../config/firebase'
import { firebaseExchange } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { getPostAuthDestination } from '../utils/authRedirect'

export function useGoogleLogin() {
  const { refreshUser } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loginWithGoogle = async () => {
    setError(null)
    setIsLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(firebaseAuth, provider)
      const idToken = await result.user.getIdToken()
      await firebaseExchange(idToken)
      const me = await refreshUser()
      navigate(getPostAuthDestination(me, searchParams), { replace: true })
    } catch (err) {
      // auth/popup-closed-by-user is not an error worth surfacing
      if ((err as { code?: string }).code === 'auth/popup-closed-by-user') {
        return
      }
      setError(err instanceof Error ? err.message : 'Google sign-in failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return { loginWithGoogle, isLoading, error }
}
