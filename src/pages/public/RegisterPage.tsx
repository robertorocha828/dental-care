import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { registerPaciente, googleAuthUrl } from '@/api/auth.api'
import { createPaciente } from '@/api/pacientes.api'
import { useAuthStore } from '@/store/auth.store'
import { decodeToken } from '@/lib/jwt'

const schema = z.object({
  username:        z.string().min(1, 'Requerido'),
  email:           z.string().min(1, 'Requerido').email('Email inválido'),
  password:        z.string().min(6, 'Mínimo 6 caracteres'),
  nombre:          z.string().min(1, 'Requerido'),
  apellido:        z.string().min(1, 'Requerido'),
  cedula:          z.string().min(1, 'Requerido'),
  telefono:        z.string().min(1, 'Requerido'),
  fechaNacimiento: z.string().min(1, 'Requerido'),
  genero:          z.enum(['masculino', 'femenino', 'otro']),
})
type FormValues = z.infer<typeof schema>

// Solo pacientes pueden auto-registrarse. Roles como admin/doctor/secretario
// los crea el administrador desde el módulo de Usuarios.
export default function RegisterPage() {
  const navigate = useNavigate()
  const setToken = useAuthStore((s) => s.setToken)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    setErrorMsg(null)
    try {
      const token = await registerPaciente({
        username: values.username,
        email:    values.email,
        password: values.password,
      })
      setToken(token)
      const userId = decodeToken(token)?.id

      await createPaciente({
        cedula:          values.cedula,
        nombre:          values.nombre,
        apellido:        values.apellido,
        fechaNacimiento: values.fechaNacimiento,
        genero:          values.genero,
        telefono:        values.telefono,
        email:           values.email,
        userId,
      })

      navigate('/portal')
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message ?? 'Ocurrió un error al registrarte. Intenta de nuevo.')
    }
  }

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card className="shadow-sm border-0 w-100" style={{ maxWidth: 480 }}>
        <Card.Body className="p-4">
          <h4 className="fw-bold mb-1">Crear cuenta</h4>
          <p className="text-muted small mb-4">Regístrate para agendar tus citas en línea.</p>

          <Button
            href={googleAuthUrl()}
            variant="outline-dark"
            className="w-100 d-flex align-items-center justify-content-center gap-2 mb-3"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.5H42V20.4H24v7.2h11.3C33.6 32 29.2 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.1-5.1C33.9 5.5 29.2 3.6 24 3.6 12.9 3.6 4 12.5 4 23.6s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.1z"/>
              <path fill="#FF3D00" d="m6.3 14.4 5.9 4.3C13.7 15.3 18.5 12 24 12c3.1 0 5.8 1.1 8 3l5.1-5.1C33.9 5.5 29.2 3.6 24 3.6c-7.6 0-14.2 4.3-17.7 10.8z"/>
              <path fill="#4CAF50" d="M24 43.6c5.1 0 9.7-1.9 13.2-5.1l-6.1-5.2c-2 1.4-4.6 2.3-7.1 2.3-5.2 0-9.6-3.5-11.2-8.3l-6.1 4.7C9.7 39.2 16.3 43.6 24 43.6z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20.4H24v7.2h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.1 5.2C40.9 35.6 44 30.1 44 23.6c0-1.3-.1-2.6-.4-3.1z"/>
            </svg>
            Continuar con Google
          </Button>

          <div className="d-flex align-items-center gap-2 my-3">
            <hr className="flex-grow-1" />
            <span className="text-muted small">o con tu correo</span>
            <hr className="flex-grow-1" />
          </div>

          {errorMsg && <Alert variant="danger" className="small">{errorMsg}</Alert>}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <p className="fw-semibold small text-muted mb-2">Datos de acceso</p>
            <Form.Group className="mb-3">
              <Form.Label>Usuario</Form.Label>
              <Form.Control {...register('username')} isInvalid={!!errors.username} />
              {errors.username && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.username.message}</Alert>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" {...register('email')} isInvalid={!!errors.email} />
              {errors.email && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.email.message}</Alert>}
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" {...register('password')} isInvalid={!!errors.password} />
              {errors.password && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.password.message}</Alert>}
            </Form.Group>

            <p className="fw-semibold small text-muted mb-2">Datos personales</p>
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
              {isSubmitting ? 'Registrando...' : 'Crear cuenta'}
            </Button>
          </Form>

          <p className="text-center text-muted mt-3 small">
            ¿Ya tienes cuenta? <Link to="/login">Ingresar</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  )
}