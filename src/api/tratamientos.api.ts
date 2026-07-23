import { http } from './http'
import type { Tratamiento, CreateTratamientoPayload } from '@/types/tratamiento.types'

export async function getTratamientos() {
  const { data } = await http.get<Tratamiento[]>('/tratamientos')
  return data
}

export async function getTratamiento(id: number) {
  const { data } = await http.get<Tratamiento>(`/tratamientos/${id}`)
  return data
}

export async function createTratamiento(payload: CreateTratamientoPayload) {
  const { data } = await http.post<Tratamiento>('/tratamientos', payload)
  return data
}

export async function updateTratamiento(id: number, payload: Partial<CreateTratamientoPayload>) {
  const { data } = await http.patch<Tratamiento>(`/tratamientos/${id}`, payload)
  return data
}

export async function deleteTratamiento(id: number) {
  await http.delete(`/tratamientos/${id}`)
}