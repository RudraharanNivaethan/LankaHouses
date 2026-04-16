import { Link } from 'react-router-dom'
import { Button, buttonClassName } from '../ui/Button'
import { ROUTES } from '../../constants/routes'
import { Badge } from '../ui/Badge'
import { StatItem } from '../ui/StatItem'
import { ImageSection } from '../layout/ImageSection'
import { SectionContainer } from '../layout/SectionContainer'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1920&q=80'

const STATS = [
  { value: '250+', label: 'Properties Listed' },
  { value: '25', label: 'Districts Covered' },
  { value: '100%', label: 'Verified Listings' },
]

export function HeroSection() {
  const scrollIndicator = (
    <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce text-white/50">
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  )

  return (
    <ImageSection
      src={HERO_IMAGE}
      alt="Luxury Sri Lankan property"
      overlay="bg-gradient-to-br from-slate-900/85 via-slate-900/60 to-brand-dark/40"
      className="flex min-h-[92vh] items-center justify-center"
      extras={scrollIndicator}
    >
      <SectionContainer className="py-20 text-center">
        <Badge variant="brand">Sri Lanka's Trusted Property Platform</Badge>

        <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          Find Your Dream Home
          <br />
          <span className="text-brand-light">in Sri Lanka</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
          Browse verified properties across the island, from coastal villas to city apartments.
          Express your interest directly with the seller, no intermediaries.
        </p>

        <div className="mx-auto mt-10 flex flex-wrap justify-center gap-8">
          {STATS.map(({ value, label }) => (
            <StatItem key={label} value={value} label={label} />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            to={ROUTES.LISTINGS}
            className={buttonClassName('primary', 'lg', 'w-full sm:w-auto text-center')}
          >
            Browse Properties
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="w-full border-white/50 text-white hover:border-brand hover:bg-brand hover:text-white sm:w-auto"
          >
            Submit an Inquiry
          </Button>
        </div>
      </SectionContainer>
    </ImageSection>
  )
}
