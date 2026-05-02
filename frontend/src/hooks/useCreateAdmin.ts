import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAdminSchema, type CreateAdminFormData } from '../schemas/superAdmin'
import { createAdmin } from '../services/superAdminService'
import { getClientErrorMessage } from '../utils/errorMessages'

export function useCreateAdmin() {
  const form = useForm<CreateAdminFormData>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  const [serverError, setServerError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = form.handleSubmit(async (data) => {
    setServerError(null)
    setSuccessMessage(null)
    setIsLoading(true)
    try {
      const created = await createAdmin(data)
      setSuccessMessage(`Admin "${created.name}" created successfully.`)
      form.reset()
    } catch (err) {
      setServerError(getClientErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  })

  return { form, onSubmit, serverError, successMessage, isLoading }
}
