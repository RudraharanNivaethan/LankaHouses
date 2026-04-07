interface WelcomeBannerProps {
  name: string
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function WelcomeBanner({ name }: WelcomeBannerProps) {
  const firstName = name.split(' ')[0] ?? name

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-brand-dark to-brand px-7 py-8 shadow-lg">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-8 right-20 h-32 w-32 rounded-full bg-brand-light/10" aria-hidden="true" />

      <div className="relative flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-white/60">{getGreeting()},</p>
          <h1 className="mt-0.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {firstName} 👋
          </h1>
          <p className="mt-2 text-sm text-white/70">
            Here's what's happening in your panel today.
          </p>
        </div>
        <p className="mt-3 shrink-0 text-xs font-medium text-white/50 sm:mt-0 sm:text-right">
          {getFormattedDate()}
        </p>
      </div>
    </div>
  )
}
