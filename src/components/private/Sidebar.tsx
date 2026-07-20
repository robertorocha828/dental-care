import { NavLink, useNavigate } from 'react-router-dom'
import { Nav, Button } from 'react-bootstrap'
import { useAuthStore } from '@/store/auth.store'

const menuItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Pacientes', to: '/pacientes' },
  { label: 'Mi perfil', to: '/perfil' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div
      className="d-flex flex-column justify-content-between bg-dark text-white p-3"
      style={{ width: 220, minHeight: '100vh' }}
    >
      <div>
        <div className="fw-bold mb-4 fs-5">Panel</div>
        <Nav className="flex-column gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link rounded px-2 py-2 ${isActive ? 'text-white bg-white bg-opacity-10' : 'text-white-50'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </Nav>
      </div>
      <Button variant="outline-light" size="sm" onClick={handleLogout}>
        Salir
      </Button>
    </div>
  )
}