export type EstadoSuperficie = 'sano' | 'caries' | 'obturado' | 'fractura' | 'ausente'

export interface Superficies {
  vestibular: EstadoSuperficie
  distal: EstadoSuperficie
  lingual: EstadoSuperficie
  mesial: EstadoSuperficie
  oclusal: EstadoSuperficie
}

export interface Diente {
  numero: number
  superficies: Superficies
  estadoGeneral?: string
  observaciones?: string
}

export interface Odontograma {
  _id: string
  pacienteId: string
  fechaEvaluacion: string
  odontologoId: string
  dientes: Diente[]
  estado?: string
  observacionesGenerales?: string
}

export interface CreateOdontogramaPayload {
  pacienteId: string
  fechaEvaluacion: string
  odontologoId: string
  dientes: Diente[]
}

export interface UpdateDientePayload {
  numero: number
  superficies?: Partial<Superficies>
  estadoGeneral?: string
  observaciones?: string
}