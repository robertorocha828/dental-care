import { http } from './http'
import type { CreateCitaPublicPayload, Cita } from '@/types/cita.types'

export async function agendarCita(payload: CreateCitaPublicPayload) {
  const { data } = await http.post<{ data: Cita }>('/citas', payload)
  return data.data
}