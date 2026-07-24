import { useEffect } from 'react'
import { Alert } from 'react-bootstrap'
import { useToastStore } from '@/store/toast.store'

const VARIANTE_POR_TIPO = {
  success: 'success',
  warning: 'warning',
  error: 'danger',
} as const

export default function ToastContainer() {
  const { message, type, clear } = useToastStore()

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(clear, 4000)
    return () => clearTimeout(timer)
  }, [message, clear])

  if (!message) return null

  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999, minWidth: 280 }}>
      <Alert variant={VARIANTE_POR_TIPO[type]} onClose={clear} dismissible className="mb-0 shadow">
        {message}
      </Alert>
    </div>
  )
}