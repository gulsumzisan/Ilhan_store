import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { login } from '@/store/slices/authSlice'
import { TextField } from '@/components/ui/TextField'
import { Button } from '@/components/ui/Button'
import { UserRole } from '@/types'

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { status, error, token, user } = useAppSelector((state) => state.auth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (token) {
    return <Navigate to={user?.role === UserRole.Admin ? '/admin' : '/'} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await dispatch(login({ email, password }))
    if (login.fulfilled.match(result)) {
      const role = result.payload.user.role
      navigate(role === UserRole.Admin ? '/admin' : '/', { replace: true })
    }
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 8px', textAlign: 'center', fontSize: 22 }}>
        Giriş Yap
      </h2>
      <p style={{ margin: '0 0 24px', textAlign: 'center', color: 'var(--color-muted)', fontSize: 14 }}>
        Hesabınıza giriş yapın
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <TextField
          label="E-posta"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Şifre"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 8,
              padding: '10px 14px',
              color: 'var(--color-danger)',
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <Button type="submit" fullWidth disabled={status === 'loading'}>
          {status === 'loading' ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </Button>
      </form>

      <p style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: 'var(--color-muted)' }}>
        Hesabınız yok mu?{' '}
        <Link
          to="/register"
          style={{ color: 'var(--color-primary)', fontWeight: 600 }}
        >
          Kayıt olun
        </Link>
      </p>
    </div>
  )
}

export default LoginPage
