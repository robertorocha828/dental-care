import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap'
import { UserPlus, LogIn, ShieldCheck, Award, ArrowRight } from 'lucide-react'

// Paleta única azul-turquesa desvanecida, reutilizada en toda la página
const NAVY = '#0a2540'
const TEAL = '#1b8a9c'
const TEAL_CLARO = '#4fb3c4'
const DEGRADADO_OSCURO = `linear-gradient(135deg, ${NAVY} 0%, ${TEAL} 100%)`
const DEGRADADO_CLARO = 'linear-gradient(135deg, #eaf5f7 0%, #d7ecf0 100%)'

const API_URL = import.meta.env.VITE_API_BASE_URL

const SLIDES = [
  `${API_URL}/uploads/home/Bienvenida.png`,
  `${API_URL}/uploads/home/Cita.png`,
  `${API_URL}/uploads/home/Equipo.png`,
  `${API_URL}/uploads/home/Tecnologia.png`,
]

const PASOS = [
  { numero: '1', titulo: 'Regístrate', descripcion: 'Crea tu cuenta con tus datos personales.' },
  { numero: '2', titulo: 'Elige tu cita', descripcion: 'Selecciona odontólogo, fecha y motivo.' },
  { numero: '3', titulo: 'Listo', descripcion: 'Gestiona tus citas desde tu portal.' },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <>

      <div style={{ background: DEGRADADO_CLARO }}>
        <Carousel fade interval={5000}>
          {SLIDES.map((src) => (
            <Carousel.Item key={src}>
              <div style={{ height: 'clamp(340px, 62vw, 760px)', position: 'relative', overflow: 'hidden' }}>
          
                <img
                  src={src}
                  alt=""
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'blur(28px) brightness(1.05) saturate(1.05)',
                    transform: 'scale(1.15)',
                  }}
                />
      
                <div
                  style={{
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={src}
                    alt="Dental Care"
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      WebkitMaskImage: 'radial-gradient(ellipse 68% 70% at center, black 55%, transparent 100%)',
                      maskImage: 'radial-gradient(ellipse 68% 70% at center, black 55%, transparent 100%)',
                    }}
                  />
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
        <Container className="d-flex flex-wrap justify-content-center gap-3 py-4">
          <Button size="lg" style={{ backgroundColor: TEAL, border: 'none' }} onClick={() => navigate('/register')}>
            <UserPlus size={18} className="me-2" style={{ marginTop: -3 }} />
            Regístrate
          </Button>
          <Button variant="outline-secondary" size="lg" onClick={() => navigate('/login')}>
            Ingresar
          </Button>
        </Container>
      </div>

      <style>{`
        @keyframes pulso-boton {
          0%   { box-shadow: 0 0 0 0 rgba(27, 138, 156, 0.45); }
          70%  { box-shadow: 0 0 0 14px rgba(27, 138, 156, 0); }
          100% { box-shadow: 0 0 0 0 rgba(27, 138, 156, 0); }
        }
        .boton-servicios {
          animation: pulso-boton 2.2s infinite;
        }
      `}</style>
      <Container className="py-5">
        <Row className="align-items-center g-5">
          <Col xs={12} md={5} className="text-center">
            <img
              src="/tooth.gif"
              alt="Diente animado Dental Care"
              style={{ maxWidth: 280, width: '100%' }}
            />
          </Col>
          <Col xs={12} md={7}>
            <p className="fw-semibold text-uppercase small mb-1" style={{ color: TEAL, letterSpacing: 2 }}>
              Dental Care
            </p>
            <h2 className="fw-bold mb-3" style={{ color: NAVY }}>Nuestros servicios</h2>
            <p className="text-muted mb-4">
              Ortodoncia, endodoncia, periodoncia, odontopediatría, estética dental y chequeo general —
              conoce en qué consiste cada uno y encuentra el que necesitas.
            </p>
            <Button
              size="lg"
              className="boton-servicios rounded-pill"
              style={{ backgroundColor: TEAL, border: 'none' }}
              onClick={() => navigate('/servicios')}
            >
              Descubre nuestros servicios
              <ArrowRight size={18} className="ms-2" style={{ marginTop: -3 }} />
            </Button>
          </Col>
        </Row>
      </Container>


      <div className="py-5" style={{ background: DEGRADADO_OSCURO }}>
        <Container>
          <Row className="align-items-center g-4">
            <Col xs={12} md={7} className="text-white">
              <p className="fw-semibold text-uppercase small mb-2" style={{ color: TEAL_CLARO, letterSpacing: 2 }}>
                Excelencia en cuidado bucal
              </p>
              <h2 className="fw-bold mb-3">Garantizamos precisión y confianza en cada tratamiento</h2>
              <p className="text-white-50">
                Contamos con equipos de tecnología moderna y profesionales certificados que
                garantizan la efectividad de cada tratamiento. Cumplimos con los más altos
                estándares de calidad, siempre innovando en nuestras metodologías.
              </p>
            </Col>
            <Col xs={12} md={5}>
              <Row className="g-3">
                <Col xs={6}>
                  <div className="text-center text-white p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
                    <ShieldCheck size={32} className="mb-2" style={{ color: TEAL_CLARO }} />
                    <div className="fw-semibold small">Tecnología de vanguardia</div>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="text-center text-white p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
                    <Award size={32} className="mb-2" style={{ color: TEAL_CLARO }} />
                    <div className="fw-semibold small">Equipo especializado</div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        <h2 className="text-center fw-bold mb-5" style={{ color: NAVY }}>¿Cómo funciona?</h2>
        <Row className="g-4 justify-content-center">
          {PASOS.map((paso) => (
            <Col key={paso.titulo} xs={12} md={4}>
              <div className="text-center">
                <div
                  className="d-flex align-items-center justify-content-center text-white rounded-circle mx-auto mb-3 fw-bold fs-4"
                  style={{ width: 56, height: 56, background: DEGRADADO_OSCURO }}
                >
                  {paso.numero}
                </div>
                <h5 className="fw-bold" style={{ color: NAVY }}>{paso.titulo}</h5>
                <p className="text-muted small">{paso.descripcion}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      <div className="py-5" style={{ background: DEGRADADO_OSCURO }}>
        <Container className="text-center">
          <h3 className="fw-bold text-white mb-3">¿Listo para cuidar tu sonrisa?</h3>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Button size="lg" style={{ backgroundColor: TEAL_CLARO, border: 'none', color: NAVY }} onClick={() => navigate('/register')}>
              <UserPlus size={18} className="me-2" style={{ marginTop: -3 }} />
              Regístrate
            </Button>
            <Button variant="outline-light" size="lg" onClick={() => navigate('/login')}>
              <LogIn size={18} className="me-2" style={{ marginTop: -3 }} />
              Ingresar
            </Button>
          </div>
        </Container>
      </div>
    </>
  )
}