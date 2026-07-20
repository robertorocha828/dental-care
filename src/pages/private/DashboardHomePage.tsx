import { useAuthStore } from '@/store/auth.store'
import { Container, Row, Col, Card } from 'react-bootstrap'

const CARDS = [
  { titulo: 'Pacientes', descripcion: 'Gestiona el registro de pacientes del consultorio.' },
  { titulo: 'Citas', descripcion: 'Administra las citas y agenda del consultorio.' },
  { titulo: 'Odontólogos', descripcion: 'Gestiona el equipo de profesionales.' },
]

export default function DashboardHomePage() {
  const userId = useAuthStore((s) => s.userId)

  return (
    <Container>
      <h4 className="fw-bold mb-1">Bienvenido al panel</h4>
      <p className="text-muted mb-4 small">ID de sesión: {userId}</p>
      <Row className="g-3">
        {CARDS.map((card) => (
          <Col key={card.titulo} xs={12} md={4}>
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
