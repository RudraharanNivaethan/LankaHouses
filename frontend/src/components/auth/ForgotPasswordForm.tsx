import { Link } from 'react-router-dom'
import { Input } from '../ui/Input'
import { BaseAuthForm } from './BaseAuthForm'
import { ROUTES } from '../../constants/routes'
import { useForgotPassword } from '../../hooks/useForgotPassword'

export function ForgotPasswordForm() {
  const { form, onSubmit, serverError, isSuccess, isLoading } = useForgotPassword()
  const { register, formState: { errors } } = form

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Check your inbox</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            If that email address is registered, we've sent a link to reset your password. Check your spam folder if it doesn't arrive within a few minutes.
          </p>
        </div>
        <Link to={ROUTES.LOGIN} className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors">
          ← Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <BaseAuthForm
      onSubmit={onSubmit}
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link."
      submitLabel="Send reset link"
      submitLoadingLabel="Sending…"
      isLoading={isLoading}
      error={serverError}
      footerText="Remember your password?"
      footerLinkTo={ROUTES.LOGIN}
      footerLinkLabel="Sign in"
    >
      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
    </BaseAuthForm>
  )
}
