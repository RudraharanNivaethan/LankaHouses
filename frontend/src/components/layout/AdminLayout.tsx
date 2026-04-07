import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLogout } from '../../hooks/useLogout'
import { ROUTES } from '../../constants/routes'
import { Spinner } from '../ui/Spinner'

interface AdminLayoutProps {
  sidebar: ReactNode
  children: ReactNode
}

export function AdminLayout({ sidebar, children }: AdminLayoutProps) {
  const { user } = useAuth()
  const { logout, isLoading: isLoggingOut } = useLogout()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        <SidebarContent sidebar={sidebar} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-50 flex h-full w-64 flex-col bg-white shadow-xl">
            <SidebarContent sidebar={sidebar} />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
          {/* Mobile hamburger */}
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open sidebar"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <span className="text-sm font-semibold text-slate-400 lg:hidden">Admin</span>

          <div className="ml-auto flex items-center gap-3">
            {user && (
              <span className="hidden text-sm font-medium text-slate-700 sm:block">
                {user.name}
              </span>
            )}
            <button
              type="button"
              onClick={logout}
              disabled={isLoggingOut}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
            >
              {isLoggingOut ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
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
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-slate-200 px-5">
        <Link to={ROUTES.ADMIN_DASHBOARD} className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand font-bold text-white text-sm">
            LH
          </div>
          <span className="text-sm font-bold text-slate-800">LankaHouses</span>
        </Link>
        <span className="ml-auto rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
          Admin
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {sidebar}
      </nav>
    </>
  )
}
