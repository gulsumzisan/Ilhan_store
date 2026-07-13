import { Link } from 'react-router-dom'
import type { Product } from '@/types'
import { formatCurrency } from '@/utils/format'
import { Button } from '@/components/ui/Button'
import { useFavorites } from '@/hooks'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { isFavorite, toggle } = useFavorites()
  const favorited = isFavorite(product.id)
  const hasDiscount =
    product.discountPrice != null && product.discountPrice < product.price

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
      }}
    >
      {/* Favori butonu — görselin üst sağ köşesi */}
      <button
        type="button"
        aria-label={favorited ? 'Favorilerden çıkar' : 'Favorilere ekle'}
        onClick={() => toggle(product.id)}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          background: 'rgba(255,255,255,0.85)',
          border: 'none',
          borderRadius: '50%',
          width: 34,
          height: 34,
          fontSize: 18,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
          transition: 'transform 0.15s',
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.15)')
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)')
        }
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

      <div
        style={{
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          flex: 1,
        }}
      >
        <Link to={`/products/${product.id}`}>
          <h3 style={{ margin: 0, fontSize: 15 }}>{product.name}</h3>
        </Link>
        {product.brand && (
          <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>
            {product.brand}
          </span>
        )}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'baseline',
            gap: 8,
          }}
        >
          {hasDiscount ? (
            <>
              <strong style={{ color: 'var(--color-danger)' }}>
                {formatCurrency(product.discountPrice!)}
              </strong>
              <span
                style={{
                  textDecoration: 'line-through',
                  color: 'var(--color-muted)',
                  fontSize: 13,
                }}
              >
                {formatCurrency(product.price)}
              </span>
            </>
          ) : (
            <strong>{formatCurrency(product.price)}</strong>
          )}
        </div>
        {onAddToCart && (
          <Button
            variant="primary"
            fullWidth
            disabled={product.stockQuantity <= 0}
            onClick={() => onAddToCart(product)}
          >
            {product.stockQuantity > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
          </Button>
        )}
      </div>
    </div>
  )
}
