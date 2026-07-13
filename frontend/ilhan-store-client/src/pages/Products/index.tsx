import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { fetchProducts } from '@/store/slices/productSlice'
import { fetchCategories } from '@/store/slices/categorySlice'
import { addToCart } from '@/store/slices/cartSlice'
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

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    const params: ProductSearchParams = {}
    if (categoryId) params.categoryId = Number(categoryId)
    const search = searchParams.get('searchTerm')
    if (search) params.searchTerm = search
    dispatch(fetchProducts(Object.keys(params).length ? params : undefined))
  }, [dispatch, categoryId, searchParams])

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
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {status === 'loading' ? (
        <Loader />
      ) : products.length === 0 ? (
        <EmptyState title="Ürün bulunamadı" description="Farklı bir arama deneyin." />
      ) : (
        <div className="grid grid-products">
          {products.map((product) => (
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
