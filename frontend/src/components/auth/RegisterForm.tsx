import { Input } from '../ui/Input'
import { GoogleSignInButton } from './GoogleSignInButton'
import { OAuthDivider } from './OAuthDivider'
import { BaseAuthForm } from './BaseAuthForm'
import { ROUTES } from '../../constants/routes'
import { useRegister } from '../../hooks/useRegister'
import { useGoogleLogin } from '../../hooks/useGoogleLogin'

export function RegisterForm() {
  const { form, onSubmit, serverError, isLoading } = useRegister()
  const { register, formState: { errors } } = form
  const { loginWithGoogle, isLoading: isGoogleLoading, error: googleError } = useGoogleLogin()

  return (
    <BaseAuthForm
      onSubmit={onSubmit}
      title="Create your account"
      subtitle="Join LankaHouses to save listings and submit inquiries"
      submitLabel="Create Account"
      submitLoadingLabel="Creating account…"
      isLoading={isLoading}
      error={serverError ?? googleError}
      footerText="Already have an account?"
      footerLinkTo={ROUTES.LOGIN}
      footerLinkLabel="Sign in"
    >
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
    </BaseAuthForm>
  )
}
