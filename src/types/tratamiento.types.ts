export interface Tratamiento {
  id: number
  nombre: string
  descripcion?: string
  costo: number
  tipoTratamientoId: number
  activo: boolean
}

export interface CreateTratamientoPayload {
  nombre: string
  descripcion?: string
  costo: number
  tipoTratamientoId: number
  activo?: boolean
}