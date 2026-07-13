import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { orderService } from '@/services'
import { Loader } from '@/components/common/Loader'
import { EmptyState } from '@/components/common/EmptyState'
import { formatCurrency, formatDate } from '@/utils/format'
import { OrderStatusLabels, PaymentStatusLabels } from '@/types'
import type { Order } from '@/types'

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderService
      .getMyOrders()
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  return (
    <div>
      <h1>Siparişlerim</h1>
      {orders.length === 0 ? (
        <EmptyState title="Henüz siparişiniz yok" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                padding: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong>#{order.orderNumber}</strong>
                <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
                  {formatDate(order.createdAt)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div>{OrderStatusLabels[order.status]}</div>
                <div style={{ color: 'var(--color-muted)', fontSize: 13 }}>
                  {PaymentStatusLabels[order.paymentStatus]}
                </div>
                <strong>{formatCurrency(order.totalAmount)}</strong>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersPage
