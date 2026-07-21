import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap'
import { Menu } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useSidebarStore } from '@/store/sidebar.store'
import { getUser } from '@/api/users.api'
import type { User } from '@/types/user.types'

export default function DashboardHeader() {
  const navigate = useNavigate()
  const userId = useAuthStore((s) => s.userId)
  const logout = useAuthStore((s) => s.logout)
  const toggleSidebar = useSidebarStore((s) => s.toggle)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (userId) getUser(userId).then(setUser)
  }, [userId])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Navbar bg="white" className="border-bottom px-3" expand="lg">
      <Container fluid>
        <Button
          variant="outline-secondary"
          size="sm"
          className="d-lg-none me-2"
          onClick={toggleSidebar}
          aria-label="Abrir menú"
        >
          <Menu size={18} />
        </Button>
        <Navbar.Brand className="fw-semibold text-dark">
          Consultorio Odontológico
        </Navbar.Brand>
        <Nav className="ms-auto">
          <NavDropdown
            title={user?.username ?? 'Usuario'}
            id="user-dropdown"
            align="end"
          >
            <NavDropdown.Item onClick={() => navigate('/perfil')}>
              Mi perfil
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout}>
              Salir
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  )
}