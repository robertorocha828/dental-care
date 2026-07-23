import { http } from './http'
import type { ApiResponse } from '@/types/common.types'
import type { Odontograma, CreateOdontogramaPayload, UpdateDientePayload } from '@/types/odontograma.types'

// El backend de odontograma (Mongo) devuelve { items, page, limit }, distinto
// al Paginated<T> de los módulos SQL (que usa { items, meta }).
interface OdontogramaListResult {
  items: Odontograma[]
  page: number
  limit: number
}

export async function getOdontogramasByPaciente(pacienteId: string) {
  const { data } = await http.get<ApiResponse<OdontogramaListResult>>(
    `/odontograma/paciente/${pacienteId}`,
    { params: { limit: 1 } },
  )
  return data.data
}

export async function createOdontograma(payload: CreateOdontogramaPayload) {
  const { data } = await http.post<ApiResponse<Odontograma>>('/odontograma', payload)
  return data.data
}

export async function updateDiente(odontogramaId: string, payload: UpdateDientePayload) {
  const { data } = await http.patch<ApiResponse<Odontograma>>(
    `/odontograma/${odontogramaId}/diente`,
    payload,
  )
  return data.data
}