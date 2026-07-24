import { Route } from 'react-router-dom'
import HomePage from '@/pages/public/HomePage'
import LoginPage from '@/pages/public/LoginPage'
import RegisterPage from '@/pages/public/RegisterPage'
import GoogleCallbackPage from '@/pages/public/GoogleCallbackPage'
import EspecialidadesPage from '@/pages/public/EspecialidadesPage'
import ServiciosPage from '@/pages/public/ServiciosPage'
import ServicioDetallePage from '@/pages/public/ServicioDetallePage'

export const publicRoutes = [
  <Route key="home"            path="/"                       element={<HomePage />} />,
  <Route key="login"           path="/login"                  element={<LoginPage />} />,
  <Route key="register"        path="/register"               element={<RegisterPage />} />,
  <Route key="google-callback" path="/auth/google/callback"   element={<GoogleCallbackPage />} />,
  <Route key="especialidades"  path="/especialidades"         element={<EspecialidadesPage />} />,
  <Route key="servicios"       path="/servicios"              element={<ServiciosPage />} />,
  <Route key="servicio-detalle" path="/servicios/:slug"       element={<ServicioDetallePage />} />,
]