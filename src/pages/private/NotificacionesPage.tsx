import { useEffect, useMemo, useState } from 'react'
import { Container, Card, Table, Button, Badge, Form, Row, Col, Pagination } from 'react-bootstrap'
import { getNotificaciones, deleteNotificacion } from '@/api/notificaciones.api'
import type { Notificacion } from '@/types/notificacion.types'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useToastStore } from '@/store/toast.store'

const ESTADO_VARIANT: Record<string, string> = {
  enviado: 'success',
  fallido: 'danger',
  pendiente: 'warning',
}

export default function NotificacionesPage() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [busqueda, setBusqueda] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Notificacion | null>(null)
  const showToast = useToastStore((s) => s.show)

  const load = async () => {
    const result = await getNotificaciones({ page, limit: 20, search: busqueda || undefined })
    setNotificaciones(result.items)
    setTotalPages(result.meta.totalPages)
  }

  useEffect(() => { load() }, [page])

  const filtradas = useMemo(() => {
    return notificaciones
      .filter((n) => !tipoFiltro || n.tipo === tipoFiltro)
      .filter((n) => !estadoFiltro || n.estado === estadoFiltro)
  }, [notificaciones, tipoFiltro, estadoFiltro])

  const handleBuscar = () => {
    setPage(1)
    load()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteNotificacion(deleteTarget.id)
    showToast('Notificación eliminada')
    setDeleteTarget(null)
    load()
  }

  return (
    <Container>
      <div className="mb-4">
        <h4 className="fw-bold mb-0">Notificaciones</h4>
        <p className="text-muted small mb-0">Registro de notificaciones enviadas por el sistema.</p>
      </div>

      <Row className="g-2 mb-3">
        <Col xs={12} md={5}>
          <Form.Control
            placeholder="Buscar por destinatario o asunto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
          />
        </Col>
        <Col xs={6} md={2}>
          <Form.Select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="enviado">Enviado</option>
            <option value="fallido">Fallido</option>
            <option value="pendiente">Pendiente</option>
          </Form.Select>
        </Col>
        <Col xs={6} md={2}>
          <Form.Control
            placeholder="Filtrar por tipo"
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
          />
        </Col>
        <Col xs={12} md={3}>
          <Button variant="outline-primary" className="w-100" onClick={handleBuscar}>
            Buscar
          </Button>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead>
              <tr>
                <th className="ps-4">Destinatario</th>
                <th>Asunto</th>
                <th>Mensaje</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtradas.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    No hay notificaciones que coincidan con el filtro.
                  </td>
                </tr>
              )}
              {filtradas.map((n) => (
                <tr key={n.id}>
                  <td className="ps-4">{n.destinatario}</td>
                  <td>{n.asunto}</td>
                  <td className="text-muted small" style={{ maxWidth: 280 }}>{n.mensaje}</td>
                  <td>{n.tipo ?? '—'}</td>
                  <td><Badge bg={ESTADO_VARIANT[n.estado] ?? 'secondary'}>{n.estado}</Badge></td>
                  <td>{n.creadoEn?.slice(0, 10)}</td>
                  <td className="text-end pe-4">
                    <Button variant="outline-danger" size="sm" onClick={() => setDeleteTarget(n)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {totalPages > 1 && (
        <Pagination className="mt-3 justify-content-center">
          {Array.from({ length: totalPages }, (_, i) => (
            <Pagination.Item key={i + 1} active={page === i + 1} onClick={() => setPage(i + 1)}>
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar notificación"
        description="¿Seguro que quieres eliminar esta notificación? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
      />
    </Container>
  )
}