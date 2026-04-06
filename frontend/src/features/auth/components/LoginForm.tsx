import { Link } from 'react-router-dom'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { Spinner } from '../../../components/ui/Spinner'
import { AlertBanner } from '../../../components/ui/AlertBanner'
import { GoogleSignInButton } from '../../../components/auth/GoogleSignInButton'
import { OAuthDivider } from '../../../components/auth/OAuthDivider'
import { ROUTES } from '../../../constants/routes'
import { useLogin } from '../hooks/useLogin'
import { useGoogleLogin } from '../hooks/useGoogleLogin'

export function LoginForm() {
  const { form, onSubmit, serverError, isLoading } = useLogin()
  const { register, formState: { errors } } = form
  const { loginWithGoogle, isLoading: isGoogleLoading, error: googleError } = useGoogleLogin()

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500">Sign in to your LankaHouses account</p>
      </div>

      <AlertBanner message={serverError ?? googleError} />

      <GoogleSignInButton
        onClick={loginWithGoogle}
        isLoading={isGoogleLoading}
        disabled={isLoading}
        loadingLabel="Signing in…"
      />

      <OAuthDivider label="or sign in with email" />

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
          to={ROUTES.FORGOT_PASSWORD}
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
        {isLoading ? <><Spinner /> Signing in…</> : 'Sign In'}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Don't have an account?{' '}
        <Link to={ROUTES.SIGNUP} className="font-semibold text-brand hover:text-brand-dark transition-colors">
          Create one
        </Link>
      </p>
    </form>
  )
}
