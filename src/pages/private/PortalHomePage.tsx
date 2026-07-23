import { useEffect, useMemo, useState } from 'react'
import { Container, Card, Table, Badge, Alert, Button, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { getPacienteByUsuario } from '@/api/pacientes.api'
import { getCitasByPaciente } from '@/api/citas.api'
import { getOdontologos } from '@/api/odontologos.api'
import { Chart as ChartJS, ArcElement, Tooltip as ChartJsTooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import type { Cita } from '@/types/cita.types'
import type { Odontologo } from '@/types/odontologo.types'

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
  const [odontologos, setOdontologos] = useState<Odontologo[]>([])
  const [loading, setLoading] = useState(true)
  const [faltaPerfil, setFaltaPerfil] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!userId) return
      try {
        const paciente = await getPacienteByUsuario(userId)
        const [result, odontologosResult] = await Promise.all([
          getCitasByPaciente(paciente.id),
          getOdontologos({ limit: 100 }),
        ])
        setCitas(result.items)
        setOdontologos(odontologosResult.items)
      } catch {
        setFaltaPerfil(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userId])

  const nombreDoctor = (id?: string) => {
    if (!id) return null
    const o = odontologos.find((x) => x.id === id)
    return o ? `${o.nombre} ${o.apellido}` : null
  }

  const proximasCitas = useMemo(() => {
    const ahora = Date.now()
    return citas
      .filter((c) => c.estado === 'agendada' && new Date(c.fechaHora).getTime() >= ahora)
      .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime())
  }, [citas])

  const proximaCita = proximasCitas[0] ?? null

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

      {!loading && (
        <Card className={`border-0 shadow-sm mb-4 ${proximaCita ? 'bg-primary bg-opacity-10' : ''}`}>
          <Card.Body className="p-4">
            <Card.Title className="fw-bold small text-uppercase text-muted mb-2">
              Tu próxima cita
            </Card.Title>
            {proximaCita ? (
              <>
                <div className="fs-4 fw-bold text-primary mb-1">
                  {new Date(proximaCita.fechaHora).toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long' })}
                  {' — '}
                  {new Date(proximaCita.fechaHora).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <p className="text-muted mb-0">
                  {proximaCita.motivo}
                  {nombreDoctor(proximaCita.odontologoId) && ` — con ${nombreDoctor(proximaCita.odontologoId)}`}
                </p>
                {proximasCitas.length > 1 && (
                  <p className="text-muted small mt-2 mb-0">
                    Tienes {proximasCitas.length - 1} cita{proximasCitas.length - 1 === 1 ? '' : 's'} más agendada{proximasCitas.length - 1 === 1 ? '' : 's'} después de esta.
                  </p>
                )}
              </>
            ) : (
              <p className="text-muted mb-0">No tienes citas próximas agendadas.</p>
            )}
          </Card.Body>
        </Card>
      )}

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
          <Card.Title className="fw-bold small text-uppercase text-muted p-4 pb-0 mb-2">
            Historial de citas
          </Card.Title>
          <Table hover responsive className="mb-0">
            <thead>
              <tr>
                <th className="ps-4">Fecha y hora</th>
                <th>Doctor</th>
                <th>Motivo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {!loading && citas.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-4">
                    Todavía no tienes citas agendadas.
                  </td>
                </tr>
              )}
              {citas.map((cita) => (
                <tr key={cita.id}>
                  <td className="ps-4">{new Date(cita.fechaHora).toLocaleString('es-EC')}</td>
                  <td>{nombreDoctor(cita.odontologoId) ?? '—'}</td>
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