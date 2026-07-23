import { useEffect, useRef, useState } from 'react'
import { Container, Card, Spinner, Badge, Button, Form } from 'react-bootstrap'
import { useAuthStore } from '@/store/auth.store'
import { getUser, updateUser, uploadAvatar } from '@/api/users.api'
import { googleAuthUrl, unlinkGoogle } from '@/api/auth.api'
import { useToastStore } from '@/store/toast.store'
import type { User } from '@/types/user.types'

export default function ProfilePage() {
  const userId = useAuthStore((s) => s.userId)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [savingUsername, setSavingUsername] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const showToast = useToastStore((s) => s.show)

  const load = () => {
    if (!userId) return
    getUser(userId).then((u) => { setUser(u); setUsername(u.username) }).finally(() => setLoading(false))
  }

  useEffect(load, [userId])

  const handleUnlink = async () => {
    await unlinkGoogle()
    showToast('Cuenta de Google desvinculada')
    load()
  }

  const handleSaveUsername = async () => {
    if (!userId || !username.trim()) return
    setSavingUsername(true)
    try {
      await updateUser(userId, { username })
      showToast('Nombre de usuario actualizado')
      load()
    } finally {
      setSavingUsername(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return
    setUploadingAvatar(true)
    try {
      await uploadAvatar(userId, file)
      showToast('Foto de perfil actualizada')
      load()
    } finally {
      setUploadingAvatar(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

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
      <Card className="border-0 shadow-sm mb-3">
        <Card.Body className="p-4">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="position-relative">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl.startsWith('http') ? user.avatarUrl : `${import.meta.env.VITE_API_BASE_URL}${user.avatarUrl}`}
                  alt={user.username}
                  className="rounded-circle"
                  style={{ width: 60, height: 60, objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-4"
                  style={{ width: 60, height: 60 }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-grow-1">
              <div className="text-muted small">{user?.email}</div>
              <Button
                variant="link"
                size="sm"
                className="p-0"
                disabled={uploadingAvatar}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadingAvatar ? 'Subiendo...' : 'Cambiar foto de perfil'}
              </Button>
              <Form.Control
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="d-none"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="small text-muted">Nombre de usuario</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control value={username} onChange={(e) => setUsername(e.target.value)} />
              <Button
                variant="outline-primary"
                disabled={savingUsername || username === user?.username}
                onClick={handleSaveUsername}
              >
                Guardar
              </Button>
            </div>
          </Form.Group>

          <div className="d-flex gap-2">
            <Badge bg="primary">{user?.rol}</Badge>
            <Badge bg={user?.activo ? 'success' : 'secondary'}>
              {user?.activo ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <Card.Title className="fw-bold small text-uppercase text-muted mb-3">
            Cuenta de Google
          </Card.Title>
          {user?.googleId ? (
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-success small">✓ Vinculada</span>
              <Button variant="outline-danger" size="sm" onClick={handleUnlink}>
                Desvincular
              </Button>
            </div>
          ) : (
            <Button
              href={userId ? googleAuthUrl(userId) : undefined}
              variant="outline-dark"
              size="sm"
            >
              Vincular cuenta de Google
            </Button>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}