import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import { createPaciente, updatePaciente } from '@/api/pacientes.api'
import { useToastStore } from '@/store/toast.store'
import { esCedulaEcuatorianaValida, esCelularEcuatorianoValido, esFechaNacimientoValida } from '@/lib/validaciones-ec'
import type { Paciente } from '@/types/paciente.types'

const schema = z.object({
  cedula: z.string().min(1, 'Requerido').refine(esCedulaEcuatorianaValida, 'Cédula ecuatoriana no válida'),
  nombre: z.string().min(1, 'Requerido'),
  apellido: z.string().min(1, 'Requerido'),
  telefono: z.string().min(1, 'Requerido').refine(esCelularEcuatorianoValido, 'Debe tener 10 dígitos y empezar con 0'),
  email: z.union([z.string().email('Email inválido'), z.literal('')]).optional(),
  fechaNacimiento: z.string().min(1, 'Requerido').refine(esFechaNacimientoValida, 'Fecha de nacimiento no válida'),
  genero: z.enum(['masculino', 'femenino', 'otro']),
})
type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  paciente: Paciente | null
  onSaved: () => void
}

export default function PacienteFormDialog({ open, onOpenChange, paciente, onSaved }: Props) {
  const showToast = useToastStore((s) => s.show)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    reset({
      cedula:          paciente?.cedula ?? '',
      nombre:          paciente?.nombre ?? '',
      apellido:        paciente?.apellido ?? '',
      telefono:        paciente?.telefono ?? '',
      email:           paciente?.email ?? '',
      fechaNacimiento: paciente?.fechaNacimiento?.slice(0, 10) ?? '',
      genero:          paciente?.genero ?? 'masculino',
    })
  }, [paciente, open, reset])

  const onSubmit = async (values: FormValues) => {
    if (paciente) {
      await updatePaciente(paciente.id, values)
      showToast('Paciente actualizado')
    } else {
      await createPaciente(values)
      showToast('Paciente creado')
    }
    onOpenChange(false)
    onSaved()
  }

  return (
    <Modal show={open} onHide={() => onOpenChange(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>{paciente ? 'Editar paciente' : 'Nuevo paciente'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control {...register('nombre')} isInvalid={!!errors.nombre} />
            {errors.nombre && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.nombre.message}</Alert>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control {...register('apellido')} isInvalid={!!errors.apellido} />
            {errors.apellido && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.apellido.message}</Alert>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Cédula</Form.Label>
            <Form.Control {...register('cedula')} maxLength={10} isInvalid={!!errors.cedula} />
            {errors.cedula && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.cedula.message}</Alert>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control {...register('telefono')} maxLength={10} placeholder="09XXXXXXXX" isInvalid={!!errors.telefono} />
            {errors.telefono && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.telefono.message}</Alert>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" {...register('email')} isInvalid={!!errors.email} />
            {errors.email && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.email.message}</Alert>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de nacimiento</Form.Label>
            <Form.Control type="date" max={new Date().toISOString().slice(0, 10)} {...register('fechaNacimiento')} isInvalid={!!errors.fechaNacimiento} />
            {errors.fechaNacimiento && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.fechaNacimiento.message}</Alert>}
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Género</Form.Label>
            <Form.Select {...register('genero')}>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </Form.Select>
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