import { create } from 'zustand'

export type ToastType = 'success' | 'warning' | 'error'

interface ToastState {
  message: string | null
  type: ToastType
  show: (message: string, type?: ToastType) => void
  clear: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  type: 'success',
  show: (message, type = 'success') => set({ message, type }),
  clear: () => set({ message: null }),
}))