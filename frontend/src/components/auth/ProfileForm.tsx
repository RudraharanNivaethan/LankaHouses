import { Input } from '../ui/Input'
import { AlertBanner } from '../ui/AlertBanner'
import { SuccessBanner } from '../ui/SuccessBanner'
import { FormLayout } from '../layout/FormLayout'
import { useUpdateProfile } from '../../hooks/useUpdateProfile'
import { useAuth } from '../../context/AuthContext'

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
        </div>
      </div>

      {/* Editable form */}
      <FormLayout
        onSubmit={onSubmit}
        title="Edit profile"
        subtitle="Update your display name or phone number."
        level={2}
        submitLabel="Save changes"
        submitLoadingLabel="Saving…"
        isLoading={isLoading}
        submitSize="md"
        submitClassName="w-full justify-center sm:w-auto"
        alerts={
          <>
            <AlertBanner message={serverError} />
            <SuccessBanner message={isSuccess ? 'Profile saved successfully.' : null} />
          </>
        }
      >
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
      </FormLayout>
    </div>
  )
}
