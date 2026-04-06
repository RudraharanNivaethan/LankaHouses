interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  /** default 'center' */
  align?: 'left' | 'center'
}

export function SectionHeader({ eyebrow, title, description, align = 'center' }: SectionHeaderProps) {
  const alignClass = align === 'left' ? 'text-left' : 'text-center'
  const descClass = align === 'left' ? 'max-w-lg' : 'mx-auto max-w-2xl'

  return (
    <div className={alignClass}>
      {eyebrow && (
        <span className="text-sm font-semibold uppercase tracking-wider text-brand">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className={`mt-3 text-slate-600 ${descClass}`}>{description}</p>
      )}
    </div>
  )
}
