import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { getPacienteByUsuario } from '@/api/pacientes.api'
import { getOdontologos } from '@/api/odontologos.api'
import { agendarCita } from '@/api/citas.api'
import { useAuthStore } from '@/store/auth.store'
import type { Odontologo } from '@/types/odontologo.types'

const schema = z.object({
  odontologoId:  z.string().min(1, 'Selecciona un odontólogo'),
  fechaHoraCita: z.string().min(1, 'Requerido'),
  motivo:        z.string().min(1, 'Requerido'),
})
type FormValues = z.infer<typeof schema>

export default function AgendarCitaPage() {
  const navigate = useNavigate()
  const userId = useAuthStore((s) => s.userId)
  const [odontologos, setOdontologos] = useState<Odontologo[]>([])
  const [pacienteId, setPacienteId] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [faltaPerfil, setFaltaPerfil] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    getOdontologos({ limit: 100 }).then((r) => setOdontologos(r.items))
    if (userId) {
      getPacienteByUsuario(userId)
        .then((p) => { setPacienteId(p.id); setEmail(p.email ?? null) })
        .catch(() => setFaltaPerfil(true))
    }
  }, [userId])

  const onSubmit = async (values: FormValues) => {
    if (!pacienteId) return
    setErrorMsg(null)
    try {
      await agendarCita({
        pacienteId,
        odontologoId: values.odontologoId,
        emailPaciente: email ?? '',
        fechaHora: values.fechaHoraCita,
        motivo: values.motivo,
      })
      navigate('/portal')
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message ?? 'No se pudo agendar la cita. Intenta de nuevo.')
    }
  }

  if (faltaPerfil) {
    return (
      <Container className="py-4 d-flex justify-content-center">
        <Card className="shadow-sm border-0 w-100" style={{ maxWidth: 480 }}>
          <Card.Body className="p-4">
            <Alert variant="warning" className="mb-3">
              Nos faltan algunos datos tuyos antes de poder agendar una cita.
            </Alert>
            <Button className="w-100" onClick={() => navigate('/completar-perfil')}>
              Completar perfil
            </Button>
          </Card.Body>
        </Card>
      </Container>
    )
  }

  return (
    <Container className="py-4 d-flex justify-content-center">
      <Card className="shadow-sm border-0 w-100" style={{ maxWidth: 480 }}>
        <Card.Body className="p-4">
          <h4 className="fw-bold mb-1">Agendar cita</h4>
          <p className="text-muted small mb-4">Elige odontólogo, fecha y motivo de tu consulta.</p>

          {errorMsg && <Alert variant="danger" className="small">{errorMsg}</Alert>}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Odontólogo</Form.Label>
              <Form.Select {...register('odontologoId')} isInvalid={!!errors.odontologoId} defaultValue="">
                <option value="" disabled>Selecciona un odontólogo</option>
                {odontologos.map((o) => (
                  <option key={o.id} value={o.id}>{o.nombre} {o.apellido}{o.especialidadRel ? ` — ${o.especialidadRel.nombre}` : ''}</option>
                ))}
              </Form.Select>
              {errors.odontologoId && (
                <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.odontologoId.message}</Alert>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha y hora</Form.Label>
              <Form.Control type="datetime-local" {...register('fechaHoraCita')} isInvalid={!!errors.fechaHoraCita} />
              {errors.fechaHoraCita && (
                <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.fechaHoraCita.message}</Alert>
              )}
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Motivo de la consulta</Form.Label>
              <Form.Control as="textarea" rows={2} {...register('motivo')} isInvalid={!!errors.motivo} />
              {errors.motivo && (
                <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.motivo.message}</Alert>
              )}
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100" disabled={isSubmitting || !pacienteId}>
              {isSubmitting ? 'Agendando...' : 'Agendar cita'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}