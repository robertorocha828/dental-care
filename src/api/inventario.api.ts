import { http } from './http'
import type { ItemInventario, CreateItemInventarioPayload } from '@/types/inventario.types'

export async function getInventario() {
  const { data } = await http.get<ItemInventario[]>('/inventario')
  return data
}

export async function getItemInventario(id: number) {
  const { data } = await http.get<ItemInventario>(`/inventario/${id}`)
  return data
}

export async function createItemInventario(payload: CreateItemInventarioPayload) {
  const { data } = await http.post<ItemInventario>('/inventario', payload)
  return data
}

export async function updateItemInventario(id: number, payload: Partial<CreateItemInventarioPayload>) {
  const { data } = await http.patch<ItemInventario>(`/inventario/${id}`, payload)
  return data
}

export async function deleteItemInventario(id: number) {
  await http.delete(`/inventario/${id}`)
}