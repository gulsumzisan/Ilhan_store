import { Link, NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { logout } from '@/store/slices/authSlice'
import { UserRole } from '@/types'

export function Navbar() {
  const dispatch = useAppDispatch()
  const { user, token } = useAppSelector((state) => state.auth)
  const cart = useAppSelector((state) => state.cart.cart)
  const itemCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0
  const isAuthenticated = Boolean(token)

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
        <Link
          to="/"
          style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-primary)' }}
        >
          İlhan Store
        </Link>

        <nav style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <NavLink to="/products" style={linkStyle}>
            Ürünler
          </NavLink>
          <NavLink to="/categories" style={linkStyle}>
            Kategoriler
          </NavLink>
          <NavLink to="/favorites" style={linkStyle}>
            Favoriler
          </NavLink>
          <NavLink to="/cart" style={linkStyle}>
            Sepet {itemCount > 0 && `(${itemCount})`}
          </NavLink>

          {isAuthenticated ? (
            <>
              {user?.role === UserRole.Admin && (
                <NavLink to="/admin" style={linkStyle}>
                  Yönetim
                </NavLink>
              )}
              <NavLink to="/orders" style={linkStyle}>
                Siparişlerim
              </NavLink>
              <NavLink to="/profile" style={linkStyle}>
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
                }}
              >
                Çıkış
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" style={linkStyle}>
                Giriş
              </NavLink>
              <NavLink to="/register" style={linkStyle}>
                Kayıt Ol
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
