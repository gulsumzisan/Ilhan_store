import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)',
        padding: 16,
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: '#fff',
            letterSpacing: '-0.5px',
          }}
        >
          İlhan Store
        </div>
        <div style={{ color: 'rgba(255,255,255,0.75)', marginTop: 4, fontSize: 14 }}>
          Yönetim & Alışveriş Platformu
        </div>
      </div>

      {/* İçerik kartı */}
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          padding: '36px 40px',
          width: '100%',
          maxWidth: 440,
          overflow: 'hidden',
        }}
      >
        <Outlet />
      </div>

      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 24 }}>
        © 2026 İlhan Store
      </p>
    </div>
  )
}

export default AuthLayout
