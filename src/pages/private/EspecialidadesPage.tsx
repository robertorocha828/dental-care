import { useEffect, useMemo, useState } from 'react'
import { Container, Card, Table, Button, Badge, Form, Row, Col } from 'react-bootstrap'
import { getEspecialidades, deleteEspecialidad } from '@/api/especialidades.api'
import type { Especialidad } from '@/types/especialidad.types'
import EspecialidadFormDialog from '@/components/private/EspecialidadFormDialog'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useToastStore } from '@/store/toast.store'

export default function EspecialidadesPage() {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([])
  const [editing, setEditing] = useState<Especialidad | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Especialidad | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [soloActivas, setSoloActivas] = useState(false)
  const showToast = useToastStore((s) => s.show)

  const load = async () => setEspecialidades(await getEspecialidades())

  useEffect(() => { load() }, [])

  const filtradas = useMemo(() => {
    return especialidades
      .filter((e) => e.nombre.toLowerCase().includes(busqueda.toLowerCase()))
      .filter((e) => !soloActivas || e.activo)
  }, [especialidades, busqueda, soloActivas])

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteEspecialidad(deleteTarget.id)
    showToast('Especialidad eliminada')
    setDeleteTarget(null)
    load()
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Especialidades</h4>
        <Button variant="primary" onClick={() => { setEditing(null); setDialogOpen(true) }}>
          Nueva especialidad
        </Button>
      </div>

      <Row className="g-2 mb-3">
        <Col xs={12} md={6}>
          <Form.Control
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </Col>
        <Col xs={12} md={6} className="d-flex align-items-center">
          <Form.Check
            type="switch"
            label="Solo activas"
            checked={soloActivas}
            onChange={(e) => setSoloActivas(e.target.checked)}
          />
        </Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead>
              <tr>
                <th className="ps-4">Nombre</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtradas.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-muted py-4">
                    No hay especialidades que coincidan con el filtro.
                  </td>
                </tr>
              )}
              {filtradas.map((e) => (
                <tr key={e.id}>
                  <td className="ps-4">{e.nombre}</td>
                  <td><Badge bg={e.activo ? 'success' : 'secondary'}>{e.activo ? 'Activa' : 'Inactiva'}</Badge></td>
                  <td className="text-end pe-4">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => { setEditing(e); setDialogOpen(true) }}
                    >
                      Editar
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => setDeleteTarget(e)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <EspecialidadFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        especialidad={editing}
        onSaved={load}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar especialidad"
        description={`¿Seguro que quieres eliminar "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
      />
    </Container>
  )
}