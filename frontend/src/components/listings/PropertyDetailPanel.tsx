import { Link } from 'react-router-dom'
import { ImageGallery } from '../ui/ImageGallery'
import { DetailSection } from '../ui/DetailSection'
import { DetailField } from '../ui/DetailField'
import { StatusBadge } from '../ui/StatusBadge'
import { Button } from '../ui/Button'
import { STATUS_LABELS, STATUS_COLORS } from '../../constants/property'
import { ROUTES } from '../../constants/routes'
import type { PropertyRecord } from '../../types/property'

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

interface PropertyDetailPanelProps {
  variant: 'admin' | 'public'
  property: PropertyRecord
  onDeleteClick?: () => void
}

export function PropertyDetailPanel({ variant, property, onDeleteClick }: PropertyDetailPanelProps) {
  const galleryImages = property.images.map((img, idx) => ({
    url: img.url,
    alt: `${property.title} - Image ${idx + 1}`,
  }))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {property.title}
          </h1>
          {variant === 'admin' && (
            <StatusBadge
              status={property.status}
              label={STATUS_LABELS[property.status]}
              colors={STATUS_COLORS[property.status]}
            />
          )}
        </div>
        {variant === 'admin' && (
          <div className="flex items-center gap-3">
            <Link to={ROUTES.ADMIN_EDIT_HOUSE.replace(':id', property._id)}>
              <Button variant="outline" size="sm">Edit Property</Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDeleteClick}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              Delete
            </Button>
          </div>
        )}
      </div>

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

      {variant === 'admin' ? (
        <DetailSection title="Metadata" columns={3}>
          <DetailField label="Property ID" value={property._id} />
          <DetailField label="Created" value={formatDate(property.createdAt)} />
          <DetailField label="Last Updated" value={formatDate(property.updatedAt)} />
        </DetailSection>
      ) : (
        <DetailSection title="Listed" columns={2}>
          <DetailField label="Created" value={formatDate(property.createdAt)} />
          <DetailField label="Last Updated" value={formatDate(property.updatedAt)} />
        </DetailSection>
      )}

      <div>
        <Link to={variant === 'admin' ? ROUTES.ADMIN_HOUSES : ROUTES.LISTINGS}>
          <Button variant="outline" size="sm">
            {variant === 'admin' ? 'Back to Properties' : 'Back to listings'}
          </Button>
        </Link>
      </div>
    </div>
  )
}
