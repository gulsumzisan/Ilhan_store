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
  size: ClothingSize.M,
  imageUrl: null,
  categoryId: 0,
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
          size: product.size,
          imageUrl: product.imageUrl ?? null,
          categoryId: product.categoryId,
        }
      : EMPTY,
  )
  // Ondalık girişler için ham metin — nokta ve virgüle izin verir
  const [priceStr, setPriceStr] = useState(product ? String(product.price) : '')
  const [discountStr, setDiscountStr] = useState(
    product?.discountPrice != null ? String(product.discountPrice) : '',
  )

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
    setSaving(true)
    setError(null)
    try {
      await onSubmit({ ...form, price, discountPrice })
      onClose()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {/* Arka plan — tıklanınca kapatır */}
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

      {/* Modal kartı — olaylar backdrop'a ulaşmaz */}
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
          maxWidth: 600,
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
            <TextField
              label="Renk"
              value={form.color ?? ''}
              onChange={(e) => set('color', e.target.value || null)}
            />

            {/* Beden seçimi */}
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Beden *</span>
              <select
                value={form.size}
                onChange={(e) => set('size', Number(e.target.value) as typeof form.size)}
                required
                style={selectStyle}
              >
                {(Object.values(ClothingSize) as number[]).map((v) => (
                  <option key={v} value={v}>
                    {ClothingSizeLabels[v as typeof form.size]}
                  </option>
                ))}
              </select>
            </label>

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
                    const subs = categories.filter((c) => c.parentCategoryId === root.id)
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
