import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Spinner, Badge } from 'react-bootstrap'
import { Smile, UserRound, ChevronDown, ChevronUp } from 'lucide-react'
import { getEspecialidades, getEspecialidad } from '@/api/especialidades.api'
import type { Especialidad } from '@/types/especialidad.types'

const NAVY = '#0a2540'
const TEAL = '#1b8a9c'

export default function EspecialidadesPage() {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([])
  const [loading, setLoading] = useState(true)
  const [abiertaId, setAbiertaId] = useState<number | null>(null)
  const [detalle, setDetalle] = useState<Especialidad | null>(null)
  const [cargandoDetalle, setCargandoDetalle] = useState(false)

  useEffect(() => {
    getEspecialidades()
      .then((data) => setEspecialidades(data.filter((e) => e.activo)))
      .finally(() => setLoading(false))
  }, [])

  const toggleEspecialidad = async (esp: Especialidad) => {
    if (abiertaId === esp.id) {
      setAbiertaId(null)
      return
    }
    setAbiertaId(esp.id)
    setCargandoDetalle(true)
    try {
      setDetalle(await getEspecialidad(esp.id))
    } finally {
      setCargandoDetalle(false)
    }
  }

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <p className="fw-semibold text-uppercase small mb-1" style={{ color: TEAL, letterSpacing: 2 }}>
          Dental Care
        </p>
        <h2 className="fw-bold" style={{ color: NAVY }}>Nuestras especialidades</h2>
        <p className="text-muted small">Toca una especialidad para ver a los odontólogos que la atienden.</p>
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
            <Card
              className="h-100 border-0 shadow-sm"
              role="button"
              onClick={() => toggleEspecialidad(esp)}
              style={{ cursor: 'pointer' }}
            >
              <Card.Body className="p-4">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                    style={{ width: 48, height: 48, backgroundColor: '#e6f4f6' }}
                  >
                    <Smile size={22} style={{ color: TEAL }} />
                  </div>
                  <Card.Title className="fw-bold mb-0 flex-grow-1" style={{ color: NAVY }}>{esp.nombre}</Card.Title>
                  {abiertaId === esp.id ? <ChevronUp size={18} className="text-muted" /> : <ChevronDown size={18} className="text-muted" />}
                </div>

                {abiertaId === esp.id && (
                  <div className="mt-3 pt-3 border-top">
                    {cargandoDetalle && <Spinner animation="border" size="sm" style={{ color: TEAL }} />}
                    {!cargandoDetalle && detalle && (detalle.odontologos?.length ?? 0) === 0 && (
                      <p className="text-muted small mb-0">Todavía no hay odontólogos asignados a esta especialidad.</p>
                    )}
                    {!cargandoDetalle && detalle?.odontologos?.map((doc) => (
                      <Badge
                        key={doc.id}
                        bg="light"
                        text="dark"
                        className="d-flex align-items-center gap-1 mb-2 p-2 border"
                      >
                        <UserRound size={14} style={{ color: TEAL }} />
                        {doc.nombre} {doc.apellido}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}