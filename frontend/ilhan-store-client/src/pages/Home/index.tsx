import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { fetchProducts } from '@/store/slices/productSlice'
import { fetchCategories } from '@/store/slices/categorySlice'
import { addToCart } from '@/store/slices/cartSlice'
import { ProductCard } from '@/components/product/ProductCard'
import { CategoryCard } from '@/components/category/CategoryCard'
import { Loader } from '@/components/common/Loader'
import { Button } from '@/components/ui/Button'
import type { Product } from '@/types'

const stats = [
  { icon: '🚚', label: 'Ücretsiz Kargo', sub: '500₺ ve üzeri' },
  { icon: '↩️', label: 'Kolay İade', sub: '30 gün içinde' },
  { icon: '🔒', label: 'Güvenli Ödeme', sub: 'SSL şifreli' },
  { icon: '💬', label: '7/24 Destek', sub: 'Her zaman yanınızdayız' },
]

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

      {/* ── Hero ── */}
      <section
        className="animate-fadeUp"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #7c3aed 100%)',
          color: '#fff',
          borderRadius: 'var(--radius-lg)',
          padding: '64px 40px',
          minHeight: 280,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* decorative circles */}
        <div
          style={{
            position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
          }}
        >
          <div style={circleStyle(340, -80, -80, 'rgba(255,255,255,0.06)')} />
          <div style={circleStyle(220, 'auto', -60, 'rgba(255,255,255,0.05)', undefined, 60)} />
          <div style={circleStyle(160, 180, 'auto', 'rgba(255,255,255,0.04)', undefined, undefined, -40)} />
        </div>

        <div style={{ position: 'relative', maxWidth: 560, textAlign: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.28)',
              backdropFilter: 'blur(4px)',
              borderRadius: 999,
              padding: '4px 14px',
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 16,
              letterSpacing: 0.3,
            }}
          >
            ✨ Yeni Sezon Koleksiyonu
          </span>
          <h1
            style={{
              margin: '0 0 14px',
              fontSize: 'clamp(26px, 4vw, 42px)',
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: -0.5,
            }}
          >
            İlhan Store'a<br />Hoş Geldiniz
          </h1>
          <p style={{ margin: '0 0 28px', opacity: 0.88, fontSize: 16, lineHeight: 1.6 }}>
            En yeni kıyafet koleksiyonlarını keşfedin.<br />
            Trendleri takip edin, tarzınızı bulun.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/products">
              <Button variant="secondary">Alışverişe Başla →</Button>
            </Link>
            <Link to="/categories">
              <button
                type="button"
                style={{
                  background: 'transparent',
                  border: '1.5px solid rgba(255,255,255,0.5)',
                  color: '#fff',
                  borderRadius: 'var(--radius)',
                  padding: '10px 20px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                }}
              >
                Kategorileri Gör
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section
        className="animate-fadeUp"
        style={{ animationDelay: '0.1s' }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                boxShadow: 'var(--shadow)',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.boxShadow = 'var(--shadow-md)'
                el.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.boxShadow = 'var(--shadow)'
                el.style.transform = 'translateY(0)'
              }}
            >
              <span style={{ fontSize: 28 }}>{s.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

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

function circleStyle(
  size: number,
  top: number | string,
  left: number | string,
  bg: string,
  right?: number | string,
  bottom?: number | string,
): React.CSSProperties {
  return {
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: '50%',
    background: bg,
    top: typeof top === 'number' ? top : top,
    left: typeof left === 'number' ? left : left,
    ...(right !== undefined ? { right } : {}),
    ...(bottom !== undefined ? { bottom } : {}),
  }
}

export default HomePage
