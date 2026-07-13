import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { logout } from '@/store/slices/authSlice'

const NAV_ITEMS = [
  { to: '/admin', label: 'Genel Bakış', icon: '📊', end: true },
  { to: '/admin/products', label: 'Ürünler', icon: '👕', end: false },
  { to: '/admin/categories', label: 'Kategoriler', icon: '🗂️', end: false },
  { to: '/admin/orders', label: 'Siparişler', icon: '📦', end: false },
]

export function AdminLayout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 256,
          background: '#0f172a',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: '24px 20px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>
            İlhan Store
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              marginTop: 6,
              background: 'rgba(37,99,235,0.3)',
              border: '1px solid rgba(37,99,235,0.5)',
              borderRadius: 6,
              padding: '2px 8px',
              fontSize: 11,
              fontWeight: 700,
              color: '#93c5fd',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            🔐 Yönetim Paneli
          </div>
        </div>

        {/* Navigasyon */}
        <nav style={{ padding: '12px 12px', flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                marginBottom: 2,
                background: isActive ? 'rgba(37,99,235,0.85)' : 'transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                fontWeight: isActive ? 700 : 500,
                fontSize: 14,
                transition: 'all 0.15s',
              })}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Profil Bölümü */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 800,
                color: '#fff',
                flexShrink: 0,
              }}
            >
              {user?.firstName?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#fff',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.firstName} {user?.lastName}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: '#93c5fd',
                  fontWeight: 600,
                }}
              >
                Yönetici
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            ↩ Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Ana içerik */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        {/* Üst başlık çubuğu */}
        <header
          style={{
            background: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
            padding: '0 28px',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: 'var(--color-muted)',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--color-success)',
                display: 'inline-block',
              }}
            />
            {user?.firstName} {user?.lastName}
            <span
              style={{
                background: '#dbeafe',
                color: '#1d4ed8',
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 6,
              }}
            >
              Admin
            </span>
          </div>
        </header>

        <main style={{ flex: 1, padding: 28 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
