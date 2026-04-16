import type { ReactNode } from 'react'

/** Soft page background and brand accent for public browse / listing detail flows. */
export function ListingsBrowseShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col border-t-4 border-brand bg-surface-muted">
      {children}
    </div>
  )
}
