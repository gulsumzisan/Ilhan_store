// UserRole enum'u (backend'de sayısal olarak serialize ediliyor)
export const UserRole = {
  Customer: 0,
  Admin: 1,
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string | null
  role: UserRole
}

export interface UpdateUserRequest {
  firstName: string
  lastName: string
  phoneNumber?: string | null
}
