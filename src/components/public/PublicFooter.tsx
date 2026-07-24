import { NavLink } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { Phone, Mail, MapPin, Clock, Globe, Share2 } from 'lucide-react'

const NAVY = '#0a2540'
const TEAL = '#1b8a9c'
const DEGRADADO_OSCURO = `linear-gradient(135deg, ${NAVY} 0%, ${TEAL} 150%)`

export default function PublicFooter() {
  return (
    <footer className="pt-5 pb-4 text-white" style={{ background: DEGRADADO_OSCURO }}>
      <Container>
        <Row className="g-5">
          <Col xs={12} md={4}>
            <div className="d-flex align-items-center gap-2 fw-bold fs-5 mb-3">
              <img src="/logo-tooth.png" alt="DentalCare" width={30} height={30} />
              DentalCare
            </div>
            <p className="small mb-0 text-white-50" style={{ maxWidth: 280 }}>
              Cuidamos tu sonrisa con profesionales certificados y tecnología de vanguardia,
              en un ambiente cercano y de confianza.
            </p>
          </Col>

          <Col xs={6} md={4}>
            <div className="fw-semibold mb-3 text-uppercase small" style={{ letterSpacing: 1 }}>
              Enlaces
            </div>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><NavLink to="/" className="text-decoration-none text-white-50">Inicio</NavLink></li>
              <li><NavLink to="/servicios" className="text-decoration-none text-white-50">Nuestros servicios</NavLink></li>
              <li><NavLink to="/especialidades" className="text-decoration-none text-white-50">Especialidades</NavLink></li>
              <li><NavLink to="/register" className="text-decoration-none text-white-50">Regístrate</NavLink></li>
              <li><NavLink to="/login" className="text-decoration-none text-white-50">Ingresar</NavLink></li>
            </ul>
          </Col>

          <Col xs={6} md={4}>
            <div className="fw-semibold mb-3 text-uppercase small" style={{ letterSpacing: 1 }}>
              Contacto
            </div>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-white-50 mb-3">
              <li className="d-flex align-items-center gap-2"><Phone size={14} /> (02) 555-0000</li>
              <li className="d-flex align-items-center gap-2"><Mail size={14} /> contacto@dentalcare.com</li>
              <li className="d-flex align-items-center gap-2"><MapPin size={14} /> Quito, Ecuador</li>
              <li className="d-flex align-items-center gap-2"><Clock size={14} /> Lun–Vie, según horario de atención</li>
            </ul>
            <div className="d-flex gap-3">
              <Globe size={18} style={{ color: TEAL }} />
              <Share2 size={18} style={{ color: TEAL }} />
            </div>
          </Col>
        </Row>

        <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.15)' }} />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 small text-white-50">
          <span>© {new Date().getFullYear()} DentalCare — Sistema de gestión odontológica</span>
          <span>Todos los derechos reservados</span>
        </div>
      </Container>
    </footer>
  )
}