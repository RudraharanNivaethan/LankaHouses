import type { FormEventHandler, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Spinner } from '../ui/Spinner'
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

export function BaseAuthForm({
  onSubmit,
  title,
  subtitle,
  submitLabel,
  submitLoadingLabel,
  isLoading,
  error,
  footerText,
  footerLinkTo,
  footerLinkLabel,
  children,
}: BaseAuthFormProps) {
  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>

      <AlertBanner message={error} />

      {children}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full justify-center"
        disabled={isLoading}
      >
        {isLoading ? <><Spinner /> {submitLoadingLabel}</> : submitLabel}
      </Button>

      {footerText && footerLinkTo && footerLinkLabel && (
        <p className="text-center text-sm text-slate-600">
          {footerText}{' '}
          <Link
            to={footerLinkTo}
            className="font-semibold text-brand hover:text-brand-dark transition-colors"
          >
            {footerLinkLabel}
          </Link>
        </p>
      )}
    </form>
  )
}
