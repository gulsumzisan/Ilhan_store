import api from '@/api/axios'
import type {
  ApiResponse,
  CreateProductRequest,
  Product,
  ProductSearchParams,
  UpdateProductRequest,
} from '@/types'

export const productService = {
  getAll: async (params?: ProductSearchParams): Promise<Product[]> => {
    const { data } = await api.get<ApiResponse<Product[]>>('/products', {
      params,
    })
    return data.data ?? []
  },

  getById: async (id: number): Promise<Product> => {
    const { data } = await api.get<ApiResponse<Product>>(`/products/${id}`)
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Ürün bulunamadı.')
    }
    return data.data
  },

  create: async (payload: CreateProductRequest): Promise<Product> => {
    const { data } = await api.post<ApiResponse<Product>>('/products', payload)
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Ürün oluşturulamadı.')
    }
    return data.data
  },

  update: async (
    id: number,
    payload: UpdateProductRequest,
  ): Promise<Product> => {
    const { data } = await api.put<ApiResponse<Product>>(
      `/products/${id}`,
      payload,
    )
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Ürün güncellenemedi.')
    }
    return data.data
  },

  remove: async (id: number): Promise<void> => {
    await api.delete<ApiResponse<boolean>>(`/products/${id}`)
  },
}
