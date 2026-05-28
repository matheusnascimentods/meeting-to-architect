import { api } from '../lib/api'

export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password })
    return data // expects { token, message }
  },

  register: async (email: string, password: string, name: string) => {
    const { data } = await api.post('/user', { email, password, name })
    return data
  },

  checkEmail: async (email: string) => {
    const { data } = await api.get(`/user/get-by-email/${email}`)
    return data
  },

  getMe: async () => {
    const { data } = await api.get('/user/me')
    return data
  },
}
