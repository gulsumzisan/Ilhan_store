import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { fetchCart, resetCart } from '@/store/slices/cartSlice'
import { orderService } from '@/services'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/common/EmptyState'
import { formatCurrency } from '@/utils/format'

type Step = 1 | 2

function formatCardNumber(raw: string) {
  return raw
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
  return digits
}

export function CheckoutPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const cart = useAppSelector((state) => state.cart.cart)

  const [step, setStep] = useState<Step>(1)

  // Step 1 – Address
  const [shippingAddress, setShippingAddress] = useState('')
  const [notes, setNotes] = useState('')

  // Step 2 – Payment
  const [cardHolder, setCardHolder] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardFlipped, setCardFlipped] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  if (!cart || cart.items.length === 0) {
    return (
      <div>
        <h1>Ödeme</h1>
        <EmptyState title="Sepetiniz boş" description="Önce sepete ürün ekleyin." />
      </div>
    )
  }

  const shippingFree = cart.totalAmount >= 500
  const shippingCost = shippingFree ? 0 : 49.99
  const total = cart.totalAmount + shippingCost

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const order = await orderService.create({ shippingAddress, notes })
      dispatch(resetCart())
      navigate(`/orders/${order.id}`)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const cardDigits = cardNumber.replace(/\s/g, '')
  const displayCard = cardDigits.padEnd(16, '•').replace(/(.{4})/g, '$1 ').trim()

  return (
    <div className="animate-fadeIn">

      {/* ── Steps indicator ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          marginBottom: 32,
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow)',
        }}
      >
        {([
          { n: 1 as Step, label: 'Teslimat Adresi', icon: '📍' },
          { n: 2 as Step, label: 'Ödeme Bilgileri', icon: '💳' },
        ] as const).map(({ n, label, icon }, i) => {
          const active = step === n
          const done = step > n
          return (
            <div
              key={n}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 20px',
                background: active
                  ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                  : done
                  ? '#f0fdf4'
                  : 'transparent',
                color: active ? '#fff' : done ? '#166534' : 'var(--color-muted)',
                borderRight: i === 0 ? '1px solid var(--color-border)' : 'none',
                transition: 'background 0.3s',
                cursor: done ? 'pointer' : 'default',
              }}
              onClick={() => done && setStep(n)}
            >
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: active ? 'rgba(255,255,255,0.22)' : done ? '#bbf7d0' : 'var(--color-bg)',
                  border: `2px solid ${active ? 'rgba(255,255,255,0.4)' : done ? '#86efac' : 'var(--color-border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 15,
                  flexShrink: 0,
                }}
              >
                {done ? '✓' : icon}
              </span>
              <div>
                <div style={{ fontSize: 11, opacity: 0.75, fontWeight: 500 }}>
                  Adım {n}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Main layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, alignItems: 'start' }}>

        {/* ── Step content ── */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 28,
            boxShadow: 'var(--shadow)',
          }}
        >

          {/* ── STEP 1: Address ── */}
          {step === 1 && (
            <form
              onSubmit={(e) => { e.preventDefault(); setStep(2) }}
              style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
            >
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>📍 Teslimat Adresi</h2>

              <FormField label="Teslimat Adresi *">
                <textarea
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  rows={4}
                  placeholder="Mahalle, Sokak, Bina No, Daire No, İlçe, İl"
                  style={inputStyle}
                />
              </FormField>

              <FormField label="Sipariş Notu (opsiyonel)">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Kapıya bırakın, kapıcıya teslim edin vb."
                  style={inputStyle}
                />
              </FormField>

              <Button type="submit">
                Devam Et: Ödeme Bilgileri →
              </Button>
            </form>
          )}

          {/* ── STEP 2: Payment ── */}
          {step === 2 && (
            <form
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
            >
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>💳 Ödeme Bilgileri</h2>

              {/* Card visual */}
              <div
                style={{
                  perspective: 1000,
                  height: 170,
                  marginBottom: 8,
                  cursor: 'pointer',
                }}
                onClick={() => setCardFlipped((f) => !f)}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.6s ease',
                    transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* Front */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backfaceVisibility: 'hidden',
                      background: 'linear-gradient(135deg, #1e3a8a, #2563eb, #7c3aed)',
                      borderRadius: 14,
                      padding: '22px 24px',
                      color: '#fff',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 10px 30px rgba(37,99,235,0.35)',
                      userSelect: 'none',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, opacity: 0.85, fontWeight: 600 }}>İlhan Store</span>
                      <CardNetworkLogo number={cardDigits} />
                    </div>
                    <div
                      style={{
                        fontFamily: 'monospace',
                        fontSize: 19,
                        letterSpacing: 3,
                        fontWeight: 600,
                      }}
                    >
                      {displayCard}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <div>
                        <div style={{ opacity: 0.7, fontSize: 10, marginBottom: 2 }}>KART SAHİBİ</div>
                        <div style={{ fontWeight: 600, textTransform: 'uppercase' }}>
                          {cardHolder || 'AD SOYAD'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ opacity: 0.7, fontSize: 10, marginBottom: 2 }}>SON KULLANIM</div>
                        <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>
                          {expiry || 'MM/YY'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Back */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: 'linear-gradient(135deg, #374151, #1f2937)',
                      borderRadius: 14,
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                      userSelect: 'none',
                    }}
                  >
                    <div style={{ background: '#111', height: 40, marginTop: 30 }} />
                    <div style={{ padding: '14px 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          background: '#f3f4f6',
                          flex: 1,
                          height: 36,
                          borderRadius: 4,
                        }}
                      />
                      <div
                        style={{
                          background: '#fff',
                          width: 56,
                          height: 36,
                          borderRadius: 4,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'monospace',
                          fontSize: 16,
                          fontWeight: 700,
                          color: '#374151',
                          letterSpacing: 2,
                        }}
                      >
                        {cvv.padEnd(3, '•')}
                      </div>
                    </div>
                    <p style={{ textAlign: 'center', fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                      CVV'yi görmek için kartı çevirin
                    </p>
                  </div>
                </div>
              </div>
              <p style={{ margin: '-4px 0 0', fontSize: 11, color: 'var(--color-muted)', textAlign: 'center' }}>
                Kartı çevirmek için tıklayın
              </p>

              {/* Card fields */}
              <FormField label="Kart Numarası *">
                <input
                  required
                  type="text"
                  inputMode="numeric"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  style={inputStyle}
                />
              </FormField>

              <FormField label="Kart Üzerindeki Ad Soyad *">
                <input
                  required
                  type="text"
                  placeholder="Ad Soyad"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  style={inputStyle}
                />
              </FormField>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <FormField label="Son Kullanım Tarihi *">
                  <input
                    required
                    type="text"
                    inputMode="numeric"
                    placeholder="AA/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                    style={inputStyle}
                  />
                </FormField>
                <FormField label="CVV *">
                  <input
                    required
                    type="text"
                    inputMode="numeric"
                    placeholder="•••"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    maxLength={4}
                    onFocus={() => setCardFlipped(true)}
                    onBlur={() => setCardFlipped(false)}
                    style={inputStyle}
                  />
                </FormField>
              </div>

              {error && (
                <div
                  style={{
                    padding: '10px 14px',
                    background: '#fee2e2',
                    border: '1px solid #fca5a5',
                    borderRadius: 8,
                    color: '#b91c1c',
                    fontSize: 14,
                  }}
                >
                  ⚠️ {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    padding: '10px 20px',
                    background: 'transparent',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: 'var(--radius)',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: 'var(--color-muted)',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-primary)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)' }}
                >
                  ← Geri
                </button>
                <div style={{ flex: 1 }}>
                  <Button type="submit" disabled={submitting} fullWidth>
                    {submitting ? '⏳ Sipariş oluşturuluyor...' : `🔒 Siparişi Tamamla · ${formatCurrency(total)}`}
                  </Button>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  color: 'var(--color-muted)',
                  justifyContent: 'center',
                }}
              >
                <span>🔒</span>
                <span>256-bit SSL şifreli güvenli ödeme</span>
              </div>
            </form>
          )}
        </div>

        {/* ── Order summary sidebar ── */}
        <aside
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 22,
            boxShadow: 'var(--shadow-md)',
            position: 'sticky',
            top: 24,
          }}
        >
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800 }}>Sipariş Özeti</h3>

          {cart.items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 10,
                gap: 8,
                fontSize: 13,
              }}
            >
              <span style={{ color: 'var(--color-muted)', flex: 1, lineHeight: 1.4 }}>
                {item.productName}
                {item.quantity > 1 && <span style={{ fontWeight: 600 }}> × {item.quantity}</span>}
              </span>
              <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                {formatCurrency(item.subTotal)}
              </span>
            </div>
          ))}

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '14px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
            <SummaryRow label="Ara Toplam" value={formatCurrency(cart.totalAmount)} />
            <SummaryRow
              label="Kargo"
              value={shippingFree ? 'Ücretsiz' : formatCurrency(shippingCost)}
              valueColor={shippingFree ? 'var(--color-success)' : undefined}
            />
          </div>

          <hr style={{ border: 'none', borderTop: '1.5px solid var(--color-border)', margin: '14px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: 15 }}>Toplam</span>
            <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--color-primary)' }}>
              {formatCurrency(total)}
            </span>
          </div>

          {step === 1 && shippingAddress && (
            <div
              style={{
                marginTop: 14,
                padding: '10px 12px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                fontSize: 12,
                color: 'var(--color-muted)',
              }}
            >
              <strong style={{ color: 'var(--color-text)', display: 'block', marginBottom: 2 }}>
                📍 Adres
              </strong>
              {shippingAddress}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{label}</span>
      {children}
    </label>
  )
}

function SummaryRow({
  label,
  value,
  valueColor,
}: {
  label: string
  value: string
  valueColor?: string
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: 'var(--color-muted)' }}>{label}</span>
      <span style={{ fontWeight: 600, color: valueColor }}>{value}</span>
    </div>
  )
}

function CardNetworkLogo({ number }: { number: string }) {
  const isAmex = number.startsWith('3')
  const isMaster = number.startsWith('5')
  const label = isAmex ? 'AMEX' : isMaster ? 'MC' : 'VISA'
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: 1,
        opacity: 0.9,
        fontStyle: 'italic',
        fontFamily: 'serif',
      }}
    >
      {label}
    </span>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 'var(--radius)',
  border: '1.5px solid var(--color-border)',
  fontSize: 14,
  background: 'var(--color-bg)',
  outline: 'none',
  transition: 'border-color 0.15s',
  width: '100%',
  boxSizing: 'border-box',
}

export default CheckoutPage
