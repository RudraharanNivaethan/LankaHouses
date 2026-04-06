import type { ReactNode } from 'react'

interface ImageSectionProps {
  src: string
  /** Provide a descriptive alt when the image conveys meaning; leave empty for decorative images */
  alt?: string
  /** Tailwind class(es) applied to the overlay div (e.g. 'bg-brand-dark/90') */
  overlay: string
  /** Extra classes on the <section> element */
  className?: string
  /**
   * Optional content rendered as a direct child of the <section> (outside the main z-10 wrapper).
   * Use this for elements that need to be absolutely positioned relative to the section itself,
   * such as scroll indicators pinned to the bottom.
   */
  extras?: ReactNode
  children: ReactNode
}

export function ImageSection({ src, alt = '', overlay, className = '', extras, children }: ImageSectionProps) {
  const isDecorative = alt === ''

  return (
    <section className={`relative overflow-hidden ${className}`.trim()}>
      <img
        src={src}
        alt={isDecorative ? undefined : alt}
        aria-hidden={isDecorative ? true : undefined}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className={`absolute inset-0 ${overlay}`} />
      <div className="relative z-10">{children}</div>
      {extras}
    </section>
  )
}
