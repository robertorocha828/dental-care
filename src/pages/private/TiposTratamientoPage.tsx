import { useEffect, useMemo, useState } from 'react'
import { Container, Card, Table, Button, Badge, Form, Row, Col } from 'react-bootstrap'
import { getTiposTratamiento, deleteTipoTratamiento } from '@/api/tipos-tratamiento.api'
import type { TipoTratamiento } from '@/types/tipo-tratamiento.types'
import TipoTratamientoFormDialog from '@/components/private/TipoTratamientoFormDialog'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useToastStore } from '@/store/toast.store'

export default function TiposTratamientoPage() {
  const [tipos, setTipos] = useState<TipoTratamiento[]>([])
  const [editing, setEditing] = useState<TipoTratamiento | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<TipoTratamiento | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [soloActivos, setSoloActivos] = useState(false)
  const showToast = useToastStore((s) => s.show)

  const load = async () => setTipos(await getTiposTratamiento())

  useEffect(() => { load() }, [])

  const filtrados = useMemo(() => {
    return tipos
      .filter((t) => t.nombre.toLowerCase().includes(busqueda.toLowerCase()))
      .filter((t) => !soloActivos || t.activo)
  }, [tipos, busqueda, soloActivos])

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteTipoTratamiento(deleteTarget.id)
    showToast('Tipo de tratamiento eliminado')
    setDeleteTarget(null)
    load()
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Tipos de tratamiento</h4>
        <Button variant="primary" onClick={() => { setEditing(null); setDialogOpen(true) }}>
          Nuevo tipo
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
            label="Solo activos"
            checked={soloActivos}
            onChange={(e) => setSoloActivos(e.target.checked)}
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
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-muted py-4">
                    No hay tipos de tratamiento que coincidan con el filtro.
                  </td>
                </tr>
              )}
              {filtrados.map((t) => (
                <tr key={t.id}>
                  <td className="ps-4">{t.nombre}</td>
                  <td><Badge bg={t.activo ? 'success' : 'secondary'}>{t.activo ? 'Activo' : 'Inactivo'}</Badge></td>
                  <td className="text-end pe-4">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => { setEditing(t); setDialogOpen(true) }}
                    >
                      Editar
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => setDeleteTarget(t)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <TipoTratamientoFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        tipoTratamiento={editing}
        onSaved={load}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar tipo de tratamiento"
        description={`¿Seguro que quieres eliminar "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
      />
    </Container>
  )
}