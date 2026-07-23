import { http } from './http'
import type { TipoTratamiento, CreateTipoTratamientoPayload } from '@/types/tipo-tratamiento.types'

export async function getTiposTratamiento() {
  const { data } = await http.get<TipoTratamiento[]>('/tipos-tratamiento')
  return data
}

export async function getTipoTratamiento(id: number) {
  const { data } = await http.get<TipoTratamiento>(`/tipos-tratamiento/${id}`)
  return data
}

export async function createTipoTratamiento(payload: CreateTipoTratamientoPayload) {
  const { data } = await http.post<TipoTratamiento>('/tipos-tratamiento', payload)
  return data
}

export async function updateTipoTratamiento(id: number, payload: Partial<CreateTipoTratamientoPayload>) {
  const { data } = await http.patch<TipoTratamiento>(`/tipos-tratamiento/${id}`, payload)
  return data
}

export async function deleteTipoTratamiento(id: number) {
  await http.delete(`/tipos-tratamiento/${id}`)
}