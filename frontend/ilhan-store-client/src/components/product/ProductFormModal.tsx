import { useEffect, useState } from 'react'
import { categoryService } from '@/services'
import { ClothingSize, ClothingSizeLabels } from '@/types'
import type { Category, CreateProductRequest, Product } from '@/types'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'

/** Hem nokta hem virgül ondalık ayracını destekler */
function parseDecimal(v: string): number {
  const n = parseFloat(v.replace(',', '.'))
  return isNaN(n) ? 0 : n
}

/** Hex rengini insan okunabilir etikete çevirir (fallback olarak hex'i döner) */
function hexToLabel(hex: string): string {
  return hex
}

/** CSS renk adını hex'e dönüştürmek için geçici canvas trick'i */
function colorNameToHex(name: string): string {
  if (!name) return '#000000'
  if (/^#[0-9a-f]{6}$/i.test(name)) return name
  // Basit CSS renk adı → hex (tarayıcıya bırakıyoruz)
  try {
    const ctx = document.createElement('canvas').getContext('2d')
    if (!ctx) return '#000000'
    ctx.fillStyle = name
    return ctx.fillStyle // tarayıcı hex'e normalize eder
  } catch {
    return '#000000'
  }
}

const ALL_SIZES = Object.values(ClothingSize).filter(
  (v): v is ClothingSize => typeof v === 'number',
)

interface ProductFormModalProps {
  /** Düzenleme modunda mevcut ürün; undefined ise yeni ürün oluşturulur */
  product?: Product
  onSubmit: (data: CreateProductRequest) => Promise<void>
  onClose: () => void
}

const EMPTY: CreateProductRequest = {
  name: '',
  description: '',
  price: 0,
  discountPrice: null,
  stockQuantity: 0,
  brand: null,
  color: null,
  sizes: null,
  size: ClothingSize.M,
  imageUrl: null,
  categoryId: 0,
}

/** Virgüllü beden stringini dizi olarak ayrıştırır */
function parseSizes(raw: string | null | undefined): ClothingSize[] {
  if (!raw) return []
  return raw
    .split(',')
    .map(Number)
    .filter((n) => ALL_SIZES.includes(n as ClothingSize)) as ClothingSize[]
}

export function ProductFormModal({
  product,
  onSubmit,
  onClose,
}: ProductFormModalProps) {
  const isEdit = product !== undefined

  const [form, setForm] = useState<CreateProductRequest>(
    product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          discountPrice: product.discountPrice ?? null,
          stockQuantity: product.stockQuantity,
          brand: product.brand ?? null,
          color: product.color ?? null,
          sizes: product.sizes ?? null,
          size: product.size,
          imageUrl: product.imageUrl ?? null,
          categoryId: product.categoryId,
        }
      : EMPTY,
  )

  // Ondalık girişler için ham metin
  const [priceStr, setPriceStr] = useState(product ? String(product.price) : '')
  const [discountStr, setDiscountStr] = useState(
    product?.discountPrice != null ? String(product.discountPrice) : '',
  )

  // Seçili bedenler
  const [selectedSizes, setSelectedSizes] = useState<ClothingSize[]>(() =>
    parseSizes(product?.sizes),
  )

  // Renk picker için hex değeri
  const [colorHex, setColorHex] = useState<string>(() => {
    if (!product?.color) return '#000000'
    return colorNameToHex(product.color)
  })
  // Renk aktif mi?
  const [colorEnabled, setColorEnabled] = useState(!!product?.color)

  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    categoryService.getAll().then(setCategories)
  }, [])

  const set = <K extends keyof CreateProductRequest>(
    key: K,
    value: CreateProductRequest[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }))

  const toggleSize = (size: ClothingSize) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.categoryId) {
      setError('Lütfen bir kategori seçin.')
      return
    }
    const price = parseDecimal(priceStr)
    if (price <= 0) {
      setError('Fiyat sıfırdan büyük olmalıdır.')
      return
    }
    const discountPrice = discountStr ? parseDecimal(discountStr) : null

    // Bedenleri virgüllü stringe dönüştür (sıralanmış)
    const sizesStr =
      selectedSizes.length > 0
        ? [...selectedSizes].sort((a, b) => a - b).join(',')
        : null

    // İlk seçili bedeni size olarak al (geriye dönük uyumluluk)
    const primarySize =
      selectedSizes.length > 0 ? Math.min(...selectedSizes) : form.size

    const finalColor = colorEnabled ? colorHex : null

    setSaving(true)
    setError(null)
    try {
      await onSubmit({
        ...form,
        price,
        discountPrice,
        sizes: sizesStr,
        size: primarySize as ClothingSize,
        color: finalColor,
      })
      onClose()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {/* Arka plan */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 100,
        }}
      />

      {/* Modal kartı */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius)',
          padding: 28,
          width: 'calc(100% - 32px)',
          maxWidth: 620,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          zIndex: 101,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <h2 style={{ margin: 0 }}>
            {isEdit ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 22,
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
        >
          {/* İki sütunlu grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <TextField
              label="Ürün Adı *"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
            />
            <TextField
              label="Marka"
              value={form.brand ?? ''}
              onChange={(e) => set('brand', e.target.value || null)}
            />
            <TextField
              label="Fiyat (₺) *"
              type="text"
              inputMode="decimal"
              value={priceStr}
              onChange={(e) => setPriceStr(e.target.value)}
              placeholder="Örn: 149,99"
              selectOnFocus
              required
            />
            <TextField
              label="İndirimli Fiyat (₺)"
              type="text"
              inputMode="decimal"
              value={discountStr}
              onChange={(e) => setDiscountStr(e.target.value)}
              placeholder="Örn: 99,90"
              selectOnFocus
            />
            <TextField
              label="Stok Adedi *"
              type="number"
              min={0}
              value={form.stockQuantity}
              onChange={(e) => set('stockQuantity', Number(e.target.value))}
              selectOnFocus
              required
            />

            {/* Kategori seçimi */}
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Kategori *</span>
              <select
                value={form.categoryId || ''}
                onChange={(e) => set('categoryId', Number(e.target.value))}
                required
                style={selectStyle}
              >
                <option value="">Seçin...</option>
                {categories
                  .filter((c) => !c.parentCategoryId)
                  .map((root) => {
                    const subs = categories.filter(
                      (c) => c.parentCategoryId === root.id,
                    )
                    return subs.length > 0 ? (
                      <optgroup key={root.id} label={root.name}>
                        <option value={root.id}>{root.name} (genel)</option>
                        {subs.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </optgroup>
                    ) : (
                      <option key={root.id} value={root.id}>
                        {root.name}
                      </option>
                    )
                  })}
              </select>
            </label>
          </div>

          {/* Renk seçici */}
          <fieldset style={fieldsetStyle}>
            <legend style={legendStyle}>Renk</legend>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={colorEnabled}
                  onChange={(e) => setColorEnabled(e.target.checked)}
                  style={{ width: 16, height: 16 }}
                />
                <span style={{ fontSize: 14 }}>Renk ekle</span>
              </label>

              {colorEnabled && (
                <>
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    style={{
                      width: 44,
                      height: 36,
                      padding: 2,
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      background: 'none',
                    }}
                    title="Renk seç"
                  />
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: colorHex,
                      border: '2px solid var(--color-border)',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 13, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                    {hexToLabel(colorHex)}
                  </span>
                </>
              )}
            </div>
          </fieldset>

          {/* Beden seçimi — çoklu checkbox */}
          <fieldset style={fieldsetStyle}>
            <legend style={legendStyle}>Bedenler</legend>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ALL_SIZES.map((size) => {
                const isChecked = selectedSizes.includes(size)
                return (
                  <label
                    key={size}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '6px 14px',
                      borderRadius: 'var(--radius)',
                      border: `2px solid ${isChecked ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      background: isChecked ? 'var(--color-primary)' : 'transparent',
                      color: isChecked ? '#fff' : 'inherit',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: 14,
                      transition: 'all 0.15s',
                      userSelect: 'none',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSize(size)}
                      style={{ display: 'none' }}
                    />
                    {ClothingSizeLabels[size]}
                  </label>
                )
              })}
            </div>
            {selectedSizes.length > 0 && (
              <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--color-text-muted)' }}>
                Seçili: {[...selectedSizes]
                  .sort((a, b) => a - b)
                  .map((s) => ClothingSizeLabels[s])
                  .join(', ')}
              </p>
            )}
          </fieldset>

          {/* Tam genişlik alanlar */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Açıklama *</span>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              required
              rows={3}
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--color-border)',
                fontSize: 14,
                resize: 'vertical',
              }}
            />
          </label>

          <TextField
            label="Görsel URL"
            type="url"
            value={form.imageUrl ?? ''}
            onChange={(e) => set('imageUrl', e.target.value || null)}
          />

          {error && (
            <p style={{ color: 'var(--color-danger)', margin: 0 }}>{error}</p>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
            <Button type="button" variant="secondary" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Kaydediliyor...' : isEdit ? 'Güncelle' : 'Ekle'}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}

const selectStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--color-border)',
  fontSize: 14,
  background: 'var(--color-surface)',
}

const fieldsetStyle: React.CSSProperties = {
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius)',
  padding: '12px 14px',
  margin: 0,
}

const legendStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  padding: '0 6px',
  color: 'var(--color-text-muted)',
}
