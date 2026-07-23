import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { getUsers } from '@/api/users.api'
import { getCitas, getCitasByOdontologo } from '@/api/citas.api'
import { getOdontologoByUsuario } from '@/api/odontologos.api'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell,
} from 'recharts'
import {
  Chart as ChartJS, ArcElement, Tooltip as ChartJsTooltip, Legend,
} from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, ChartJsTooltip, Legend)

const CARDS = [
  { titulo: 'Pacientes', descripcion: 'Gestiona el registro de pacientes del consultorio.', to: '/pacientes' },
  { titulo: 'Odontólogos', descripcion: 'Gestiona el equipo de profesionales.', to: '/odontologos' },
]

const ESTADO_LABELS: Record<string, string> = {
  agendada: 'Agendadas',
  completada: 'Completadas',
  cancelada: 'Canceladas',
}

const ESTADO_COLORS = ['#0d6efd', '#198754', '#dc3545']

function contarPorEstado(citas: { estado: string }[]) {
  const conteo: Record<string, number> = { agendada: 0, completada: 0, cancelada: 0 }
  citas.forEach((c) => { conteo[c.estado] = (conteo[c.estado] ?? 0) + 1 })
  return Object.entries(conteo).map(([estado, total]) => ({ estado: ESTADO_LABELS[estado] ?? estado, total }))
}

// --- Dashboard del ADMIN: panorama general del consultorio ---
function AdminDashboard({ userId }: { userId: string | null }) {
  const navigate = useNavigate()
  const [citasPorEstado, setCitasPorEstado] = useState<{ estado: string; total: number }[]>([])
  const [usuariosPorRol, setUsuariosPorRol] = useState<{ rol: string; total: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [citas, users] = await Promise.all([
        getCitas({ limit: 100 }),
        getUsers({ limit: 100 }),
      ])
      setCitasPorEstado(contarPorEstado(citas.items))
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
          <Col key={card.titulo} xs={12} md={6}>
            <Card
              className="h-100 border-0 shadow-sm"
              role="button"
              onClick={() => navigate(card.to)}
              style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <Card.Body className="p-4">
                <Card.Title className="fw-bold">{card.titulo}</Card.Title>
                <Card.Text className="text-muted small mb-0">{card.descripcion}</Card.Text>
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

// --- Dashboard del DOCTOR: su propia agenda ---
function DoctorDashboard({ userId }: { userId: string | null }) {
  const navigate = useNavigate()
  const [citasPorEstado, setCitasPorEstado] = useState<{ estado: string; total: number }[]>([])
  const [pendientes, setPendientes] = useState(0)
  const [loading, setLoading] = useState(true)
  const [sinFicha, setSinFicha] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!userId) return
      try {
        const odontologo = await getOdontologoByUsuario(userId)
        const citas = await getCitasByOdontologo(odontologo.id, { limit: 100 })
        setCitasPorEstado(contarPorEstado(citas.items))
        setPendientes(citas.items.filter((c) => c.estado === 'agendada').length)
      } catch {
        setSinFicha(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userId])

  if (!loading && sinFicha) {
    return (
      <Container>
        <h4 className="fw-bold mb-1">Bienvenido, doctor</h4>
        <p className="text-muted small">
          Tu ficha de odontólogo todavía no está vinculada a tu usuario. Pide al admin que la vincule.
        </p>
      </Container>
    )
  }

  return (
    <Container>
      <h4 className="fw-bold mb-1">Bienvenido, doctor</h4>
      <p className="text-muted mb-4 small">Este es el resumen de tu agenda.</p>

      <Row className="g-3 mb-4">
        <Col xs={12} md={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="fs-2 fw-bold text-primary">{loading ? '—' : pendientes}</div>
              <Card.Text className="text-muted small mb-3">Citas pendientes</Card.Text>
              <Button size="sm" onClick={() => navigate('/historial-clinico')}>
                Ir a Historial clínico
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={8}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <Card.Title className="fw-bold mb-3">Mis citas por estado</Card.Title>
              {!loading && (
                <ResponsiveContainer width="100%" height={220}>
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
      </Row>
    </Container>
  )
}

export default function DashboardHomePage() {
  const userId = useAuthStore((s) => s.userId)
  const rol = useAuthStore((s) => s.rol)

  return rol === 'doctor'
    ? <DoctorDashboard userId={userId} />
    : <AdminDashboard userId={userId} />
}