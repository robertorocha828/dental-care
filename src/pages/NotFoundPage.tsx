import { useNavigate } from 'react-router-dom'
import { Container, Button } from 'react-bootstrap'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <Container className="text-center py-5">
      <h1 className="display-1 fw-bold text-muted">404</h1>
      <p className="lead mb-4">La página que buscas no existe.</p>
      <Button variant="primary" onClick={() => navigate('/')}>Volver al inicio</Button>
    </Container>
  )
}
