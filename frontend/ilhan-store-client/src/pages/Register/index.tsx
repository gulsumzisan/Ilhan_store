import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { register } from '@/store/slices/authSlice'
import { TextField } from '@/components/ui/TextField'
import { Button } from '@/components/ui/Button'
import { UserRole } from '@/types'

export function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { status, error, token, user } = useAppSelector((state) => state.auth)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
  })

  if (token) {
    return <Navigate to={user?.role === UserRole.Admin ? '/admin' : '/'} replace />
  }

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await dispatch(
      register({ ...form, phoneNumber: form.phoneNumber || null }),
    )
    if (register.fulfilled.match(result)) {
      const role = result.payload.user.role
      navigate(role === UserRole.Admin ? '/admin' : '/', { replace: true })
    }
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 8px', textAlign: 'center', fontSize: 22 }}>
        Kayıt Ol
      </h2>
      <p style={{ margin: '0 0 24px', textAlign: 'center', color: 'var(--color-muted)', fontSize: 14 }}>
        Yeni bir hesap oluşturun
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <TextField label="Ad" name="firstName" value={form.firstName} onChange={update('firstName')} required />
        <TextField label="Soyad" name="lastName" value={form.lastName} onChange={update('lastName')} required />
        <TextField label="E-posta" name="email" type="email" value={form.email} onChange={update('email')} required />
        <TextField label="Şifre" name="password" type="password" value={form.password} onChange={update('password')} required />
        <TextField label="Telefon (opsiyonel)" name="phoneNumber" value={form.phoneNumber} onChange={update('phoneNumber')} />

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
          {status === 'loading' ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
        </Button>
      </form>

      <p style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: 'var(--color-muted)' }}>
        Zaten hesabınız var mı?{' '}
        <Link
          to="/login"
          style={{ color: 'var(--color-primary)', fontWeight: 600 }}
        >
          Giriş yapın
        </Link>
      </p>
    </div>
  )
}

export default RegisterPage
