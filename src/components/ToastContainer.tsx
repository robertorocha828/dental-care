import { useEffect } from 'react'
import { Alert } from 'react-bootstrap'
import { useToastStore } from '@/store/toast.store'

export default function ToastContainer() {
  const { message, clear } = useToastStore()

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(clear, 4000)
    return () => clearTimeout(timer)
  }, [message, clear])

  if (!message) return null

  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999, minWidth: 280 }}>
      <Alert variant="danger" onClose={clear} dismissible className="mb-0 shadow">
        {message}
      </Alert>
    </div>
  )
}
