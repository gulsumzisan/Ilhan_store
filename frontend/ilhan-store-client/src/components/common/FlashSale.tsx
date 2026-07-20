import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '@/types'
import { formatCurrency } from '@/utils/format'
import { useFavorites } from '@/hooks'

interface FlashSaleProps {
  products: Product[]
  onAddToCart?: (product: Product) => void
}

function discountPct(product: Product) {
  if (!product.discountPrice || product.discountPrice >= product.price) return 0
  return Math.round(((product.price - product.discountPrice) / product.price) * 100)
}

/* Gece yarısına kadar olan saniye — her gün sıfırlanır */
function secondsUntilMidnight() {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  return Math.floor((midnight.getTime() - now.getTime()) / 1000)
}

function FlashCard({ product, onAddToCart }: { product: Product; onAddToCart?: (p: Product) => void }) {
  const { isFavorite, toggle } = useFavorites()
  const favorited = isFavorite(product.id)
  const pct = discountPct(product)

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        minWidth: 180,
        maxWidth: 200,
        flexShrink: 0,
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = 'var(--shadow-md)'
        el.style.transform = 'translateY(-3px)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = 'none'
        el.style.transform = 'translateY(0)'
      }}
    >
      {/* İndirim rozeti */}
      {pct > 0 && (
        <div style={{
          position: 'absolute', top: 8, left: 8, zIndex: 1,
          background: '#ef4444', color: '#fff',
          borderRadius: 6, padding: '3px 8px',
          fontSize: 12, fontWeight: 800, lineHeight: 1.4,
        }}>
          %{pct}
        </div>
      )}

      {/* Favori */}
      <button
        type="button"
        aria-label={favorited ? 'Favorilerden çıkar' : 'Favorilere ekle'}
        onClick={() => toggle(product.id)}
        style={{
          position: 'absolute', top: 8, right: 8, zIndex: 1,
          background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
          width: 30, height: 30, fontSize: 16, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)', transition: 'transform 0.15s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.15)' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
      >
        {favorited ? '❤️' : '🤍'}
      </button>

      <Link to={`/products/${product.id}`}>
        <img
          src={product.imageUrl || 'https://placehold.co/300x300?text=No+Image'}
          alt={product.name}
          style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover' }}
        />
      </Link>

      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 'auto' }}>
          <strong style={{ color: '#ef4444', fontSize: 15 }}>
            {formatCurrency(product.discountPrice!)}
          </strong>
          <span style={{ textDecoration: 'line-through', color: 'var(--color-muted)', fontSize: 12 }}>
            {formatCurrency(product.price)}
          </span>
        </div>

        {onAddToCart && (
          <button
            type="button"
            disabled={product.stockQuantity <= 0}
            onClick={() => onAddToCart(product)}
            style={{
              background: product.stockQuantity > 0 ? '#ef4444' : 'var(--color-border)',
              color: product.stockQuantity > 0 ? '#fff' : 'var(--color-muted)',
              border: 'none', borderRadius: 'var(--radius)',
              padding: '8px 0', width: '100%',
              fontSize: 12, fontWeight: 700, cursor: product.stockQuantity > 0 ? 'pointer' : 'not-allowed',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => { if (product.stockQuantity > 0) (e.currentTarget as HTMLButtonElement).style.opacity = '0.85' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
          >
            {product.stockQuantity > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
          </button>
        )}
      </div>
    </div>
  )
}

export function FlashSale({ products, onAddToCart }: FlashSaleProps) {
  const discounted = products.filter(
    (p) => p.discountPrice != null && p.discountPrice < p.price,
  )

  const [secs, setSecs] = useState(secondsUntilMidnight)

  useEffect(() => {
    const id = setInterval(() => setSecs(secondsUntilMidnight()), 1000)
    return () => clearInterval(id)
  }, [])

  if (discounted.length === 0) return null

  const h = String(Math.floor(secs / 3600)).padStart(2, '0')
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0')
  const s = String(secs % 60).padStart(2, '0')

  return (
    <section className="animate-fadeUp">
      {/* Başlık */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24 }}>⚡</span>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#ef4444' }}>
              Flaş İndirimler
            </h2>
          </div>

          {/* Geri sayım */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {[h, m, s].map((val, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{
                  background: '#1a1a1a', color: '#fff',
                  borderRadius: 6, padding: '4px 8px',
                  fontSize: 15, fontWeight: 800, letterSpacing: 1,
                  minWidth: 34, textAlign: 'center',
                }}>
                  {val}
                </span>
                {i < 2 && <span style={{ color: '#ef4444', fontWeight: 900, fontSize: 16 }}>:</span>}
              </span>
            ))}
          </div>
        </div>

        <Link
          to="/products"
          style={{ fontSize: 14, fontWeight: 600, color: '#ef4444', textDecoration: 'none' }}
        >
          Tümünü Gör →
        </Link>
      </div>

      {/* Ürünler – yatay kaydırma */}
      <div
        style={{
          display: 'flex',
          gap: 14,
          overflowX: 'auto',
          paddingBottom: 8,
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--color-border) transparent',
        }}
      >
        {discounted.map((p) => (
          <FlashCard key={p.id} product={p} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  )
}

export default FlashSale
