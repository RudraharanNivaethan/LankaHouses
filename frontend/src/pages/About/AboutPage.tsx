import { Link } from 'react-router-dom'
import { ImageSection } from '../../components/layout/ImageSection'
import { SectionContainer } from '../../components/layout/SectionContainer'
import { ROUTES } from '../../constants/routes'
import { buttonClassName } from '../../components/ui/Button'
import { SectionHeader } from '../../components/ui/SectionHeader'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1920&q=80'
const STORY_IMAGE =
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80'

const CORE_PILLARS = [
  {
    title: 'Mission',
    description:
      'To simplify property discovery by providing accurate, verified listings and a seamless inquiry experience.',
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.868v4.264a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Vision',
    description: 'To become Sri Lanka\'s most trusted and widely used real estate platform.',
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276a1 1 0 011.447.894v6.764a1 1 0 01-1.447.894L15 14m-6 2h6a2 2 0 002-2V10a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Values',
    description: 'Transparency, Trust, Simplicity, Accessibility.',
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
]

const STATS = [
  { value: '250+', label: 'Properties Listed' },
  { value: '25', label: 'Districts Covered' },
  { value: '100%', label: 'Verified Listings' },
]

export function AboutPage() {
  return (
    <div className="bg-white">
      <ImageSection
        src={HERO_IMAGE}
        alt="Sri Lankan skyline and premium residences"
        overlay="bg-gradient-to-br from-slate-950/85 via-slate-900/65 to-brand-dark/55"
        className="py-24 sm:py-28"
      >
        <SectionContainer>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              About LankaHouses
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-200">
              Sri Lanka&apos;s trusted platform for discovering verified properties, built to simplify how
              people find their perfect home.
            </p>
          </div>
        </SectionContainer>
      </ImageSection>

      <section className="py-16 sm:py-20">
        <SectionContainer>
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <SectionHeader eyebrow="Our foundation" title="Our Story" align="left" />
              <div className="mt-5 space-y-4 text-slate-600">
                <p>
                  LankaHouses was created with a simple mission - to make property discovery in Sri Lanka
                  transparent, reliable, and accessible.
                </p>
                <p>
                  In a market often filled with outdated listings, unclear ownership, and unnecessary
                  intermediaries, we saw the need for a platform built on trust.
                </p>
                <p>
                  Today, LankaHouses connects buyers directly with verified property listings across the
                  island, ensuring a smooth and honest experience from search to inquiry.
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-sm">
              <img
                src={STORY_IMAGE}
                alt="Scenic Sri Lankan property"
                className="h-full min-h-[280px] w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </SectionContainer>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <SectionContainer>
          <SectionHeader
            eyebrow="Core pillars"
            title="Mission, Vision, and Values"
            description="Everything we build is guided by clarity, trust, and a better property journey for every Sri Lankan home seeker."
          />
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {CORE_PILLARS.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="inline-flex rounded-xl bg-brand/10 p-2 text-brand">{pillar.icon}</span>
                <h3 className="mt-4 text-xl font-bold text-slate-900">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{pillar.description}</p>
              </article>
            ))}
          </div>
        </SectionContainer>
      </section>

      <section className="py-16 sm:py-20">
        <SectionContainer>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Why LankaHouses?</h2>
            <p className="mx-auto mt-4 max-w-3xl text-slate-600">
              We believe finding a property should not be complicated or risky. LankaHouses eliminates the
              noise by offering only verified listings, direct communication, and a streamlined process
              that puts users first.
            </p>
          </div>
        </SectionContainer>
      </section>

      <section className="bg-slate-900 py-16 sm:py-20">
        <SectionContainer>
          <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
            {STATS.map((stat) => (
              <article key={stat.label}>
                <p className="text-3xl font-bold text-white sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
              </article>
            ))}
          </div>
        </SectionContainer>
      </section>

      <section className="py-16 sm:py-20">
        <SectionContainer>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm sm:p-10">
            <SectionHeader
              eyebrow="Island-wide reach"
              title="Island-Wide Reach"
              align="left"
              description="From bustling city apartments in Colombo to serene villas in Galle and cool retreats in Nuwara Eliya, LankaHouses brings together properties from across all major districts in Sri Lanka."
            />
          </div>
        </SectionContainer>
      </section>

      <ImageSection
        src={HERO_IMAGE}
        overlay="bg-brand-dark/90"
        className="py-20 sm:py-24"
      >
        <SectionContainer className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Start Your Property Journey Today
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Explore verified listings and connect directly with sellers in just a few clicks.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to={ROUTES.LISTINGS}
              className={buttonClassName(
                'outline',
                'lg',
                'w-full border-white/50 text-white hover:border-white hover:bg-white/10 sm:w-auto',
              )}
            >
              Browse Properties
            </Link>
            <Link
              to={ROUTES.CONTACT}
              className={buttonClassName(
                'outline',
                'lg',
                'w-full border-white/50 text-white hover:border-white hover:bg-white/10 sm:w-auto',
              )}
            >
              Contact Us
            </Link>
          </div>
        </SectionContainer>
      </ImageSection>
    </div>
  )
}
