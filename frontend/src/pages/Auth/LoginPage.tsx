import { Link } from 'react-router-dom'
import { LoginForm } from '../../features/auth/components/LoginForm'
import { ROUTES } from '../../constants/routes'

const PANEL_IMAGE =
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80'

export function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left brand panel — desktop only */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-slate-900 p-12 lg:flex xl:w-5/12">
        <img
          src={PANEL_IMAGE}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-brand-dark/70" />

        {/* Logo */}
        <Link to={ROUTES.HOME} className="relative z-10 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand font-bold text-white shadow-lg">
            LH
          </span>
          <span className="text-xl font-bold text-white">
            Lanka<span className="text-brand-light">Houses</span>
          </span>
        </Link>

        {/* Tagline */}
        <div className="relative z-10">
          <blockquote className="space-y-4">
            <p className="text-2xl font-semibold leading-snug text-white">
              "Find your perfect home in the heart of Sri Lanka."
            </p>
            <p className="text-sm text-slate-400">
              Browse verified properties island-wide and connect directly with the seller — no intermediaries, no complications.
            </p>
          </blockquote>

          <div className="mt-8 flex items-center gap-6">
            {[
              { value: '200+', label: 'Listings' },
              { value: '9', label: 'Districts' },
              { value: '100%', label: 'Verified' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col">
        {/* Mobile logo */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 lg:hidden">
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand font-bold text-sm text-white">
              LH
            </span>
            <span className="text-lg font-bold text-slate-900">
              Lanka<span className="text-brand">Houses</span>
            </span>
          </Link>
          <Link
            to={ROUTES.HOME}
            className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← Back to home
          </Link>
        </div>

        {/* Form area */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>

        <p className="pb-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} LankaHouses. All rights reserved.
        </p>
      </div>
    </div>
  )
}
