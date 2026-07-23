import { http } from './http'
import type { Receta, CreateRecetaPayload } from '@/types/receta.types'

export async function getRecetas() {
  const { data } = await http.get<Receta[]>('/recetas')
  return data
}

export async function getReceta(id: string) {
  const { data } = await http.get<Receta>(`/recetas/${id}`)
  return data
}

export async function createReceta(payload: CreateRecetaPayload) {
  const { data } = await http.post<Receta>('/recetas', payload)
  return data
}

export async function updateReceta(id: string, payload: Partial<CreateRecetaPayload>) {
  const { data } = await http.patch<Receta>(`/recetas/${id}`, payload)
  return data
}

export async function deleteReceta(id: string) {
  await http.delete(`/recetas/${id}`)
}
