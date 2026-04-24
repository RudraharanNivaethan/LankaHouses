import { useParams } from 'react-router-dom'
import { useProperty } from '../../hooks/useProperty'
import { PropertyDetailPanel } from '../../components/listings/PropertyDetailPanel'
import { ListingsBrowseShell } from '../../components/layout/ListingsBrowseShell'
import { SectionContainer } from '../../components/layout/SectionContainer'
import { Spinner } from '../../components/ui/Spinner'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { BackButton } from '../../components/ui/BackButton'

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { property, isLoading, error } = useProperty(id)

  if (isLoading) {
    return (
      <ListingsBrowseShell>
        <SectionContainer className="flex flex-1 flex-col py-16">
          <div className="flex items-center justify-center py-20">
            <Spinner className="h-8 w-8 text-brand" />
          </div>
        </SectionContainer>
      </ListingsBrowseShell>
    )
  }

  if (error || !property) {
    return (
      <ListingsBrowseShell>
        <SectionContainer className="flex flex-1 flex-col gap-4 py-16">
          <AlertBanner message={error ?? 'Property not found.'} />
          <BackButton variant="outline" size="sm" label="Back to listings" />
        </SectionContainer>
      </ListingsBrowseShell>
    )
  }

  return (
    <ListingsBrowseShell>
      <SectionContainer className="flex flex-1 flex-col gap-8 py-10 sm:py-12">
        <PropertyDetailPanel variant="public" property={property} />
      </SectionContainer>
    </ListingsBrowseShell>
  )
}
