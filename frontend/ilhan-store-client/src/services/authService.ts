import api from '@/api/axios'
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '@/types'

export const authService = {
  login: async (payload: LoginRequest): Promise<AuthResponse> => {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      payload,
    )
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Giriş başarısız.')
    }
    return data.data
  },

  register: async (payload: RegisterRequest): Promise<AuthResponse> => {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      payload,
    )
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Kayıt başarısız.')
    }
    return data.data
  },
}
