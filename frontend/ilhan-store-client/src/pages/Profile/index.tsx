import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/hooks'
import { setUser } from '@/store/slices/authSlice'
import { userService } from '@/services'
import { Loader } from '@/components/common/Loader'
import { TextField } from '@/components/ui/TextField'
import { Button } from '@/components/ui/Button'
import type { User } from '@/types'

export function ProfilePage() {
  const dispatch = useAppDispatch()
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  useEffect(() => {
    userService
      .getProfile()
      .then((data) => {
        setProfile(data)
        setFirstName(data.firstName)
        setLastName(data.lastName)
        setPhoneNumber(data.phoneNumber ?? '')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const updated = await userService.updateProfile({
        firstName,
        lastName,
        phoneNumber: phoneNumber || null,
      })
      setProfile(updated)
      dispatch(setUser(updated))
      setMessage('Profil güncellendi.')
    } catch (err) {
      setMessage((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <h1>Profilim</h1>
      <p style={{ color: 'var(--color-muted)' }}>{profile?.email}</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TextField
          label="Ad"
          name="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <TextField
          label="Soyad"
          name="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <TextField
          label="Telefon"
          name="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        {message && <p style={{ color: 'var(--color-success)' }}>{message}</p>}
        <Button type="submit" disabled={saving}>
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </form>
    </div>
  )
}

export default ProfilePage
