import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import loginService from '../services/login'
import blogService from '../services/blogs'

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,

      loginUser: async (credentials) => {
        const user = await loginService.login(credentials)
        blogService.setToken(user.token)
        set({ user })
      },

      logoutUser: () => {
        blogService.setToken(null)
        set({ user: null })
      },
    }),
    {
      name: 'bloglist-user',
    },
  ),
)
