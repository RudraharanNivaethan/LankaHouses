import { AdminShell } from '../../components/layout/AdminShell'
import { PageHeader } from '../../components/layout/PageHeader'
import { ProfileForm } from '../../components/auth/ProfileForm'

export function AdminProfilePage() {
  return (
    <AdminShell
      header={
        <PageHeader
          title="My Profile"
          description="Update your display name or phone number."
        />
      }
    >
      <div className="mx-auto w-full max-w-lg">
        <ProfileForm />
      </div>
    </AdminShell>
  )
}
