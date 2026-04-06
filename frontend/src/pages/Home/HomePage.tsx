import { HeroSection } from '../../components/home/HeroSection'
import { FeaturedProperties } from '../../components/home/FeaturedProperties'
import { WhyUsSection } from '../../components/home/WhyUsSection'
import { CtaSection } from '../../components/home/CtaSection'

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
