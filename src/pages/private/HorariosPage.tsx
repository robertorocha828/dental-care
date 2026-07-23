import { useEffect, useMemo, useState } from 'react'
import { Container, Card, Table, Button, Form, Row, Col } from 'react-bootstrap'
import { getHorarios, deleteHorario } from '@/api/horarios.api'
import { DIAS_SEMANA } from '@/types/horario.types'
import type { Horario, DiaSemana } from '@/types/horario.types'
import HorarioFormDialog from '@/components/private/HorarioFormDialog'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useToastStore } from '@/store/toast.store'

const diaLabel = (dia: DiaSemana) => DIAS_SEMANA.find((d) => d.value === dia)?.label ?? dia

export default function HorariosPage() {
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [editing, setEditing] = useState<Horario | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Horario | null>(null)
  const [diaFiltro, setDiaFiltro] = useState('')
  const showToast = useToastStore((s) => s.show)

  const load = async () => {
    const result = await getHorarios({ limit: 100 })
    setHorarios(result.items)
  }

  useEffect(() => { load() }, [])

  const filtrados = useMemo(() => {
    return horarios.filter((h) => !diaFiltro || h.dia === diaFiltro)
  }, [horarios, diaFiltro])

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteHorario(deleteTarget.id)
    showToast('Horario eliminado')
    setDeleteTarget(null)
    load()
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Horarios de atención</h4>
        <Button variant="primary" onClick={() => { setEditing(null); setDialogOpen(true) }}>
          Nuevo horario
        </Button>
      </div>

      <Row className="g-2 mb-3">
        <Col xs={12} md={4}>
          <Form.Select value={diaFiltro} onChange={(e) => setDiaFiltro(e.target.value)}>
            <option value="">Todos los días</option>
            {DIAS_SEMANA.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead>
              <tr>
                <th className="ps-4">Día</th>
                <th>Hora inicio</th>
                <th>Hora fin</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-4">
                    No hay horarios que coincidan con el filtro.
                  </td>
                </tr>
              )}
              {filtrados.map((h) => (
                <tr key={h.id}>
                  <td className="ps-4">{diaLabel(h.dia)}</td>
                  <td>{h.horaInicio?.slice(0, 5)}</td>
                  <td>{h.horaFin?.slice(0, 5)}</td>
                  <td className="text-end pe-4">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => { setEditing(h); setDialogOpen(true) }}
                    >
                      Editar
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => setDeleteTarget(h)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <HorarioFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        horario={editing}
        onSaved={load}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar horario"
        description="¿Seguro que quieres eliminar este horario? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
      />
    </Container>
  )
}
