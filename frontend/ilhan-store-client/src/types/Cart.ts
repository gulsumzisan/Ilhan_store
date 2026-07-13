export interface CartItem {
  id: number
  productId: number
  productName: string
  productImageUrl?: string | null
  unitPrice: number
  quantity: number
  subTotal: number
}

export interface Cart {
  id: number
  userId: number
  items: CartItem[]
  totalAmount: number
}

export interface AddToCartRequest {
  productId: number
  quantity: number
}

export interface UpdateCartItemRequest {
  quantity: number
}
