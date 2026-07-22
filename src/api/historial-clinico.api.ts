import { http } from './http'
import type { ApiResponse } from '@/types/common.types'
import type { HistorialClinico, CreateHistorialClinicoPayload } from '@/types/historial-clinico.types'

interface HistorialListResult {
  items: HistorialClinico[]
  page: number
  limit: number
}

export async function createHistorialClinico(payload: CreateHistorialClinicoPayload) {
  const { data } = await http.post<ApiResponse<HistorialClinico>>('/historial-clinico', payload)
  return data.data
}

export async function updateHistorialClinico(id: string, payload: Partial<CreateHistorialClinicoPayload>) {
  const { data } = await http.patch<ApiResponse<HistorialClinico>>(`/historial-clinico/${id}`, payload)
  return data.data
}

export async function getHistorialByPaciente(pacienteId: string) {
  const { data } = await http.get<ApiResponse<HistorialListResult>>(
    `/historial-clinico/paciente/${pacienteId}`,
    { params: { limit: 20 } },
  )
  return data.data
}