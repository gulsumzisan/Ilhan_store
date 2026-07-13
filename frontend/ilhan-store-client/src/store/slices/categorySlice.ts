import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { categoryService } from '@/services'
import type { Category } from '@/types'

interface CategoryState {
  items: Category[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: CategoryState = {
  items: [],
  status: 'idle',
  error: null,
}

export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async () => {
    return await categoryService.getAll()
  },
)

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Kategoriler yüklenemedi.'
      })
  },
})

export default categorySlice.reducer
