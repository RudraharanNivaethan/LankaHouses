import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { ROUTES } from '../../constants/routes'

export function QuickActions() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link to={ROUTES.ADMIN_ADD_HOUSE}>
        <Button variant="primary" size="md" className="w-full sm:w-auto">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add New Property
        </Button>
      </Link>
      <Link to={ROUTES.ADMIN_INQUIRIES}>
        <Button variant="outline" size="md" className="w-full sm:w-auto">
          View All Inquiries
        </Button>
      </Link>
    </div>
  )
}
