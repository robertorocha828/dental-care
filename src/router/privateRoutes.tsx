import { Route } from 'react-router-dom'
import DashboardHomePage from '@/pages/private/DashboardHomePage'
import ProfilePage from '@/pages/private/ProfilePage'
import UsersPage from '@/pages/private/UsersPage'
import PortalHomePage from '@/pages/private/PortalHomePage'
import AgendarCitaPage from '@/pages/private/AgendarCitaPage'
import PacientesPage from '@/pages/private/PacientesPage'
import CompletarPerfilPage from '@/pages/private/CompletarPerfilPage'
import HistorialClinicoPage from '@/pages/private/HistorialClinicoPage'
import OdontologosPage from '@/pages/private/OdontologosPage'
import EspecialidadesPage from '@/pages/private/EspecialidadesPage'

export const privateRoutes = [
  <Route key="dashboard" path="/dashboard" element={<DashboardHomePage />} />,
  <Route key="perfil"    path="/perfil"    element={<ProfilePage />} />,
  <Route key="usuarios"  path="/usuarios"  element={<UsersPage />} />,
  <Route key="pacientes" path="/pacientes" element={<PacientesPage />} />,
  <Route key="odontologos" path="/odontologos" element={<OdontologosPage />} />,
  <Route key="especialidades-admin" path="/admin/especialidades" element={<EspecialidadesPage />} />,
  <Route key="portal"    path="/portal"    element={<PortalHomePage />} />,
  <Route key="agendar"   path="/agendar"   element={<AgendarCitaPage />} />,
  <Route key="completar-perfil" path="/completar-perfil" element={<CompletarPerfilPage />} />,
  <Route key="historial-clinico" path="/historial-clinico" element={<HistorialClinicoPage />} />,
]