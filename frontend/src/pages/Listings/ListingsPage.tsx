import { useLocation } from 'react-router-dom'
import { ListingsBrowseShell } from '../../components/layout/ListingsBrowseShell'
import { SectionContainer } from '../../components/layout/SectionContainer'
import { ImageSection } from '../../components/layout/ImageSection'
import { PropertyListingList } from '../../components/listings/PropertyListingList'
import { PropertySlider } from '../../components/listings/PropertySlider'
import { Badge } from '../../components/ui/Badge'

const BANNER_IMAGE =
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80'

export function ListingsPage() {
  const location = useLocation()

  return (
    <ListingsBrowseShell>
      {/* 1. Full-bleed dark image banner */}
      <ImageSection
        src={BANNER_IMAGE}
        overlay="bg-gradient-to-br from-slate-900/85 via-slate-900/65 to-brand-dark/40"
        className="py-16 sm:py-20"
      >
        <SectionContainer>
          <Badge variant="brand">Sri Lanka&rsquo;s Property Listings</Badge>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Browse All Listings
          </h1>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-slate-300">
            Verified properties across Sri Lanka. Filter by type, listing, or search by location and keywords.
          </p>
        </SectionContainer>
      </ImageSection>

      {/* 2. Slider + filterable grid */}
      <SectionContainer className="flex flex-1 flex-col gap-6 py-8 sm:py-10">
        <PropertySlider />
        <PropertyListingList key={location.search} variant="public" />
      </SectionContainer>
    </ListingsBrowseShell>
  )
}
