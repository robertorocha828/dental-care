import { http } from './http'
import type { ApiResponse, Paginated } from '@/types/common.types'
import type { CreateCitaPublicPayload, Cita } from '@/types/cita.types'
import type { ListQuery } from '@/types/query.types'

export async function agendarCita(payload: CreateCitaPublicPayload) {
  const { data } = await http.post<{ data: Cita }>('/citas', payload)
  return data.data
}

export async function getCitas(query: ListQuery = {}) {
  const { data } = await http.get<ApiResponse<Paginated<Cita>>>('/citas', { params: query })
  return data.data
}

export async function getCitasByPaciente(pacienteId: string, query: ListQuery = { limit: 50 }) {
  const { data } = await http.get<ApiResponse<Paginated<Cita>>>(`/citas/paciente/${pacienteId}`, { params: query })
  return data.data
}

export async function getCitasByOdontologo(odontologoId: string, query: ListQuery = { limit: 50 }) {
  const { data } = await http.get<ApiResponse<Paginated<Cita>>>(`/citas/odontologo/${odontologoId}`, { params: query })
  return data.data
}

export async function updateCita(id: string, payload: Partial<Cita>) {
  const { data } = await http.put<ApiResponse<Cita>>(`/citas/${id}`, payload)
  return data.data
}