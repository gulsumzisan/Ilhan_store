export const OrderStatus = {
  Pending: 0,
  Confirmed: 1,
  Shipped: 2,
  Delivered: 3,
  Cancelled: 4,
} as const

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]

export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'Beklemede',
  [OrderStatus.Confirmed]: 'Onaylandı',
  [OrderStatus.Shipped]: 'Kargoda',
  [OrderStatus.Delivered]: 'Teslim Edildi',
  [OrderStatus.Cancelled]: 'İptal Edildi',
}

export const PaymentStatus = {
  Pending: 0,
  Paid: 1,
  Failed: 2,
  Refunded: 3,
} as const

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.Pending]: 'Ödeme Bekleniyor',
  [PaymentStatus.Paid]: 'Ödendi',
  [PaymentStatus.Failed]: 'Başarısız',
  [PaymentStatus.Refunded]: 'İade Edildi',
}

export interface OrderItem {
  productId: number
  productName: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: number
  orderNumber: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  totalAmount: number
  shippingAddress: string
  notes?: string | null
  createdAt: string
  items: OrderItem[]
}

export interface CreateOrderRequest {
  shippingAddress: string
  notes?: string | null
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus
  paymentStatus?: PaymentStatus | null
}
