import { http } from './http'
import type { ApiResponse } from '@/types/common.types'
import type { User } from '@/types/user.types'

export async function getUser(id: string) {
  const { data } = await http.get<ApiResponse<User>>(`/users/${id}`)
  return data.data
}
