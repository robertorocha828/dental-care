import { http } from './http'
import type { Especialidad, CreateEspecialidadPayload } from '@/types/especialidad.types'

// Ojo: a diferencia de la mayoría de módulos, EspecialidadesController
// devuelve los datos directo (sin envolver en { success, message, data }).

export async function getEspecialidades() {
  const { data } = await http.get<Especialidad[]>('/especialidades')
  return data
}

export async function createEspecialidad(payload: CreateEspecialidadPayload) {
  const { data } = await http.post<Especialidad>('/especialidades', payload)
  return data
}

export async function updateEspecialidad(id: number, payload: Partial<CreateEspecialidadPayload>) {
  const { data } = await http.patch<Especialidad>(`/especialidades/${id}`, payload)
  return data
}

export async function deleteEspecialidad(id: number) {
  await http.delete(`/especialidades/${id}`)
}