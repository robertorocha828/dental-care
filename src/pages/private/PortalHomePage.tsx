import { useAuthStore } from '@/store/auth.store'
import { Container, Row, Col, Card } from 'react-bootstrap'

const CARDS = [
  { titulo: 'Mis citas', descripcion: 'Consulta y agenda tus citas en el consultorio.' },
  { titulo: 'Mi perfil', descripcion: 'Revisa y actualiza tus datos personales.' },
]

export default function PortalHomePage() {
  const userId = useAuthStore((s) => s.userId)

  return (
    <Container>
      <h4 className="fw-bold mb-1">Bienvenido a tu portal</h4>
      <p className="text-muted mb-4 small">ID de sesión: {userId}</p>
      <Row className="g-3">
        {CARDS.map((card) => (
          <Col key={card.titulo} xs={12} md={6}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <Card.Title className="fw-bold">{card.titulo}</Card.Title>
                <Card.Text className="text-muted small">{card.descripcion}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}