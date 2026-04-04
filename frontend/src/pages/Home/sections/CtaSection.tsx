import { Button } from '../../../components/ui/Button'

const BG_IMAGE =
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80'

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Background */}
      <img
        src={BG_IMAGE}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-brand-dark/90" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm">
          No account needed to inquire
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Ready to Find Your
          <br />
          Perfect Property?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/75">
          Browse our full catalogue of verified Sri Lankan properties and submit an inquiry in minutes. Our team will reach out to you directly.
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
      </div>
    </section>
  )
}
