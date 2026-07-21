import { http } from './http'
import type { ApiResponse, Paginated } from '@/types/common.types'
import type { Paciente, CreatePacientePayload } from '@/types/paciente.types'
import type { ListQuery } from '@/types/query.types'

export async function getPacientes(query: ListQuery = {}) {
  const { data } = await http.get<ApiResponse<Paginated<Paciente>>>('/pacientes', { params: query })
  return data.data
}

export async function getPacienteByUsuario(userId: string) {
  const { data } = await http.get<ApiResponse<Paciente>>(`/pacientes/usuario/${userId}`)
  return data.data
}

export async function createPaciente(payload: CreatePacientePayload) {
  const { data } = await http.post<ApiResponse<Paciente>>('/pacientes', payload)
  return data.data
}

export async function updatePaciente(id: string, payload: Partial<CreatePacientePayload>) {
  const { data } = await http.put<ApiResponse<Paciente>>(`/pacientes/${id}`, payload)
  return data.data
}

export async function deletePaciente(id: string) {
  await http.delete(`/pacientes/${id}`)
}