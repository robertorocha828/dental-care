export interface Especialidad {
  id: number
  nombre: string
  activo: boolean
  odontologos?: { id: string; nombre: string; apellido: string }[]
}

export interface CreateEspecialidadPayload {
  nombre: string
  activo?: boolean
}