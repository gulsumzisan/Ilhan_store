import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { orderService } from '@/services'
import { Loader } from '@/components/common/Loader'
import { EmptyState } from '@/components/common/EmptyState'
import { formatCurrency, formatDate } from '@/utils/format'
import { OrderStatusLabels, PaymentStatusLabels } from '@/types'
import type { Order } from '@/types'

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    orderService
      .getById(Number(id))
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loader />
  if (!order) return <EmptyState title="Sipariş bulunamadı" />

  return (
    <div>
      <h1>Sipariş #{order.orderNumber}</h1>
      <p style={{ color: 'var(--color-muted)' }}>{formatDate(order.createdAt)}</p>

      <div style={{ display: 'flex', gap: 24, margin: '16px 0' }}>
        <span>Durum: <strong>{OrderStatusLabels[order.status]}</strong></span>
        <span>Ödeme: <strong>{PaymentStatusLabels[order.paymentStatus]}</strong></span>
      </div>

      <h3>Teslimat Adresi</h3>
      <p>{order.shippingAddress}</p>
      {order.notes && (
        <>
          <h3>Not</h3>
          <p>{order.notes}</p>
        </>
      )}

      <h3>Ürünler</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {order.items.map((item) => (
          <div
            key={item.productId}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: 12,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
            }}
          >
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'right', marginTop: 16, fontSize: 20 }}>
        <strong>Toplam: {formatCurrency(order.totalAmount)}</strong>
      </div>
    </div>
  )
}

export default OrderDetailPage
