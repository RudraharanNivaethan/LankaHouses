import { Link } from 'react-router-dom'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { Spinner } from '../../../components/ui/Spinner'
import { AlertBanner } from '../../../components/ui/AlertBanner'
import { ROUTES } from '../../../constants/routes'
import { useForgotPassword } from '../hooks/useForgotPassword'

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
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reset your password</h1>
        <p className="text-sm text-slate-500">Enter your email and we'll send you a reset link.</p>
      </div>

      <AlertBanner message={serverError} />

      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full justify-center"
        disabled={isLoading}
      >
        {isLoading ? <><Spinner /> Sending…</> : 'Send reset link'}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Remember your password?{' '}
        <Link to={ROUTES.LOGIN} className="font-semibold text-brand hover:text-brand-dark transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  )
}
