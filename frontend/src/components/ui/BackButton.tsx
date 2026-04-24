import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeftIcon } from './icons'
import { Button } from './Button'
import type { ButtonSize } from './Button'

interface BackButtonProps {
  label?: string
  className?: string
  /**
   * 'ghost' — text-link style used in page headers (default)
   * 'outline' — bordered button style used in content areas
   */
  variant?: 'ghost' | 'outline'
  size?: ButtonSize
}

/**
 * Shared back-navigation button used across the app.
 *
 * Priority:
 * 1. Returns to `location.state.source` if set (populated by useNavigateWithSource)
 * 2. Falls back to navigate(-1) when no source is available
 *
 * No hardcoded routes. No per-page logic needed.
 */
export function BackButton({ label = 'Back', className = '', variant = 'ghost', size = 'sm' }: BackButtonProps) {
  const navigate = useNavigate()
  const source = (useLocation().state as { source?: string } | null)?.source

  const handleBack = () => (source ? navigate(source) : navigate(-1))

  if (variant === 'outline') {
    return (
      <Button type="button" variant="outline" size={size} onClick={handleBack} className={className}>
        <ChevronLeftIcon className="h-4 w-4" />
        {label}
      </Button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-brand ${className}`}
    >
      <ChevronLeftIcon className="h-4 w-4" />
      {label}
    </button>
  )
}
