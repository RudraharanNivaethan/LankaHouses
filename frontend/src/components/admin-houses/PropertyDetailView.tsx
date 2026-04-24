import { useParams } from 'react-router-dom'
import { useProperty } from '../../hooks/useProperty'
import { useDeleteProperty } from '../../hooks/useDeleteProperty'
import { PropertyDetailPanel } from '../listings/PropertyDetailPanel'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { Spinner } from '../ui/Spinner'
import { AlertBanner } from '../ui/AlertBanner'
import { BackButton } from '../ui/BackButton'

export function PropertyDetailView() {
  const { id } = useParams<{ id: string }>()
  const { property, isLoading, error } = useProperty(id)
  const {
    isDeleting,
    error: deleteError,
    showConfirm,
    requestDelete,
    cancelDelete,
    confirmDelete,
  } = useDeleteProperty()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-brand" />
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="flex flex-col gap-4">
        <AlertBanner message={error ?? 'Property not found.'} />
        <BackButton variant="outline" size="sm" label="Back to Properties" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <AlertBanner message={deleteError} />
      <PropertyDetailPanel variant="admin" property={property} onDeleteClick={requestDelete} />
      <ConfirmDialog
        open={showConfirm}
        title="Delete Property"
        message={`Are you sure you want to remove "${property.title}"? This will mark the property as removed.`}
        confirmLabel="Delete"
        onConfirm={() => confirmDelete(property._id)}
        onCancel={cancelDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
