import api from '@/api/axios'
import type {
  AddToCartRequest,
  ApiResponse,
  Cart,
  UpdateCartItemRequest,
} from '@/types'

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const { data } = await api.get<ApiResponse<Cart>>('/cart')
    if (!data.data) {
      throw new Error(data.message || 'Sepet alınamadı.')
    }
    return data.data
  },

  addItem: async (payload: AddToCartRequest): Promise<Cart> => {
    const { data } = await api.post<ApiResponse<Cart>>('/cart/items', payload)
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Ürün sepete eklenemedi.')
    }
    return data.data
  },

  updateItem: async (
    itemId: number,
    payload: UpdateCartItemRequest,
  ): Promise<Cart> => {
    const { data } = await api.put<ApiResponse<Cart>>(
      `/cart/items/${itemId}`,
      payload,
    )
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Sepet güncellenemedi.')
    }
    return data.data
  },

  removeItem: async (itemId: number): Promise<Cart> => {
    const { data } = await api.delete<ApiResponse<Cart>>(
      `/cart/items/${itemId}`,
    )
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Ürün sepetten çıkarılamadı.')
    }
    return data.data
  },

  clear: async (): Promise<void> => {
    await api.delete<ApiResponse<boolean>>('/cart')
  },
}
