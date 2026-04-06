import type { ReactNode } from 'react'

interface SectionContainerProps {
  children: ReactNode
  className?: string
}

export function SectionContainer({ children, className = '' }: SectionContainerProps) {
  return (
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`.trim()}>
      {children}
    </div>
  )
}
