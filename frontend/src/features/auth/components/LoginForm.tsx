import { Link } from 'react-router-dom'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { ROUTES } from '../../../constants/routes'
import { useLogin } from '../hooks/useLogin'

export function LoginForm() {
  const { form, onSubmit, serverError, isLoading } = useLogin()
  const { register, formState: { errors } } = form

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Welcome back
        </h1>
        <p className="text-sm text-slate-500">
          Sign in to your LankaHouses account
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <svg className="mt-0.5 h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {serverError}
        </div>
      )}

      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="flex items-center justify-end">
        <Link
          to={ROUTES.HOME}
          className="text-xs font-medium text-brand hover:text-brand-dark transition-colors"
        >
          Forgot your password?
        </Link>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full justify-center"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Signing in…
          </>
        ) : (
          'Sign In'
        )}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Don't have an account?{' '}
        <Link
          to={ROUTES.SIGNUP}
          className="font-semibold text-brand hover:text-brand-dark transition-colors"
        >
          Create one
        </Link>
      </p>
    </form>
  )
}
