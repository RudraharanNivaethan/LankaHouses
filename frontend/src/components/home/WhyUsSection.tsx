import { SectionHeader } from '../ui/SectionHeader'
import { FeatureCard } from '../ui/FeatureCard'
import { SectionContainer } from '../layout/SectionContainer'

const PILLARS = [
  {
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Verified Listings',
    description:
      'Every property is reviewed and verified by our team before it goes live. No misleading descriptions or outdated listings.',
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: 'Direct from Seller',
    description:
      'We are the sole seller, no third-party agents or hidden fees. Your inquiry goes straight to the source.',
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    title: 'Simple Inquiry Process',
    description:
      'Submit your interest in seconds. Create an account and fill out a short form and our team will get back to you promptly.',
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Island-Wide Coverage',
    description:
      'Properties in Colombo, Jaffna, Galle, Kandy, Nuwara Eliya and beyond, we cover every major district in Sri Lanka.',
  },
]

export function WhyUsSection() {
  return (
    <section className="bg-slate-50 py-20">
      <SectionContainer>
        <div className="mb-14">
          <SectionHeader
            eyebrow="Why choose us"
            title="The LankaHouses Difference"
            description="We built this platform to make property discovery in Sri Lanka straightforward, honest, and accessible to everyone."
          />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ icon, title, description }) => (
            <FeatureCard key={title} icon={icon} title={title} description={description} />
          ))}
        </div>
      </SectionContainer>
    </section>
  )
}
