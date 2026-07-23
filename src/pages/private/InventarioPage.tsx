import { useEffect, useMemo, useState } from 'react'
import { Container, Card, Table, Button, Badge, Form, Row, Col } from 'react-bootstrap'
import { getInventario, deleteItemInventario } from '@/api/inventario.api'
import type { ItemInventario } from '@/types/inventario.types'
import InventarioFormDialog from '@/components/private/InventarioFormDialog'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useToastStore } from '@/store/toast.store'

export default function InventarioPage() {
  const [items, setItems] = useState<ItemInventario[]>([])
  const [editing, setEditing] = useState<ItemInventario | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ItemInventario | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('')
  const [soloStockBajo, setSoloStockBajo] = useState(false)
  const showToast = useToastStore((s) => s.show)

  const load = async () => setItems(await getInventario())

  useEffect(() => { load() }, [])

  const categorias = useMemo(() => {
    const set = new Set(items.map((i) => i.categoria).filter((c): c is string => !!c))
    return Array.from(set)
  }, [items])

  const filtrados = useMemo(() => {
    return items
      .filter((i) => i.nombre.toLowerCase().includes(busqueda.toLowerCase()))
      .filter((i) => !categoriaFiltro || i.categoria === categoriaFiltro)
      .filter((i) => !soloStockBajo || i.cantidad <= i.stockMinimo)
  }, [items, busqueda, categoriaFiltro, soloStockBajo])

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteItemInventario(deleteTarget.id)
    showToast('Ítem eliminado')
    setDeleteTarget(null)
    load()
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Inventario</h4>
        <Button variant="primary" onClick={() => { setEditing(null); setDialogOpen(true) }}>
          Nuevo ítem
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
          <Form.Select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={12} md={3} className="d-flex align-items-center">
          <Form.Check
            type="switch"
            label="Solo stock bajo"
            checked={soloStockBajo}
            onChange={(e) => setSoloStockBajo(e.target.checked)}
          />
        </Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead>
              <tr>
                <th className="ps-4">Nombre</th>
                <th>Categoría</th>
                <th>Cantidad</th>
                <th>Stock mínimo</th>
                <th>Precio unitario</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    No hay ítems que coincidan con el filtro.
                  </td>
                </tr>
              )}
              {filtrados.map((i) => (
                <tr key={i.id}>
                  <td className="ps-4">{i.nombre}</td>
                  <td>{i.categoria ?? '—'}</td>
                  <td>
                    {i.cantidad}
                    {i.cantidad <= i.stockMinimo && (
                      <Badge bg="danger" className="ms-2">Stock bajo</Badge>
                    )}
                  </td>
                  <td>{i.stockMinimo}</td>
                  <td>${i.precioUnitario.toFixed(2)}</td>
                  <td><Badge bg={i.activo ? 'success' : 'secondary'}>{i.activo ? 'Activo' : 'Inactivo'}</Badge></td>
                  <td className="text-end pe-4">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => { setEditing(i); setDialogOpen(true) }}
                    >
                      Editar
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => setDeleteTarget(i)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <InventarioFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editing}
        onSaved={load}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar ítem de inventario"
        description={`¿Seguro que quieres eliminar "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
      />
    </Container>
  )
}