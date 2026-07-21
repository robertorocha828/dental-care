import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Button, Card } from 'react-bootstrap'

const ESPECIALIDADES = [
  { titulo: 'Ortodoncia', descripcion: 'Corrección de la posición dental y de mordida.' },
  { titulo: 'Endodoncia', descripcion: 'Tratamiento de conducto y salud interna del diente.' },
  { titulo: 'Periodoncia', descripcion: 'Cuidado de encías y tejido de soporte dental.' },
  { titulo: 'Odontopediatría', descripcion: 'Atención dental especializada para niños.' },
]

const PASOS = [
  { numero: '1', titulo: 'Regístrate', descripcion: 'Crea tu cuenta con tus datos personales.' },
  { numero: '2', titulo: 'Elige tu cita', descripcion: 'Selecciona odontólogo, fecha y motivo.' },
  { numero: '3', titulo: 'Listo', descripcion: 'Gestiona tus citas desde tu portal.' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [activa, setActiva] = useState(0)

  return (
    <>
      {/* Hero */}
      <div className="bg-dark text-white py-5">
        <Container>
          <Row className="align-items-center g-4">
            <Col xs={12} md={7}>
              <h1 className="display-4 fw-bold mb-3">Consultorio Odontológico</h1>
              <p className="lead text-white-50 mb-4">
                Agenda tu cita en línea en menos de dos minutos y gestiona tu
                salud dental desde un solo lugar.
              </p>
              <Button variant="success" size="lg" onClick={() => navigate('/agendar')}>
                Agendar cita
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Cómo funciona - pasos interactivos */}
      <Container className="py-5">
        <h2 className="text-center fw-bold mb-5">¿Cómo funciona?</h2>
        <Row className="g-4 justify-content-center">
          {PASOS.map((paso, i) => (
            <Col key={paso.titulo} xs={12} md={4}>
              <div className="text-center">
                <div
                  className="d-flex align-items-center justify-content-center bg-primary text-white rounded-circle mx-auto mb-3 fw-bold fs-4"
                  style={{ width: 56, height: 56 }}
                >
                  {paso.numero}
                </div>
                <h5 className="fw-bold">{paso.titulo}</h5>
                <p className="text-muted small">{paso.descripcion}</p>
              </div>
              {i < PASOS.length - 1 && (
                <div className="d-none d-md-block text-center text-muted" style={{ marginTop: -80, marginLeft: '55%' }}>
                  →
                </div>
              )}
            </Col>
          ))}
        </Row>
      </Container>

      {/* Especialidades - tabs interactivos, sin botones repetidos */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center fw-bold mb-4">Nuestras especialidades</h2>
          <Row className="g-4">
            <Col xs={12} md={4}>
              <div className="d-flex flex-column gap-2">
                {ESPECIALIDADES.map((esp, i) => (
                  <button
                    key={esp.titulo}
                    onClick={() => setActiva(i)}
                    className={`btn text-start ${i === activa ? 'btn-primary' : 'btn-outline-secondary'}`}
                  >
                    {esp.titulo}
                  </button>
                ))}
              </div>
            </Col>
            <Col xs={12} md={8}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <Card.Title className="fw-bold fs-4">{ESPECIALIDADES[activa].titulo}</Card.Title>
                  <Card.Text className="text-muted">{ESPECIALIDADES[activa].descripcion}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}