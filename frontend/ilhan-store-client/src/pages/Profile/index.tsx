import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '@/hooks'
import { useRecentlyViewed } from '@/hooks'
import { setUser } from '@/store/slices/authSlice'
import { userService, orderService } from '@/services'
import { Loader } from '@/components/common/Loader'
import { EmptyState } from '@/components/common/EmptyState'
import { TextField } from '@/components/ui/TextField'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/utils/format'
import { OrderStatusLabels, PaymentStatusLabels } from '@/types'
import type { User, Order } from '@/types'

type Tab = 'profile' | 'orders' | 'history' | 'coupons'

const TABS: { id: Tab; label: string }[] = [
  { id: 'profile', label: '👤 Profilim' },
  { id: 'orders', label: '📦 Siparişlerim' },
  { id: 'history', label: '🕐 Geçmişim' },
  { id: 'coupons', label: '🎟️ Kuponlarım' },
]

export function ProfilePage() {
  const dispatch = useAppDispatch()
  const [activeTab, setActiveTab] = useState<Tab>('profile')

  // Profil verisi
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  // Siparişler
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersLoaded, setOrdersLoaded] = useState(false)

  // Geçmişim
  const { items: recentItems, clear: clearHistory } = useRecentlyViewed()

  useEffect(() => {
    userService
      .getProfile()
      .then((data) => {
        setProfile(data)
        setFirstName(data.firstName)
        setLastName(data.lastName)
        setPhoneNumber(data.phoneNumber ?? '')
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (activeTab === 'orders' && !ordersLoaded) {
      setOrdersLoading(true)
      orderService
        .getMyOrders()
        .then((data) => {
          setOrders(data)
          setOrdersLoaded(true)
        })
        .finally(() => setOrdersLoading(false))
    }
  }, [activeTab, ordersLoaded])

  if (loading) return <Loader />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const updated = await userService.updateProfile({
        firstName,
        lastName,
        phoneNumber: phoneNumber || null,
      })
      setProfile(updated)
      dispatch(setUser(updated))
      setMessage('Profil güncellendi.')
    } catch (err) {
      setMessage((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ marginBottom: 4 }}>
        {profile?.firstName} {profile?.lastName}
      </h1>
      <p style={{ color: 'var(--color-muted)', marginBottom: 24 }}>{profile?.email}</p>

      {/* Sekmeler */}
      <div
        style={{
          display: 'flex',
          borderBottom: '2px solid var(--color-border)',
          marginBottom: 28,
          gap: 0,
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-muted)',
              borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
              marginBottom: -2,
              transition: 'color 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profil sekmesi */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
          <TextField
            label="Ad"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <TextField
            label="Soyad"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <TextField
            label="Telefon"
            name="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {message && (
            <p style={{ color: message === 'Profil güncellendi.' ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {message}
            </p>
          )}
          <Button type="submit" disabled={saving}>
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </form>
      )}

      {/* Siparişlerim sekmesi */}
      {activeTab === 'orders' && (
        <div>
          {ordersLoading ? (
            <Loader />
          ) : orders.length === 0 ? (
            <EmptyState title="Henüz siparişiniz yok" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <div>
                    <strong>#{order.orderNumber}</strong>
                    <div style={{ color: 'var(--color-muted)', fontSize: 13, marginTop: 2 }}>
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13 }}>{OrderStatusLabels[order.status]}</div>
                    <div style={{ color: 'var(--color-muted)', fontSize: 12 }}>
                      {PaymentStatusLabels[order.paymentStatus]}
                    </div>
                    <strong>{formatCurrency(order.totalAmount)}</strong>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Geçmişim sekmesi */}
      {activeTab === 'history' && (
        <div>
          {recentItems.length === 0 ? (
            <EmptyState title="Henüz hiçbir ürün gezmediniz" />
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                <Button variant="ghost" onClick={clearHistory} style={{ fontSize: 13 }}>
                  Geçmişi Temizle
                </Button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recentItems.map((item) => (
                  <Link
                    key={item.id}
                    to={`/products/${item.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: 12,
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 8,
                        overflow: 'hidden',
                        flexShrink: 0,
                        background: 'var(--color-bg)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <img
                        src={item.imageUrl || 'https://placehold.co/56x56?text=?'}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 2 }}>
                        {formatDate(item.viewedAt)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      {item.discountPrice != null && item.discountPrice < item.price ? (
                        <>
                          <div style={{ fontWeight: 700, color: 'var(--color-danger)' }}>
                            {formatCurrency(item.discountPrice)}
                          </div>
                          <div style={{ fontSize: 12, textDecoration: 'line-through', color: 'var(--color-muted)' }}>
                            {formatCurrency(item.price)}
                          </div>
                        </>
                      ) : (
                        <div style={{ fontWeight: 700 }}>{formatCurrency(item.price)}</div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Kuponlarım sekmesi */}
      {activeTab === 'coupons' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '48px 0',
            gap: 12,
            color: 'var(--color-muted)',
          }}
        >
          <span style={{ fontSize: 48 }}>🎟️</span>
          <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Kuponlarım</h3>
          <p style={{ margin: 0, textAlign: 'center', maxWidth: 320 }}>
            Aktif kuponunuz bulunmuyor. Kampanyalarımızı takip ederek indirim fırsatlarını kaçırmayın!
          </p>
          <Link
            to="/products"
            style={{
              marginTop: 8,
              padding: '10px 24px',
              background: 'var(--color-primary)',
              color: '#fff',
              borderRadius: 'var(--radius)',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Alışverişe Devam Et
          </Link>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
