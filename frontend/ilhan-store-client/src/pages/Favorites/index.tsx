import { useEffect, useState } from 'react'
import { useFavorites } from '@/hooks'
import { productService } from '@/services'
import { ProductCard } from '@/components/product/ProductCard'
import { Loader } from '@/components/common/Loader'
import { EmptyState } from '@/components/common/EmptyState'
import type { Product } from '@/types'

export function FavoritesPage() {
  const { ids } = useFavorites()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }
    setLoading(true)
    Promise.all(
      ids.map((id) => productService.getById(id).catch(() => null)),
    )
      .then((results) => setProducts(results.filter((p): p is Product => p !== null)))
      .finally(() => setLoading(false))
  }, [ids])

  return (
    <div>
      <h1>Favorilerim</h1>
      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <EmptyState
          title="Favori listeniz boş"
          description="Beğendiğiniz ürünleri favorilerinize ekleyin."
        />
      ) : (
        <div className="grid grid-products">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default FavoritesPage
