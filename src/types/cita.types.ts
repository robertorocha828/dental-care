export interface Cita {
  id: string
  pacienteId?: string
  odontologoId?: string
  emailPaciente?: string
  fechaHora: string
  motivo: string
  estado: 'agendada' | 'completada' | 'cancelada'
  observaciones?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateCitaPublicPayload {
  emailPaciente: string
  fechaHora: string
  motivo: string
  observaciones?: string
}