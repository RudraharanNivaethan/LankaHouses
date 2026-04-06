import { Link } from 'react-router-dom'

interface FormFooterLinkProps {
  text: string
  to: string
  label: string
}

export function FormFooterLink({ text, to, label }: FormFooterLinkProps) {
  return (
    <p className="text-center text-sm text-slate-600">
      {text}{' '}
      <Link
        to={to}
        className="font-semibold text-brand hover:text-brand-dark transition-colors"
      >
        {label}
      </Link>
    </p>
  )
}
