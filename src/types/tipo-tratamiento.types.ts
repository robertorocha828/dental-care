export interface TipoTratamiento {
  id: number
  nombre: string
  activo: boolean
}

export interface CreateTipoTratamientoPayload {
  nombre: string
  activo?: boolean
}