import { useEffect, useState } from 'react'
import { Container, Card, Table, Badge, Alert } from 'react-bootstrap'
import { useAuthStore } from '@/store/auth.store'
import { getPacienteByUsuario } from '@/api/pacientes.api'
import { getCitasByPaciente } from '@/api/citas.api'
import type { Cita } from '@/types/cita.types'

const estadoBadge: Record<Cita['estado'], string> = {
  agendada: 'primary',
  completada: 'success',
  cancelada: 'danger',
}

export default function PortalHomePage() {
  const userId = useAuthStore((s) => s.userId)
  const [citas, setCitas] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!userId) return
      try {
        const paciente = await getPacienteByUsuario(userId)
        const result = await getCitasByPaciente(paciente.id)
        setCitas(result.items)
      } catch {
        setError('No pudimos encontrar tu ficha de paciente todavía.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userId])

  return (
    <Container>
      <h4 className="fw-bold mb-4">Mis citas</h4>

      {error && <Alert variant="warning">{error}</Alert>}

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead>
              <tr>
                <th className="ps-4">Fecha y hora</th>
                <th>Motivo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {!loading && !error && citas.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-muted py-4">
                    Todavía no tienes citas agendadas.
                  </td>
                </tr>
              )}
              {citas.map((cita) => (
                <tr key={cita.id}>
                  <td className="ps-4">{new Date(cita.fechaHora).toLocaleString('es-EC')}</td>
                  <td>{cita.motivo}</td>
                  <td>
                    <Badge bg={estadoBadge[cita.estado]}>{cita.estado}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  )
}
