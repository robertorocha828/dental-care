import { Modal, Button } from 'react-bootstrap'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  onConfirm: () => void
}

export default function ConfirmDialog({
  open, onOpenChange, title, description, confirmText = 'Eliminar', onConfirm,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Modal show={open} onHide={() => onOpenChange(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{description}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={() => onOpenChange(false)}>Cancelar</Button>
        <Button variant="danger" onClick={handleConfirm}>{confirmText}</Button>
      </Modal.Footer>
    </Modal>
  )
}