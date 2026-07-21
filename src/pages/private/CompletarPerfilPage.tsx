import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { getUser } from '@/api/users.api'
import { createPaciente } from '@/api/pacientes.api'
import { useAuthStore } from '@/store/auth.store'
import type { User } from '@/types/user.types'

const schema = z.object({
  nombre:          z.string().min(1, 'Requerido'),
  apellido:        z.string().min(1, 'Requerido'),
  cedula:          z.string().min(1, 'Requerido'),
  telefono:        z.string().min(1, 'Requerido'),
  fechaNacimiento: z.string().min(1, 'Requerido'),
  genero:          z.enum(['masculino', 'femenino', 'otro']),
})
type FormValues = z.infer<typeof schema>

// Los usuarios que entran por Google no traen cédula/teléfono/fecha de
// nacimiento, así que antes de usar el portal completan estos datos aquí.
export default function CompletarPerfilPage() {
  const navigate = useNavigate()
  const userId = useAuthStore((s) => s.userId)
  const [user, setUser] = useState<User | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (!userId) return
    getUser(userId).then((u) => {
      setUser(u)
      const [nombre, ...resto] = u.username.split(' ')
      reset({ nombre, apellido: resto.join(' ') })
    })
  }, [userId, reset])

  const onSubmit = async (values: FormValues) => {
    if (!userId || !user) return
    setErrorMsg(null)
    try {
      await createPaciente({ ...values, email: user.email, userId })
      navigate('/portal')
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message ?? 'No se pudo guardar tu perfil. Intenta de nuevo.')
    }
  }

  return (
    <Container className="py-4 d-flex justify-content-center">
      <Card className="shadow-sm border-0 w-100" style={{ maxWidth: 480 }}>
        <Card.Body className="p-4">
          <h4 className="fw-bold mb-1">Completa tu perfil</h4>
          <p className="text-muted small mb-4">
            Nos faltan algunos datos para poder agendar tus citas.
          </p>

          {errorMsg && <Alert variant="danger" className="small">{errorMsg}</Alert>}

          <Form onSubmit={handleSubmit(onSubmit)}>
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
              <Form.Label>Fecha de nacimiento</Form.Label>
              <Form.Control type="date" {...register('fechaNacimiento')} isInvalid={!!errors.fechaNacimiento} />
              {errors.fechaNacimiento && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.fechaNacimiento.message}</Alert>}
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Género</Form.Label>
              <Form.Select {...register('genero')}>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar y continuar'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}