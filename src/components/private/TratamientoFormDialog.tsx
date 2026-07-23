import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import { createTratamiento, updateTratamiento } from '@/api/tratamientos.api'
import { getTiposTratamiento } from '@/api/tipos-tratamiento.api'
import { useToastStore } from '@/store/toast.store'
import type { Tratamiento } from '@/types/tratamiento.types'
import type { TipoTratamiento } from '@/types/tipo-tratamiento.types'

const schema = z.object({
  nombre:            z.string().min(1, 'Requerido').max(100),
  descripcion:       z.string().optional(),
  costo:             z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  tipoTratamientoId: z.string().min(1, 'Selecciona un tipo'),
  activo:            z.boolean(),
})
type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  tratamiento: Tratamiento | null
  onSaved: () => void
}

export default function TratamientoFormDialog({ open, onOpenChange, tratamiento, onSaved }: Props) {
  const showToast = useToastStore((s) => s.show)
  const [tipos, setTipos] = useState<TipoTratamiento[]>([])
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (!open) return
    getTiposTratamiento().then((data) => setTipos(data.filter((t) => t.activo)))
    reset({
      nombre:            tratamiento?.nombre ?? '',
      descripcion:       tratamiento?.descripcion ?? '',
      costo:             tratamiento?.costo ?? 0,
      tipoTratamientoId: tratamiento?.tipoTratamientoId ? String(tratamiento.tipoTratamientoId) : '',
      activo:            tratamiento?.activo ?? true,
    })
  }, [tratamiento, open, reset])

  const onSubmit = async (values: FormValues) => {
    const payload = { ...values, tipoTratamientoId: Number(values.tipoTratamientoId) }
    if (tratamiento) {
      await updateTratamiento(tratamiento.id, payload)
      showToast('Tratamiento actualizado')
    } else {
      await createTratamiento(payload)
      showToast('Tratamiento creado')
    }
    onOpenChange(false)
    onSaved()
  }

  return (
    <Modal show={open} onHide={() => onOpenChange(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>{tratamiento ? 'Editar tratamiento' : 'Nuevo tratamiento'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control {...register('nombre')} isInvalid={!!errors.nombre} />
            {errors.nombre && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.nombre.message}</Alert>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" rows={2} {...register('descripcion')} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Costo</Form.Label>
            <Form.Control type="number" step="0.01" {...register('costo')} isInvalid={!!errors.costo} />
            {errors.costo && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.costo.message}</Alert>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tipo de tratamiento</Form.Label>
            <Form.Select {...register('tipoTratamientoId')} isInvalid={!!errors.tipoTratamientoId} defaultValue="">
              <option value="" disabled>Selecciona un tipo</option>
              {tipos.map((t) => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </Form.Select>
            {errors.tipoTratamientoId && (
              <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.tipoTratamientoId.message}</Alert>
            )}
            {tipos.length === 0 && (
              <Form.Text className="text-muted">
                No hay tipos de tratamiento activos. Créalos primero en ese módulo.
              </Form.Text>
            )}
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