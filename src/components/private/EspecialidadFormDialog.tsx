import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import { createEspecialidad, updateEspecialidad } from '@/api/especialidades.api'
import { useToastStore } from '@/store/toast.store'
import type { Especialidad } from '@/types/especialidad.types'

const schema = z.object({
  nombre: z.string().min(1, 'Requerido'),
  activo: z.boolean(),
})
type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  especialidad: Especialidad | null
  onSaved: () => void
}

export default function EspecialidadFormDialog({ open, onOpenChange, especialidad, onSaved }: Props) {
  const showToast = useToastStore((s) => s.show)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    reset({ nombre: especialidad?.nombre ?? '', activo: especialidad?.activo ?? true })
  }, [especialidad, open, reset])

  const onSubmit = async (values: FormValues) => {
    if (especialidad) {
      await updateEspecialidad(especialidad.id, values)
      showToast('Especialidad actualizada')
    } else {
      await createEspecialidad(values)
      showToast('Especialidad creada')
    }
    onOpenChange(false)
    onSaved()
  }

  return (
    <Modal show={open} onHide={() => onOpenChange(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>{especialidad ? 'Editar especialidad' : 'Nueva especialidad'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control {...register('nombre')} isInvalid={!!errors.nombre} />
            {errors.nombre && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.nombre.message}</Alert>}
          </Form.Group>
          <Form.Check type="switch" label="Activa" {...register('activo')} />
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