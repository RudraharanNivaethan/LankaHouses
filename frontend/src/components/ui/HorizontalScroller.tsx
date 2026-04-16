import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

interface HorizontalScrollerProps {
  children: ReactNode
  /** Pixels scrolled per arrow press */
  scrollStep?: number
  className?: string
  /** Accessible label for the scroll region */
  label?: string
}

/**
 * Generic horizontally scrollable container with:
 * - CSS scroll-snap (mandatory, start alignment on children)
 * - Arrow navigation on sm+ screens
 * - Scrollbar hidden; touch/swipe works via native scroll
 *
 * Children must carry `shrink-0` and a fixed/max width to work with snap.
 */
export function HorizontalScroller({
  children,
  scrollStep = 304,
  className = '',
  label,
}: HorizontalScrollerProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateArrows = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateArrows()
    el.addEventListener('scroll', updateArrows, { passive: true })
    const ro = new ResizeObserver(updateArrows)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateArrows)
      ro.disconnect()
    }
  }, [updateArrows])

  const scroll = (dir: 'left' | 'right') => {
    trackRef.current?.scrollBy({
      left: dir === 'right' ? scrollStep : -scrollStep,
      behavior: 'smooth',
    })
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={trackRef}
        role="region"
        aria-label={label}
        className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
      >
        {children}
      </div>

      {canScrollLeft && (
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scroll('left')}
          className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-surface p-2 shadow-md transition-all duration-150 hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-brand sm:flex"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {canScrollRight && (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scroll('right')}
          className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-surface p-2 shadow-md transition-all duration-150 hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-brand sm:flex"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  )
}
