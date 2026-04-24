import type { ReactNode } from 'react'
import { AdminLayout } from './AdminLayout'
import { AdminSidebar } from '../admin-dashboard/AdminSidebar'

interface AdminShellProps {
  /** Optional header slot rendered above `children` (e.g. PageHeader / WelcomeBanner). */
  header?: ReactNode
  /** Vertical gap between header and content. Defaults to 'md' (gap-7). */
  gap?: 'sm' | 'md' | 'none'
  /** Optional badge count forwarded to the sidebar's Inquiries link. */
  pendingInquiries?: number
  children: ReactNode
}

/**
 * Shared shell for all admin pages. Wraps `AdminLayout` with the `AdminSidebar`
 * and a standard content container so individual pages no longer duplicate
 * that structure. The sidebar reads its capability flags from the
 * authenticated user's `permissions` object — no per-page props needed.
 */
export function AdminShell({
  header,
  gap = 'md',
  pendingInquiries,
  children,
}: AdminShellProps) {
  const gapClass = gap === 'none' ? '' : gap === 'sm' ? 'gap-6' : 'gap-7'

  return (
    <AdminLayout sidebar={<AdminSidebar pendingInquiries={pendingInquiries} />}>
      <div className={`flex flex-col ${gapClass}`.trim()}>
        {header}
        {children}
      </div>
    </AdminLayout>
  )
}
