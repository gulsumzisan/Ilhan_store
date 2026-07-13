import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { authService } from '@/services'
import type { LoginRequest, RegisterRequest, User } from '@/types'
import { tokenStorage, userStorage } from '@/utils/storage'

interface AuthState {
  user: User | null
  token: string | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: AuthState = {
  user: userStorage.get(),
  token: tokenStorage.get(),
  status: 'idle',
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (payload: LoginRequest, { rejectWithValue }) => {
    try {
      return await authService.login(payload)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const register = createAsyncThunk(
  'auth/register',
  async (payload: RegisterRequest, { rejectWithValue }) => {
    try {
      return await authService.register(payload)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.status = 'idle'
      state.error = null
      tokenStorage.remove()
      userStorage.remove()
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      userStorage.set(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        tokenStorage.set(action.payload.token)
        userStorage.set(action.payload.user)
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = (action.payload as string) ?? 'Giriş başarısız.'
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        tokenStorage.set(action.payload.token)
        userStorage.set(action.payload.user)
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed'
        state.error = (action.payload as string) ?? 'Kayıt başarısız.'
      })
  },
})

export const { logout, setUser } = authSlice.actions
export default authSlice.reducer
