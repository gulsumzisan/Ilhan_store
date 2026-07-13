import api from '@/api/axios'
import type {
  ApiResponse,
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/types'

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get<ApiResponse<Category[]>>('/categories')
    return data.data ?? []
  },

  getById: async (id: number): Promise<Category> => {
    const { data } = await api.get<ApiResponse<Category>>(`/categories/${id}`)
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Kategori bulunamadı.')
    }
    return data.data
  },

  create: async (payload: CreateCategoryRequest): Promise<Category> => {
    const { data } = await api.post<ApiResponse<Category>>(
      '/categories',
      payload,
    )
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Kategori oluşturulamadı.')
    }
    return data.data
  },

  update: async (
    id: number,
    payload: UpdateCategoryRequest,
  ): Promise<Category> => {
    const { data } = await api.put<ApiResponse<Category>>(
      `/categories/${id}`,
      payload,
    )
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Kategori güncellenemedi.')
    }
    return data.data
  },

  remove: async (id: number): Promise<void> => {
    await api.delete<ApiResponse<boolean>>(`/categories/${id}`)
  },
}
