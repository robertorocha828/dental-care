import { NavLink } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { Smile, Phone, Mail, MapPin, Globe, Share2 } from 'lucide-react'

const NAVY = '#0a2540'
const TEAL = '#1b8a9c'
const TEAL_CLARO = '#4fb3c4'
const DEGRADADO_OSCURO = `linear-gradient(135deg, ${NAVY} 0%, ${TEAL} 150%)`

export default function PublicFooter() {
  return (
    <footer className="pt-5 pb-4 text-white border-top border-secondary" style={{ background: DEGRADADO_OSCURO }}>
      <Container>
        <Row className="g-4">
          <Col xs={12} md={4}>
            <div className="d-flex align-items-center gap-2 fw-bold fs-5 mb-2">
              <Smile size={22} style={{ color: TEAL_CLARO }} />
              Consultorio Odontológico
            </div>
            <p className="small mb-0 text-white-50">
              Cuidamos tu sonrisa con profesionales certificados y tecnología de vanguardia.
            </p>
          </Col>

          <Col xs={6} md={4}>
            <div className="fw-semibold mb-2">Enlaces</div>
            <ul className="list-unstyled small d-flex flex-column gap-1">
              <li><NavLink to="/" className="text-decoration-none text-white-50">Inicio</NavLink></li>
              <li><NavLink to="/especialidades" className="text-decoration-none text-white-50">Especialidades</NavLink></li>
              <li><NavLink to="/agendar" className="text-decoration-none text-white-50">Agendar cita</NavLink></li>
              <li><NavLink to="/login" className="text-decoration-none text-white-50">Ingresar</NavLink></li>
            </ul>
          </Col>

          <Col xs={6} md={4}>
            <div className="fw-semibold mb-2">Contacto</div>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-white-50">
              <li className="d-flex align-items-center gap-2"><Phone size={14} /> (02) 555-0000</li>
              <li className="d-flex align-items-center gap-2"><Mail size={14} /> contacto@consultorio.com</li>
              <li className="d-flex align-items-center gap-2"><MapPin size={14} /> Quito, Ecuador</li>
            </ul>
            <div className="d-flex gap-3 mt-2">
              <Globe size={18} style={{ color: TEAL }} />
              <Share2 size={18} style={{ color: TEAL }} />
            </div>
          </Col>
        </Row>

        <hr className="border-secondary my-4" />

        <div className="text-center small text-white-50">
          © {new Date().getFullYear()} Consultorio Odontológico — Sistema de gestión odontológica
        </div>
      </Container>
    </footer>
  )
}