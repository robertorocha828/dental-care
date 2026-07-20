import { http } from './http'
import type { AuthTokenResponse } from '@/types/auth.types'

export async function login(payload: { email: string; password: string }) {
  const { data } = await http.post<AuthTokenResponse>('/auth/login', payload)
  return data.access_token
}

export async function register(payload: { username: string; email: string; password: string }) {
  const { data } = await http.post<AuthTokenResponse>('/auth/register', payload)
  return data.access_token
}
export async function registerPaciente(payload: { username: string; email: string; password: string }) {
  const { data } = await http.post<AuthTokenResponse>('/auth/register/paciente', payload)
  return data.access_token
}