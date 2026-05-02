import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteProperty } from '../services/propertyService'
import { ROUTES } from '../constants/routes'
import { getClientErrorMessage } from '../utils/errorMessages'

export function useDeleteProperty() {
  const navigate = useNavigate()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const requestDelete = () => setShowConfirm(true)
  const cancelDelete = () => setShowConfirm(false)

  const confirmDelete = async (id: string) => {
    setIsDeleting(true)
    setError(null)
    try {
      await deleteProperty(id)
      setShowConfirm(false)
      navigate(ROUTES.ADMIN_HOUSES)
    } catch (err) {
      setError(getClientErrorMessage(err))
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    isDeleting,
    error,
    showConfirm,
    requestDelete,
    cancelDelete,
    confirmDelete,
  }
}
