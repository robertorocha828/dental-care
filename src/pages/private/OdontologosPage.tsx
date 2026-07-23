import { useEffect, useState } from 'react'
import { Container, Card, Table, Button, Badge } from 'react-bootstrap'
import { getOdontologos, deleteOdontologo } from '@/api/odontologos.api'
import type { Odontologo } from '@/types/odontologo.types'
import OdontologoFormDialog from '@/components/private/OdontologoFormDialog'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useToastStore } from '@/store/toast.store'

export default function OdontologosPage() {
  const [odontologos, setOdontologos] = useState<Odontologo[]>([])
  const [editing, setEditing] = useState<Odontologo | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Odontologo | null>(null)
  const showToast = useToastStore((s) => s.show)

  const load = async () => {
    const result = await getOdontologos({ limit: 100 })
    setOdontologos(result.items)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteOdontologo(deleteTarget.id)
    showToast('Odontólogo eliminado')
    setDeleteTarget(null)
    load()
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Odontólogos</h4>
        <Button variant="primary" onClick={() => { setEditing(null); setDialogOpen(true) }}>
          Nuevo odontólogo
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead>
              <tr>
                <th className="ps-4">Nombre</th>
                <th>Especialidad</th>
                <th>Registro</th>
                <th>Vinculado</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {odontologos.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    No hay odontólogos registrados.
                  </td>
                </tr>
              )}
              {odontologos.map((o) => (
                <tr key={o.id}>
                  <td className="ps-4">{o.nombre} {o.apellido}</td>
                  <td>{o.especialidadRel?.nombre ?? <span className="text-muted">Sin asignar</span>}</td>
                  <td>{o.numeroRegistro}</td>
                  <td>
                    <Badge bg={o.userId ? 'success' : 'secondary'}>
                      {o.userId ? 'Sí' : 'No'}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={o.estado === 'activo' ? 'success' : 'danger'}>{o.estado}</Badge>
                  </td>
                  <td className="text-end pe-4">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => { setEditing(o); setDialogOpen(true) }}
                    >
                      Editar
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => setDeleteTarget(o)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <OdontologoFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        odontologo={editing}
        onSaved={load}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar odontólogo"
        description={`¿Seguro que quieres eliminar a "${deleteTarget?.nombre} ${deleteTarget?.apellido}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
      />
    </Container>
  )
}