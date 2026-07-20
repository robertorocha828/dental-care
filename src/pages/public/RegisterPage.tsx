import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { register as registerApi } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'

const schema = z.object({
  username: z.string().min(1, 'Requerido'),
  email: z.string().min(1, 'Requerido').email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})
type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const setToken = useAuthStore((s) => s.setToken)
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    const token = await registerApi(values)
    setToken(token)
    navigate('/dashboard')
  }

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card className="shadow-sm border-0 w-100" style={{ maxWidth: 420 }}>
        <Card.Body className="p-4">
          <h4 className="fw-bold mb-4">Crear cuenta</h4>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Usuario</Form.Label>
              <Form.Control type="text" {...register('username')} isInvalid={!!errors.username} />
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
            <Button type="submit" variant="primary" className="w-100" disabled={isSubmitting}>
              {isSubmitting ? 'Registrando...' : 'Registrarme'}
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
