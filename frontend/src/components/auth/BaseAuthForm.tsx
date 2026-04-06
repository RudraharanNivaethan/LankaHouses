import type { FormEventHandler, ReactNode } from 'react'
import { FormLayout } from '../layout/FormLayout'
import { AlertBanner } from '../ui/AlertBanner'

interface BaseAuthFormProps {
  onSubmit: FormEventHandler<HTMLFormElement>
  title: string
  subtitle?: string
  submitLabel: string
  submitLoadingLabel: string
  isLoading: boolean
  error?: string | null
  footerText?: string
  footerLinkTo?: string
  footerLinkLabel?: string
  children: ReactNode
}

export function BaseAuthForm({ error, ...rest }: BaseAuthFormProps) {
  return (
    <FormLayout {...rest} alerts={<AlertBanner message={error} />} />
  )
}
