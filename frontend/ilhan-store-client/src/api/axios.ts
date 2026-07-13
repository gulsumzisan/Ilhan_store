import axios, { AxiosError } from 'axios'
import { API_BASE_URL } from '@/utils/constants'
import { tokenStorage, userStorage } from '@/utils/storage'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// İstek interceptor'ı: JWT token'ı otomatik olarak ekler.
api.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Cevap interceptor'ı: 401 durumunda oturumu temizler.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      tokenStorage.remove()
      userStorage.remove()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
