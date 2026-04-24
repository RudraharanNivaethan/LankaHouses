import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Button } from '../ui/Button'
import { MenuIcon, CloseIcon } from '../ui/icons'
import { ROUTES } from '../../constants/routes'
import { useAuth } from '../../context/AuthContext'
import { useLogout } from '../../hooks/useLogout'
import { getInitials } from '../../utils/stringUtils'

const NAV_LINKS = [
  { label: 'Browse', to: ROUTES.LISTINGS },
  { label: 'About', to: ROUTES.ABOUT },
  { label: 'Contact', to: ROUTES.CONTACT },
]

function UserAvatar({ name }: { name: string }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
      {getInitials(name)}
    </span>
  )
}

function AuthenticatedActions({ onClose }: { onClose?: () => void }) {
  const { user } = useAuth()
  const { logout, isLoading } = useLogout()

  if (!user) return null

  return (
    <div className="flex items-center gap-3">
      {/* Profile link */}
      <Link
        to={ROUTES.PROFILE}
        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-slate-300 hover:bg-white/10 transition-colors"
      >
        <UserAvatar name={user.name} />
        <span className="hidden max-w-[120px] truncate xl:inline">{user.name}</span>
      </Link>

      <Button
        variant="ghost"
        size="sm"
        className="text-slate-300 hover:text-white"
        disabled={isLoading}
        onClick={() => {
          onClose?.()
          logout()
        }}
      >
        {isLoading ? 'Logging out…' : 'Logout'}
      </Button>
    </div>
  )
}

function UnauthenticatedActions({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <Link to={ROUTES.LOGIN} onClick={onClose}>
        <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
          Sign In
        </Button>
      </Link>
      <Link to={ROUTES.SIGNUP} onClick={onClose}>
        <Button variant="primary" size="sm">
          Register
        </Button>
      </Link>
    </div>
  )
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, isLoading } = useAuth()

  const closeMobile = () => setMobileOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2" onClick={closeMobile}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white font-bold text-sm shadow">
            LH
          </span>
          <span className="text-xl font-bold text-white">
            Lanka<span className="text-brand-light">Houses</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150',
                  isActive
                    ? 'bg-brand/20 text-brand-light'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white',
                ].join(' ')
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTA — hidden while session check is in flight */}
        {!isLoading && (
          <div className="hidden md:flex">
            {isAuthenticated ? (
              <AuthenticatedActions />
            ) : (
              <UnauthenticatedActions />
            )}
          </div>
        )}

        {/* Mobile hamburger */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white md:hidden transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <CloseIcon className="h-5 w-5" />
          ) : (
            <MenuIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-slate-900 px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                onClick={closeMobile}
                className={({ isActive }) =>
                  [
                    'rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand/20 text-brand-light'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white',
                  ].join(' ')
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {!isLoading && (
            <div className="mt-3 border-t border-white/10 pt-3">
              {isAuthenticated ? (
                <AuthenticatedActions onClose={closeMobile} />
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to={ROUTES.LOGIN} onClick={closeMobile}>
                    <Button variant="outline" size="sm" className="w-full justify-center border-slate-600 text-slate-300 hover:border-brand hover:text-brand">
                      Sign In
                    </Button>
                  </Link>
                  <Link to={ROUTES.SIGNUP} onClick={closeMobile}>
                    <Button variant="primary" size="sm" className="w-full justify-center">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  )
}
