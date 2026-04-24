import { useParams } from 'react-router-dom'
import { useUser } from '../../hooks/useUser'
import { Spinner } from '../ui/Spinner'
import { AlertBanner } from '../ui/AlertBanner'
import { BackButton } from '../ui/BackButton'
import { DetailSection } from '../ui/DetailSection'
import { DetailField } from '../ui/DetailField'
import { formatAdminDate } from '../../utils/formatDate'
import { UserRoleBadge } from './UserRoleBadge'

export function UserDetailView() {
  const { id } = useParams<{ id: string }>()
  const { user, isLoading, error } = useUser(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="h-8 w-8 text-brand" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex flex-col gap-4">
        <AlertBanner message={error ?? 'User not found.'} />
        <BackButton label="Back to Users" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <BackButton label="Back to Users" />

      <DetailSection title="Profile" columns={2}>
        <DetailField label="Name" value={user.name} />
        <DetailField label="Email" value={user.email} />
        <DetailField
          label="Role"
          value={<UserRoleBadge role={user.role} displayRole={user.displayRole} />}
        />
        <DetailField label="Phone" value={user.phone ?? '—'} />
        <DetailField
          label="Registered"
          value={user.createdAt ? formatAdminDate(user.createdAt) : '—'}
        />
      </DetailSection>
    </div>
  )
}
