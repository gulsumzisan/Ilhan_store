import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { useFavorites } from '@/hooks'
import { fetchProductById } from '@/store/slices/productSlice'
import { addToCart } from '@/store/slices/cartSlice'
import { Loader } from '@/components/common/Loader'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/utils/format'
import { ClothingSizeLabels } from '@/types'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { selected, status } = useAppSelector((state) => state.products)
  const token = useAppSelector((state) => state.auth.token)
  const { isFavorite, toggle } = useFavorites()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (id) dispatch(fetchProductById(Number(id)))
  }, [dispatch, id])

  useEffect(() => {
    setQuantity(1)
    setAdded(false)
  }, [id])

  if (status === 'loading' || !selected) {
    return <Loader />
  }

  const hasDiscount =
    selected.discountPrice != null && selected.discountPrice < selected.price

  const discountPct = hasDiscount
    ? Math.round(((selected.price - selected.discountPrice!) / selected.price) * 100)
    : 0

  const inStock = selected.stockQuantity > 0

  const handleAddToCart = () => {
    if (!token) {
      navigate('/login')
      return
    }
    dispatch(addToCart({ productId: selected.id, quantity }))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const changeQty = (delta: number) => {
    setQuantity((q) => Math.min(selected.stockQuantity, Math.max(1, q + delta)))
  }

  const favorited = isFavorite(selected.id)

  return (
    <div className="animate-fadeIn">

      {/* ── Breadcrumb ── */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          color: 'var(--color-muted)',
          marginBottom: 24,
        }}
      >
        <Link to="/" style={{ color: 'var(--color-primary)' }}>Ana Sayfa</Link>
        <span>/</span>
        <Link to="/products" style={{ color: 'var(--color-primary)' }}>Ürünler</Link>
        {selected.categoryName && (
          <>
            <span>/</span>
            <span>{selected.categoryName}</span>
          </>
        )}
        <span>/</span>
        <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{selected.name}</span>
      </nav>

      {/* ── Main grid ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 520px) 1fr',
          gap: 40,
          alignItems: 'start',
        }}
      >
        {/* Left – image */}
        <div style={{ position: 'sticky', top: 24 }}>
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-lg)',
              aspectRatio: '3 / 4',
            }}
          >
            <img
              src={selected.imageUrl || 'https://placehold.co/600x800?text=No+Image'}
              alt={selected.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.4s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.03)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'
              }}
            />

            {/* Discount badge */}
            {hasDiscount && (
              <span
                style={{
                  position: 'absolute',
                  top: 14,
                  left: 14,
                  background: 'var(--color-danger)',
                  color: '#fff',
                  borderRadius: 999,
                  padding: '4px 12px',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                -%{discountPct}
              </span>
            )}

            {/* Stock badge */}
            {!inStock && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.42)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    background: '#fff',
                    color: 'var(--color-text)',
                    fontWeight: 700,
                    borderRadius: 8,
                    padding: '8px 20px',
                    fontSize: 16,
                  }}
                >
                  Stokta Yok
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right – info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Name + favorite */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1 }}>
              {selected.brand && (
                <p
                  style={{
                    margin: '0 0 6px',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: 0.6,
                  }}
                >
                  {selected.brand}
                </p>
              )}
              <h1 style={{ margin: 0, fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, lineHeight: 1.25 }}>
                {selected.name}
              </h1>
            </div>
            <button
              type="button"
              aria-label={favorited ? 'Favorilerden çıkar' : 'Favorilere ekle'}
              onClick={() => toggle(selected.id)}
              style={{
                background: favorited ? '#fff0f0' : 'var(--color-bg)',
                border: `1.5px solid ${favorited ? '#fca5a5' : 'var(--color-border)'}`,
                borderRadius: '50%',
                width: 46,
                height: 46,
                fontSize: 22,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'transform 0.15s, background 0.15s',
                boxShadow: 'var(--shadow)',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
            >
              {favorited ? '❤️' : '🤍'}
            </button>
          </div>

          {/* Price */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 12,
              padding: '16px 20px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow)',
            }}
          >
            {hasDiscount ? (
              <>
                <strong style={{ fontSize: 30, color: 'var(--color-danger)', fontWeight: 800 }}>
                  {formatCurrency(selected.discountPrice!)}
                </strong>
                <span style={{ textDecoration: 'line-through', color: 'var(--color-muted)', fontSize: 18 }}>
                  {formatCurrency(selected.price)}
                </span>
                <span className="badge badge-danger">%{discountPct} İndirim</span>
              </>
            ) : (
              <strong style={{ fontSize: 30, fontWeight: 800 }}>{formatCurrency(selected.price)}</strong>
            )}
          </div>

          {/* Description */}
          {selected.description && (
            <p style={{ margin: 0, lineHeight: 1.75, color: 'var(--color-text)' }}>
              {selected.description}
            </p>
          )}

          {/* Chips – size, color, stock, category */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ChipRow label="Beden" value={ClothingSizeLabels[selected.size]} />
            {selected.color && <ChipRow label="Renk" value={selected.color} colorDot={selected.color} />}
            <ChipRow
              label="Stok Durumu"
              value={inStock ? `${selected.stockQuantity} adet mevcut` : 'Tükendi'}
              badge={inStock ? 'badge-success' : 'badge-danger'}
            />
            {selected.categoryName && <ChipRow label="Kategori" value={selected.categoryName} />}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: 0 }} />

          {/* Quantity + Add to cart */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                background: 'var(--color-surface)',
              }}
            >
              <button
                type="button"
                onClick={() => changeQty(-1)}
                disabled={quantity <= 1}
                style={qtyBtnStyle(quantity <= 1)}
              >
                −
              </button>
              <span
                style={{
                  minWidth: 44,
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: 700,
                  padding: '0 4px',
                }}
              >
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => changeQty(1)}
                disabled={quantity >= selected.stockQuantity}
                style={qtyBtnStyle(quantity >= selected.stockQuantity)}
              >
                +
              </button>
            </div>

            <div style={{ flex: 1, minWidth: 180 }}>
              <Button
                onClick={handleAddToCart}
                disabled={!inStock}
                fullWidth
              >
                {!inStock
                  ? '🚫 Stokta Yok'
                  : added
                  ? '✓ Sepete Eklendi!'
                  : '🛒 Sepete Ekle'}
              </Button>
            </div>
          </div>

          {/* Trust badges */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              padding: '14px 16px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 'var(--radius)',
              fontSize: 13,
            }}
          >
            {['🚚 Ücretsiz kargo', '↩️ 30 gün iade', '🔒 Güvenli ödeme'].map((t) => (
              <span key={t} style={{ color: '#166534', fontWeight: 600 }}>{t}</span>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

function ChipRow({
  label,
  value,
  colorDot,
  badge,
}: {
  label: string
  value: string
  colorDot?: string
  badge?: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span
        style={{
          minWidth: 110,
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--color-muted)',
          textTransform: 'uppercase',
          letterSpacing: 0.4,
        }}
      >
        {label}
      </span>
      {badge ? (
        <span className={`badge ${badge}`}>{value}</span>
      ) : (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 12px',
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {colorDot && (
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: colorDot.toLowerCase(),
                border: '1px solid rgba(0,0,0,0.1)',
                display: 'inline-block',
              }}
            />
          )}
          {value}
        </span>
      )}
    </div>
  )
}

function qtyBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    width: 40,
    height: 40,
    border: 'none',
    background: disabled ? '#f3f4f6' : 'var(--color-bg)',
    color: disabled ? '#d1d5db' : 'var(--color-text)',
    fontSize: 18,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background 0.15s',
    fontWeight: 700,
  }
}

export default ProductDetailPage
