export interface ItemInventario {
  id: number
  nombre: string
  categoria?: string
  cantidad: number
  stockMinimo: number
  precioUnitario: number
  activo: boolean
}

export interface CreateItemInventarioPayload {
  nombre: string
  categoria?: string
  cantidad: number
  stockMinimo?: number
  precioUnitario: number
  activo?: boolean
}