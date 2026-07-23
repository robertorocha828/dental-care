import { http } from './http'
import type { ApiResponse, Paginated } from '@/types/common.types'
import type { Odontologo, CreateOdontologoPayload } from '@/types/odontologo.types'
import type { ListQuery } from '@/types/query.types'
import type { User } from '@/types/user.types'

export async function getOdontologos(query: ListQuery = { limit: 100 }) {
  const { data } = await http.get<ApiResponse<Paginated<Odontologo>>>('/odontologos', { params: query })
  return data.data
}

export async function getUsuariosDisponiblesOdontologo() {
  const { data } = await http.get<ApiResponse<User[]>>('/odontologos/usuarios-disponibles')
  return data.data
}

export async function getOdontologoByUsuario(userId: string) {
  const { data } = await http.get<ApiResponse<Odontologo>>(`/odontologos/usuario/${userId}`)
  return data.data
}

export async function createOdontologo(payload: CreateOdontologoPayload) {
  const { data } = await http.post<ApiResponse<Odontologo>>('/odontologos', payload)
  return data.data
}

export async function updateOdontologo(id: string, payload: Partial<CreateOdontologoPayload>) {
  const { data } = await http.put<ApiResponse<Odontologo>>(`/odontologos/${id}`, payload)
  return data.data
}

export async function deleteOdontologo(id: string) {
  await http.delete(`/odontologos/${id}`)
}