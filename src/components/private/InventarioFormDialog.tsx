import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap'
import { createItemInventario, updateItemInventario } from '@/api/inventario.api'
import { useToastStore } from '@/store/toast.store'
import type { ItemInventario } from '@/types/inventario.types'

const schema = z.object({
  nombre:         z.string().min(1, 'Requerido').max(100),
  categoria:      z.string().optional(),
  cantidad:       z.coerce.number().int().min(0, 'Debe ser mayor o igual a 0'),
  stockMinimo:    z.coerce.number().int().min(0, 'Debe ser mayor o igual a 0'),
  precioUnitario: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  activo:         z.boolean(),
})
type FormValues = z.input<typeof schema>
type FormOutput = z.output<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: ItemInventario | null
  onSaved: () => void
}

export default function InventarioFormDialog({ open, onOpenChange, item, onSaved }: Props) {
  const showToast = useToastStore((s) => s.show)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues, any, FormOutput>({ resolver: zodResolver(schema) })

  useEffect(() => {
    reset({
      nombre:         item?.nombre ?? '',
      categoria:      item?.categoria ?? '',
      cantidad:       item?.cantidad ?? 0,
      stockMinimo:    item?.stockMinimo ?? 0,
      precioUnitario: item?.precioUnitario ?? 0,
      activo:         item?.activo ?? true,
    })
  }, [item, open, reset])

  const onSubmit = async (values: FormOutput) => {
    if (item) {
      await updateItemInventario(item.id, values)
      showToast('Ítem actualizado')
    } else {
      await createItemInventario(values)
      showToast('Ítem creado')
    }
    onOpenChange(false)
    onSaved()
  }

  return (
    <Modal show={open} onHide={() => onOpenChange(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>{item ? 'Editar ítem' : 'Nuevo ítem de inventario'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control {...register('nombre')} isInvalid={!!errors.nombre} />
            {errors.nombre && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.nombre.message}</Alert>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Control {...register('categoria')} />
          </Form.Group>
          <Row>
            <Col xs={6}>
              <Form.Group className="mb-3">
                <Form.Label>Cantidad</Form.Label>
                <Form.Control type="number" {...register('cantidad')} isInvalid={!!errors.cantidad} />
                {errors.cantidad && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.cantidad.message}</Alert>}
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group className="mb-3">
                <Form.Label>Stock mínimo</Form.Label>
                <Form.Control type="number" {...register('stockMinimo')} isInvalid={!!errors.stockMinimo} />
                {errors.stockMinimo && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.stockMinimo.message}</Alert>}
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Precio unitario</Form.Label>
            <Form.Control type="number" step="0.01" {...register('precioUnitario')} isInvalid={!!errors.precioUnitario} />
            {errors.precioUnitario && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.precioUnitario.message}</Alert>}
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