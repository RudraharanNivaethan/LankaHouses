import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  /**
   * brand — brand-tinted bg + brand-light text with a pulsing dot (for image/dark backgrounds)
   * ghost — white/10 bg + white/80 text, no dot (for solid dark backgrounds)
   */
  variant?: 'brand' | 'ghost'
}

export function Badge({ children, variant = 'brand' }: BadgeProps) {
  if (variant === 'ghost') {
    return (
      <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm">
        {children}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand-light backdrop-blur-sm">
      <span className="h-2 w-2 animate-pulse rounded-full bg-brand-light" aria-hidden="true" />
      {children}
    </span>
  )
}
