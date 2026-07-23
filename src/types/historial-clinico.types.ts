export interface HistorialClinico {
  _id: string
  pacienteId: string
  odontologoId: string
  citaId?: string
  fechaConsulta: string
  motivoConsulta: string
  diagnostico: string
  procedimientosRealizados?: string
  tratamientosIds?: string[]
  proximaVisita?: string
  observaciones?: string
}

export interface CreateHistorialClinicoPayload {
  pacienteId: string
  odontologoId: string
  citaId?: string
  fechaConsulta: string
  motivoConsulta: string
  diagnostico: string
  procedimientosRealizados?: string
  tratamientosIds?: string[]
  proximaVisita?: string
  observaciones?: string
}