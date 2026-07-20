import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logoImg from '@/assets/images/logo.png'
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

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
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
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

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
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const rootCategories = categories.filter((c) => c.isMainCategory)
  const subOf = (parentId: number) => categories.filter((c) => c.parentCategoryIds.includes(parentId))

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchTerm.trim()
    if (q) {
      navigate(`/products?searchTerm=${encodeURIComponent(q)}`)
    } else {
      navigate('/products')
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    setProfileOpen(false)
    navigate('/login')
  }

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
      <div className="container">

        {/* ── Üst satır: Logo | Arama | Aksiyonlar ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            alignItems: 'center',
            gap: 20,
            padding: '12px 0',
          }}
        >
          {/* Sol: Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            <img
              src={logoImg}
              alt="İlhan Store"
              style={{ height: 64, width: 'auto', objectFit: 'contain' }}
            />
          </Link>

          {/* Orta: Arama */}
          <form
            onSubmit={handleSearch}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--color-bg)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => { (e.currentTarget as HTMLFormElement).style.borderColor = 'var(--color-primary)' }}
            onBlur={(e) => { (e.currentTarget as HTMLFormElement).style.borderColor = 'var(--color-border)' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', paddingLeft: 14, color: 'var(--color-muted)', flexShrink: 0 }}>
              <SearchIcon />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ürün, kategori veya marka ara..."
              style={{ flex: 1, padding: '11px 12px', background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: 'var(--color-text)' }}
            />
            {searchTerm && (
              <button type="button" onClick={() => setSearchTerm('')}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0 8px', color: 'var(--color-muted)', fontSize: 18, lineHeight: 1, display: 'flex', alignItems: 'center' }}>
                ×
              </button>
            )}
            <button type="submit"
              style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', padding: '11px 20px', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'opacity 0.15s', flexShrink: 0 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}>
              Ara
            </button>
          </form>

          {/* Sağ: Auth + Favoriler + Sepet */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>

            {/* Auth */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }} ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((v) => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: profileOpen ? 'var(--color-bg)' : 'transparent',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius)', padding: '8px 12px',
                    cursor: 'pointer', fontSize: 14, fontWeight: 600,
                    color: 'var(--color-text)', transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { if (!profileOpen) (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg)' }}
                  onMouseLeave={(e) => { if (!profileOpen) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                >
                  <UserIcon />
                  {user?.firstName ?? 'Profil'}
                  <ChevronIcon open={profileOpen} />
                </button>

                {profileOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    minWidth: 220, background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)', borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow-md)', overflow: 'hidden', zIndex: 200,
                  }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text)' }}>{user?.firstName} {user?.lastName}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>{user?.email}</div>
                    </div>
                    {[
                      { label: 'Profilim', to: '/profile' },
                      { label: 'Siparişlerim', to: '/orders' },
                      { label: 'Favorilerim', to: '/favorites' },
                      ...(user?.role === UserRole.Admin ? [{ label: 'Yönetim Paneli', to: '/admin' }] : []),
                    ].map((item) => (
                      <Link key={item.to} to={item.to} onClick={() => setProfileOpen(false)}
                        style={{ display: 'block', padding: '11px 16px', textDecoration: 'none', color: 'var(--color-text)', fontSize: 14, fontWeight: 500, borderBottom: '1px solid var(--color-border)', transition: 'background 0.12s' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--color-bg)' }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}>
                        {item.label}
                      </Link>
                    ))}
                    <button type="button" onClick={handleLogout}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '11px 16px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: 'var(--color-danger)', transition: 'background 0.12s' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg)' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}>
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 6 }}>
                <NavLink to="/login"
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', borderRadius: 'var(--radius)',
                    border: '1px solid var(--color-border)',
                    textDecoration: 'none', fontSize: 14, fontWeight: 600,
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                    background: 'transparent',
                  })}>
                  <UserIcon /> Giriş Yap
                </NavLink>
                <NavLink to="/register"
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', borderRadius: 'var(--radius)',
                    border: '1px solid var(--color-primary)',
                    textDecoration: 'none', fontSize: 14, fontWeight: 600,
                    color: '#fff', background: isActive ? 'var(--color-primary-dark)' : 'var(--color-primary)',
                  })}>
                  Kayıt Ol
                </NavLink>
              </div>
            )}

            {/* Favoriler */}
            <button type="button" aria-label="Favoriler" onClick={() => navigate('/favorites')}
              style={{
                position: 'relative', background: 'transparent',
                border: '1px solid var(--color-border)', borderRadius: '50%',
                width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: favoriteCount > 0 ? 'var(--color-danger)' : 'var(--color-muted)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}>
              <HeartIcon />
              {favoriteCount > 0 && (
                <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--color-danger)', color: '#fff', borderRadius: 999, fontSize: 10, fontWeight: 700, minWidth: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', lineHeight: 1 }}>
                  {favoriteCount}
                </span>
              )}
            </button>

            {/* Sepet */}
            <button type="button" aria-label="Sepet" onClick={() => navigate('/cart')}
              style={{
                position: 'relative', background: 'transparent',
                border: '1px solid var(--color-border)', borderRadius: '50%',
                width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: itemCount > 0 ? 'var(--color-primary)' : 'var(--color-muted)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}>
              <CartIcon />
              {itemCount > 0 && (
                <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--color-primary)', color: '#fff', borderRadius: 999, fontSize: 10, fontWeight: 700, minWidth: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', lineHeight: 1 }}>
                  {itemCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* ── Alt satır: Kategoriler butonu + kategori linkleri ── */}
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {/* Kategoriler dropdown */}
          <div style={{ position: 'relative', flexShrink: 0 }} ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: menuOpen ? 'var(--color-bg)' : 'transparent',
                border: 'none', borderRight: '1px solid var(--color-border)',
                padding: '11px 16px', cursor: 'pointer',
                fontSize: 14, fontWeight: 700, color: 'var(--color-text)',
                transition: 'background 0.15s', whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { if (!menuOpen) (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg)' }}
              onMouseLeave={(e) => { if (!menuOpen) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
            >
              <HamburgerIcon open={menuOpen} />
              Kategoriler
            </button>

            {menuOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 1px)', left: 0,
                minWidth: 260, background: 'var(--color-surface)',
                border: '1px solid var(--color-border)', borderRadius: '0 0 var(--radius) var(--radius)',
                boxShadow: 'var(--shadow-md)', overflow: 'hidden', zIndex: 200,
                animation: 'slideDown 0.22s ease both',
              }}>
                {rootCategories.length === 0 ? (
                  <div style={{ padding: '12px 16px', color: 'var(--color-muted)', fontSize: 14 }}>Kategori bulunamadı</div>
                ) : (
                  rootCategories.map((cat) => {
                    const subs = subOf(cat.id)
                    const isExpanded = expandedId === cat.id
                    return (
                      <div key={cat.id}>
                        <div
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 16px', borderBottom: '1px solid var(--color-border)', cursor: 'pointer', transition: 'background 0.12s' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--color-bg)' }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
                        >
                          <Link to={`/products?categoryId=${cat.id}`} onClick={() => setMenuOpen(false)}
                            style={{ flex: 1, textDecoration: 'none', color: 'var(--color-text)', fontWeight: 600, fontSize: 14 }}>
                            {cat.name}
                          </Link>
                          {subs.length > 0 && (
                            <button type="button"
                              onClick={(e) => { e.stopPropagation(); setExpandedId(isExpanded ? null : cat.id) }}
                              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 4px', color: 'var(--color-muted)', display: 'flex', alignItems: 'center' }}>
                              <ChevronIcon open={isExpanded} />
                            </button>
                          )}
                        </div>
                        {isExpanded && subs.length > 0 && (
                          <div style={{ background: 'var(--color-bg)', animation: 'slideDown 0.18s ease both' }}>
                            {subs.map((sub) => (
                              <Link key={sub.id} to={`/products?categoryId=${sub.id}`} onClick={() => setMenuOpen(false)}
                                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px 9px 28px', textDecoration: 'none', color: 'var(--color-muted)', fontSize: 13, fontWeight: 500, borderBottom: '1px solid var(--color-border)', transition: 'background 0.12s, color 0.12s' }}
                                onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'var(--color-surface)'; el.style.color = 'var(--color-primary)' }}
                                onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'transparent'; el.style.color = 'var(--color-muted)' }}>
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

          {/* Yatay kategori linkleri */}
          {rootCategories.map((cat) => (
            <NavLink
              key={cat.id}
              to={`/products?categoryId=${cat.id}`}
              style={({ isActive }) => ({
                padding: '11px 14px',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                transition: 'color 0.15s, border-color 0.15s',
              })}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-primary)' }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                if (!el.classList.contains('active')) el.style.color = 'var(--color-text)'
              }}
            >
              {cat.name}
            </NavLink>
          ))}
        </div>

      </div>
    </header>
  )
}
