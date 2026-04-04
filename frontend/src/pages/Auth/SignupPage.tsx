import { Link } from 'react-router-dom'
import { RegisterForm } from '../../features/auth/components/RegisterForm'
import { ROUTES } from '../../constants/routes'

const PANEL_IMAGE =
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80'

export function SignupPage() {
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
              "Start your Sri Lankan property journey today."
            </p>
            <p className="text-sm text-slate-400">
              Create a free account to save listings, track your inquiries, and get notified about new properties.
            </p>
          </blockquote>

          <ul className="mt-8 space-y-3">
            {[
              'Browse the full property catalogue',
              'Submit inquiries directly to the seller',
              'Save your favourite listings',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-slate-300">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand-light">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
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
            <RegisterForm />
          </div>
        </div>

        <p className="pb-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} LankaHouses. All rights reserved.
        </p>
      </div>
    </div>
  )
}
