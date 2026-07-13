import api from '@/api/axios'
import type { ApiResponse, UpdateUserRequest, User } from '@/types'

export const userService = {
  getProfile: async (): Promise<User> => {
    const { data } = await api.get<ApiResponse<User>>('/users/me')
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Profil alınamadı.')
    }
    return data.data
  },

  updateProfile: async (payload: UpdateUserRequest): Promise<User> => {
    const { data } = await api.put<ApiResponse<User>>('/users/me', payload)
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Profil güncellenemedi.')
    }
    return data.data
  },

  getAll: async (): Promise<User[]> => {
    const { data } = await api.get<ApiResponse<User[]>>('/users')
    return data.data ?? []
  },
}
