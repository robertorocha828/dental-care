export interface User {
  id: string
  username: string
  email: string
  rol: string
  activo: boolean
  googleId?: string | null
  avatarUrl?: string | null
}

export interface CreateUserPayload {
  username: string
  email: string
  password?: string
  rol?: string
}

export type UpdateUserPayload = Partial<CreateUserPayload> & { activo?: boolean }