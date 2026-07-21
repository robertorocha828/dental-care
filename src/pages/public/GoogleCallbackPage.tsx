import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Container, Spinner } from 'react-bootstrap'
import { useAuthStore } from '@/store/auth.store'
import { decodeToken } from '@/lib/jwt'

export default function GoogleCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const setToken = useAuthStore((s) => s.setToken)

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      navigate('/login')
      return
    }
    setToken(token)
    const payload = decodeToken(token)
    navigate(payload?.rol === 'paciente' ? '/portal' : '/dashboard')
  }, [searchParams, navigate, setToken])

  return (
    <Container className="py-5 text-center">
      <Spinner animation="border" />
      <p className="text-muted mt-3">Iniciando sesión con Google...</p>
    </Container>
  )
}