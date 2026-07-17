import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  categoryService,
  orderService,
  productService,
  userService,
} from '@/services'
import { ProductFormModal } from '@/components/product/ProductFormModal'
import { Loader } from '@/components/common/Loader'
import { Button } from '@/components/ui/Button'
import type { CreateProductRequest } from '@/types'

interface Stats {
  products: number
  categories: number
  orders: number
  users: number
}

const STAT_CARDS = [
  { key: 'products' as const, label: 'Toplam Ürün', icon: '👕', color: '#c4687e', bg: '#fce4ec' },
  { key: 'categories' as const, label: 'Kategori', icon: '🗂️', color: '#9b5a8c', bg: '#f3e8f9' },
  { key: 'orders' as const, label: 'Sipariş', icon: '📦', color: '#d97706', bg: '#fef3c7' },
  { key: 'users' as const, label: 'Kullanıcı', icon: '👥', color: '#16a34a', bg: '#dcfce7' },
]

export function AdminDashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<Stats | null>(null)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [addSuccess, setAddSuccess] = useState(false)

  const loadStats = () => {
    Promise.all([
      productService.getAll(),
      categoryService.getAll(),
      orderService.getMyOrders(),
      userService.getAll().catch(() => []),
    ]).then(([products, categories, orders, users]) =>
      setStats({
        products: products.length,
        categories: categories.length,
        orders: orders.length,
        users: users.length,
      }),
    )
  }

  useEffect(() => {
    loadStats()
  }, [])

  const handleProductAdd = async (data: CreateProductRequest) => {
    await productService.create(data)
    setAddSuccess(true)
    loadStats()
    setTimeout(() => setAddSuccess(false), 3000)
  }

  if (!stats) return <Loader />

  return (
    <>
      {addModalOpen && (
        <ProductFormModal
          onSubmit={handleProductAdd}
          onClose={() => setAddModalOpen(false)}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* Sayfa başlığı */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: 24 }}>Genel Bakış</h1>
            <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: 14 }}>
              Mağazanızın anlık durumu
            </p>
          </div>
          <Button onClick={() => setAddModalOpen(true)}>
            + Hızlı Ürün Ekle
          </Button>
        </div>

        {/* Başarı mesajı */}
        {addSuccess && (
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #86efac',
              borderRadius: 10,
              padding: '12px 16px',
              color: '#15803d',
              fontWeight: 600,
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            ✅ Ürün başarıyla eklendi!
          </div>
        )}

        {/* İstatistik kartları */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
          }}
        >
          {STAT_CARDS.map((card) => (
            <div
              key={card.key}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 12,
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                boxShadow: 'var(--shadow)',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: card.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: card.color, lineHeight: 1 }}>
                  {stats[card.key]}
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 4 }}>
                  {card.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hızlı erişim */}
        <div>
          <h2 style={{ fontSize: 16, margin: '0 0 14px', color: 'var(--color-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: 12 }}>
            Hızlı Erişim
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {[
              { label: 'Ürün Ekle', desc: 'Yeni ürün ekleyin', icon: '➕', action: () => setAddModalOpen(true) },
              { label: 'Ürünleri Yönet', desc: 'Tüm ürünleri görün', icon: '👕', action: () => navigate('/admin/products') },
              { label: 'Kategoriler', desc: 'Kategori yönetimi', icon: '🗂️', action: () => navigate('/admin/categories') },
              { label: 'Siparişler', desc: 'Sipariş takibi', icon: '📦', action: () => navigate('/admin/orders') },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 10,
                  padding: '16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>{item.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminDashboardPage
