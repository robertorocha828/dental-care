export interface Especialidad {
  id: number
  nombre: string
  activo: boolean
}

export interface CreateEspecialidadPayload {
  nombre: string
  activo?: boolean
}