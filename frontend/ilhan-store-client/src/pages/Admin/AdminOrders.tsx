import { useEffect, useState } from 'react'
import { orderService } from '@/services'
import { Loader } from '@/components/common/Loader'
import { formatCurrency, formatDate } from '@/utils/format'
import { OrderStatus, OrderStatusLabels } from '@/types'
import type { Order } from '@/types'

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    orderService
      .getMyOrders()
      .then(setOrders)
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleStatusChange = async (id: number, status: OrderStatus) => {
    await orderService.updateStatus(id, { status })
    load()
  }

  if (loading) return <Loader />

  return (
    <div>
      <h1>Sipariş Yönetimi</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--color-border)' }}>
            <th style={cellStyle}>Sipariş No</th>
            <th style={cellStyle}>Tarih</th>
            <th style={cellStyle}>Tutar</th>
            <th style={cellStyle}>Durum</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td style={cellStyle}>#{order.orderNumber}</td>
              <td style={cellStyle}>{formatDate(order.createdAt)}</td>
              <td style={cellStyle}>{formatCurrency(order.totalAmount)}</td>
              <td style={cellStyle}>
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order.id, Number(e.target.value) as OrderStatus)
                  }
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {Object.values(OrderStatus).map((value) => (
                    <option key={value} value={value}>
                      {OrderStatusLabels[value]}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const cellStyle: React.CSSProperties = { padding: '10px 8px' }

export default AdminOrdersPage
