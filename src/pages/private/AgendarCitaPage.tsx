import { useEffect, useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { getPacienteByUsuario } from '@/api/pacientes.api'
import { getOdontologos } from '@/api/odontologos.api'
import { agendarCita } from '@/api/citas.api'
import { getHorarios } from '@/api/horarios.api'
import { useAuthStore } from '@/store/auth.store'
import type { Odontologo } from '@/types/odontologo.types'
import type { Horario, DiaSemana } from '@/types/horario.types'

const schema = z.object({
  odontologoId: z.string().min(1, 'Selecciona un odontólogo'),
  fecha:        z.string().min(1, 'Selecciona una fecha'),
  hora:         z.string().min(1, 'Selecciona una hora'),
  motivo:       z.string().min(1, 'Requerido'),
})
type FormValues = z.infer<typeof schema>

const DIAS_JS_ORDER: DiaSemana[] = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']

function diaSemanaDeFecha(fecha: string): DiaSemana {
  const [y, m, d] = fecha.split('-').map(Number)
  const dateObj = new Date(y, m - 1, d)
  return DIAS_JS_ORDER[dateObj.getDay()]
}

function generarSlots(horarios: Horario[], dia: DiaSemana, intervaloMin = 30): string[] {
  const delDia = horarios.filter((h) => h.dia === dia)
  const slots: string[] = []
  delDia.forEach((h) => {
    let [hh, mm] = h.horaInicio.slice(0, 5).split(':').map(Number)
    const [endH, endM] = h.horaFin.slice(0, 5).split(':').map(Number)
    while (hh < endH || (hh === endH && mm < endM)) {
      slots.push(`${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`)
      mm += intervaloMin
      if (mm >= 60) { mm -= 60; hh += 1 }
    }
  })
  return slots.sort()
}

function hoyISO() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export default function AgendarCitaPage() {
  const navigate = useNavigate()
  const userId = useAuthStore((s) => s.userId)
  const [odontologos, setOdontologos] = useState<Odontologo[]>([])
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [pacienteId, setPacienteId] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [faltaPerfil, setFaltaPerfil] = useState(false)
  const { register, handleSubmit, control, watch, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) })

  const fechaSeleccionada = watch('fecha')

  useEffect(() => {
    getOdontologos({ limit: 100 }).then((r) => setOdontologos(r.items))
    getHorarios({ limit: 100 }).then((r) => setHorarios(r.items))
    if (userId) {
      getPacienteByUsuario(userId)
        .then((p) => { setPacienteId(p.id); setEmail(p.email ?? null) })
        .catch(() => setFaltaPerfil(true))
    }
  }, [userId])

  const slotsDisponibles = useMemo(() => {
    if (!fechaSeleccionada) return []
    const dia = diaSemanaDeFecha(fechaSeleccionada)
    return generarSlots(horarios, dia)
  }, [fechaSeleccionada, horarios])

  const sinAtencionEseDia = !!fechaSeleccionada && slotsDisponibles.length === 0

  const onSubmit = async (values: FormValues) => {
    if (!pacienteId) return
    setErrorMsg(null)
    try {
      await agendarCita({
        pacienteId,
        odontologoId: values.odontologoId,
        emailPaciente: email ?? '',
        fechaHora: `${values.fecha}T${values.hora}:00`,
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
              <Form.Label>Fecha</Form.Label>
              <Controller
                name="fecha"
                control={control}
                render={({ field }) => (
                  <Form.Control type="date" min={hoyISO()} isInvalid={!!errors.fecha} {...field} />
                )}
              />
              {errors.fecha && (
                <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.fecha.message}</Alert>
              )}
              {sinAtencionEseDia && (
                <Form.Text className="text-danger">
                  No hay horario de atención configurado para ese día. Elige otra fecha.
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Hora</Form.Label>
              <Form.Select {...register('hora')} isInvalid={!!errors.hora} disabled={slotsDisponibles.length === 0} defaultValue="">
                <option value="" disabled>
                  {fechaSeleccionada ? 'Selecciona una hora' : 'Primero elige una fecha'}
                </option>
                {slotsDisponibles.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Form.Select>
              {errors.hora && (
                <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.hora.message}</Alert>
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