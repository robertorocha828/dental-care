import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import { createUser, updateUser } from '@/api/users.api'
import { getRoles } from '@/api/roles.api'
import { useToastStore } from '@/store/toast.store'
import type { User } from '@/types/user.types'
import type { Rol } from '@/types/rol.types'

const schema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.union([z.string().min(6, 'Mínimo 6 caracteres'), z.literal('')]),
  rol: z.string().min(1, 'Selecciona un rol'),
})
type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onSaved: () => void
}

export default function UserFormDialog({ open, onOpenChange, user, onSaved }: Props) {
  const [roles, setRoles] = useState<Rol[]>([])
  const showToast = useToastStore((s) => s.show)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (open) getRoles({ limit: 100 }).then((result) => setRoles(result.items))
  }, [open])

  useEffect(() => {
    reset({ username: user?.username ?? '', email: user?.email ?? '', password: '', rol: user?.rol ?? '' })
  }, [user, open, reset])

  const onSubmit = async (values: FormValues) => {
    if (user) {
      const payload = {
        username: values.username,
        email: values.email,
        rol: values.rol,
        ...(values.password && { password: values.password }),
      }
      await updateUser(user.id, payload)
      showToast('Usuario actualizado')
    } else {
      await createUser({
        username: values.username,
        email: values.email,
        password: values.password,
        rol: values.rol,
      })
      showToast('Usuario creado. Se envió un correo con sus credenciales.')
    }
    onOpenChange(false)
    onSaved()
  }

  return (
    <Modal show={open} onHide={() => onOpenChange(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>{user ? 'Editar usuario' : 'Nuevo usuario'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Usuario</Form.Label>
            <Form.Control {...register('username')} isInvalid={!!errors.username} />
            {errors.username && (
              <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.username.message}</Alert>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" {...register('email')} isInvalid={!!errors.email} />
            {errors.email && (
              <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.email.message}</Alert>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder={user ? 'Dejar en blanco para no cambiarla' : undefined}
              {...register('password')}
              isInvalid={!!errors.password}
            />
            {errors.password && (
              <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.password.message}</Alert>
            )}
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Rol</Form.Label>
            <Form.Select {...register('rol')} isInvalid={!!errors.rol} defaultValue="">
              <option value="" disabled>Selecciona un rol</option>
              {roles.map((rol) => (
                <option key={rol.id} value={rol.nombre}>{rol.nombre}</option>
              ))}
            </Form.Select>
            {errors.rol && (
              <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.rol.message}</Alert>
            )}
            {roles.length === 0 && (
              <Form.Text className="text-muted">
                No hay roles creados todavía. Crea uno desde el backend (POST /roles).
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