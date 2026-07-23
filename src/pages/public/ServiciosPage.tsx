import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { SERVICIOS } from '@/lib/servicios'

const NAVY = '#0a2540'
const TEAL = '#1b8a9c'

export default function ServiciosPage() {
  const navigate = useNavigate()

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <p className="fw-semibold text-uppercase small mb-1" style={{ color: TEAL, letterSpacing: 2 }}>
          Dental Care
        </p>
        <h2 className="fw-bold" style={{ color: NAVY }}>Nuestros servicios</h2>
        <p className="text-muted">Toca un servicio para conocer en qué consiste.</p>
      </div>

      <Row className="g-4">
        {SERVICIOS.map((s) => (
          <Col key={s.slug} xs={12} sm={6} lg={4}>
            <Card
              role="button"
              className="h-100 border-0 shadow-sm overflow-hidden"
              style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
              onClick={() => navigate(`/servicios/${s.slug}`)}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <Card.Img variant="top" src={s.imagen} alt={s.titulo} style={{ aspectRatio: '1 / 1', objectFit: 'cover' }} />
              <Card.Body className="p-4">
                <Card.Title className="fw-bold" style={{ color: NAVY }}>{s.titulo}</Card.Title>
                <Card.Text className="text-muted small mb-0">{s.descripcionCorta}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}