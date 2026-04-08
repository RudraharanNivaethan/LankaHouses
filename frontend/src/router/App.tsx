import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AdminHouseListView } from '../components/admin_dashboard/AdminHouseListView'
import { AdminHouseDetailPage } from '../pages/Admin/AdminHouseDetailPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/houses" element={<AdminHouseListView />} />
        <Route path="/admin/houses/:id" element={<AdminHouseDetailPage />} />
      </Routes>
    </Router>
  )
}

export default App