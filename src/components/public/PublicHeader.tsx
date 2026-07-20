import { NavLink } from 'react-router-dom'
import { Navbar, Container, Nav, Button } from 'react-bootstrap'
import { useAuthStore } from '@/store/auth.store'

export default function PublicHeader() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="border-bottom border-secondary">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold">
          Consultorio Odontológico
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto gap-1 align-items-center">
            <Nav.Link as={NavLink} to="/" end>Inicio</Nav.Link>
            <Nav.Link as={NavLink} to="/especialidades">Especialidades</Nav.Link>
            <Nav.Link as={NavLink} to="/agendar">
              <Button variant="success" size="sm">Agendar cita</Button>
            </Nav.Link>
            {isAuthenticated ? (
              <Nav.Link as={NavLink} to="/dashboard">
                <Button variant="outline-light" size="sm">Dashboard</Button>
              </Nav.Link>
            ) : (
              <Nav.Link as={NavLink} to="/login">Ingresar</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}