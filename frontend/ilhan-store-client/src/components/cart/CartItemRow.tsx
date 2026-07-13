import { Link } from 'react-router-dom'
import type { CartItem } from '@/types'
import { formatCurrency } from '@/utils/format'

interface CartItemRowProps {
  item: CartItem
  onUpdateQuantity: (itemId: number, quantity: number) => void
  onRemove: (itemId: number) => void
}

export function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '80px 1fr auto auto auto',
        alignItems: 'center',
        gap: 16,
        padding: '14px 20px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-md)' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow)' }}
    >
      {/* Image */}
      <Link to={`/products/${item.productId}`}>
        <img
          src={item.productImageUrl || 'https://placehold.co/80x80?text=Ürün'}
          alt={item.productName}
          style={{
            width: 80,
            height: 80,
            objectFit: 'cover',
            borderRadius: 10,
            border: '1px solid var(--color-border)',
          }}
        />
      </Link>

      {/* Name + price */}
      <div>
        <Link to={`/products/${item.productId}`}>
          <h4
            style={{
              margin: '0 0 4px',
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--color-text)',
              lineHeight: 1.3,
            }}
          >
            {item.productName}
          </h4>
        </Link>
        <span style={{ color: 'var(--color-muted)', fontSize: 13 }}>
          Birim: {formatCurrency(item.unitPrice)}
        </span>
      </div>

      {/* Qty stepper */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          border: '1.5px solid var(--color-border)',
          borderRadius: 8,
          overflow: 'hidden',
          background: 'var(--color-bg)',
        }}
      >
        <button
          type="button"
          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
          disabled={item.quantity <= 1}
          style={stepperBtn(item.quantity <= 1)}
        >
          −
        </button>
        <span style={{ minWidth: 36, textAlign: 'center', fontSize: 15, fontWeight: 700 }}>
          {item.quantity}
        </span>
        <button
          type="button"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          style={stepperBtn(false)}
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <strong style={{ fontSize: 16, fontWeight: 700, minWidth: 90, textAlign: 'right' }}>
        {formatCurrency(item.subTotal)}
      </strong>

      {/* Remove */}
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        aria-label="Ürünü kaldır"
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: '#fee2e2',
          border: 'none',
          color: '#dc2626',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          flexShrink: 0,
          transition: 'background 0.15s, transform 0.15s',
        }}
        onMouseEnter={(e) => {
          const b = e.currentTarget as HTMLButtonElement
          b.style.background = '#fca5a5'
          b.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={(e) => {
          const b = e.currentTarget as HTMLButtonElement
          b.style.background = '#fee2e2'
          b.style.transform = 'scale(1)'
        }}
      >
        ✕
      </button>
    </div>
  )
}

function stepperBtn(disabled: boolean): React.CSSProperties {
  return {
    width: 34,
    height: 34,
    border: 'none',
    background: disabled ? '#f3f4f6' : 'transparent',
    color: disabled ? '#9ca3af' : 'var(--color-text)',
    fontSize: 17,
    fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background 0.15s',
  }
}
