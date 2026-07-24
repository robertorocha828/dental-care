import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { login as loginApi, googleAuthUrl } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { useToastStore } from '@/store/toast.store'
import { decodeToken } from '@/lib/jwt'

const schema = z.object({
  email: z.string().min(1, 'Requerido'),
  password: z.string().min(1, 'Requerido'),
})
type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const setToken = useAuthStore((s) => s.setToken)
  const showToast = useToastStore((s) => s.show)
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    try {
      const token = await loginApi({ email: values.email, password: values.password })
      setToken(token)

      const payload = decodeToken(token)
      if (payload?.rol === 'paciente') {
        navigate('/portal')
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? 'Credenciales inválidas', 'error')
    }
  }

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card className="shadow-sm border-0 w-100" style={{ maxWidth: 420 }}>
        <Card.Body className="p-4">
          <h4 className="fw-bold mb-4">Iniciar sesión</h4>

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
              onClick={() => navigate('/register')}
            >
              Regístrate como paciente
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}