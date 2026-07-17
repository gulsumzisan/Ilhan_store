import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { fetchProducts } from '@/store/slices/productSlice'
import { fetchCategories } from '@/store/slices/categorySlice'
import { addToCart } from '@/store/slices/cartSlice'
import { productService } from '@/services'
import { ProductCard } from '@/components/product/ProductCard'
import { Loader } from '@/components/common/Loader'
import { EmptyState } from '@/components/common/EmptyState'
import type { Product, ProductSearchParams } from '@/types'

export function ProductsPage() {
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { items: products, status } = useAppSelector((state) => state.products)
  const { items: categories } = useAppSelector((state) => state.categories)
  const token = useAppSelector((state) => state.auth.token)

  const categoryId = searchParams.get('categoryId')
  const [term, setTerm] = useState(searchParams.get('searchTerm') ?? '')

  // Üst kategori seçilince alt kategorilerin ürünlerini de çekmek için yerel state
  const [localProducts, setLocalProducts] = useState<Product[] | null>(null)
  const [localLoading, setLocalLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    const numericId = categoryId ? Number(categoryId) : null
    const searchTerm = searchParams.get('searchTerm') ?? undefined

    if (numericId && categories.length > 0) {
      const subCategories = categories.filter((c) => c.parentCategoryId === numericId)

      if (subCategories.length > 0) {
        // Üst kategori: ürünleri hem ana hem de alt kategorilerden getir
        const allIds = [numericId, ...subCategories.map((s) => s.id)]
        setLocalLoading(true)
        Promise.all(
          allIds.map((id) =>
            productService.getAll({ categoryId: id, ...(searchTerm ? { searchTerm } : {}) }),
          ),
        )
          .then((results) => {
            const map = new Map<number, Product>()
            results.flat().forEach((p) => map.set(p.id, p))
            setLocalProducts(Array.from(map.values()))
          })
          .catch(() => setLocalProducts([]))
          .finally(() => setLocalLoading(false))
        return
      }
    }

    // Alt kategori veya kategori seçilmemişse Redux akışını kullan
    setLocalProducts(null)
    const params: ProductSearchParams = {}
    if (numericId) params.categoryId = numericId
    if (searchTerm) params.searchTerm = searchTerm
    dispatch(fetchProducts(Object.keys(params).length ? params : undefined))
  }, [dispatch, categoryId, searchParams, categories])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const next = new URLSearchParams(searchParams)
    if (term) next.set('searchTerm', term)
    else next.delete('searchTerm')
    setSearchParams(next)
  }

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ productId: product.id, quantity: 1 }))
  }

  const displayProducts = localProducts ?? products
  const isLoading = localLoading || (!localProducts && status === 'loading')

  // Seçili kategorinin adını bul (üst + alt dahil)
  const selectedCategory = categoryId
    ? categories.find((c) => c.id === Number(categoryId))
    : null
  const subCount = selectedCategory
    ? categories.filter((c) => c.parentCategoryId === selectedCategory.id).length
    : 0

  return (
    <div>
      <h1>Ürünler</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1 }}>
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Ürün ara..."
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--color-border)',
            }}
          />
        </form>
        <select
          value={categoryId ?? ''}
          onChange={(e) => {
            const next = new URLSearchParams(searchParams)
            if (e.target.value) next.set('categoryId', e.target.value)
            else next.delete('categoryId')
            setSearchParams(next)
          }}
          style={{
            padding: '10px 12px',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--color-border)',
          }}
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.parentCategoryId ? `  ↳ ${c.name}` : c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Üst kategori seçilince bilgi mesajı */}
      {selectedCategory && subCount > 0 && (
        <div
          style={{
            marginBottom: 16,
            padding: '8px 14px',
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            fontSize: 13,
            color: 'var(--color-muted)',
          }}
        >
          <strong style={{ color: 'var(--color-text)' }}>{selectedCategory.name}</strong> kategorisi
          ve {subCount} alt kategorisinin ürünleri gösteriliyor.
        </div>
      )}

      {isLoading ? (
        <Loader />
      ) : displayProducts.length === 0 ? (
        <EmptyState title="Ürün bulunamadı" description="Farklı bir arama deneyin." />
      ) : (
        <div className="grid grid-products">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={token ? handleAddToCart : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductsPage
