import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import { updateHistorialClinico } from '@/api/historial-clinico.api'
import { useToastStore } from '@/store/toast.store'
import type { HistorialClinico } from '@/types/historial-clinico.types'

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
  historial: HistorialClinico | null
  onSaved: () => void
}

// Para corregir una entrada de historial ya guardada (errores de tipeo,
// diagnóstico incompleto, etc.) — no toca el estado de la cita.
export default function EditarHistorialDialog({ open, onOpenChange, historial, onSaved }: Props) {
  const showToast = useToastStore((s) => s.show)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    reset({
      diagnostico: historial?.diagnostico ?? '',
      procedimientosRealizados: historial?.procedimientosRealizados ?? '',
      proximaVisita: historial?.proximaVisita ?? '',
      observaciones: historial?.observaciones ?? '',
    })
  }, [historial, open, reset])

  const onSubmit = async (values: FormValues) => {
    if (!historial?._id) return
    await updateHistorialClinico(historial._id, values)
    showToast('Historial clínico actualizado')
    onOpenChange(false)
    onSaved()
  }

  return (
    <Modal show={open} onHide={() => onOpenChange(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar consulta — {historial?.motivoConsulta}</Modal.Title>
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
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}