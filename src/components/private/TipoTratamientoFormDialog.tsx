import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import { createTipoTratamiento, updateTipoTratamiento } from '@/api/tipos-tratamiento.api'
import { useToastStore } from '@/store/toast.store'
import type { TipoTratamiento } from '@/types/tipo-tratamiento.types'

const schema = z.object({
  nombre: z.string().min(1, 'Requerido').max(100),
  activo: z.boolean(),
})
type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  tipoTratamiento: TipoTratamiento | null
  onSaved: () => void
}

export default function TipoTratamientoFormDialog({ open, onOpenChange, tipoTratamiento, onSaved }: Props) {
  const showToast = useToastStore((s) => s.show)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    reset({ nombre: tipoTratamiento?.nombre ?? '', activo: tipoTratamiento?.activo ?? true })
  }, [tipoTratamiento, open, reset])

  const onSubmit = async (values: FormValues) => {
    if (tipoTratamiento) {
      await updateTipoTratamiento(tipoTratamiento.id, values)
      showToast('Tipo de tratamiento actualizado')
    } else {
      await createTipoTratamiento(values)
      showToast('Tipo de tratamiento creado')
    }
    onOpenChange(false)
    onSaved()
  }

  return (
    <Modal show={open} onHide={() => onOpenChange(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>{tipoTratamiento ? 'Editar tipo de tratamiento' : 'Nuevo tipo de tratamiento'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control {...register('nombre')} isInvalid={!!errors.nombre} />
            {errors.nombre && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.nombre.message}</Alert>}
          </Form.Group>
          <Form.Check type="switch" label="Activo" {...register('activo')} />
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