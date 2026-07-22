import { useEffect, useState } from 'react'
import { Modal, Spinner, Alert } from 'react-bootstrap'
import { getHistorialByPaciente } from '@/api/historial-clinico.api'
import type { HistorialClinico } from '@/types/historial-clinico.types'
import type { Paciente } from '@/types/paciente.types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  paciente: Paciente | null
}

export default function PacienteHistorialModal({ open, onOpenChange, paciente }: Props) {
  const [historial, setHistorial] = useState<HistorialClinico[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!open || !paciente) return
    setLoading(true)
    getHistorialByPaciente(paciente.id)
      .then((r) => setHistorial(r.items))
      .finally(() => setLoading(false))
  }, [open, paciente])

  return (
    <Modal show={open} onHide={() => onOpenChange(false)} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Historial clínico — {paciente?.nombre} {paciente?.apellido}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <div className="text-center py-4">
            <Spinner animation="border" size="sm" />
          </div>
        )}
        {!loading && historial.length === 0 && (
          <Alert variant="secondary" className="mb-0">
            Este paciente todavía no tiene consultas registradas.
          </Alert>
        )}
        {!loading && historial.map((h) => (
          <div key={h._id} className="border-bottom pb-3 mb-3">
            <div className="d-flex justify-content-between">
              <span className="fw-semibold small text-muted">
                {new Date(h.fechaConsulta).toLocaleDateString('es-EC')}
              </span>
              {h.proximaVisita && (
                <span className="small text-muted">Próxima visita: {h.proximaVisita}</span>
              )}
            </div>
            <p className="mb-1"><b>Motivo:</b> {h.motivoConsulta}</p>
            <p className="mb-1"><b>Diagnóstico:</b> {h.diagnostico}</p>
            {h.procedimientosRealizados && (
              <p className="mb-1"><b>Procedimientos:</b> {h.procedimientosRealizados}</p>
            )}
            {h.observaciones && (
              <p className="mb-0 text-muted small">{h.observaciones}</p>
            )}
          </div>
        ))}
      </Modal.Body>
    </Modal>
  )
}