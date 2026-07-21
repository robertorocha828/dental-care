import { useEffect, useState } from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { useAuthStore } from '@/store/auth.store'
import { getUsers } from '@/api/users.api'
import { getCitas } from '@/api/citas.api'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell,
} from 'recharts'
import {
  Chart as ChartJS, ArcElement, Tooltip as ChartJsTooltip, Legend,
} from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, ChartJsTooltip, Legend)

const CARDS = [
  { titulo: 'Pacientes', descripcion: 'Gestiona el registro de pacientes del consultorio.' },
  { titulo: 'Citas', descripcion: 'Administra las citas y agenda del consultorio.' },
  { titulo: 'Odontólogos', descripcion: 'Gestiona el equipo de profesionales.' },
]

const ESTADO_LABELS: Record<string, string> = {
  agendada: 'Agendadas',
  completada: 'Completadas',
  cancelada: 'Canceladas',
}

const ESTADO_COLORS = ['#0d6efd', '#198754', '#dc3545']

export default function DashboardHomePage() {
  const userId = useAuthStore((s) => s.userId)
  const [citasPorEstado, setCitasPorEstado] = useState<{ estado: string; total: number }[]>([])
  const [usuariosPorRol, setUsuariosPorRol] = useState<{ rol: string; total: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [citas, users] = await Promise.all([
        getCitas({ limit: 100 }),
        getUsers({ limit: 100 }),
      ])

      const conteoEstados: Record<string, number> = { agendada: 0, completada: 0, cancelada: 0 }
      citas.items.forEach((c) => { conteoEstados[c.estado] = (conteoEstados[c.estado] ?? 0) + 1 })
      setCitasPorEstado(
        Object.entries(conteoEstados).map(([estado, total]) => ({ estado: ESTADO_LABELS[estado] ?? estado, total })),
      )

      const conteoRoles: Record<string, number> = {}
      users.items.forEach((u) => { conteoRoles[u.rol] = (conteoRoles[u.rol] ?? 0) + 1 })
      setUsuariosPorRol(Object.entries(conteoRoles).map(([rol, total]) => ({ rol, total })))

      setLoading(false)
    }
    load()
  }, [])

  const pieData = {
    labels: usuariosPorRol.map((r) => r.rol),
    datasets: [{
      data: usuariosPorRol.map((r) => r.total),
      backgroundColor: ['#0d6efd', '#198754', '#dc3545', '#fd7e14', '#6f42c1', '#20c997'],
    }],
  }

  return (
    <Container>
      <h4 className="fw-bold mb-1">Bienvenido al panel</h4>
      <p className="text-muted mb-4 small">ID de sesión: {userId}</p>

      <Row className="g-3 mb-4">
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

      <Row className="g-3">
        <Col xs={12} md={7}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <Card.Title className="fw-bold mb-3">Citas por estado</Card.Title>
              {!loading && (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={citasPorEstado}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="estado" />
                    <YAxis allowDecimals={false} />
                    <RechartsTooltip />
                    <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                      {citasPorEstado.map((_, i) => (
                        <Cell key={i} fill={ESTADO_COLORS[i % ESTADO_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={5}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <Card.Title className="fw-bold mb-3">Usuarios por rol</Card.Title>
              {!loading && usuariosPorRol.length > 0 && (
                <div style={{ maxWidth: 320, margin: '0 auto' }}>
                  <Pie data={pieData} />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}