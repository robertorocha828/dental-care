import { NavLink } from 'react-router-dom'
import { Navbar, Container, Nav, Button } from 'react-bootstrap'
import { Phone, UserPlus } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

const NAVY = '#0a2540'
const TEAL = '#1b8a9c'

export default function PublicHeader() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return (
    <>
      <div className="text-white py-1 small d-none d-md-block" style={{ backgroundColor: NAVY }}>
        <Container className="d-flex justify-content-end gap-3">
          <span className="d-flex align-items-center gap-1">
            <Phone size={14} /> (02) 555-0000
          </span>
        </Container>
      </div>

      <Navbar
        expand="lg"
        sticky="top"
        className="border-bottom"
        style={{ background: `linear-gradient(90deg, ${NAVY} 0%, ${TEAL} 150%)` }}
        data-bs-theme="dark"
      >
        <Container>
          <Navbar.Brand as={NavLink} to="/" className="fw-bold d-flex align-items-center gap-2">
            <img src="/logo-tooth.png" alt="DentalCare" width={28} height={28} />
            DentalCare
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="ms-auto gap-1 align-items-center">
              <Nav.Link as={NavLink} to="/" end>Inicio</Nav.Link>
              <Nav.Link as={NavLink} to="/servicios">Nuestros servicios</Nav.Link>
              {isAuthenticated ? (
                <Nav.Link as={NavLink} to="/dashboard">
                  <Button variant="outline-light" size="sm">Dashboard</Button>
                </Nav.Link>
              ) : (
                <>
                  <Nav.Link as={NavLink} to="/register">
                    <Button size="sm" style={{ backgroundColor: TEAL, border: 'none' }} className="d-flex align-items-center gap-1">
                      <UserPlus size={16} />
                      Regístrate
                    </Button>
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/login">Ingresar</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}