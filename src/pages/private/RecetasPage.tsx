import { useEffect, useMemo, useState } from 'react'
import { Container, Card, Table, Button, Badge, Form, Row, Col } from 'react-bootstrap'
import { getRecetas, deleteReceta } from '@/api/recetas.api'
import { getPacientes } from '@/api/pacientes.api'
import { getOdontologos } from '@/api/odontologos.api'
import type { Receta } from '@/types/receta.types'
import type { Paciente } from '@/types/paciente.types'
import type { Odontologo } from '@/types/odontologo.types'
import RecetaFormDialog from '@/components/private/RecetaFormDialog'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useToastStore } from '@/store/toast.store'

const ESTADO_VARIANT: Record<string, string> = {
  activa: 'success',
  finalizada: 'secondary',
  cancelada: 'danger',
}

export default function RecetasPage() {
  const [recetas, setRecetas] = useState<Receta[]>([])
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [odontologos, setOdontologos] = useState<Odontologo[]>([])
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

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Recetas</h4>
        <Button variant="primary" onClick={() => { setEditing(null); setDialogOpen(true) }}>
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
          <Form.Select value={odontologoFiltro} onChange={(e) => setOdontologoFiltro(e.target.value)}>
            <option value="">Todos los odontólogos</option>
            {odontologos.map((o) => (
              <option key={o.id} value={o.id}>{o.nombre} {o.apellido}</option>
            ))}
          </Form.Select>
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
