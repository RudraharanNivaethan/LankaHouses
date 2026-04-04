import { Button } from '../../../components/ui/Button'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1920&q=80'

export function HeroSection() {
  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
      {/* Background image */}
      <img
        src={HERO_IMAGE}
        alt="Luxury Sri Lankan property"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-900/60 to-brand-dark/40" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand-light backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand-light" />
          Sri Lanka's Trusted Property Platform
        </span>

        <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          Find Your Dream Home
          <br />
          <span className="text-brand-light">in Sri Lanka</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
          Browse verified properties across the island — from coastal villas to city apartments.
          Express your interest directly with the seller, no intermediaries.
        </p>

        {/* Stats row */}
        <div className="mx-auto mt-10 flex flex-wrap justify-center gap-8">
          {[
            { value: '200+', label: 'Properties Listed' },
            { value: '9', label: 'Districts Covered' },
            { value: '100%', label: 'Verified Listings' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="mt-0.5 text-sm text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" variant="primary" className="w-full sm:w-auto">
            Browse Properties
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full border-white/50 text-white hover:border-brand hover:bg-brand hover:text-white sm:w-auto"
          >
            Submit an Inquiry
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
