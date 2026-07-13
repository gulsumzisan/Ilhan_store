import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { cartService } from '@/services'
import type { AddToCartRequest, Cart, UpdateCartItemRequest } from '@/types'

interface CartState {
  cart: Cart | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: CartState = {
  cart: null,
  status: 'idle',
  error: null,
}

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  return await cartService.getCart()
})

export const addToCart = createAsyncThunk(
  'cart/addItem',
  async (payload: AddToCartRequest) => {
    return await cartService.addItem(payload)
  },
)

export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({
    itemId,
    payload,
  }: {
    itemId: number
    payload: UpdateCartItemRequest
  }) => {
    return await cartService.updateItem(itemId, payload)
  },
)

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async (itemId: number) => {
    return await cartService.removeItem(itemId)
  },
)

export const clearCart = createAsyncThunk('cart/clear', async () => {
  await cartService.clear()
})

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: (state) => {
      state.cart = null
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.cart = action.payload
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Sepet yüklenemedi.'
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cart = action.payload
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.cart = action.payload
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = null
      })
  },
})

export const { resetCart } = cartSlice.actions
export default cartSlice.reducer
