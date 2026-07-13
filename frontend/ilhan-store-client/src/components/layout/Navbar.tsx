import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { logout } from '@/store/slices/authSlice'
import { useFavorites } from '@/hooks'
import { UserRole } from '@/types'

function HeartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

export function Navbar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, token } = useAppSelector((state) => state.auth)
  const cart = useAppSelector((state) => state.cart.cart)
  const itemCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0
  const isAuthenticated = Boolean(token)
  const { ids: favoriteIds } = useFavorites()
  const favoriteCount = favoriteIds.length

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
    fontWeight: isActive ? 700 : 500,
  })

  return (
    <header
      style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
          gap: 24,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-primary)', flexShrink: 0 }}
        >
          İlhan Store
        </Link>

        {/* Ana nav linkleri */}
        <nav style={{ display: 'flex', gap: 20, alignItems: 'center', flex: 1 }}>
          <NavLink to="/products" style={linkStyle}>
            Ürünler
          </NavLink>
          <NavLink to="/categories" style={linkStyle}>
            Kategoriler
          </NavLink>

          {isAuthenticated && (
            <>
              {user?.role === UserRole.Admin && (
                <NavLink to="/admin" style={linkStyle}>
                  Yönetim
                </NavLink>
              )}
            </>
          )}
        </nav>

        {/* Sağ kısım: ikonlar + auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

          {/* Favoriler ikonu */}
          <button
            type="button"
            aria-label="Favoriler"
            onClick={() => navigate('/favorites')}
            style={{
              position: 'relative',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: favoriteCount > 0 ? 'var(--color-danger)' : 'var(--color-muted)',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
            }}
          >
            <HeartIcon />
            {favoriteCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  background: 'var(--color-danger)',
                  color: '#fff',
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: 700,
                  minWidth: 18,
                  height: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  lineHeight: 1,
                }}
              >
                {favoriteCount}
              </span>
            )}
          </button>

          {/* Sepet ikonu */}
          <button
            type="button"
            aria-label="Sepet"
            onClick={() => navigate('/cart')}
            style={{
              position: 'relative',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: itemCount > 0 ? 'var(--color-primary)' : 'var(--color-muted)',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
            }}
          >
            <CartIcon />
            {itemCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  background: 'var(--color-primary)',
                  color: '#fff',
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: 700,
                  minWidth: 18,
                  height: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  lineHeight: 1,
                }}
              >
                {itemCount}
              </span>
            )}
          </button>

          {/* Auth linkleri */}
          {isAuthenticated ? (
            <>
              <NavLink to="/orders" style={({ isActive }) => ({
                color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                fontWeight: isActive ? 700 : 500,
                fontSize: 14,
              })}>
                Siparişlerim
              </NavLink>
              <NavLink to="/profile" style={({ isActive }) => ({
                color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                fontWeight: isActive ? 700 : 500,
                fontSize: 14,
              })}>
                {user?.firstName ?? 'Profil'}
              </NavLink>
              <button
                type="button"
                onClick={() => dispatch(logout())}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                Çıkış
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" style={({ isActive }) => ({
                color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                fontWeight: isActive ? 700 : 500,
                fontSize: 14,
              })}>
                Giriş
              </NavLink>
              <NavLink to="/register" style={({ isActive }) => ({
                color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                fontWeight: isActive ? 700 : 500,
                fontSize: 14,
              })}>
                Kayıt Ol
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
