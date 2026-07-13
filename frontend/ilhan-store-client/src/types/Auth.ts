import type { User } from './User'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber?: string | null
}

export interface AuthResponse {
  token: string
  user: User
}
