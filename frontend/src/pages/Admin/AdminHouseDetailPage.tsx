import { Link, useParams } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { PageHeader } from '../../components/layout/PageHeader'
import { AdminSidebar } from '../../components/admin_dashboard/AdminSidebar'
import { ROUTES } from '../../constants/routes'

function ImagePlaceholder({ title }: { title: string }) {
  return (
    <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand/15 via-white to-brand/10">
      <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_1px_1px,rgba(199,0,57,0.22)_1px,transparent_0)] [background-size:16px_16px]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200">
          <span className="inline-block h-2 w-2 rounded-full bg-brand" />
          {title}
        </div>
      </div>
    </div>
  )
}

const SAMPLE_HOUSES = [
  {
    id: 'luxury-villa',
    title: 'Luxury Villa',
    location: 'Colombo',
    priceLkr: '25,000,000',
    bedrooms: 4,
    bathrooms: 3,
    description: 'A luxurious villa in Colombo with modern amenities.',
  },
  {
    id: 'modern-apartment',
    title: 'Modern Apartment',
    location: 'Kandy',
    priceLkr: '12,500,000',
    bedrooms: 2,
    bathrooms: 2,
    description: 'A modern apartment in the heart of Kandy city.',
  },
  {
    id: 'cozy-cottage',
    title: 'Cozy Cottage',
    location: 'Galle',
    priceLkr: '8,500,000',
    bedrooms: 3,
    bathrooms: 2,
    description: 'A cozy cottage near the beach in Galle.',
  },
  {
    id: 't-villa',   
    title: 'T-Villa',
    location: 'Colombo',
    priceLkr: '18,500,000',
    bedrooms: 5,
    bathrooms: 2,
    description: 'A spacious villa with garden in Colombo.',
  },
  {
    id: 's-villa',   
    title: 'S-Villa',
    location: 'Jaffna',
    priceLkr: '14,500,000',
    bedrooms: 3,
    bathrooms: 3,
    description: 'A modern villa in Jaffna city.',
  },
]

export function AdminHouseDetailPage() {
  const { id } = useParams()


  const house = SAMPLE_HOUSES.find(
    (h) => h.id.toLowerCase() === id?.toLowerCase()
  )

  if (!house) {
    return (
      <AdminLayout sidebar={<AdminSidebar />}>
        <div className="flex flex-col gap-6">
          <PageHeader title="House not found" description="The requested listing does not exist." />
          <Link
            to={ROUTES.ADMIN_HOUSES}
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark transition-colors"
          >
            ← Back to Houses
          </Link>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout sidebar={<AdminSidebar />}>
      <div className="flex flex-col gap-7">
        <PageHeader
          title={house.title}
          description={`Property ID: ${house.id}`}
          actions={
            <Link
              to={ROUTES.ADMIN_EDIT_HOUSE.replace(':id', house.id)}
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark transition-colors"
            >
              Edit Property
            </Link>
          }
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ImagePlaceholder title={house.title} />
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-brand/30 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-brand">Price</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  LKR {house.priceLkr}
                </p>
              </div>
              <div className="text-sm text-slate-600">
                <div><span className="font-semibold text-brand">Location:</span> {house.location}</div>
                <div><span className="font-semibold text-brand">Bedrooms:</span> {house.bedrooms}</div>
                <div><span className="font-semibold text-brand">Bathrooms:</span> {house.bathrooms}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-slate-50 p-5 text-sm text-slate-700">
          <div className="font-semibold text-slate-900">Listing overview</div>
          <p className="mt-2">
            {house.title} in {house.location} with {house.bedrooms} bedrooms and {house.bathrooms} bathrooms.
          </p>
        </div>

        <Link
          to={ROUTES.ADMIN_HOUSES}
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand ring-1 ring-brand/20 hover:bg-brand/5"
        >
          ← Back to Houses
        </Link>
      </div>
    </AdminLayout>
  )
}