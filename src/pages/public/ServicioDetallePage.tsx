import { useNavigate, useParams } from 'react-router-dom'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { ArrowLeft, UserPlus } from 'lucide-react'
import { getServicioPorSlug, SERVICIOS } from '@/lib/servicios'

const NAVY = '#0a2540'
const TEAL = '#1b8a9c'

export default function ServicioDetallePage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const servicio = slug ? getServicioPorSlug(slug) : null

  if (!servicio) {
    return (
      <Container className="py-5 text-center">
        <p className="text-muted">No encontramos ese servicio.</p>
        <Button variant="outline-secondary" onClick={() => navigate('/servicios')}>
          Volver a Nuestros servicios
        </Button>
      </Container>
    )
  }

  const otros = SERVICIOS.filter((s) => s.slug !== servicio.slug).slice(0, 3)

  return (
    <Container className="py-5">
      <Button variant="link" className="ps-0 mb-4 text-decoration-none" onClick={() => navigate('/servicios')} style={{ color: TEAL }}>
        <ArrowLeft size={18} className="me-1" style={{ marginTop: -3 }} />
        Volver a Nuestros servicios
      </Button>

      <Row className="align-items-center g-5 mb-5">
        <Col xs={12} md={5}>
          <img
            src={servicio.imagen}
            alt={servicio.titulo}
            className="img-fluid rounded-4 shadow-sm"
            style={{ aspectRatio: '1 / 1', objectFit: 'cover', width: '100%' }}
          />
        </Col>
        <Col xs={12} md={7}>
          <p className="fw-semibold text-uppercase small mb-1" style={{ color: TEAL, letterSpacing: 2 }}>
            Dental Care
          </p>
          <h2 className="fw-bold mb-3" style={{ color: NAVY }}>{servicio.titulo}</h2>
          <p className="text-muted">{servicio.descripcionLarga}</p>
          <Button
            size="lg"
            className="mt-2"
            style={{ backgroundColor: TEAL, border: 'none' }}
            onClick={() => navigate('/register')}
          >
            <UserPlus size={18} className="me-2" style={{ marginTop: -3 }} />
            Regístrate y agenda tu cita
          </Button>
        </Col>
      </Row>

      {otros.length > 0 && (
        <>
          <h5 className="fw-bold mb-3" style={{ color: NAVY }}>Otros servicios</h5>
          <Row className="g-4">
            {otros.map((s) => (
              <Col key={s.slug} xs={12} sm={4}>
                <div
                  role="button"
                  className="d-flex align-items-center gap-3 p-3 rounded-3 border"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/servicios/${s.slug}`)}
                >
                  <img src={s.imagen} alt={s.titulo} width={56} height={56} style={{ objectFit: 'cover', borderRadius: 8 }} />
                  <span className="fw-semibold" style={{ color: NAVY }}>{s.titulo}</span>
                </div>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  )
}