import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Button, Card, Carousel } from 'react-bootstrap'
import {
  Smile, CalendarCheck, ShieldCheck, Sparkles, Award,
  Stethoscope, Syringe, Activity, Baby,
} from 'lucide-react'

// Paleta única azul-turquesa desvanecida, reutilizada en toda la página
const NAVY = '#0a2540'
const TEAL = '#1b8a9c'
const TEAL_CLARO = '#4fb3c4'
const DEGRADADO_OSCURO = `linear-gradient(135deg, ${NAVY} 0%, ${TEAL} 100%)`
const DEGRADADO_CLARO = 'linear-gradient(135deg, #eaf5f7 0%, #d7ecf0 100%)'

const API_URL = import.meta.env.VITE_API_BASE_URL

// Las imágenes ya traen su propio texto de marca, así que el carrusel
// solo las muestra a pantalla completa, sin superponer texto encima.
const SLIDES = [
  `${API_URL}/uploads/home/Bienvenida.png`,
  `${API_URL}/uploads/home/Cita.png`,
  `${API_URL}/uploads/home/Equipo.png`,
  `${API_URL}/uploads/home/Tecnologia.png`,
]

const SERVICIOS = [
  { icon: Smile, titulo: 'Ortodoncia', descripcion: 'Corrección de la posición dental y de mordida.' },
  { icon: Syringe, titulo: 'Endodoncia', descripcion: 'Tratamiento de conducto y salud interna del diente.' },
  { icon: Activity, titulo: 'Periodoncia', descripcion: 'Cuidado de encías y tejido de soporte dental.' },
  { icon: Baby, titulo: 'Odontopediatría', descripcion: 'Atención dental especializada para niños.' },
  { icon: Sparkles, titulo: 'Estética Dental', descripcion: 'Blanqueamiento y diseño de sonrisa.' },
  { icon: Stethoscope, titulo: 'Chequeo General', descripcion: 'Diagnóstico y prevención integral.' },
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
      {/* Carrusel — fondo difuminado con la misma imagen + imagen nítida centrada encima */}
      <div style={{ background: DEGRADADO_CLARO }}>
        <Carousel fade interval={5000}>
          {SLIDES.map((src) => (
            <Carousel.Item key={src}>
              <div style={{ height: 'clamp(340px, 62vw, 760px)', position: 'relative', overflow: 'hidden' }}>
                {/* Capa de fondo: la misma imagen, ampliada y difuminada, rellena todo el espacio */}
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
                {/* Capa nítida: la imagen completa (sin recortar), con los bordes disueltos
                    en transparencia para que se funda con el fondo difuminado de atrás */}
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
          <Button size="lg" style={{ backgroundColor: TEAL, border: 'none' }} onClick={() => navigate('/agendar')}>
            <CalendarCheck size={18} className="me-2" style={{ marginTop: -3 }} />
            Agendar cita
          </Button>
          <Button variant="outline-secondary" size="lg" onClick={() => navigate('/especialidades')}>
            Ver especialidades
          </Button>
        </Container>
      </div>

      {/* Servicios */}
      <Container className="py-5">
        <div className="text-center mb-5">
          <p className="fw-semibold text-uppercase small mb-1" style={{ color: TEAL, letterSpacing: 2 }}>
            Dental Care
          </p>
          <h2 className="fw-bold" style={{ color: NAVY }}>Nuestros servicios</h2>
        </div>
        <Row className="g-4">
          {SERVICIOS.map((s) => {
            const Icon = s.icon
            return (
              <Col key={s.titulo} xs={12} sm={6} lg={4}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                      style={{ width: 52, height: 52, background: DEGRADADO_CLARO }}
                    >
                      <Icon size={24} style={{ color: TEAL }} />
                    </div>
                    <Card.Title className="fw-bold" style={{ color: NAVY }}>{s.titulo}</Card.Title>
                    <Card.Text className="text-muted small">{s.descripcion}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            )
          })}
        </Row>
      </Container>

      {/* Por qué elegirnos */}
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

      {/* Cómo funciona */}
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

      {/* CTA final */}
      <div className="py-5" style={{ background: DEGRADADO_OSCURO }}>
        <Container className="text-center">
          <h3 className="fw-bold text-white mb-3">¿Listo para tu próxima cita?</h3>
          <Button size="lg" style={{ backgroundColor: TEAL_CLARO, border: 'none', color: NAVY }} onClick={() => navigate('/agendar')}>
            <CalendarCheck size={18} className="me-2" style={{ marginTop: -3 }} />
            Agendar cita
          </Button>
        </Container>
      </div>
    </>
  )
}