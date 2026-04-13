import { Link, useParams } from 'react-router-dom'
import { useProperty } from '../../hooks/useProperty'
import { Spinner } from '../../components/ui/Spinner'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { Button } from '../../components/ui/Button'
import { ImageGallery } from '../../components/ui/ImageGallery'
import { DetailSection } from '../../components/ui/DetailSection'
import { DetailField } from '../../components/ui/DetailField'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { ROUTES } from '../../constants/routes'
import { STATUS_LABELS, STATUS_COLORS } from '../../constants/property'

function formatPrice(price: number): string {
  return price.toLocaleString('en-LK')
}

export function PublicPropertyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { property, isLoading, error } = useProperty(id)

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="h-10 w-10 text-brand" />
      </div>
    )
  }

  if (error || !property || !id) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <AlertBanner message={error ?? 'This listing is not available.'} />
        <Link to={ROUTES.LISTINGS} className="mt-4 inline-block text-sm font-semibold text-brand hover:text-brand-dark">
          ← Back to listings
        </Link>
      </div>
    )
  }

  const galleryImages = property.images.map((img, idx) => ({
    url: img.url,
    alt: `${property.title} - Image ${idx + 1}`,
  }))

  const canInquire = property.status === 'active'
  const inquiryHref = `${ROUTES.INQUIRY}?property=${encodeURIComponent(property._id)}`

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{property.title}</h1>
            <StatusBadge
              status={property.status}
              label={STATUS_LABELS[property.status]}
              colors={STATUS_COLORS[property.status]}
            />
          </div>
          <p className="text-xl font-semibold text-brand">LKR {formatPrice(property.price)}</p>
          <p className="mt-1 text-slate-600">
            {property.district}, {property.province}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
          {canInquire ? (
            <Link
              to={inquiryHref}
              className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-brand px-6 py-2.5 text-base font-semibold text-white shadow-md transition-all duration-200 hover:bg-brand-dark hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Inquire
            </Link>
          ) : (
            <div className="flex flex-col items-stretch gap-1 sm:items-end">
              <Button variant="primary" size="md" disabled className="justify-center opacity-60">
                Inquire
              </Button>
              <p className="text-center text-xs text-slate-500 sm:text-right">
                {property.status === 'sold'
                  ? 'This property is sold — inquiries are closed.'
                  : 'This listing is not available for inquiry.'}
              </p>
            </div>
          )}
          <Link
            to={ROUTES.LISTINGS}
            className="text-center text-sm font-medium text-slate-600 hover:text-brand sm:text-right"
          >
            ← All listings
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ImageGallery images={galleryImages} />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-2">
          <DetailSection title="Overview" columns={3}>
            <DetailField label="Type" value={property.type} />
            <DetailField label="Listing" value={property.listingType === 'sale' ? 'For sale' : 'For rent'} />
            <DetailField label="Bedrooms" value={property.bedrooms} />
            <DetailField label="Bathrooms" value={property.bathrooms} />
            <DetailField label="Parking" value={property.parkingSpaces} />
            <DetailField label="Furnished" value={property.furnished ? 'Yes' : 'No'} />
            <DetailField label="Area (sq ft)" value={property.area.toLocaleString()} />
            <DetailField label="Land (perches)" value={property.landSize.toLocaleString()} />
          </DetailSection>
          <DetailSection title="Location" columns={1}>
            <DetailField label="Address" value={property.address} />
          </DetailSection>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="mb-3 text-base font-semibold text-slate-800">Description</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{property.description}</p>
          </section>
        </div>
      </div>
    </div>
  )
}
