import { ROLE_OPTIONS } from '../../constants/roles'
import type { UserRole } from '../../types/auth'

interface UserRoleFilterProps {
  active: UserRole | undefined
  onChange: (role: UserRole | undefined) => void
}

export function UserRoleFilter({ active, onChange }: UserRoleFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by role">
      {ROLE_OPTIONS.map(({ label, value }) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(value)}
          aria-pressed={active === value}
          className={[
            'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
            active === value
              ? 'border-brand bg-brand text-white'
              : 'border-slate-200 bg-white text-slate-600 hover:border-brand/40 hover:text-brand',
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
