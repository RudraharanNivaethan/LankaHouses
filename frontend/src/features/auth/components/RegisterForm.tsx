import { Link } from 'react-router-dom'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { Spinner } from '../../../components/ui/Spinner'
import { AlertBanner } from '../../../components/ui/AlertBanner'
import { GoogleSignInButton } from '../../../components/auth/GoogleSignInButton'
import { OAuthDivider } from '../../../components/auth/OAuthDivider'
import { ROUTES } from '../../../constants/routes'
import { useRegister } from '../hooks/useRegister'
import { useGoogleLogin } from '../hooks/useGoogleLogin'

export function RegisterForm() {
  const { form, onSubmit, serverError, isLoading } = useRegister()
  const { register, formState: { errors } } = form
  const { loginWithGoogle, isLoading: isGoogleLoading, error: googleError } = useGoogleLogin()

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create your account</h1>
        <p className="text-sm text-slate-500">Join LankaHouses to save listings and submit inquiries</p>
      </div>

      <AlertBanner message={serverError ?? googleError} />

      <GoogleSignInButton
        onClick={loginWithGoogle}
        isLoading={isGoogleLoading}
        disabled={isLoading}
        loadingLabel="Continuing…"
      />

      <OAuthDivider label="or create account with email" />

      <Input
        label="Full name"
        type="text"
        placeholder="Kamal Perera"
        autoComplete="name"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Phone number (optional)"
        type="tel"
        placeholder="0712345678"
        autoComplete="tel"
        hint="You can add this later from your profile"
        error={errors.phone?.message}
        {...register('phone')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Create a strong password"
        autoComplete="new-password"
        hint="Min. 12 characters with uppercase, lowercase, number & symbol"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full justify-center"
        disabled={isLoading}
      >
        {isLoading ? <><Spinner /> Creating account…</> : 'Create Account'}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="font-semibold text-brand hover:text-brand-dark transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  )
}
