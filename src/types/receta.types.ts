export interface Medicamento {
  medicamento: string
  dosis: string
  indicaciones?: string
}

export interface Receta {
  _id: string
  pacienteId: string
  odontologoId: string
  fechaEmision: string
  medicamentos: Medicamento[]
  observaciones?: string
  estado: string
}

export interface CreateRecetaPayload {
  pacienteId: string
  odontologoId: string
  fechaEmision: string
  medicamentos: Medicamento[]
  observaciones?: string
  estado?: string
}
