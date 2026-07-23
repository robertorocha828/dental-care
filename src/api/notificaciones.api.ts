import { http } from './http'
import type { ApiResponse, Paginated } from '@/types/common.types'
import type { Notificacion, CreateNotificacionPayload, UpdateNotificacionPayload } from '@/types/notificacion.types'
import type { ListQuery } from '@/types/query.types'

export async function getNotificaciones(query: ListQuery = { limit: 20 }) {
  const { data } = await http.get<ApiResponse<Paginated<Notificacion>>>('/notificaciones', { params: query })
  return data.data
}

export async function getNotificacion(id: string) {
  const { data } = await http.get<ApiResponse<Notificacion>>(`/notificaciones/${id}`)
  return data.data
}

export async function createNotificacion(payload: CreateNotificacionPayload) {
  const { data } = await http.post<ApiResponse<Notificacion>>('/notificaciones', payload)
  return data.data
}

export async function updateNotificacion(id: string, payload: UpdateNotificacionPayload) {
  const { data } = await http.put<ApiResponse<Notificacion>>(`/notificaciones/${id}`, payload)
  return data.data
}

export async function deleteNotificacion(id: string) {
  await http.delete(`/notificaciones/${id}`)
}
