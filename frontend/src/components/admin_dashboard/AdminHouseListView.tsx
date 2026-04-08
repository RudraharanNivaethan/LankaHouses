import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

type HouseCard = {
  id: string
  title: string
  location: string
  priceLkr: string
  bedrooms: number
  bathrooms: number
}

const SAMPLE_HOUSES: HouseCard[] = [
  {
    id: 'luxury-villa',
    title: 'Luxury Villa',
    location: 'Colombo',
    priceLkr: '25,000,000',
    bedrooms: 4,
    bathrooms: 3,
  },
  {
    id: 'modern-apartment',
    title: 'Modern Apartment',
    location: 'Kandy',
    priceLkr: '12,500,000',
    bedrooms: 2,
    bathrooms: 2,
  },
  {
    id: 'cozy-cottage',
    title: 'Cozy Cottage',
    location: 'Galle',
    priceLkr: '8,500,000',
    bedrooms: 3,
    bathrooms: 2,
  },
]

function ImagePlaceholder({ title }: { title: string }) {
  return (
    <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-brand/15 via-white to-brand/10">
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

export function AdminHouseListView() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {SAMPLE_HOUSES.map((house) => (
        <Link
          key={house.id}
          to={ROUTES.ADMIN_HOUSES}
          className="group overflow-hidden rounded-2xl border border-brand/30 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <ImagePlaceholder title={house.title} />

          <div className="flex flex-col gap-2 p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold text-brand group-hover:text-brand-dark transition-colors">
                {house.title}
              </h2>
              <span className="shrink-0 rounded-full bg-brand/8 px-2.5 py-1 text-[11px] font-semibold text-brand">
                LKR {house.priceLkr}
              </span>
            </div>

            <div className="text-sm text-slate-600">
              <span className="font-semibold text-brand">Location:</span> {house.location}
            </div>
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-brand">Bedrooms:</span> {house.bedrooms}{' '}
              <span className="text-slate-400">|</span>{' '}
              <span className="font-semibold text-brand">Bathrooms:</span> {house.bathrooms}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}