import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import { createHorario, updateHorario } from '@/api/horarios.api'
import { useToastStore } from '@/store/toast.store'
import { DIAS_SEMANA } from '@/types/horario.types'
import type { Horario } from '@/types/horario.types'

const schema = z.object({
  dia: z.enum(['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']),
  horaInicio: z.string().min(1, 'Requerido'),
  horaFin: z.string().min(1, 'Requerido'),
})
type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  horario: Horario | null
  onSaved: () => void
}

export default function HorarioFormDialog({ open, onOpenChange, horario, onSaved }: Props) {
  const showToast = useToastStore((s) => s.show)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    reset({
      dia: horario?.dia ?? 'lunes',
      horaInicio: horario?.horaInicio?.slice(0, 5) ?? '',
      horaFin: horario?.horaFin?.slice(0, 5) ?? '',
    })
  }, [horario, open, reset])

  const onSubmit = async (values: FormValues) => {
    if (horario) {
      await updateHorario(horario.id, values)
      showToast('Horario actualizado')
    } else {
      await createHorario(values)
      showToast('Horario creado')
    }
    onOpenChange(false)
    onSaved()
  }

  return (
    <Modal show={open} onHide={() => onOpenChange(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>{horario ? 'Editar horario' : 'Nuevo horario'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Día</Form.Label>
            <Form.Select {...register('dia')}>
              {DIAS_SEMANA.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hora de inicio</Form.Label>
            <Form.Control type="time" {...register('horaInicio')} isInvalid={!!errors.horaInicio} />
            {errors.horaInicio && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.horaInicio.message}</Alert>}
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Hora de fin</Form.Label>
            <Form.Control type="time" {...register('horaFin')} isInvalid={!!errors.horaFin} />
            {errors.horaFin && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.horaFin.message}</Alert>}
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
