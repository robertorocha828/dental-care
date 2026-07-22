import { useEffect, useState } from 'react'
import { Container, Card, Table, Button, Badge } from 'react-bootstrap'
import { getPacientes, deletePaciente } from '@/api/pacientes.api'
import type { Paciente } from '@/types/paciente.types'
import PacienteFormDialog from '@/components/private/PacienteFormDialog'
import PacienteHistorialModal from '@/components/private/PacienteHistorialModal'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useToastStore } from '@/store/toast.store'

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [editing, setEditing] = useState<Paciente | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Paciente | null>(null)
  const [historialTarget, setHistorialTarget] = useState<Paciente | null>(null)
  const showToast = useToastStore((s) => s.show)

  const load = async () => {
    const result = await getPacientes({ limit: 100 })
    setPacientes(result.items)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deletePaciente(deleteTarget.id)
    showToast('Paciente eliminado')
    setDeleteTarget(null)
    load()
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Pacientes</h4>
        <Button variant="primary" onClick={() => { setEditing(null); setDialogOpen(true) }}>
          Nuevo paciente
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead>
              <tr>
                <th className="ps-4">Nombre</th>
                <th>Cédula</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {pacientes.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    No hay pacientes registrados.
                  </td>
                </tr>
              )}
              {pacientes.map((p) => (
                <tr key={p.id}>
                  <td className="ps-4">{p.nombre} {p.apellido}</td>
                  <td>{p.cedula}</td>
                  <td>{p.telefono}</td>
                  <td>{p.email ?? '—'}</td>
                  <td>
                    <Badge bg={p.estado === 'activo' ? 'success' : 'danger'}>{p.estado}</Badge>
                  </td>
                  <td className="text-end pe-4">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => setHistorialTarget(p)}
                    >
                      Ver historial
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => { setEditing(p); setDialogOpen(true) }}
                    >
                      Editar
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => setDeleteTarget(p)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <PacienteFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        paciente={editing}
        onSaved={load}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar paciente"
        description={`¿Seguro que quieres eliminar a "${deleteTarget?.nombre} ${deleteTarget?.apellido}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
      />
      <PacienteHistorialModal
        open={!!historialTarget}
        onOpenChange={(open) => !open && setHistorialTarget(null)}
        paciente={historialTarget}
      />
    </Container>
  )
}