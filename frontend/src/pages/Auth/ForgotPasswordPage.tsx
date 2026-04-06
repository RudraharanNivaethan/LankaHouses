import { AuthLayout } from '../../components/layout/AuthLayout'
import { ForgotPasswordForm } from '../../features/auth/components/ForgotPasswordForm'

const PANEL_IMAGE = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80'

const PANEL_CONTENT = (
  <blockquote className="space-y-4">
    <p className="text-2xl font-semibold leading-snug text-white">
      "Find your perfect home in the heart of Sri Lanka."
    </p>
    <p className="text-sm text-slate-400">
      Browse verified properties island-wide and connect directly with the seller — no intermediaries, no complications.
    </p>
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
  </blockquote>
)

export function ForgotPasswordPage() {
  return (
    <AuthLayout panelImage={PANEL_IMAGE} panelContent={PANEL_CONTENT}>
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
