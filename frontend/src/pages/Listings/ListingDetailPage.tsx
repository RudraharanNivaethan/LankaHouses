import { Link, useParams } from 'react-router-dom'
import { useProperty } from '../../hooks/useProperty'
import { PropertyDetailPanel } from '../../components/listings/PropertyDetailPanel'
import { SectionContainer } from '../../components/layout/SectionContainer'
import { Spinner } from '../../components/ui/Spinner'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { Button } from '../../components/ui/Button'
import { ROUTES } from '../../constants/routes'

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { property, isLoading, error } = useProperty(id)

  if (isLoading) {
    return (
      <SectionContainer className="flex flex-1 flex-col py-16">
        <div className="flex items-center justify-center py-20">
          <Spinner className="h-8 w-8 text-brand" />
        </div>
      </SectionContainer>
    )
  }

  if (error || !property) {
    return (
      <SectionContainer className="flex flex-1 flex-col gap-4 py-16">
        <AlertBanner message={error ?? 'Property not found.'} />
        <Link to={ROUTES.LISTINGS}>
          <Button variant="outline" size="sm">Back to listings</Button>
        </Link>
      </SectionContainer>
    )
  }

  return (
    <SectionContainer className="flex flex-1 flex-col gap-8 py-10 sm:py-12">
      <PropertyDetailPanel variant="public" property={property} />
    </SectionContainer>
  )
}
