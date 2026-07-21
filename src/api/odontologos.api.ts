import { http } from './http'
import type { ApiResponse, Paginated } from '@/types/common.types'
import type { Odontologo } from '@/types/odontologo.types'
import type { ListQuery } from '@/types/query.types'

export async function getOdontologos(query: ListQuery = { limit: 100 }) {
  const { data } = await http.get<ApiResponse<Paginated<Odontologo>>>('/odontologos', { params: query })
  return data.data
}