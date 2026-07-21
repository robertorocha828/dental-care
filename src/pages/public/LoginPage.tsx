import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { login as loginApi } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { decodeToken } from '@/lib/jwt'

const schema = z.object({
  email: z.string().min(1, 'Requerido'),
  password: z.string().min(1, 'Requerido'),
})
type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const setToken = useAuthStore((s) => s.setToken)
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    const token = await loginApi({ email: values.email, password: values.password })
    setToken(token)

    const payload = decodeToken(token)
    if (payload?.rol === 'paciente') {
      navigate('/portal')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card className="shadow-sm border-0 w-100" style={{ maxWidth: 420 }}>
        <Card.Body className="p-4">
          <h4 className="fw-bold mb-4">Iniciar sesión</h4>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Email o usuario</Form.Label>
              <Form.Control type="text" {...register('email')} isInvalid={!!errors.email} />
              {errors.email && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.email.message}</Alert>}
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" {...register('password')} isInvalid={!!errors.password} />
              {errors.password && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.password.message}</Alert>}
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100" disabled={isSubmitting}>
              {isSubmitting ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </Form>

          <hr className="my-4" />

          <div className="text-center">
            <p className="text-muted small mb-2">¿Eres paciente?</p>
            <Button
              variant="outline-success"
              className="w-100"
              onClick={() => navigate('/registro-paciente')}
            >
              Regístrate como paciente
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}