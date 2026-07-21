import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap'
import { Smile } from 'lucide-react'
import { getEspecialidades } from '@/api/especialidades.api'
import type { Especialidad } from '@/types/especialidad.types'

const NAVY = '#0a2540'
const TEAL = '#1b8a9c'

export default function EspecialidadesPage() {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEspecialidades()
      .then((data) => setEspecialidades(data.filter((e) => e.activo)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <p className="fw-semibold text-uppercase small mb-1" style={{ color: TEAL, letterSpacing: 2 }}>
          Dental Care
        </p>
        <h2 className="fw-bold" style={{ color: NAVY }}>Nuestras especialidades</h2>
      </div>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" style={{ color: TEAL }} />
        </div>
      )}

      {!loading && especialidades.length === 0 && (
        <p className="text-center text-muted">Aún no hay especialidades registradas.</p>
      )}

      <Row className="g-4">
        {especialidades.map((esp) => (
          <Col key={esp.id} xs={12} sm={6} lg={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4 d-flex align-items-center gap-3">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  style={{ width: 48, height: 48, backgroundColor: '#e6f4f6' }}
                >
                  <Smile size={22} style={{ color: TEAL }} />
                </div>
                <Card.Title className="fw-bold mb-0" style={{ color: NAVY }}>{esp.nombre}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}