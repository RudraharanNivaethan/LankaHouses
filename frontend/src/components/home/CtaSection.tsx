import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { ImageSection } from '../layout/ImageSection'
import { SectionContainer } from '../layout/SectionContainer'

const BG_IMAGE =
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80'

export function CtaSection() {
  return (
    <ImageSection
      src={BG_IMAGE}
      overlay="bg-brand-dark/90"
      className="py-24"
    >
      <SectionContainer className="text-center">
        <Badge variant="ghost">No account needed to inquire</Badge>

        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Ready to Find Your
          <br />
          Perfect Property?
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/75">
          Browse our full catalogue of verified Sri Lankan properties and submit an inquiry in minutes.
          Our team will reach out to you directly.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            variant="primary"
            className="w-full bg-white text-brand-dark hover:bg-slate-100 sm:w-auto"
          >
            Browse All Properties
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full border-white/50 text-white hover:border-white hover:bg-white/10 sm:w-auto"
          >
            Contact Us
          </Button>
        </div>
      </SectionContainer>
    </ImageSection>
  )
}
