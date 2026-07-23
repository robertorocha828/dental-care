import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap'
import { createReceta, updateReceta } from '@/api/recetas.api'
import { getPacientes } from '@/api/pacientes.api'
import { getOdontologos } from '@/api/odontologos.api'
import { useToastStore } from '@/store/toast.store'
import type { Receta } from '@/types/receta.types'
import type { Paciente } from '@/types/paciente.types'
import type { Odontologo } from '@/types/odontologo.types'

const schema = z.object({
  pacienteId:   z.string().min(1, 'Selecciona un paciente'),
  odontologoId: z.string().min(1, 'Selecciona un odontólogo'),
  fechaEmision: z.string().min(1, 'Requerido'),
  observaciones: z.string().optional(),
  estado: z.string().min(1, 'Requerido'),
  medicamentos: z.array(z.object({
    medicamento: z.string().min(1, 'Requerido'),
    dosis: z.string().min(1, 'Requerido'),
    indicaciones: z.string().optional(),
  })).min(1, 'Agrega al menos un medicamento'),
})
type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  receta: Receta | null
  onSaved: () => void
}

export default function RecetaFormDialog({ open, onOpenChange, receta, onSaved }: Props) {
  const showToast = useToastStore((s) => s.show)
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [odontologos, setOdontologos] = useState<Odontologo[]>([])
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const { fields, append, remove } = useFieldArray({ control, name: 'medicamentos' })

  useEffect(() => {
    if (!open) return
    getPacientes({ limit: 100 }).then((r) => setPacientes(r.items))
    getOdontologos({ limit: 100 }).then((r) => setOdontologos(r.items))
    reset({
      pacienteId:    receta?.pacienteId ?? '',
      odontologoId:  receta?.odontologoId ?? '',
      fechaEmision:  receta?.fechaEmision?.slice(0, 10) ?? '',
      observaciones: receta?.observaciones ?? '',
      estado:        receta?.estado ?? 'activa',
      medicamentos:  receta?.medicamentos?.length ? receta.medicamentos : [{ medicamento: '', dosis: '', indicaciones: '' }],
    })
  }, [receta, open, reset])

  const onSubmit = async (values: FormValues) => {
    if (receta) {
      await updateReceta(receta._id, values)
      showToast('Receta actualizada')
    } else {
      await createReceta(values)
      showToast('Receta creada')
    }
    onOpenChange(false)
    onSaved()
  }

  return (
    <Modal show={open} onHide={() => onOpenChange(false)} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{receta ? 'Editar receta' : 'Nueva receta'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Paciente</Form.Label>
                <Form.Select {...register('pacienteId')} isInvalid={!!errors.pacienteId} defaultValue="">
                  <option value="" disabled>Selecciona un paciente</option>
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
                  ))}
                </Form.Select>
                {errors.pacienteId && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.pacienteId.message}</Alert>}
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Odontólogo</Form.Label>
                <Form.Select {...register('odontologoId')} isInvalid={!!errors.odontologoId} defaultValue="">
                  <option value="" disabled>Selecciona un odontólogo</option>
                  {odontologos.map((o) => (
                    <option key={o.id} value={o.id}>{o.nombre} {o.apellido}</option>
                  ))}
                </Form.Select>
                {errors.odontologoId && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.odontologoId.message}</Alert>}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha de emisión</Form.Label>
                <Form.Control type="date" {...register('fechaEmision')} isInvalid={!!errors.fechaEmision} />
                {errors.fechaEmision && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.fechaEmision.message}</Alert>}
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select {...register('estado')}>
                  <option value="activa">Activa</option>
                  <option value="finalizada">Finalizada</option>
                  <option value="cancelada">Cancelada</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Label className="fw-semibold">Medicamentos</Form.Label>
          {errors.medicamentos?.message && (
            <Alert variant="danger" className="py-1 px-2 small">{errors.medicamentos.message}</Alert>
          )}
          {fields.map((field, index) => (
            <Row key={field.id} className="g-2 mb-2 align-items-start">
              <Col xs={12} md={3}>
                <Form.Control
                  placeholder="Medicamento"
                  {...register(`medicamentos.${index}.medicamento`)}
                  isInvalid={!!errors.medicamentos?.[index]?.medicamento}
                />
              </Col>
              <Col xs={12} md={3}>
                <Form.Control
                  placeholder="Dosis"
                  {...register(`medicamentos.${index}.dosis`)}
                  isInvalid={!!errors.medicamentos?.[index]?.dosis}
                />
              </Col>
              <Col xs={12} md={5}>
                <Form.Control
                  placeholder="Indicaciones"
                  {...register(`medicamentos.${index}.indicaciones`)}
                />
              </Col>
              <Col xs={12} md={1}>
                <Button
                  variant="outline-danger"
                  size="sm"
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                >
                  X
                </Button>
              </Col>
            </Row>
          ))}
          <Button
            variant="outline-primary"
            size="sm"
            className="mt-1"
            onClick={() => append({ medicamento: '', dosis: '', indicaciones: '' })}
          >
            Agregar medicamento
          </Button>

          <Form.Group className="mt-3">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control as="textarea" rows={2} {...register('observaciones')} />
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
