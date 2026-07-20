import { Route } from 'react-router-dom'
import HomePage from '@/pages/public/HomePage'
import LoginPage from '@/pages/public/LoginPage'
import RegisterPage from '@/pages/public/RegisterPage'


export const publicRoutes = [
  <Route key="home"                path="/"                      element={<HomePage />} />,
  <Route key="login"               path="/login"                  element={<LoginPage />} />,
  <Route key="register"            path="/register"               element={<RegisterPage />} />,
]