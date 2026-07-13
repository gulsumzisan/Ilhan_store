import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks'
import {
  clearCart,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from '@/store/slices/cartSlice'
import { CartItemRow } from '@/components/cart/CartItemRow'
import { Loader } from '@/components/common/Loader'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/utils/format'

export function CartPage() {
  const dispatch = useAppDispatch()
  const { cart, status } = useAppSelector((state) => state.cart)

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  if (status === 'loading' && !cart) {
    return <Loader />
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>🛒 Sepetim</h1>
        <EmptyState
          title="Sepetiniz boş"
          description="Beğendiğiniz ürünleri sepete ekleyerek alışverişe başlayın."
        />
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Link to="/products">
            <Button>Ürünlere Göz At</Button>
          </Link>
        </div>
      </div>
    )
  }

  const itemCount = cart.items.reduce((s, i) => s + i.quantity, 0)
  const shippingFree = cart.totalAmount >= 500
  const shippingCost = shippingFree ? 0 : 49.99

  return (
    <div className="animate-fadeIn">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>🛒 Sepetim</h1>
        <span className="badge badge-primary">{itemCount} ürün</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: 28,
          alignItems: 'start',
        }}
      >
        {/* ── Left: items list ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cart.items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onUpdateQuantity={(itemId, quantity) =>
                dispatch(updateCartItem({ itemId, payload: { quantity } }))
              }
              onRemove={(itemId) => dispatch(removeCartItem(itemId))}
            />
          ))}

          <div style={{ marginTop: 8 }}>
            <button
              type="button"
              onClick={() => dispatch(clearCart())}
              style={{
                background: 'transparent',
                border: '1px solid var(--color-border)',
                color: 'var(--color-danger)',
                borderRadius: 'var(--radius)',
                padding: '8px 18px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#fee2e2' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
            >
              🗑️ Sepeti Temizle
            </button>
          </div>
        </div>

        {/* ── Right: order summary ── */}
        <aside
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 24,
            boxShadow: 'var(--shadow-md)',
            position: 'sticky',
            top: 24,
          }}
        >
          <h3 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 800 }}>
            Sipariş Özeti
          </h3>

          {cart.items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
                fontSize: 14,
                gap: 8,
              }}
            >
              <span style={{ color: 'var(--color-muted)', flex: 1, lineHeight: 1.4 }}>
                {item.productName}
                {item.quantity > 1 && (
                  <span style={{ marginLeft: 4, fontWeight: 600 }}>× {item.quantity}</span>
                )}
              </span>
              <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                {formatCurrency(item.subTotal)}
              </span>
            </div>
          ))}

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '16px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
            <Row label="Ara Toplam" value={formatCurrency(cart.totalAmount)} />
            <Row
              label="Kargo"
              value={shippingFree ? 'Ücretsiz' : formatCurrency(shippingCost)}
              valueColor={shippingFree ? 'var(--color-success)' : undefined}
            />
            {!shippingFree && (
              <p style={{ margin: 0, fontSize: 12, color: 'var(--color-muted)' }}>
                {formatCurrency(500 - cart.totalAmount)} daha ekleyin, kargo ücretsiz olsun.
              </p>
            )}
          </div>

          <hr style={{ border: 'none', borderTop: '1.5px solid var(--color-border)', margin: '16px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontWeight: 800, fontSize: 16 }}>Toplam</span>
            <span style={{ fontWeight: 800, fontSize: 22, color: 'var(--color-primary)' }}>
              {formatCurrency(cart.totalAmount + shippingCost)}
            </span>
          </div>

          <Link to="/checkout">
            <Button fullWidth>Ödemeye Geç →</Button>
          </Link>

          <Link to="/products">
            <button
              type="button"
              style={{
                width: '100%',
                marginTop: 10,
                background: 'transparent',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                padding: '10px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                color: 'var(--color-muted)',
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={(e) => {
                const b = e.currentTarget as HTMLButtonElement
                b.style.borderColor = 'var(--color-primary)'
                b.style.color = 'var(--color-primary)'
              }}
              onMouseLeave={(e) => {
                const b = e.currentTarget as HTMLButtonElement
                b.style.borderColor = 'var(--color-border)'
                b.style.color = 'var(--color-muted)'
              }}
            >
              Alışverişe Devam Et
            </button>
          </Link>

          {/* Trust */}
          <div
            style={{
              marginTop: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              padding: '12px 14px',
              background: '#f0fdf4',
              borderRadius: 8,
              fontSize: 12,
              color: '#166534',
            }}
          >
            <span>🔒 Güvenli ödeme</span>
            <span>↩️ 30 gün iade hakkı</span>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  valueColor,
}: {
  label: string
  value: string
  valueColor?: string
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: 'var(--color-muted)' }}>{label}</span>
      <span style={{ fontWeight: 600, color: valueColor }}>{value}</span>
    </div>
  )
}

export default CartPage
