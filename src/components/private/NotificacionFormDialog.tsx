import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import { createNotificacion, updateNotificacion } from '@/api/notificaciones.api'
import { useToastStore } from '@/store/toast.store'
import type { Notificacion } from '@/types/notificacion.types'

const schema = z.object({
  _isCreate: z.boolean(),
  destinatario: z.string().optional(),
  asunto: z.string().optional(),
  mensaje: z.string().optional(),
  estado: z.string().min(1, 'Requerido'),
  tipo: z.string().optional(),
}).superRefine((data, ctx) => {
  if (!data._isCreate) return
  if (!data.destinatario) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Requerido', path: ['destinatario'] })
  if (!data.asunto) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Requerido', path: ['asunto'] })
  if (!data.mensaje) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Requerido', path: ['mensaje'] })
})
type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  notificacion: Notificacion | null
  onSaved: () => void
}

export default function NotificacionFormDialog({ open, onOpenChange, notificacion, onSaved }: Props) {
  const showToast = useToastStore((s) => s.show)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    reset({
      _isCreate: !notificacion,
      destinatario: notificacion?.destinatario ?? '',
      asunto: notificacion?.asunto ?? '',
      mensaje: notificacion?.mensaje ?? '',
      estado: notificacion?.estado ?? 'enviado',
      tipo: notificacion?.tipo ?? '',
    })
  }, [notificacion, open, reset])

  const onSubmit = async (values: FormValues) => {
    if (notificacion) {
      await updateNotificacion(notificacion.id, { estado: values.estado, tipo: values.tipo })
      showToast('Notificación actualizada')
    } else {
      await createNotificacion({
        destinatario: values.destinatario!,
        asunto: values.asunto!,
        mensaje: values.mensaje!,
        estado: values.estado,
        tipo: values.tipo,
      })
      showToast('Notificación creada')
    }
    onOpenChange(false)
    onSaved()
  }
  return (
    <Modal show={open} onHide={() => onOpenChange(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>{notificacion ? 'Editar notificación' : 'Nueva notificación'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          {!notificacion && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Destinatario</Form.Label>
                <Form.Control {...register('destinatario')} isInvalid={!!errors.destinatario} />
                {errors.destinatario && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.destinatario.message}</Alert>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Asunto</Form.Label>
                <Form.Control {...register('asunto')} isInvalid={!!errors.asunto} />
                {errors.asunto && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.asunto.message}</Alert>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mensaje</Form.Label>
                <Form.Control as="textarea" rows={3} {...register('mensaje')} isInvalid={!!errors.mensaje} />
                {errors.mensaje && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.mensaje.message}</Alert>}
              </Form.Group>
            </>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Select {...register('estado')}>
              <option value="enviado">Enviado</option>
              <option value="fallido">Fallido</option>
              <option value="pendiente">Pendiente</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Tipo</Form.Label>
            <Form.Control {...register('tipo')} placeholder="recordatorio, confirmacion, etc." />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}