import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import { createOdontologo, updateOdontologo, getUsuariosDisponiblesOdontologo } from '@/api/odontologos.api'
import { getEspecialidades } from '@/api/especialidades.api'
import { useToastStore } from '@/store/toast.store'
import { esCedulaEcuatorianaValida, esCelularEcuatorianoValido } from '@/lib/validaciones-ec'
import type { Odontologo } from '@/types/odontologo.types'
import type { User } from '@/types/user.types'
import type { Especialidad } from '@/types/especialidad.types'

const schema = z.object({
  _isCreate: z.boolean(),
  userId: z.string().optional(),
  nombre: z.string().min(1, 'Requerido'),
  apellido: z.string().min(1, 'Requerido'),
  cedula: z.string().min(1, 'Requerido').refine(esCedulaEcuatorianaValida, 'Cédula ecuatoriana no válida'),
  telefono: z.string().min(1, 'Requerido').refine(esCelularEcuatorianoValido, 'Debe tener 10 dígitos y empezar con 0'),
  email: z.union([z.string().email('Email inválido'), z.literal('')]).optional(),
  especialidadId: z.string().min(1, 'Selecciona una especialidad'),
}).superRefine((data, ctx) => {
  if (data._isCreate && !data.userId) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Selecciona una cuenta de usuario', path: ['userId'] })
  }
})
type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  odontologo: Odontologo | null
  onSaved: () => void
}

function splitUsername(username: string) {
  const partes = username.trim().split(/\s+/)
  return { nombre: partes[0] ?? '', apellido: partes.slice(1).join(' ') }
}

export default function OdontologoFormDialog({ open, onOpenChange, odontologo, onSaved }: Props) {
  const showToast = useToastStore((s) => s.show)
  const [usuariosDisponibles, setUsuariosDisponibles] = useState<User[]>([])
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([])
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const userIdSeleccionado = watch('userId')

  useEffect(() => {
    if (!open) return
    getEspecialidades().then((data) => setEspecialidades(data.filter((e) => e.activo)))
    if (!odontologo) {
      getUsuariosDisponiblesOdontologo().then(setUsuariosDisponibles)
    }
    reset({
      _isCreate:      !odontologo,
      userId:         odontologo?.userId ?? '',
      nombre:         odontologo?.nombre ?? '',
      apellido:       odontologo?.apellido ?? '',
      cedula:         odontologo?.cedula ?? '',
      telefono:       odontologo?.telefono ?? '',
      email:          odontologo?.email ?? '',
      especialidadId: odontologo?.especialidadId ? String(odontologo.especialidadId) : '',
    })
  }, [odontologo, open, reset])

  const handleSeleccionarUsuario = (userId: string) => {
    setValue('userId', userId)
    const usuario = usuariosDisponibles.find((u) => u.id === userId)
    if (usuario) {
      const { nombre, apellido } = splitUsername(usuario.username)
      setValue('nombre', nombre)
      setValue('apellido', apellido)
      setValue('email', usuario.email)
    }
  }

  const onSubmit = async (values: FormValues) => {
    const payload = {
      nombre: values.nombre,
      apellido: values.apellido,
      cedula: values.cedula,
      telefono: values.telefono,
      email: values.email || undefined,
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

  const usuarioElegido = usuariosDisponibles.find((u) => u.id === userIdSeleccionado)

  return (
    <Modal show={open} onHide={() => onOpenChange(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>{odontologo ? 'Editar odontólogo' : 'Nuevo odontólogo'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          {!odontologo && (
            <Form.Group className="mb-3">
              <Form.Label>Cuenta de usuario</Form.Label>
              <Form.Select
                value={userIdSeleccionado ?? ''}
                onChange={(e) => handleSeleccionarUsuario(e.target.value)}
                isInvalid={!!errors.userId}
              >
                <option value="" disabled>Selecciona una cuenta con rol "doctor"</option>
                {usuariosDisponibles.map((u) => (
                  <option key={u.id} value={u.id}>{u.username} — {u.email}</option>
                ))}
              </Form.Select>
              {errors.userId && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.userId.message}</Alert>}
              {usuariosDisponibles.length === 0 && (
                <Form.Text className="text-muted">
                  No hay usuarios con rol "doctor" disponibles. Créalo primero en el módulo de Usuarios
                  (todos los existentes ya tienen un odontólogo vinculado).
                </Form.Text>
              )}
            </Form.Group>
          )}

          {odontologo && (
            <Form.Group className="mb-3">
              <Form.Label>Cuenta de usuario vinculada</Form.Label>
              <Form.Control value={odontologo.userId ? 'Cuenta vinculada' : 'Sin vincular'} disabled readOnly />
            </Form.Group>
          )}

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
            <Form.Control
              type="email"
              {...register('email')}
              isInvalid={!!errors.email}
              readOnly={!odontologo && !!usuarioElegido}
            />
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
          <Form.Group className="mb-2">
            <Form.Label>Número de registro</Form.Label>
            <Form.Control
              value={odontologo?.numeroRegistro ?? 'Se generará automáticamente'}
              disabled
              readOnly
            />
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