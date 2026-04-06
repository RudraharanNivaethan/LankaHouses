import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { firebaseAuth } from '../config/firebase'
import { logoutUser } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { ROUTES } from '../constants/routes'

export function useLogout() {
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const logout = async () => {
    setIsLoading(true)
    try {
      await logoutUser()
    } catch {
      // Proceed with local logout even if the server call fails
    } finally {
      // Clear Firebase local session so the account picker appears on next Google sign-in
      await signOut(firebaseAuth).catch(() => {})
      setUser(null)
      setIsLoading(false)
      navigate(ROUTES.HOME)
    }
  }

  return { logout, isLoading }
}
