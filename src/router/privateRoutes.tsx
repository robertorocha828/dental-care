import { Route } from 'react-router-dom'
import DashboardHomePage from '@/pages/private/DashboardHomePage'
import ProfilePage from '@/pages/private/ProfilePage'

export const privateRoutes = [
  <Route key="dashboard" path="/dashboard" element={<DashboardHomePage />} />,
  <Route key="perfil"    path="/perfil"    element={<ProfilePage />} />,
]
