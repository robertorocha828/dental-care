import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import { createOdontologo, updateOdontologo } from '@/api/odontologos.api'
import { getUsers } from '@/api/users.api'
import { getEspecialidades } from '@/api/especialidades.api'
import { useToastStore } from '@/store/toast.store'
import type { Odontologo } from '@/types/odontologo.types'
import type { User } from '@/types/user.types'
import type { Especialidad } from '@/types/especialidad.types'

const schema = z.object({
  nombre:         z.string().min(1, 'Requerido'),
  apellido:       z.string().min(1, 'Requerido'),
  cedula:         z.string().min(1, 'Requerido'),
  telefono:       z.string().min(1, 'Requerido'),
  email:          z.union([z.string().email('Email inválido'), z.literal('')]).optional(),
  especialidadId: z.string().min(1, 'Selecciona una especialidad'),
  numeroRegistro: z.string().min(1, 'Requerido'),
  userId:         z.string().optional(),
})
type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  odontologo: Odontologo | null
  onSaved: () => void
}

export default function OdontologoFormDialog({ open, onOpenChange, odontologo, onSaved }: Props) {
  const showToast = useToastStore((s) => s.show)
  const [usuariosDoctor, setUsuariosDoctor] = useState<User[]>([])
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([])
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (!open) return
    getUsers({ limit: 100 }).then((r) => setUsuariosDoctor(r.items.filter((u) => u.rol === 'doctor')))
    getEspecialidades().then((data) => setEspecialidades(data.filter((e) => e.activo)))
    reset({
      nombre:         odontologo?.nombre ?? '',
      apellido:       odontologo?.apellido ?? '',
      cedula:         odontologo?.cedula ?? '',
      telefono:       odontologo?.telefono ?? '',
      email:          odontologo?.email ?? '',
      especialidadId: odontologo?.especialidadId ? String(odontologo.especialidadId) : '',
      numeroRegistro: odontologo?.numeroRegistro ?? '',
      userId:         odontologo?.userId ?? '',
    })
  }, [odontologo, open, reset])

  const onSubmit = async (values: FormValues) => {
    const payload = {
      ...values,
      especialidadId: Number(values.especialidadId),
      userId: values.userId || undefined,
    }
    if (odontologo) {
      await updateOdontologo(odontologo.id, payload)
      showToast('Odontólogo actualizado')
    } else {
      await createOdontologo(payload)
      showToast('Odontólogo creado')
    }
    onOpenChange(false)
    onSaved()
  }

  return (
    <Modal show={open} onHide={() => onOpenChange(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>{odontologo ? 'Editar odontólogo' : 'Nuevo odontólogo'}</Modal.Title>
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
            <Form.Control {...register('cedula')} isInvalid={!!errors.cedula} />
            {errors.cedula && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.cedula.message}</Alert>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control {...register('telefono')} isInvalid={!!errors.telefono} />
            {errors.telefono && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.telefono.message}</Alert>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" {...register('email')} isInvalid={!!errors.email} />
            {errors.email && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.email.message}</Alert>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Especialidad</Form.Label>
            <Form.Select {...register('especialidadId')} isInvalid={!!errors.especialidadId} defaultValue="">
              <option value="" disabled>Selecciona una especialidad</option>
              {especialidades.map((e) => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </Form.Select>
            {errors.especialidadId && (
              <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.especialidadId.message}</Alert>
            )}
            {especialidades.length === 0 && (
              <Form.Text className="text-muted">
                No hay especialidades activas todavía. Créalas primero en el módulo de Especialidades.
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Número de registro</Form.Label>
            <Form.Control {...register('numeroRegistro')} isInvalid={!!errors.numeroRegistro} />
            {errors.numeroRegistro && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.numeroRegistro.message}</Alert>}
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Cuenta de usuario vinculada</Form.Label>
            <Form.Select {...register('userId')} defaultValue="">
              <option value="">Sin vincular</option>
              {usuariosDoctor.map((u) => (
                <option key={u.id} value={u.id}>{u.username} — {u.email}</option>
              ))}
            </Form.Select>
            {usuariosDoctor.length === 0 && (
              <Form.Text className="text-muted">
                No hay usuarios con rol "doctor" todavía. Créalo primero en el módulo de Usuarios.
              </Form.Text>
            )}
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