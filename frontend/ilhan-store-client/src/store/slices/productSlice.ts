import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { productService } from '@/services'
import type { Product, ProductSearchParams } from '@/types'

interface ProductState {
  items: Product[]
  selected: Product | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: ProductState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null,
}

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params: ProductSearchParams | undefined = undefined) => {
    return await productService.getAll(params)
  },
)

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id: number) => {
    return await productService.getById(id)
  },
)

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selected = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Ürünler yüklenemedi.'
      })
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading'
        state.selected = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.selected = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Ürün yüklenemedi.'
      })
  },
})

export const { clearSelectedProduct } = productSlice.actions
export default productSlice.reducer
