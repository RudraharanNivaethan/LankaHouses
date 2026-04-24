import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLogout } from '../../hooks/useLogout'
import { ROUTES } from '../../constants/routes'
import { Spinner } from '../ui/Spinner'
import { MenuIcon, LogoutIcon } from '../ui/icons'
import { getInitials } from '../../utils/stringUtils'

interface AdminLayoutProps {
  sidebar: ReactNode
  children: ReactNode
}

export function AdminLayout({ sidebar, children }: AdminLayoutProps) {
  const { user } = useAuth()
  const { logout, isLoading: isLoggingOut } = useLogout()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Desktop sidebar — dark */}
      <aside className="hidden w-64 shrink-0 flex-col bg-slate-900 lg:flex">
        <SidebarContent sidebar={sidebar} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-50 flex h-full w-64 flex-col bg-slate-900 shadow-2xl">
            <SidebarContent sidebar={sidebar} />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center gap-3 bg-white px-4 shadow-sm sm:px-6">
          {/* Mobile hamburger */}
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open sidebar"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <span className="text-sm font-semibold text-slate-400 lg:hidden">Admin</span>

          <div className="ml-auto flex items-center gap-4">
            {user && (
              <div className="hidden items-center gap-3 sm:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-bold text-white shadow-md">
                  {getInitials(user.name)}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.displayRole}</p>
                </div>
              </div>
            )}

            <div className="h-5 w-px bg-slate-200 hidden sm:block" aria-hidden="true" />

            <button
              type="button"
              onClick={logout}
              disabled={isLoggingOut}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
            >
              {isLoggingOut ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <LogoutIcon className="h-4 w-4" />
              )}
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ sidebar }: { sidebar: ReactNode }) {
  return (
    <>
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-3 px-5">
        <Link to={ROUTES.ADMIN_DASHBOARD} className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand font-extrabold text-white text-sm shadow-lg shadow-brand/40">
            LH
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">LankaHouses</p>
            <p className="text-xs text-slate-500 mt-0.5">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-slate-800" />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {sidebar}
      </nav>

      {/* Bottom decoration */}
      <div className="px-5 pb-5">
        <div className="rounded-xl bg-brand/10 border border-brand/20 px-4 py-3">
          <p className="text-xs font-semibold text-brand-light">LankaHouses</p>
          <p className="text-xs text-slate-500 mt-0.5">Admin v1.0</p>
        </div>
      </div>
    </>
  )
}
