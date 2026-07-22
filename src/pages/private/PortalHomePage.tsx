import { useEffect, useState } from 'react'
import { Container, Card, Table, Badge, Alert, Button, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { getPacienteByUsuario } from '@/api/pacientes.api'
import { getCitasByPaciente } from '@/api/citas.api'
import { Chart as ChartJS, ArcElement, Tooltip as ChartJsTooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import type { Cita } from '@/types/cita.types'

ChartJS.register(ArcElement, ChartJsTooltip, Legend)

const estadoBadge: Record<Cita['estado'], string> = {
  agendada: 'primary',
  completada: 'success',
  cancelada: 'danger',
}

const ESTADO_COLORS: Record<Cita['estado'], string> = {
  agendada: '#0d6efd',
  completada: '#198754',
  cancelada: '#dc3545',
}

export default function PortalHomePage() {
  const navigate = useNavigate()
  const userId = useAuthStore((s) => s.userId)
  const [citas, setCitas] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)
  const [faltaPerfil, setFaltaPerfil] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!userId) return
      try {
        const paciente = await getPacienteByUsuario(userId)
        const result = await getCitasByPaciente(paciente.id)
        setCitas(result.items)
      } catch {
        setFaltaPerfil(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userId])

  if (!loading && faltaPerfil) {
    return (
      <Container>
        <Alert variant="warning" className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>Nos faltan algunos datos tuyos antes de continuar.</span>
          <Button size="sm" onClick={() => navigate('/completar-perfil')}>Completar perfil</Button>
        </Alert>
      </Container>
    )
  }

  const pendientes = citas.filter((c) => c.estado === 'agendada').length
  const conteoEstados = citas.reduce((acc, c) => {
    acc[c.estado] = (acc[c.estado] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const doughnutData = {
    labels: Object.keys(conteoEstados),
    datasets: [{
      data: Object.values(conteoEstados),
      backgroundColor: Object.keys(conteoEstados).map((e) => ESTADO_COLORS[e as Cita['estado']]),
    }],
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Mis citas</h4>
        <Button variant="primary" onClick={() => navigate('/agendar')}>
          Agendar cita
        </Button>
      </div>

      <Row className="g-3 mb-4">
        <Col xs={12} md={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4 text-center">
              <div className="fs-1 fw-bold text-primary">{pendientes}</div>
              <Card.Text className="text-muted small mb-0">Citas pendientes</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={8}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <Card.Title className="fw-bold small text-uppercase text-muted mb-3">
                Mis citas por estado
              </Card.Title>
              {citas.length > 0 ? (
                <div style={{ maxWidth: 220, margin: '0 auto' }}>
                  <Doughnut data={doughnutData} />
                </div>
              ) : (
                <p className="text-muted small mb-0">Todavía no tienes datos para mostrar aquí.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead>
              <tr>
                <th className="ps-4">Fecha y hora</th>
                <th>Motivo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {!loading && citas.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-muted py-4">
                    Todavía no tienes citas agendadas.
                  </td>
                </tr>
              )}
              {citas.map((cita) => (
                <tr key={cita.id}>
                  <td className="ps-4">{new Date(cita.fechaHora).toLocaleString('es-EC')}</td>
                  <td>{cita.motivo}</td>
                  <td>
                    <Badge bg={estadoBadge[cita.estado]}>{cita.estado}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  )
}