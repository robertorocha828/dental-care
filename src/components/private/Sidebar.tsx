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
            <Nav.Link
              key={item.to}
              as={NavLink}
              to={item.to}
              className="text-white-50 rounded px-2 py-2"
              style={({ isActive }: { isActive: boolean }) =>
                isActive ? { color: 'white', backgroundColor: '#ffffff1a' } : {}
              }
            >
              {item.label}
            </Nav.Link>
          ))}
        </Nav>
      </div>
      <Button variant="outline-light" size="sm" onClick={handleLogout}>
        Salir
      </Button>
    </div>
  )
}
