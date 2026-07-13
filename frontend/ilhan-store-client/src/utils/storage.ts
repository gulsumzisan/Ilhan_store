import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from './constants'
import type { User } from '@/types'

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_STORAGE_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_STORAGE_KEY, token),
  remove: () => localStorage.removeItem(TOKEN_STORAGE_KEY),
}

export const userStorage = {
  get: (): User | null => {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as User
    } catch {
      return null
    }
  },
  set: (user: User) =>
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user)),
  remove: () => localStorage.removeItem(USER_STORAGE_KEY),
}
