import type { ReactNode } from 'react'

interface AuthCardProps {
  title: string
  children: ReactNode
  footer?: ReactNode
}

// Giriş / kayıt formlarını saran ortak kart bileşeni.
export function AuthCard({ title, children, footer }: AuthCardProps) {
  return (
    <div
      style={{
        maxWidth: 420,
        margin: '40px auto',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
        padding: 32,
        boxShadow: 'var(--shadow)',
      }}
    >
      <h1 style={{ marginTop: 0, textAlign: 'center' }}>{title}</h1>
      {children}
      {footer && (
        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14 }}>
          {footer}
        </div>
      )}
    </div>
  )
}
