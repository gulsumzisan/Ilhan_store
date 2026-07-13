import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 0' }}>
      <h1 style={{ fontSize: 72, margin: 0 }}>404</h1>
      <p style={{ color: 'var(--color-muted)', marginBottom: 24 }}>
        Aradığınız sayfa bulunamadı.
      </p>
      <Link to="/">
        <Button>Ana Sayfaya Dön</Button>
      </Link>
    </div>
  )
}

export default NotFoundPage
