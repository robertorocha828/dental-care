import { http } from './http'
import type { ApiResponse, Paginated } from '@/types/common.types'
import type { Rol } from '@/types/rol.types'
import type { ListQuery } from '@/types/query.types'

// Solo lectura: los roles y permisos se crean/editan directamente en backend.
export async function getRoles(query: ListQuery = { limit: 100 }) {
  const { data } = await http.get<ApiResponse<Paginated<Rol>>>('/roles', { params: query })
  return data.data
}