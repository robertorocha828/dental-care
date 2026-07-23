export interface Notificacion {
  id: string
  destinatario: string
  asunto: string
  mensaje: string
  estado: string
  tipo?: string
  creadoEn: string
}

export interface CreateNotificacionPayload {
  destinatario: string
  asunto: string
  mensaje: string
  estado?: string
  tipo?: string
}

export interface UpdateNotificacionPayload {
  estado?: string
  tipo?: string
}
