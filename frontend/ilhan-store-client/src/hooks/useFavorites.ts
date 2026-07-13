import { useCallback, useEffect, useState } from 'react'

const FAVORITES_KEY = 'ilhanstore_favorites'

const read = (): number[] => {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    return raw ? (JSON.parse(raw) as number[]) : []
  } catch {
    return []
  }
}

// Favoriler backend'de uç nokta olarak sunulmadığı için istemci tarafında
// (localStorage) tutulur.
export function useFavorites() {
  const [ids, setIds] = useState<number[]>(read)

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
  }, [ids])

  const toggle = useCallback((productId: number) => {
    setIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    )
  }, [])

  const isFavorite = useCallback(
    (productId: number) => ids.includes(productId),
    [ids],
  )

  return { ids, toggle, isFavorite }
}
