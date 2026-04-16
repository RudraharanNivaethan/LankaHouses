import type { ReactNode } from 'react'

/** Wrapper for public browse / listing detail flows. Sections handle their own backgrounds. */
export function ListingsBrowseShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {children}
    </div>
  )
}
