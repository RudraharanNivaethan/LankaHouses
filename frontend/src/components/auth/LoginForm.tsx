import { Link } from 'react-router-dom'
import { Input } from '../ui/Input'
import { GoogleSignInButton } from './GoogleSignInButton'
import { OAuthDivider } from './OAuthDivider'
import { BaseAuthForm } from './BaseAuthForm'
import { ROUTES } from '../../constants/routes'
import { useLogin } from '../../hooks/useLogin'
import { useGoogleLogin } from '../../hooks/useGoogleLogin'

export function LoginForm() {
  const { form, onSubmit, serverError, isLoading } = useLogin()
  const { register, formState: { errors } } = form
  const { loginWithGoogle, isLoading: isGoogleLoading, error: googleError } = useGoogleLogin()

  return (
    <BaseAuthForm
      onSubmit={onSubmit}
      title="Welcome back"
      subtitle="Sign in to your LankaHouses account"
      submitLabel="Sign In"
      submitLoadingLabel="Signing in…"
      isLoading={isLoading}
      error={serverError ?? googleError}
      footerText="Don't have an account?"
      footerLinkTo={ROUTES.SIGNUP}
      footerLinkLabel="Create one"
    >
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
    </BaseAuthForm>
  )
}
