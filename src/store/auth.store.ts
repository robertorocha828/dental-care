import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { decodeToken } from '@/lib/jwt'

interface AuthState {
  token: string | null
  userId: string | null
  rol: string | null
  isAuthenticated: boolean
  setToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      rol: null,
      isAuthenticated: false,
      setToken: (token) =>
        set({
          token,
          userId: decodeToken(token)?.id ?? null,
          rol: decodeToken(token)?.rol ?? null,
          isAuthenticated: true,
        }),
      logout: () => set({ token: null, userId: null, rol: null, isAuthenticated: false }),
    }),
    { name: 'consultorio-auth' },
  ),
)