import { create } from 'zustand'
import usersService from '../services/users'

export const useUserListStore = create((set) => ({
  users: [],

  initializeUsers: async () => {
    const users = await usersService.getAll()
    set({ users })
  },
}))
