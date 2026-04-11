import { Link, useParams } from 'react-router-dom'
import { useProperty } from '../../hooks/useProperty'
import { useDeleteProperty } from '../../hooks/useDeleteProperty'
import { ImageGallery } from '../ui/ImageGallery'
import { DetailSection } from '../ui/DetailSection'
import { DetailField } from '../ui/DetailField'
import { StatusBadge } from '../ui/StatusBadge'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { Spinner } from '../ui/Spinner'
import { AlertBanner } from '../ui/AlertBanner'
import { Button } from '../ui/Button'
import { STATUS_LABELS, STATUS_COLORS } from '../../constants/property'
import { ROUTES } from '../../constants/routes'

function formatPrice(price: number): string {
  return price.toLocaleString('en-LK')
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

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
        <Link to={ROUTES.ADMIN_HOUSES}>
          <Button variant="outline" size="sm">Back to Properties</Button>
        </Link>
      </div>
    )
  }

  const galleryImages = property.images.map((img, idx) => ({
    url: img.url,
    alt: `${property.title} - Image ${idx + 1}`,
  }))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {property.title}
          </h1>
          <StatusBadge
            status={property.status}
            label={STATUS_LABELS[property.status]}
            colors={STATUS_COLORS[property.status]}
          />
        </div>
        <div className="flex items-center gap-3">
          <Link to={ROUTES.ADMIN_EDIT_HOUSE.replace(':id', property._id)}>
            <Button variant="outline" size="sm">Edit Property</Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={requestDelete} className="text-red-600 hover:bg-red-50 hover:text-red-700">
            Delete
          </Button>
        </div>
      </div>

      <AlertBanner message={deleteError} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ImageGallery images={galleryImages} />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <DetailSection title="Overview" columns={3}>
            <DetailField label="Price" value={`LKR ${formatPrice(property.price)}`} />
            <DetailField label="Type" value={property.type} />
            <DetailField label="Listing" value={property.listingType === 'sale' ? 'For Sale' : 'For Rent'} />
            <DetailField label="Bedrooms" value={property.bedrooms} />
            <DetailField label="Bathrooms" value={property.bathrooms} />
            <DetailField label="Parking Spaces" value={property.parkingSpaces} />
            <DetailField label="Furnished" value={property.furnished ? 'Yes' : 'No'} />
            <DetailField label="Year Built" value={property.yearBuilt} />
            <DetailField label="Floors" value={property.noOfFloors} />
            <DetailField label="Area (sq ft)" value={property.area.toLocaleString()} />
            <DetailField label="Land Size (perches)" value={property.landSize.toLocaleString()} />
            <DetailField label="Contact" value={property.contactNumber} />
          </DetailSection>

          <DetailSection title="Location" columns={3}>
            <DetailField label="Address" value={property.address} />
            <DetailField label="District" value={property.district} />
            <DetailField label="Province" value={property.province} />
          </DetailSection>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="mb-3 text-base font-semibold text-slate-800">Description</h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
          {property.description}
        </p>
      </section>

      <DetailSection title="Metadata" columns={3}>
        <DetailField label="Property ID" value={property._id} />
        <DetailField label="Created" value={formatDate(property.createdAt)} />
        <DetailField label="Last Updated" value={formatDate(property.updatedAt)} />
      </DetailSection>

      <div>
        <Link to={ROUTES.ADMIN_HOUSES}>
          <Button variant="outline" size="sm">Back to Properties</Button>
        </Link>
      </div>

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
