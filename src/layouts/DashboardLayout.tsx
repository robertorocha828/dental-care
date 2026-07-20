import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/private/Sidebar'
import DashboardHeader from '@/components/private/DashboardHeader'
import DashboardFooter from '@/components/private/DashboardFooter'

export default function DashboardLayout() {
  return (
    <div className="d-flex min-vh-100">
      <Sidebar />
      <div className="d-flex flex-column flex-grow-1">
        <DashboardHeader />
        <main className="flex-grow-1 p-4">
          <Outlet />
        </main>
        <DashboardFooter />
      </div>
    </div>
  )
}
