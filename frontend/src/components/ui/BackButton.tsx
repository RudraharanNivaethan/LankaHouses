import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeftIcon } from './icons'

interface BackButtonProps {
  label?: string
  className?: string
}

/**
 * Shared back-navigation button used on all Quick Action destination pages.
 *
 * Priority:
 * 1. Returns to `location.state.source` if set (populated by useNavigateWithSource)
 * 2. Falls back to navigate(-1) when no source is available
 *
 * No hardcoded routes. No per-page logic needed.
 */
export function BackButton({ label = 'Back', className = '' }: BackButtonProps) {
  const navigate = useNavigate()
  const source = (useLocation().state as { source?: string } | null)?.source

  return (
    <button
      type="button"
      onClick={() => (source ? navigate(source) : navigate(-1))}
      className={`inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-brand ${className}`}
    >
      <ChevronLeftIcon className="h-4 w-4" />
      {label}
    </button>
  )
}
