import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { registerPaciente } from '@/api/auth.api'
import { createPaciente } from '@/api/pacientes.api'
import { useAuthStore } from '@/store/auth.store'

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

export default function RegistroPacientePage() {
  const navigate = useNavigate()
  const setToken = useAuthStore((s) => s.setToken)
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    // 1. Crear cuenta de usuario con rol paciente
    const token = await registerPaciente({
      username: values.username,
      email:    values.email,
      password: values.password,
    })
    setToken(token)

    // 2. Crear registro del paciente
    await createPaciente({
      cedula:          values.cedula,
      nombre:          values.nombre,
      apellido:        values.apellido,
      fechaNacimiento: values.fechaNacimiento,
      genero:          values.genero,
      telefono:        values.telefono,
      email:           values.email,
    })

    navigate('/portal')
  }

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card className="shadow-sm border-0 w-100" style={{ maxWidth: 480 }}>
        <Card.Body className="p-4">
          <h4 className="fw-bold mb-1">Registro de paciente</h4>
          <p className="text-muted small mb-4">
            Crea tu cuenta para agendar citas en línea.
          </p>
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

            <Button type="submit" variant="success" className="w-100" disabled={isSubmitting}>
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