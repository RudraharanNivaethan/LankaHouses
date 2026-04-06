import { AuthLayout } from '../../components/layout/AuthLayout'
import { RegisterForm } from '../../components/auth/RegisterForm'

const PANEL_IMAGE = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80'

const PANEL_CONTENT = (
  <div className="space-y-4">
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
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </span>
          {item}
        </li>
      ))}
    </ul>
  </div>
)

export function SignupPage() {
  return (
    <AuthLayout panelImage={PANEL_IMAGE} panelContent={PANEL_CONTENT}>
      <RegisterForm />
    </AuthLayout>
  )
}
