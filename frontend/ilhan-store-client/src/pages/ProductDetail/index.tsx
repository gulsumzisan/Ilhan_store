import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { useFavorites, useRecentlyViewed } from '@/hooks'
import { fetchProductById } from '@/store/slices/productSlice'
import { addToCart } from '@/store/slices/cartSlice'
import { Loader } from '@/components/common/Loader'
import { formatCurrency } from '@/utils/format'
import { ClothingSize, ClothingSizeLabels } from '@/types'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { selected, status } = useAppSelector((state) => state.products)
  const token = useAppSelector((state) => state.auth.token)
  const { isFavorite, toggle } = useFavorites()
  const { addItem: addRecentlyViewed } = useRecentlyViewed()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [selectedSize, setSelectedSize] = useState<ClothingSize | null>(null)

  useEffect(() => {
    if (id) dispatch(fetchProductById(Number(id)))
  }, [dispatch, id])

  useEffect(() => {
    setQuantity(1)
    setAdded(false)
  }, [id])

  useEffect(() => {
    if (selected) {
      addRecentlyViewed({
        id: selected.id,
        name: selected.name,
        imageUrl: selected.imageUrl,
        price: selected.price,
        discountPrice: selected.discountPrice,
      })
    }
  }, [selected, addRecentlyViewed])

  if (status === 'loading' || !selected) return <Loader />

  const hasDiscount =
    selected.discountPrice != null && selected.discountPrice < selected.price
  const discountPct = hasDiscount
    ? Math.round(((selected.price - selected.discountPrice!) / selected.price) * 100)
    : 0
  const inStock = selected.stockQuantity > 0

  const handleAddToCart = () => {
    if (!token) { navigate('/login'); return }
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

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#888', marginBottom: 20 }}>
        <Link to="/" style={{ color: '#f27a1a' }}>Ana Sayfa</Link>
        <span>/</span>
        <Link to="/products" style={{ color: '#f27a1a' }}>Ürünler</Link>
        {selected.categoryName && (
          <>
            <span>/</span>
            <span>{selected.categoryName}</span>
          </>
        )}
        <span>/</span>
        <span style={{ color: '#333', fontWeight: 500 }}>{selected.name}</span>
      </nav>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 480px) 1fr', gap: 32, alignItems: 'start' }}>

        {/* Left – image */}
        <div style={{ position: 'sticky', top: 24 }}>
          <div
            style={{
              position: 'relative',
              borderRadius: 8,
              overflow: 'hidden',
              background: '#f9f9f9',
              border: '1px solid #e5e7eb',
              aspectRatio: '3 / 4',
            }}
          >
            <img
              src={selected.imageUrl || 'https://placehold.co/600x800?text=No+Image'}
              alt={selected.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)' }}
            />
            {hasDiscount && (
              <span style={{ position: 'absolute', top: 12, left: 12, background: '#f27a1a', color: '#fff', borderRadius: 4, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>
                -%{discountPct}
              </span>
            )}
            {!inStock && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ background: '#fff', color: '#111', fontWeight: 700, borderRadius: 6, padding: '8px 20px', fontSize: 15 }}>Stokta Yok</span>
              </div>
            )}
          </div>
        </div>

        {/* Right – info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* Brand row */}
          {selected.brand && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#f27a1a', letterSpacing: 0.3 }}>
                {selected.brand}
              </span>
              <button
                type="button"
                aria-label={favorited ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                onClick={() => toggle(selected.id)}
                style={{
                  background: favorited ? '#fff0f0' : '#f9f9f9',
                  border: `1.5px solid ${favorited ? '#fca5a5' : '#e5e7eb'}`,
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  fontSize: 18,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.15s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
              >
                {favorited ? '❤️' : '🤍'}
              </button>
            </div>
          )}

          {/* Product title */}
          <h1 style={{ margin: '0 0 16px', fontSize: 'clamp(17px, 2.5vw, 22px)', fontWeight: 700, lineHeight: 1.3, color: '#111' }}>
            {selected.name}
          </h1>

          {/* Price block */}
          <div style={{ marginBottom: 18 }}>
            {hasDiscount ? (
              <>
                <div style={{ display: 'inline-block', background: '#fff3e0', color: '#f27a1a', fontSize: 11, fontWeight: 700, borderRadius: 3, padding: '2px 8px', marginBottom: 6, letterSpacing: 0.5 }}>
                  İNDİRİMLİ FİYAT
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: '#111' }}>
                    {formatCurrency(selected.discountPrice!)}
                  </span>
                  <span style={{ textDecoration: 'line-through', color: '#aaa', fontSize: 16 }}>
                    {formatCurrency(selected.price)}
                  </span>
                </div>
              </>
            ) : (
              <span style={{ fontSize: 28, fontWeight: 800, color: '#111' }}>
                {formatCurrency(selected.price)}
              </span>
            )}
          </div>

          {/* Description */}
          {selected.description && (
            <p style={{ margin: '0 0 18px', fontSize: 14, lineHeight: 1.7, color: '#555' }}>
              {selected.description}
            </p>
          )}

          {/* Color */}
          {selected.color && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ margin: '0 0 8px', fontSize: 13, color: '#555', fontWeight: 600 }}>
                Renk
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  title={selected.color}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: selected.color,
                    border: '2px solid #f27a1a',
                    boxShadow: '0 0 0 1px #f27a1a',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 13, color: '#555', fontFamily: 'monospace' }}>
                  {selected.color}
                </span>
              </div>
            </div>
          )}

          {/* Bedenler */}
          {(() => {
            const availableSizes: ClothingSize[] = selected.sizes
              ? (selected.sizes
                  .split(',')
                  .map(Number)
                  .filter((n): n is ClothingSize => !isNaN(n)) as ClothingSize[])
              : [selected.size]
            return (
              <div style={{ marginBottom: 18 }}>
                <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: '#333' }}>
                  Beden
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {availableSizes.map((size) => {
                    const active = selectedSize === size
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        style={{
                          padding: '7px 18px',
                          border: `2px solid ${active ? '#f27a1a' : '#e5e7eb'}`,
                          borderRadius: 8,
                          background: active ? '#fff3e0' : '#fff',
                          color: active ? '#f27a1a' : '#111',
                          fontWeight: 700,
                          fontSize: 14,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        {ClothingSizeLabels[size]}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })()}

          {/* Stock info */}
          <div style={{ marginBottom: 18 }}>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 600,
                background: inStock ? '#f0fdf4' : '#fef2f2',
                color: inStock ? '#166534' : '#991b1b',
                border: `1px solid ${inStock ? '#bbf7d0' : '#fecaca'}`,
              }}
            >
              {inStock ? `${selected.stockQuantity} adet mevcut` : 'Tükendi'}
            </span>
            {selected.categoryName && (
              <span style={{ marginLeft: 8, fontSize: 13, color: '#888' }}>
                Kategori: <strong style={{ color: '#555' }}>{selected.categoryName}</strong>
              </span>
            )}
          </div>

          {/* Quantity + Add to cart */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'stretch', marginBottom: 14 }}>
            {/* Quantity */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #e5e7eb',
                borderRadius: 8,
                overflow: 'hidden',
                background: '#fff',
              }}
            >
              <button type="button" onClick={() => changeQty(-1)} disabled={quantity <= 1} style={qtyBtnStyle(quantity <= 1)}>−</button>
              <span style={{ minWidth: 36, textAlign: 'center', fontSize: 15, fontWeight: 700 }}>{quantity}</span>
              <button type="button" onClick={() => changeQty(1)} disabled={quantity >= selected.stockQuantity} style={qtyBtnStyle(quantity >= selected.stockQuantity)}>+</button>
            </div>

            {/* Add to cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock}
              style={{
                flex: 1,
                background: !inStock ? '#d1d5db' : added ? '#16a34a' : '#111',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 700,
                cursor: !inStock ? 'not-allowed' : 'pointer',
                padding: '0 20px',
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'background 0.2s',
              }}
            >
              {!inStock ? 'Stokta Yok' : added ? '✓ Sepete Eklendi!' : '+ Sepete Ekle'}
            </button>
          </div>

          {/* Trust badges */}
          <div
            style={{
              display: 'flex',
              gap: 0,
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            {[
              { icon: '🚚', text: 'Ücretsiz kargo' },
              { icon: '↩️', text: '30 gün iade' },
              { icon: '🔒', text: 'Güvenli ödeme' },
            ].map((item, i) => (
              <div
                key={item.text}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  padding: '12px 8px',
                  borderLeft: i > 0 ? '1px solid #e5e7eb' : 'none',
                  fontSize: 12,
                  color: '#374151',
                  fontWeight: 500,
                }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

function qtyBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    width: 40,
    height: 48,
    border: 'none',
    background: disabled ? '#f3f4f6' : '#fff',
    color: disabled ? '#d1d5db' : '#111',
    fontSize: 20,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 700,
  }
}

export default ProductDetailPage
