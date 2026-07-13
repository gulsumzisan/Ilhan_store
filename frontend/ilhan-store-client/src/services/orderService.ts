import api from '@/api/axios'
import type {
  ApiResponse,
  CreateOrderRequest,
  Order,
  UpdateOrderStatusRequest,
} from '@/types'

export const orderService = {
  getMyOrders: async (): Promise<Order[]> => {
    const { data } = await api.get<ApiResponse<Order[]>>('/orders')
    return data.data ?? []
  },

  getById: async (id: number): Promise<Order> => {
    const { data } = await api.get<ApiResponse<Order>>(`/orders/${id}`)
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Sipariş bulunamadı.')
    }
    return data.data
  },

  create: async (payload: CreateOrderRequest): Promise<Order> => {
    const { data } = await api.post<ApiResponse<Order>>('/orders', payload)
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Sipariş oluşturulamadı.')
    }
    return data.data
  },

  updateStatus: async (
    id: number,
    payload: UpdateOrderStatusRequest,
  ): Promise<Order> => {
    const { data } = await api.put<ApiResponse<Order>>(
      `/orders/${id}/status`,
      payload,
    )
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Sipariş durumu güncellenemedi.')
    }
    return data.data
  },
}
