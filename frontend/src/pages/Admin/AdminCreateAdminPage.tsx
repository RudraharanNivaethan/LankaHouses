import { AdminShell } from '../../components/layout/AdminShell'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { SuccessBanner } from '../../components/ui/SuccessBanner'
import { Input } from '../../components/ui/Input'
import { Spinner } from '../../components/ui/Spinner'
import { BackButton } from '../../components/ui/BackButton'
import { useCreateAdmin } from '../../hooks/useCreateAdmin'

export function AdminCreateAdminPage() {
  const { form, onSubmit, serverError, successMessage, isLoading } = useCreateAdmin()
  const {
    register,
    formState: { errors },
  } = form

  const header = (
    <div>
      <BackButton className="mb-3" />
      <h1 className="text-2xl font-bold text-slate-800">Create Admin</h1>
      <p className="mt-1 text-sm text-slate-500">
        Create a new admin account. The account will be active immediately.
      </p>
    </div>
  )

  return (
    <AdminShell header={header} gap="sm">
      <div className="flex flex-col gap-6 max-w-xl">
        <AlertBanner message={serverError} />
        <SuccessBanner message={successMessage} />

        <form
          onSubmit={onSubmit}
          noValidate
          className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <Input
            label="Full Name"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email Address"
            type="email"
            autoComplete="email"
            placeholder="admin@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="Min 12 characters with uppercase, number & symbol"
            hint="Must be at least 12 characters with uppercase, lowercase, number, and symbol."
            error={errors.password?.message}
            {...register('password')}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:opacity-60"
          >
            {isLoading && <Spinner className="h-4 w-4 text-white" />}
            {isLoading ? 'Creating...' : 'Create Admin'}
          </button>
        </form>
      </div>
    </AdminShell>
  )
}
