import { useEffect, useState } from 'react'
import { Container, Card, Table, Button, Badge } from 'react-bootstrap'
import { getUsers, deleteUser } from '@/api/users.api'
import type { User } from '@/types/user.types'
import UserFormDialog from '@/components/private/UserFormDialog'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useToastStore } from '@/store/toast.store'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [editing, setEditing] = useState<User | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const showToast = useToastStore((s) => s.show)

  const load = async () => {
    const result = await getUsers({ limit: 50 })
    setUsers(result.items)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteUser(deleteTarget.id)
    showToast('Usuario eliminado')
    setDeleteTarget(null)
    load()
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Usuarios</h4>
        <Button variant="primary" onClick={() => { setEditing(null); setDialogOpen(true) }}>
          Nuevo usuario
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead>
              <tr>
                <th className="ps-4">Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="ps-4">{user.username}</td>
                  <td>{user.email}</td>
                  <td><Badge bg="secondary">{user.rol}</Badge></td>
                  <td>
                    <Badge bg={user.activo ? 'success' : 'danger'}>
                      {user.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td className="text-end pe-4">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => { setEditing(user); setDialogOpen(true) }}
                    >
                      Editar
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => setDeleteTarget(user)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={editing}
        onSaved={load}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar usuario"
        description={`¿Seguro que quieres eliminar "${deleteTarget?.username}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
      />
    </Container>
  )
}