import { useParams } from 'react-router-dom'
import { AdminShell } from '../../components/layout/AdminShell'
import { PageHeader } from '../../components/layout/PageHeader'
import { PlaceholderPage } from '../../components/admin/PlaceholderPage'

const InquiryDetailIcon = (
  <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
)

export function AdminInquiryDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <AdminShell
      header={
        <PageHeader
          title="Inquiry Detail"
          description={id ? `Viewing inquiry ID: ${id}` : 'Full inquiry view with reply form.'}
        />
      }
    >
      <PlaceholderPage
        icon={InquiryDetailIcon}
        title="Inquiry Detail View"
        description="The full inquiry detail with buyer information, property reference, and reply form will be built in Sprint 2."
        badge="Coming in Sprint 2"
      />
    </AdminShell>
  )
}
