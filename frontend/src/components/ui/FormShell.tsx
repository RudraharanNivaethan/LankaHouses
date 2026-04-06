import type { FormEventHandler, ReactNode } from 'react'

interface FormShellProps {
  onSubmit: FormEventHandler<HTMLFormElement>
  className?: string
  children: ReactNode
}

export function FormShell({ onSubmit, className = '', children }: FormShellProps) {
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={`flex flex-col gap-5 ${className}`.trim()}
    >
      {children}
    </form>
  )
}
