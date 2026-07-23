import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import { createHistorialClinico } from '@/api/historial-clinico.api'
import { updateCita, agendarCita } from '@/api/citas.api'
import { getTratamientos } from '@/api/tratamientos.api'
import { useToastStore } from '@/store/toast.store'
import type { Cita } from '@/types/cita.types'
import type { Tratamiento } from '@/types/tratamiento.types'

const schema = z.object({
  diagnostico: z.string().min(1, 'Requerido'),
  tratamientosIds: z.array(z.string()).optional(),
  procedimientosRealizados: z.string().optional(),
  proximaVisita: z.string().optional(),
  proximaVisitaHora: z.string().optional(),
  observaciones: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.proximaVisita && !data.proximaVisitaHora) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Selecciona la hora de la próxima visita', path: ['proximaVisitaHora'] })
  }
})
type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  cita: Cita | null
  odontologoId: string
  pacienteEmail?: string | null
  onSaved: () => void
}

export default function AtenderCitaDialog({ open, onOpenChange, cita, odontologoId, pacienteEmail, onSaved }: Props) {
  const showToast = useToastStore((s) => s.show)
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([])
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (!open) return
    getTratamientos().then((data) => setTratamientos(data.filter((t) => t.activo)))
    reset({
      diagnostico: '',
      tratamientosIds: [],
      procedimientosRealizados: '',
      proximaVisita: '',
      proximaVisitaHora: '',
      observaciones: '',
    })
  }, [cita, open, reset])

  const onSubmit = async (values: FormValues) => {
    if (!cita?.pacienteId) return

    await createHistorialClinico({
      pacienteId: cita.pacienteId,
      odontologoId,
      citaId: cita.id,
      fechaConsulta: new Date().toISOString(),
      motivoConsulta: cita.motivo,
      diagnostico: values.diagnostico,
      procedimientosRealizados: values.procedimientosRealizados,
      tratamientosIds: values.tratamientosIds,
      proximaVisita: values.proximaVisita,
      observaciones: values.observaciones,
    })
    await updateCita(cita.id, { estado: 'completada' })

    if (values.proximaVisita && values.proximaVisitaHora) {
      try {
        await agendarCita({
          pacienteId: cita.pacienteId,
          odontologoId,
          emailPaciente: pacienteEmail ?? '',
          fechaHora: `${values.proximaVisita}T${values.proximaVisitaHora}:00`,
          motivo: 'Próxima visita de seguimiento',
        })
        showToast('Consulta guardada. Próxima cita agendada y notificada por correo')
      } catch (err: any) {
        showToast(
          err?.response?.data?.message ??
          'Consulta guardada, pero no se pudo agendar automáticamente la próxima cita (agéndala manualmente)'
        )
      }
    } else {
      showToast('Consulta guardada y cita marcada como completada')
    }

    reset()
    onOpenChange(false)
    onSaved()
  }

  return (
    <Modal show={open} onHide={() => onOpenChange(false)} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Atender cita — {cita?.motivo}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Diagnóstico</Form.Label>
            <Form.Control as="textarea" rows={2} {...register('diagnostico')} isInvalid={!!errors.diagnostico} />
            {errors.diagnostico && (
              <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.diagnostico.message}</Alert>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Procedimientos realizados</Form.Label>
            {tratamientos.length === 0 && (
              <Form.Text className="d-block text-muted mb-2">
                No hay tratamientos activos en el catálogo. Créalos en el módulo de Tratamientos.
              </Form.Text>
            )}
            <div className="d-flex flex-wrap gap-3 border rounded p-2">
              {tratamientos.map((t) => (
                <Form.Check
                  key={t.id}
                  type="checkbox"
                  id={`tratamiento-${t.id}`}
                  label={t.nombre}
                  value={t.id}
                  {...register('tratamientosIds')}
                />
              ))}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Notas adicionales del procedimiento</Form.Label>
            <Form.Control as="textarea" rows={2} {...register('procedimientosRealizados')} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Próxima visita — fecha</Form.Label>
            <Form.Control type="date" {...register('proximaVisita')} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Próxima visita — hora</Form.Label>
            <Form.Control type="time" {...register('proximaVisitaHora')} isInvalid={!!errors.proximaVisitaHora} />
            {errors.proximaVisitaHora && (
              <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.proximaVisitaHora.message}</Alert>
            )}
            <Form.Text className="text-muted">
              Si la llenas, se agenda automáticamente la próxima cita y se notifica por correo al paciente
              (debe caer dentro de un horario de atención configurado).
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control as="textarea" rows={2} {...register('observaciones')} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar y completar cita'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}