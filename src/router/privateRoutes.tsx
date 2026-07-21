import { Route } from 'react-router-dom'
import DashboardHomePage from '@/pages/private/DashboardHomePage'
import ProfilePage from '@/pages/private/ProfilePage'
import UsersPage from '@/pages/private/UsersPage'
import PortalHomePage from '@/pages/private/PortalHomePage'
import AgendarCitaPage from '@/pages/private/AgendarCitaPage'

export const privateRoutes = [
  <Route key="dashboard" path="/dashboard" element={<DashboardHomePage />} />,
  <Route key="perfil"    path="/perfil"    element={<ProfilePage />} />,
  <Route key="usuarios"  path="/usuarios"  element={<UsersPage />} />,
  <Route key="portal"    path="/portal"    element={<PortalHomePage />} />,
  <Route key="agendar"   path="/agendar"   element={<AgendarCitaPage />} />,
]