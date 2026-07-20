import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { fetchProducts } from '@/store/slices/productSlice'
import { fetchCategories } from '@/store/slices/categorySlice'
import { addToCart } from '@/store/slices/cartSlice'
import { ProductCard } from '@/components/product/ProductCard'
import { CategoryCard } from '@/components/category/CategoryCard'
import { Loader } from '@/components/common/Loader'
import { HeroSlider } from '@/components/common/HeroSlider'
import { FlashSale } from '@/components/common/FlashSale'
import type { Product } from '@/types'

export function HomePage() {
  const dispatch = useAppDispatch()
  const { items: products, status } = useAppSelector((state) => state.products)
  const { items: categories } = useAppSelector((state) => state.categories)
  const token = useAppSelector((state) => state.auth.token)

  useEffect(() => {
    dispatch(fetchProducts(undefined))
    dispatch(fetchCategories())
  }, [dispatch])

  const handleAddToCart = (product: Product) => {
    if (!token) return
    dispatch(addToCart({ productId: product.id, quantity: 1 }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

      {/* ── Hero Slider ── */}
      <HeroSlider />

      {/* ── Flaş İndirimler ── */}
      {status !== 'loading' && (
        <FlashSale
          products={products}
          onAddToCart={token ? handleAddToCart : undefined}
        />
      )}

      {/* ── Categories ── */}
      {categories.length > 0 && (
        <section className="animate-fadeUp" style={{ animationDelay: '0.15s' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Kategoriler</h2>
              <p style={{ margin: '4px 0 0', color: 'var(--color-muted)', fontSize: 14 }}>
                İlgilendiğin kategoriyi seç
              </p>
            </div>
            <Link
              to="/categories"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              Tümünü Gör →
            </Link>
          </div>
          <div className="grid grid-products">
            {categories.slice(0, 6).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>
      )}

      {/* ── Promo banner ── */}
      <section
        className="animate-fadeUp"
        style={{ animationDelay: '0.2s' }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            border: '1px solid #fcd34d',
            borderRadius: 'var(--radius-lg)',
            padding: '28px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div style={{ fontSize: 28, marginBottom: 4 }}>🏷️</div>
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: '#92400e' }}>
              Özel İndirim Fırsatı!
            </h3>
            <p style={{ margin: 0, color: '#b45309', fontSize: 14 }}>
              Seçili ürünlerde <strong>%30'a varan</strong> indirimler sizi bekliyor.
            </p>
          </div>
          <Link to="/products">
            <button
              type="button"
              style={{
                background: '#b45309',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius)',
                padding: '10px 22px',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#92400e' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#b45309' }}
            >
              İndirimleri Keşfet
            </button>
          </Link>
        </div>
      </section>

      {/* ── Featured products ── */}
      <section className="animate-fadeUp" style={{ animationDelay: '0.25s' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Öne Çıkan Ürünler</h2>
            <p style={{ margin: '4px 0 0', color: 'var(--color-muted)', fontSize: 14 }}>
              En çok tercih edilenler
            </p>
          </div>
          <Link
            to="/products"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            Tüm Ürünler →
          </Link>
        </div>
        {status === 'loading' ? (
          <Loader />
        ) : (
          <div className="grid grid-products">
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={token ? handleAddToCart : undefined}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  )
}

export default HomePage
