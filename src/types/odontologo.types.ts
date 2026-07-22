export interface Odontologo {
  id: string
  cedula: string
  nombre: string
  apellido: string
  telefono: string
  email?: string
  especialidadId?: number
  especialidadRel?: { id: number; nombre: string }
  numeroRegistro: string
  estado: 'activo' | 'inactivo'
  userId?: string
}

export interface CreateOdontologoPayload {
  cedula: string
  nombre: string
  apellido: string
  telefono: string
  email?: string
  especialidadId?: number
  numeroRegistro: string
  userId?: string
}