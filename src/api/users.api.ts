import { http } from './http'
import type { ApiResponse, Paginated } from '@/types/common.types'
import type { User, CreateUserPayload, UpdateUserPayload } from '@/types/user.types'
import type { ListQuery } from '@/types/query.types'

export async function getUser(id: string) {
  const { data } = await http.get<ApiResponse<User>>(`/users/${id}`)
  return data.data
}

export async function getUsers(query: ListQuery = {}) {
  const { data } = await http.get<ApiResponse<Paginated<User>>>('/users', { params: query })
  return data.data
}

export async function createUser(payload: CreateUserPayload) {
  const { data } = await http.post<ApiResponse<User>>('/users', payload)
  return data.data
}

export async function updateUser(id: string, payload: UpdateUserPayload) {
  const { data } = await http.put<ApiResponse<User>>(`/users/${id}`, payload)
  return data.data
}

export async function uploadAvatar(id: string, file: File) {
  const formData = new FormData()
  formData.append('avatar', file)
  const { data } = await http.post<ApiResponse<User>>(`/users/${id}/avatar`, formData)
  return data.data
}

export async function deleteUser(id: string) {
  await http.delete(`/users/${id}`)
}