import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Button, Card } from 'react-bootstrap'

const INFO = [
  { titulo: 'Especialidades', descripcion: 'Ortodoncia, Endodoncia, Periodoncia y más.' },
  { titulo: 'Odontólogos', descripcion: 'Profesionales certificados y con experiencia.' },
  { titulo: 'Citas Online', descripcion: 'Agenda tu cita desde cualquier dispositivo.' },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <>
      {/* Hero */}
      <div className="bg-dark text-white py-5">
        <Container>
          <Row className="align-items-center g-4">
            <Col xs={12} md={7}>
              <h1 className="display-4 fw-bold mb-3">Consultorio Odontológico</h1>
              <p className="lead text-white-50 mb-4">
                Sistema de gestión para centros odontológicos. Administra pacientes,
                citas, tratamientos y más desde un solo lugar.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Button variant="success" size="lg" onClick={() => navigate('/agendar')}>
                  Agendar cita
                </Button>
                <Button variant="outline-light" size="lg" onClick={() => navigate('/especialidades')}>
                  Ver especialidades
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Info cards */}
      <Container className="py-5">
        <h2 className="text-center fw-bold mb-4">¿Qué ofrecemos?</h2>
        <Row className="g-4">
          {INFO.map((item) => (
            <Col key={item.titulo} xs={12} md={4}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="p-4">
                  <Card.Title className="fw-bold">{item.titulo}</Card.Title>
                  <Card.Text className="text-muted">{item.descripcion}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-5">
          <Button variant="primary" size="lg" onClick={() => navigate('/agendar')}>
            Agenda tu cita ahora
          </Button>
        </div>
      </Container>
    </>
  )
}