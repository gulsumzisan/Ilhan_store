import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { logout } from '@/store/slices/authSlice'
import { fetchCategories } from '@/store/slices/categorySlice'
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

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export function Navbar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, token } = useAppSelector((state) => state.auth)
  const cart = useAppSelector((state) => state.cart.cart)
  const categories = useAppSelector((state) => state.categories.items)
  const categoriesStatus = useAppSelector((state) => state.categories.status)
  const itemCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0
  const isAuthenticated = Boolean(token)
  const { ids: favoriteIds } = useFavorites()
  const favoriteCount = favoriteIds.length

  const [menuOpen, setMenuOpen] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (categoriesStatus === 'idle') {
      dispatch(fetchCategories())
    }
  }, [categoriesStatus, dispatch])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const rootCategories = categories.filter((c) => !c.parentCategoryId)
  const subOf = (parentId: number) => categories.filter((c) => c.parentCategoryId === parentId)

  return (
    <header
      style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          height: 64,
          gap: 16,
        }}
      >
        {/* Sol: Hamburger Kategoriler */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} ref={menuRef}>
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: menuOpen ? 'var(--color-bg)' : 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                padding: '7px 14px',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--color-text)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!menuOpen) (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg)'
              }}
              onMouseLeave={(e) => {
                if (!menuOpen) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
              }}
            >
              <HamburgerIcon open={menuOpen} />
              Kategoriler
            </button>

            {/* Dropdown panel */}
            {menuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  minWidth: 260,
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  boxShadow: 'var(--shadow-md)',
                  overflow: 'hidden',
                  zIndex: 200,
                }}
              >
                {rootCategories.length === 0 ? (
                  <div style={{ padding: '12px 16px', color: 'var(--color-muted)', fontSize: 14 }}>
                    Kategori bulunamadı
                  </div>
                ) : (
                  rootCategories.map((cat) => {
                    const subs = subOf(cat.id)
                    const isExpanded = expandedId === cat.id
                    return (
                      <div key={cat.id}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '11px 16px',
                            borderBottom: '1px solid var(--color-border)',
                            cursor: 'pointer',
                            transition: 'background 0.12s',
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLDivElement).style.background = 'var(--color-bg)'
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLDivElement).style.background = 'transparent'
                          }}
                        >
                          <Link
                            to={`/products?categoryId=${cat.id}`}
                            onClick={() => setMenuOpen(false)}
                            style={{
                              flex: 1,
                              textDecoration: 'none',
                              color: 'var(--color-text)',
                              fontWeight: 600,
                              fontSize: 14,
                            }}
                          >
                            {cat.name}
                          </Link>
                          {subs.length > 0 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setExpandedId(isExpanded ? null : cat.id)
                              }}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '2px 4px',
                                color: 'var(--color-muted)',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <ChevronIcon open={isExpanded} />
                            </button>
                          )}
                        </div>

                        {/* Alt kategoriler */}
                        {isExpanded && subs.length > 0 && (
                          <div style={{ background: 'var(--color-bg)' }}>
                            {subs.map((sub) => (
                              <Link
                                key={sub.id}
                                to={`/products?categoryId=${sub.id}`}
                                onClick={() => setMenuOpen(false)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                  padding: '9px 16px 9px 28px',
                                  textDecoration: 'none',
                                  color: 'var(--color-muted)',
                                  fontSize: 13,
                                  fontWeight: 500,
                                  borderBottom: '1px solid var(--color-border)',
                                  transition: 'background 0.12s, color 0.12s',
                                }}
                                onMouseEnter={(e) => {
                                  const el = e.currentTarget as HTMLAnchorElement
                                  el.style.background = 'var(--color-surface)'
                                  el.style.color = 'var(--color-primary)'
                                }}
                                onMouseLeave={(e) => {
                                  const el = e.currentTarget as HTMLAnchorElement
                                  el.style.background = 'transparent'
                                  el.style.color = 'var(--color-muted)'
                                }}
                              >
                                <span style={{ color: 'var(--color-primary)', fontSize: 12 }}>↳</span>
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>

          {/* Admin linki */}
          {isAuthenticated && user?.role === UserRole.Admin && (
            <nav style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <NavLink
                to="/admin"
                style={({ isActive }) => ({
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 14,
                  textDecoration: 'none',
                })}
              >
                Yönetim
              </NavLink>
            </nav>
          )}
        </div>

        {/* Orta: Logo */}
        <Link
          to="/"
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: 'var(--color-primary)',
            textDecoration: 'none',
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          İlhan Store
        </Link>

        {/* Sağ: ikonlar + profil */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
          {/* Favoriler */}
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

          {/* Sepet */}
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

          {/* Auth */}
          {isAuthenticated ? (
            <NavLink
              to="/profile"
              style={({ isActive }) => ({
                color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                fontWeight: isActive ? 700 : 500,
                fontSize: 14,
                textDecoration: 'none',
              })}
            >
              {user?.firstName ?? 'Profil'}
            </NavLink>
          ) : (
            <>
              <NavLink
                to="/login"
                style={({ isActive }) => ({
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 14,
                  textDecoration: 'none',
                })}
              >
                Giriş
              </NavLink>
              <NavLink
                to="/register"
                style={({ isActive }) => ({
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 14,
                  textDecoration: 'none',
                })}
              >
                Kayıt Ol
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
