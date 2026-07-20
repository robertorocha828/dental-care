import { useEffect, useState } from 'react'
import { Container, Card, Spinner, Badge } from 'react-bootstrap'
import { useAuthStore } from '@/store/auth.store'
import { getUser } from '@/api/users.api'
import type { User } from '@/types/user.types'

export default function ProfilePage() {
  const userId = useAuthStore((s) => s.userId)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    getUser(userId).then(setUser).finally(() => setLoading(false))
  }, [userId])

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    )
  }

  return (
    <Container style={{ maxWidth: 500 }}>
      <h4 className="fw-bold mb-4">Mi perfil</h4>
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-4"
              style={{ width: 60, height: 60 }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="fw-bold">{user?.username}</div>
              <div className="text-muted small">{user?.email}</div>
            </div>
          </div>
          <div className="d-flex gap-2">
            <Badge bg="primary">{user?.rol}</Badge>
            <Badge bg={user?.activo ? 'success' : 'secondary'}>
              {user?.activo ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}
