import { NavLink, useNavigate } from 'react-router-dom'
import { Nav, Button, Offcanvas } from 'react-bootstrap'
import { useAuthStore } from '@/store/auth.store'
import { useSidebarStore } from '@/store/sidebar.store'

const adminMenuItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Pacientes', to: '/pacientes' },
  { label: 'Usuarios', to: '/usuarios' },
  { label: 'Mi perfil', to: '/perfil' },
]

const doctorMenuItems = [
  { label: 'Historial clínico', to: '/historial-clinico' },
  { label: 'Mi perfil', to: '/perfil' },
]

const pacienteMenuItems = [
  { label: 'Inicio', to: '/portal' },
  { label: 'Agendar cita', to: '/agendar' },
  { label: 'Mi perfil', to: '/perfil' },
]

function MenuContent({ menuItems, onNavigate, onLogout }: {
  menuItems: { label: string; to: string }[]
  onNavigate: () => void
  onLogout: () => void
}) {
  return (
    <div className="d-flex flex-column justify-content-between h-100">
      <div>
        <div className="fw-bold mb-4 fs-5 d-none d-lg-block">Panel</div>
        <Nav className="flex-column gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `nav-link rounded px-2 py-2 ${isActive ? 'text-white bg-white bg-opacity-10' : 'text-white-50'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </Nav>
      </div>
      <Button variant="outline-light" size="sm" onClick={onLogout}>
        Salir
      </Button>
    </div>
  )
}

export default function Sidebar() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const rol = useAuthStore((s) => s.rol)
  const open = useSidebarStore((s) => s.open)
  const close = useSidebarStore((s) => s.close)

  const menuItems =
    rol === 'paciente' ? pacienteMenuItems :
    rol === 'doctor' ? doctorMenuItems :
    adminMenuItems

  const handleLogout = () => {
    close()
    logout()
    navigate('/')
  }

  return (
    <>
      {/* Escritorio: barra lateral fija, siempre visible */}
      <div
        className="d-none d-lg-flex flex-column bg-dark text-white p-3"
        style={{ width: 220, minHeight: '100vh' }}
      >
        <MenuContent menuItems={menuItems} onNavigate={() => {}} onLogout={handleLogout} />
      </div>

      {/* Móvil/tablet: panel deslizante, se abre desde el botón de hamburguesa del header */}
      <Offcanvas show={open} onHide={close} className="bg-dark text-white d-lg-none" style={{ width: 240 }}>
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>Panel</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <MenuContent menuItems={menuItems} onNavigate={close} onLogout={handleLogout} />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}