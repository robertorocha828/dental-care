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

// Redirección real del navegador (no axios) — inicia el flujo de Google.
// Si se pasa userId, es una vinculación desde /perfil (va como ?state=).
export function googleAuthUrl(userId?: string) {
  const base = `${import.meta.env.VITE_API_BASE_URL}/auth/google`
  return userId ? `${base}?state=${userId}` : base
}

export async function unlinkGoogle() {
  await http.delete('/auth/google')
}