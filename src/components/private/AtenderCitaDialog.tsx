import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import { createHistorialClinico } from '@/api/historial-clinico.api'
import { updateCita } from '@/api/citas.api'
import { useToastStore } from '@/store/toast.store'
import type { Cita } from '@/types/cita.types'

const schema = z.object({
  diagnostico: z.string().min(1, 'Requerido'),
  procedimientosRealizados: z.string().optional(),
  proximaVisita: z.string().optional(),
  observaciones: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  cita: Cita | null
  odontologoId: string
  onSaved: () => void
}

export default function AtenderCitaDialog({ open, onOpenChange, cita, odontologoId, onSaved }: Props) {
  const showToast = useToastStore((s) => s.show)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    if (!cita?.pacienteId) return

    await createHistorialClinico({
      pacienteId: cita.pacienteId,
      odontologoId,
      citaId: cita.id,
      fechaConsulta: new Date().toISOString(),
      motivoConsulta: cita.motivo,
      ...values,
    })
    await updateCita(cita.id, { estado: 'completada' })

    showToast('Consulta guardada y cita marcada como completada')
    reset()
    onOpenChange(false)
    onSaved()
  }

  return (
    <Modal show={open} onHide={() => onOpenChange(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Atender cita — {cita?.motivo}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Diagnóstico</Form.Label>
            <Form.Control as="textarea" rows={2} {...register('diagnostico')} isInvalid={!!errors.diagnostico} />
            {errors.diagnostico && (
              <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.diagnostico.message}</Alert>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Procedimientos realizados</Form.Label>
            <Form.Control as="textarea" rows={2} {...register('procedimientosRealizados')} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Próxima visita</Form.Label>
            <Form.Control type="date" {...register('proximaVisita')} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control as="textarea" rows={2} {...register('observaciones')} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar y completar cita'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}