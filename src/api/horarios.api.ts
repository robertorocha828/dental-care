import { http } from './http'
import type { ApiResponse, Paginated } from '@/types/common.types'
import type { Horario, CreateHorarioPayload } from '@/types/horario.types'
import type { ListQuery } from '@/types/query.types'

export async function getHorarios(query: ListQuery = { limit: 100 }) {
  const { data } = await http.get<ApiResponse<Paginated<Horario>>>('/horarios', { params: query })
  return data.data
}

export async function getHorario(id: string) {
  const { data } = await http.get<ApiResponse<Horario>>(`/horarios/${id}`)
  return data.data
}

export async function createHorario(payload: CreateHorarioPayload) {
  const { data } = await http.post<ApiResponse<Horario>>('/horarios', payload)
  return data.data
}

export async function updateHorario(id: string, payload: Partial<CreateHorarioPayload>) {
  const { data } = await http.put<ApiResponse<Horario>>(`/horarios/${id}`, payload)
  return data.data
}

export async function deleteHorario(id: string) {
  await http.delete(`/horarios/${id}`)
}
