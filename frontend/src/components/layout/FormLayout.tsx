import type { FormEventHandler, ReactNode } from 'react'
import { FormShell } from '../ui/FormShell'
import { FormHeader } from '../ui/FormHeader'
import { FormSubmitButton } from '../ui/FormSubmitButton'
import { FormFooterLink } from '../ui/FormFooterLink'

interface FormLayoutProps {
  onSubmit: FormEventHandler<HTMLFormElement>
  title: string
  subtitle?: string
  /** 1 = h1 text-2xl (default), 2 = h2 text-base */
  level?: 1 | 2
  submitLabel: string
  submitLoadingLabel: string
  isLoading: boolean
  submitSize?: 'md' | 'lg'
  submitClassName?: string
  footerText?: string
  footerLinkTo?: string
  footerLinkLabel?: string
  /** Banner slot — pass AlertBanner, SuccessBanner, or both */
  alerts?: ReactNode
  children: ReactNode
}

export function FormLayout({
  onSubmit,
  title,
  subtitle,
  level = 1,
  submitLabel,
  submitLoadingLabel,
  isLoading,
  submitSize = 'lg',
  submitClassName = 'w-full justify-center',
  footerText,
  footerLinkTo,
  footerLinkLabel,
  alerts,
  children,
}: FormLayoutProps) {
  return (
    <FormShell onSubmit={onSubmit}>
      <FormHeader title={title} subtitle={subtitle} level={level} />
      {alerts}
      {children}
      <FormSubmitButton
        isLoading={isLoading}
        label={submitLabel}
        loadingLabel={submitLoadingLabel}
        size={submitSize}
        className={submitClassName}
      />
      {footerText && footerLinkTo && footerLinkLabel && (
        <FormFooterLink text={footerText} to={footerLinkTo} label={footerLinkLabel} />
      )}
    </FormShell>
  )
}
