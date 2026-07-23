import { useEffect, useMemo, useState } from 'react'
import { Container, Card, Table, Button, Badge, Form, Row, Col } from 'react-bootstrap'
import { getTratamientos, deleteTratamiento } from '@/api/tratamientos.api'
import { getTiposTratamiento } from '@/api/tipos-tratamiento.api'
import type { Tratamiento } from '@/types/tratamiento.types'
import type { TipoTratamiento } from '@/types/tipo-tratamiento.types'
import TratamientoFormDialog from '@/components/private/TratamientoFormDialog'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useToastStore } from '@/store/toast.store'

export default function TratamientosPage() {
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([])
  const [tipos, setTipos] = useState<TipoTratamiento[]>([])
  const [editing, setEditing] = useState<Tratamiento | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Tratamiento | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('')
  const [soloActivos, setSoloActivos] = useState(false)
  const showToast = useToastStore((s) => s.show)

  const load = async () => {
    const [t, tp] = await Promise.all([getTratamientos(), getTiposTratamiento()])
    setTratamientos(t)
    setTipos(tp)
  }

  useEffect(() => { load() }, [])

  const tipoNombre = (id: number) => tipos.find((t) => t.id === id)?.nombre ?? '—'

  const filtrados = useMemo(() => {
    return tratamientos
      .filter((t) => t.nombre.toLowerCase().includes(busqueda.toLowerCase()))
      .filter((t) => !tipoFiltro || t.tipoTratamientoId === Number(tipoFiltro))
      .filter((t) => !soloActivos || t.activo)
  }, [tratamientos, busqueda, tipoFiltro, soloActivos])

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteTratamiento(deleteTarget.id)
    showToast('Tratamiento eliminado')
    setDeleteTarget(null)
    load()
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Tratamientos</h4>
        <Button variant="primary" onClick={() => { setEditing(null); setDialogOpen(true) }}>
          Nuevo tratamiento
        </Button>
      </div>

      <Row className="g-2 mb-3">
        <Col xs={12} md={5}>
          <Form.Control
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </Col>
        <Col xs={12} md={4}>
          <Form.Select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}>
            <option value="">Todos los tipos</option>
            {tipos.map((t) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={12} md={3} className="d-flex align-items-center">
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
                <th>Tipo</th>
                <th>Costo</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    No hay tratamientos que coincidan con el filtro.
                  </td>
                </tr>
              )}
              {filtrados.map((t) => (
                <tr key={t.id}>
                  <td className="ps-4">{t.nombre}</td>
                  <td>{tipoNombre(t.tipoTratamientoId)}</td>
                  <td>${t.costo.toFixed(2)}</td>
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

      <TratamientoFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        tratamiento={editing}
        onSaved={load}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar tratamiento"
        description={`¿Seguro que quieres eliminar "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
      />
    </Container>
  )
}