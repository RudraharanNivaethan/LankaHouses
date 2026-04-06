interface FormHeaderProps {
  title: string
  subtitle?: string
  /** 1 = h1 text-2xl (default, auth/page forms), 2 = h2 text-base (section forms) */
  level?: 1 | 2
}

export function FormHeader({ title, subtitle, level = 1 }: FormHeaderProps) {
  const Heading = level === 1 ? 'h1' : 'h2'
  const headingClass =
    level === 1
      ? 'text-2xl font-bold tracking-tight text-slate-900'
      : 'text-base font-semibold text-slate-900'

  return (
    <div className="flex flex-col gap-1">
      <Heading className={headingClass}>{title}</Heading>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </div>
  )
}
