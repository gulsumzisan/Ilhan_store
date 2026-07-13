import { useCallback, useState } from 'react'

const KEY = 'ilhanstore_recently_viewed'
const MAX = 20

export interface RecentlyViewedItem {
  id: number
  name: string
  imageUrl?: string | null
  price: number
  discountPrice?: number | null
  viewedAt: string
}

const read = (): RecentlyViewedItem[] => {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as RecentlyViewedItem[]) : []
  } catch {
    return []
  }
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedItem[]>(read)

  const addItem = useCallback((item: Omit<RecentlyViewedItem, 'viewedAt'>) => {
    setItems((prev) => {
      const filtered = prev.filter((i) => i.id !== item.id)
      const updated = [
        { ...item, viewedAt: new Date().toISOString() },
        ...filtered,
      ].slice(0, MAX)
      localStorage.setItem(KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const clear = useCallback(() => {
    localStorage.removeItem(KEY)
    setItems([])
  }, [])

  return { items, addItem, clear }
}
