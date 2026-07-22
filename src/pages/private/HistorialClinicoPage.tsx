import { useEffect, useState } from 'react'
import { Container, Form, Card, Alert, Spinner, Table, Badge, Button } from 'react-bootstrap'
import { getPacientes } from '@/api/pacientes.api'
import { getOdontologoByUsuario } from '@/api/odontologos.api'
import { getOdontogramasByPaciente, createOdontograma, updateDiente } from '@/api/odontograma.api'
import { getCitasByOdontologo } from '@/api/citas.api'
import { getHistorialByPaciente } from '@/api/historial-clinico.api'
import { useAuthStore } from '@/store/auth.store'
import Odontograma, { CICLO_ESTADOS } from '@/components/private/Odontograma'
import AtenderCitaDialog from '@/components/private/AtenderCitaDialog'
import EditarHistorialDialog from '@/components/private/EditarHistorialDialog'
import type { Paciente } from '@/types/paciente.types'
import type { Cita } from '@/types/cita.types'
import type { Odontograma as OdontogramaType, Superficies } from '@/types/odontograma.types'
import type { HistorialClinico } from '@/types/historial-clinico.types'

export default function HistorialClinicoPage() {
  const userId = useAuthStore((s) => s.userId)
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [citas, setCitas] = useState<Cita[]>([])
  const [pacienteId, setPacienteId] = useState('')
  const [odontologoId, setOdontologoId] = useState<string | null>(null)
  const [odontograma, setOdontograma] = useState<OdontogramaType | null>(null)
  const [historial, setHistorial] = useState<HistorialClinico[]>([])
  const [citaAtender, setCitaAtender] = useState<Cita | null>(null)
  const [editandoHistorial, setEditandoHistorial] = useState<HistorialClinico | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cargarCitas = async (odId: string) => {
    const result = await getCitasByOdontologo(odId, { limit: 50 })
    setCitas(result.items.filter((c) => c.estado === 'agendada'))
  }

  useEffect(() => {
    getPacientes({ limit: 100 }).then((r) => setPacientes(r.items))
    if (userId) {
      getOdontologoByUsuario(userId)
        .then((o) => {
          setOdontologoId(o.id)
          cargarCitas(o.id)
        })
        .catch(() => setError('No se encontró tu ficha de odontólogo. Pide al admin que la vincule a tu usuario.'))
    }
  }, [userId])

  const cargarHistorial = async (id: string) => {
    const result = await getHistorialByPaciente(id)
    setHistorial(result.items)
  }

  const cargarOdontograma = async (id: string) => {
    setOdontograma(null)
    setError(null)
    if (!id) return

    if (!odontologoId) {
      setError('Tu ficha de odontólogo todavía no ha cargado. Espera un momento e intenta de nuevo.')
      return
    }

    setLoading(true)
    try {
      const result = await getOdontogramasByPaciente(id)
      if (result.items.length > 0) {
        setOdontograma(result.items[0])
      } else {
        const nuevo = await createOdontograma({
          pacienteId: id,
          fechaEvaluacion: new Date().toISOString(),
          odontologoId,
          dientes: [],
        })
        setOdontograma(nuevo)
      }
      await cargarHistorial(id)
    } catch {
      setError('No se pudo cargar el odontograma de este paciente.')
    } finally {
      setLoading(false)
    }
  }

  const seleccionarPaciente = (id: string) => {
    setPacienteId(id)
    cargarOdontograma(id)
  }

  const atenderCita = (cita: Cita) => {
    if (!cita.pacienteId) return
    setCitaAtender(cita)
    setPacienteId(cita.pacienteId)
    cargarOdontograma(cita.pacienteId)
  }

  const handleSurfaceClick = async (numero: number, superficie: keyof Superficies) => {
    if (!odontograma?._id) return
    const diente = odontograma.dientes.find((d) => d.numero === numero)
    const actual = diente?.superficies[superficie] ?? 'sano'
    const siguiente = CICLO_ESTADOS[(CICLO_ESTADOS.indexOf(actual) + 1) % CICLO_ESTADOS.length]

    const actualizado = await updateDiente(odontograma._id, {
      numero,
      superficies: { [superficie]: siguiente },
    })
    setOdontograma(actualizado)
  }

  return (
    <Container>
      <h4 className="fw-bold mb-4">Historial clínico</h4>

      {/* Citas pendientes del doctor */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-0">
          <Card.Title className="fw-bold small text-uppercase text-muted p-4 pb-0 mb-2">
            Mis citas agendadas
          </Card.Title>
          <Table hover responsive className="mb-0">
            <thead>
              <tr>
                <th className="ps-4">Fecha</th>
                <th>Motivo</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {citas.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-muted py-3">No tienes citas agendadas.</td>
                </tr>
              )}
              {citas.map((c) => (
                <tr key={c.id}>
                  <td className="ps-4">{new Date(c.fechaHora).toLocaleString('es-EC')}</td>
                  <td>{c.motivo}</td>
                  <td className="text-end pe-4">
                    <Button size="sm" variant="primary" onClick={() => atenderCita(c)}>Atender</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Selector manual de paciente (por si no viene de una cita) */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-4">
          <Form.Group style={{ maxWidth: 420 }}>
            <Form.Label>Paciente</Form.Label>
            <Form.Select
              value={pacienteId}
              disabled={!odontologoId}
              onChange={(e) => seleccionarPaciente(e.target.value)}
            >
              <option value="">Selecciona un paciente</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre} {p.apellido} — {p.cedula}</option>
              ))}
            </Form.Select>
            {!odontologoId && !error && (
              <Form.Text className="text-muted">Cargando tu ficha de odontólogo...</Form.Text>
            )}
          </Form.Group>
        </Card.Body>
      </Card>

      {error && <Alert variant="warning">{error}</Alert>}

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" size="sm" className="me-2" />
          Cargando odontograma...
        </div>
      )}

      {!loading && odontograma && (
        <>
          {citaAtender && (
            <div className="mb-3">
              <Badge bg="info">Atendiendo cita: {citaAtender.motivo}</Badge>
            </div>
          )}
          <Odontograma dientes={odontograma.dientes} onSurfaceClick={handleSurfaceClick} />

          {/* Historial de consultas pasadas de este paciente */}
          <Card className="border-0 shadow-sm mt-4">
            <Card.Body className="p-0">
              <Card.Title className="fw-bold small text-uppercase text-muted p-4 pb-0 mb-2">
                Historial de este paciente
              </Card.Title>
              <Table hover responsive className="mb-0">
                <thead>
                  <tr>
                    <th className="ps-4">Fecha</th>
                    <th>Motivo</th>
                    <th>Diagnóstico</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {historial.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-3">
                        Este paciente todavía no tiene consultas registradas.
                      </td>
                    </tr>
                  )}
                  {historial.map((h) => (
                    <tr key={h._id}>
                      <td className="ps-4">{new Date(h.fechaConsulta).toLocaleDateString('es-EC')}</td>
                      <td>{h.motivoConsulta}</td>
                      <td>{h.diagnostico}</td>
                      <td className="text-end pe-4">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => setEditandoHistorial(h)}
                        >
                          Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </>
      )}

      {!loading && !odontograma && !error && pacienteId === '' && (
        <p className="text-muted small">Selecciona un paciente o atiende una cita para ver su odontograma.</p>
      )}

      <AtenderCitaDialog
        open={!!citaAtender}
        onOpenChange={(open) => !open && setCitaAtender(null)}
        cita={citaAtender}
        odontologoId={odontologoId ?? ''}
        onSaved={() => {
          if (odontologoId) cargarCitas(odontologoId)
          if (pacienteId) cargarHistorial(pacienteId)
        }}
      />
      <EditarHistorialDialog
        open={!!editandoHistorial}
        onOpenChange={(open) => !open && setEditandoHistorial(null)}
        historial={editandoHistorial}
        onSaved={() => pacienteId && cargarHistorial(pacienteId)}
      />
    </Container>
  )
}