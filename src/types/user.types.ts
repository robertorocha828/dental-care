export interface User {
  id: string
  username: string
  email: string
  rol: string
  activo: boolean
}

export interface CreateUserPayload {
  username: string
  email: string
  password: string
  rol?: string
}

export type UpdateUserPayload = Partial<CreateUserPayload> & { activo?: boolean }