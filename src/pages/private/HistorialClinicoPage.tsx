import { useEffect, useState } from 'react'
import { Container, Form, Card, Alert, Spinner, Table, Badge, Button } from 'react-bootstrap'
import { getPaciente } from '@/api/pacientes.api'
import { getOdontologoByUsuario, getOdontologos } from '@/api/odontologos.api'
import { getOdontogramasByPaciente, createOdontograma, updateDiente } from '@/api/odontograma.api'
import { getCitasByOdontologo } from '@/api/citas.api'
import { getHistorialByPaciente } from '@/api/historial-clinico.api'
import { getTratamientos } from '@/api/tratamientos.api'
import { useAuthStore } from '@/store/auth.store'
import Odontograma, { CICLO_ESTADOS } from '@/components/private/Odontograma'
import AtenderCitaDialog from '@/components/private/AtenderCitaDialog'
import EditarHistorialDialog from '@/components/private/EditarHistorialDialog'
import type { Paciente } from '@/types/paciente.types'
import type { Cita } from '@/types/cita.types'
import type { Odontologo } from '@/types/odontologo.types'
import type { Tratamiento } from '@/types/tratamiento.types'
import type { Odontograma as OdontogramaType, Superficies } from '@/types/odontograma.types'
import type { HistorialClinico } from '@/types/historial-clinico.types'

function esCitaAtendible(fechaHora: string): boolean {
  const fecha = new Date(fechaHora)
  const hoy = new Date()
  const f = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate())
  const h = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
  return f.getTime() <= h.getTime()
}

export default function HistorialClinicoPage() {
  const userId = useAuthStore((s) => s.userId)
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [odontologos, setOdontologos] = useState<Odontologo[]>([])
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([])
  const [citas, setCitas] = useState<Cita[]>([])
  const [pacienteId, setPacienteId] = useState('')
  const [odontologoId, setOdontologoId] = useState<string | null>(null)
  const [odontograma, setOdontograma] = useState<OdontogramaType | null>(null)
  const [historial, setHistorial] = useState<HistorialClinico[]>([])
  const [citaAtender, setCitaAtender] = useState<Cita | null>(null)
  const [editandoHistorial, setEditandoHistorial] = useState<HistorialClinico | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cargarMisPacientes = async (odId: string) => {
    const result = await getCitasByOdontologo(odId, { limit: 100 })
    setCitas(result.items.filter((c) => c.estado === 'agendada'))

    const idsUnicos = Array.from(new Set(result.items.map((c) => c.pacienteId).filter((id): id is string => !!id)))
    const encontrados = await Promise.all(
      idsUnicos.map((id) => getPaciente(id).catch(() => null)),
    )
    setPacientes(encontrados.filter((p): p is Paciente => !!p))
  }

  useEffect(() => {
    getOdontologos({ limit: 100 }).then((r) => setOdontologos(r.items))
    getTratamientos().then(setTratamientos)
    if (userId) {
      getOdontologoByUsuario(userId)
        .then((o) => {
          setOdontologoId(o.id)
          cargarMisPacientes(o.id)
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

  const nombreDoctor = (id: string) => {
    const o = odontologos.find((x) => x.id === id)
    return o ? `${o.nombre} ${o.apellido}` : '—'
  }

  const nombresTratamientos = (ids?: string[]) => {
    if (!ids || ids.length === 0) return []
    return ids.map((id) => tratamientos.find((t) => String(t.id) === id)?.nombre ?? id)
  }

  const pacienteSeleccionado = pacientes.find((p) => p.id === pacienteId) ?? null

  return (
    <Container>
      <h4 className="fw-bold mb-4">Historial clínico</h4>

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
              {citas.map((c) => {
                const atendible = esCitaAtendible(c.fechaHora)
                return (
                  <tr key={c.id}>
                    <td className="ps-4">{new Date(c.fechaHora).toLocaleString('es-EC')}</td>
                    <td>{c.motivo}</td>
                    <td className="text-end pe-4">
                      <Button
                        size="sm"
                        variant={atendible ? 'primary' : 'outline-secondary'}
                        disabled={!atendible}
                        title={atendible ? undefined : 'Todavía no es el día de esta cita'}
                        onClick={() => atenderCita(c)}
                      >
                        {atendible ? 'Atender' : 'Aún no es el día'}
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

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
            {odontologoId && pacientes.length === 0 && (
              <Form.Text className="text-muted">
                Todavía no tienes pacientes: aparecerán aquí en cuanto tengas una cita agendada con alguno.
              </Form.Text>
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

          <Card className="border-0 shadow-sm mt-4">
            <Card.Body className="p-0">
              <Card.Title className="fw-bold small text-uppercase text-muted p-4 pb-0 mb-2">
                Historial de este paciente
              </Card.Title>
              <Table hover responsive className="mb-0">
                <thead>
                  <tr>
                    <th className="ps-4">Fecha</th>
                    <th>Doctor</th>
                    <th>Motivo</th>
                    <th>Diagnóstico</th>
                    <th>Tratamientos aplicados</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {historial.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-3">
                        Este paciente todavía no tiene consultas registradas.
                      </td>
                    </tr>
                  )}
                  {historial.map((h) => (
                    <tr key={h._id}>
                      <td className="ps-4">{new Date(h.fechaConsulta).toLocaleDateString('es-EC')}</td>
                      <td>{nombreDoctor(h.odontologoId)}</td>
                      <td>{h.motivoConsulta}</td>
                      <td>{h.diagnostico}</td>
                      <td>
                        {nombresTratamientos(h.tratamientosIds).length === 0
                          ? <span className="text-muted small">—</span>
                          : nombresTratamientos(h.tratamientosIds).map((n) => (
                            <Badge key={n} bg="light" text="dark" className="border me-1 mb-1">{n}</Badge>
                          ))}
                      </td>
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
        pacienteEmail={pacienteSeleccionado?.email}
        onSaved={() => {
          if (odontologoId) cargarMisPacientes(odontologoId)
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