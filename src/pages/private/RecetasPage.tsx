import { useEffect, useMemo, useState } from 'react'
import { Container, Card, Table, Button, Badge, Form, Row, Col } from 'react-bootstrap'
import { getRecetas, deleteReceta } from '@/api/recetas.api'
import { getPacientes } from '@/api/pacientes.api'
import { getOdontologos, getOdontologoByUsuario } from '@/api/odontologos.api'
import { useAuthStore } from '@/store/auth.store'
import type { Receta } from '@/types/receta.types'
import type { Paciente } from '@/types/paciente.types'
import type { Odontologo } from '@/types/odontologo.types'
import RecetaFormDialog from '@/components/private/RecetaFormDialog'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useToastStore } from '@/store/toast.store'
import { generarRecetaPdf } from '@/lib/receta-pdf'

const ESTADO_VARIANT: Record<string, string> = {
  activa: 'success',
  finalizada: 'secondary',
  cancelada: 'danger',
}

export default function RecetasPage() {
  const rol = useAuthStore((s) => s.rol)
  const userId = useAuthStore((s) => s.userId)
  const esDoctor = rol === 'doctor'

  const [recetas, setRecetas] = useState<Receta[]>([])
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [odontologos, setOdontologos] = useState<Odontologo[]>([])
  const [miOdontologoId, setMiOdontologoId] = useState<string | null>(null)
  const [editing, setEditing] = useState<Receta | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Receta | null>(null)
  const [pacienteFiltro, setPacienteFiltro] = useState('')
  const [odontologoFiltro, setOdontologoFiltro] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState('')
  const showToast = useToastStore((s) => s.show)

  const load = async () => {
    const [r, p, o] = await Promise.all([
      getRecetas(),
      getPacientes({ limit: 100 }),
      getOdontologos({ limit: 100 }),
    ])
    setRecetas(r)
    setPacientes(p.items)
    setOdontologos(o.items)
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    if (!esDoctor || !userId) return
    getOdontologoByUsuario(userId).then((o) => {
      setMiOdontologoId(o.id)
      setOdontologoFiltro(o.id)
    }).catch(() => {})
  }, [esDoctor, userId])

  const nombrePaciente = (id: string) => {
    const p = pacientes.find((x) => x.id === id)
    return p ? `${p.nombre} ${p.apellido}` : '—'
  }
  const nombreOdontologo = (id: string) => {
    const o = odontologos.find((x) => x.id === id)
    return o ? `${o.nombre} ${o.apellido}` : '—'
  }

  const filtradas = useMemo(() => {
    return recetas
      .filter((r) => !pacienteFiltro || r.pacienteId === pacienteFiltro)
      .filter((r) => !odontologoFiltro || r.odontologoId === odontologoFiltro)
      .filter((r) => !estadoFiltro || r.estado === estadoFiltro)
  }, [recetas, pacienteFiltro, odontologoFiltro, estadoFiltro])

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteReceta(deleteTarget._id)
    showToast('Receta eliminada')
    setDeleteTarget(null)
    load()
  }

  const handleDescargarPdf = (receta: Receta) => {
    const paciente = pacientes.find((p) => p.id === receta.pacienteId)
    const odontologo = odontologos.find((o) => o.id === receta.odontologoId)
    generarRecetaPdf({
      receta,
      pacienteNombre: paciente ? `${paciente.nombre} ${paciente.apellido}` : 'Paciente',
      pacienteCedula: paciente?.cedula,
      odontologoNombre: odontologo ? `${odontologo.nombre} ${odontologo.apellido}` : 'Odontólogo',
      odontologoRegistro: odontologo?.numeroRegistro,
      odontologoEspecialidad: odontologo?.especialidadRel?.nombre,
    })
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">{esDoctor ? 'Mis recetas' : 'Recetas'}</h4>
        <Button
          variant="primary"
          onClick={() => { setEditing(null); setDialogOpen(true) }}
        >
          Nueva receta
        </Button>
      </div>

      <Row className="g-2 mb-3">
        <Col xs={12} md={4}>
          <Form.Select value={pacienteFiltro} onChange={(e) => setPacienteFiltro(e.target.value)}>
            <option value="">Todos los pacientes</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={12} md={4}>
          {esDoctor ? (
            <Form.Control value={nombreOdontologo(miOdontologoId ?? '')} disabled readOnly />
          ) : (
            <Form.Select value={odontologoFiltro} onChange={(e) => setOdontologoFiltro(e.target.value)}>
              <option value="">Todos los odontólogos</option>
              {odontologos.map((o) => (
                <option key={o.id} value={o.id}>{o.nombre} {o.apellido}</option>
              ))}
            </Form.Select>
          )}
        </Col>
        <Col xs={12} md={4}>
          <Form.Select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="activa">Activa</option>
            <option value="finalizada">Finalizada</option>
            <option value="cancelada">Cancelada</option>
          </Form.Select>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead>
              <tr>
                <th className="ps-4">Paciente</th>
                <th>Odontólogo</th>
                <th>Fecha</th>
                <th>Medicamentos</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtradas.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    No hay recetas que coincidan con el filtro.
                  </td>
                </tr>
              )}
              {filtradas.map((r) => (
                <tr key={r._id}>
                  <td className="ps-4">{nombrePaciente(r.pacienteId)}</td>
                  <td>{nombreOdontologo(r.odontologoId)}</td>
                  <td>{r.fechaEmision?.slice(0, 10)}</td>
                  <td>{r.medicamentos.map((m) => m.medicamento).join(', ')}</td>
                  <td><Badge bg={ESTADO_VARIANT[r.estado] ?? 'secondary'}>{r.estado}</Badge></td>
                  <td className="text-end pe-4">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleDescargarPdf(r)}
                    >
                      PDF
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => { setEditing(r); setDialogOpen(true) }}
                    >
                      Editar
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => setDeleteTarget(r)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <RecetaFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        receta={editing}
        onSaved={load}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar receta"
        description="¿Seguro que quieres eliminar esta receta? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
      />
    </Container>
  )
}