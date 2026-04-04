import { HeroSection } from './sections/HeroSection'
import { FeaturedProperties } from './sections/FeaturedProperties'
import { WhyUsSection } from './sections/WhyUsSection'
import { CtaSection } from './sections/CtaSection'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProperties />
      <WhyUsSection />
      <CtaSection />
    </>
  )
}
