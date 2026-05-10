import { create } from 'zustand'

export const useNotificationStore = create((set) => ({
  message: null,
  severity: 'info',

  setNotification: (message, severity = 'info') => set({ message, severity }),
  clearNotification: () => set({ message: null }),
}))
