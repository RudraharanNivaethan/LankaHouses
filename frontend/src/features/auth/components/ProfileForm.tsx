import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { useUpdateProfile } from '../hooks/useUpdateProfile'
import { useAuth } from '../../../context/AuthContext'

export function ProfileForm() {
  const { user } = useAuth()
  const { form, onSubmit, serverError, isSuccess, isLoading } = useUpdateProfile()
  const { register, formState: { errors } } = form

  if (!user) return null

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand text-xl font-bold text-white">
          {user.name
            .split(' ')
            .slice(0, 2)
            .map((n) => n[0]?.toUpperCase() ?? '')
            .join('')}
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{user.name}</h1>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
      </div>

      {/* Read-only account info */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Account</p>
        <div className="mt-3 flex flex-col gap-3">
          <div>
            <p className="text-xs text-slate-500">Email address</p>
            <p className="mt-0.5 text-sm font-medium text-slate-700">{user.email}</p>
          </div>
          <p className="text-xs text-slate-400">
            Email is managed by Firebase and cannot be changed here.
          </p>
        </div>
      </div>

      {/* Editable form */}
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Edit profile</h2>
          <p className="text-sm text-slate-500">Update your display name or phone number.</p>
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

        {isSuccess && (
          <div
            role="status"
            className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Profile saved successfully.
          </div>
        )}

        <Input
          label="Display name"
          type="text"
          placeholder="Your full name"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Phone number"
          type="tel"
          placeholder="0712345678 or +94712345678"
          autoComplete="tel"
          hint={!user.phone ? 'No phone number on file. Add one to enable contact features.' : undefined}
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full justify-center sm:w-auto"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving…
            </>
          ) : (
            'Save changes'
          )}
        </Button>
      </form>
    </div>
  )
}
