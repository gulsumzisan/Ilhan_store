import { useEffect, useState } from 'react'
import { categoryService } from '@/services'
import { Loader } from '@/components/common/Loader'
import { TextField } from '@/components/ui/TextField'
import { Button } from '@/components/ui/Button'
import type { Category } from '@/types'

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: 'transform 0.2s',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        flexShrink: 0,
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function ParentBadge({ name }: { name: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: '#fce4ec',
        color: 'var(--color-primary)',
        borderRadius: 12,
        padding: '2px 10px',
        fontSize: 11,
        fontWeight: 600,
        marginRight: 4,
        marginBottom: 2,
      }}
    >
      {name}
    </span>
  )
}

interface ParentMultiSelectProps {
  allCategories: Category[]
  selectedIds: number[]
  excludeId?: number | null
  onChange: (ids: number[]) => void
  label: string
  style?: React.CSSProperties
}

function ParentMultiSelect({ allCategories, selectedIds, excludeId, onChange, label, style }: ParentMultiSelectProps) {
  const options = allCategories.filter((c) => c.id !== excludeId)

  const toggle = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
      <div
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          background: 'var(--color-surface)',
          maxHeight: 160,
          overflowY: 'auto',
          padding: '6px 0',
        }}
      >
        {options.length === 0 ? (
          <div style={{ padding: '8px 12px', color: 'var(--color-muted)', fontSize: 13 }}>
            Üst kategori yok
          </div>
        ) : (
          options.map((cat) => {
            const checked = selectedIds.includes(cat.id)
            return (
              <label
                key={cat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: 13,
                  background: checked ? '#fce4ec' : 'transparent',
                  color: checked ? 'var(--color-primary)' : 'var(--color-text)',
                  transition: 'background 0.12s',
                  fontWeight: checked ? 600 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!checked) (e.currentTarget as HTMLLabelElement).style.background = 'var(--color-bg)'
                }}
                onMouseLeave={(e) => {
                  if (!checked) (e.currentTarget as HTMLLabelElement).style.background = 'transparent'
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(cat.id)}
                  style={{ accentColor: 'var(--color-primary)', width: 14, height: 14 }}
                />
                {cat.name}
                {cat.isMainCategory && (
                  <span style={{ fontSize: 10, color: 'var(--color-muted)', marginLeft: 'auto' }}>
                    Ana Kategori
                  </span>
                )}
              </label>
            )
          })
        )}
      </div>
      {selectedIds.length > 0 && (
        <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>
          {selectedIds.length} üst kategori seçildi
        </div>
      )}
    </div>
  )
}

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // Yeni kategori formu
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isMainCategory, setIsMainCategory] = useState(true)
  const [parentCategoryIds, setParentCategoryIds] = useState<number[]>([])

  // Düzenleme durumu
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editImageUrl, setEditImageUrl] = useState('')
  const [editIsMainCategory, setEditIsMainCategory] = useState(true)
  const [editParentIds, setEditParentIds] = useState<number[]>([])
  const [saving, setSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  // Açık/kapalı üst kategoriler
  const [expandedParents, setExpandedParents] = useState<Set<number>>(new Set())

  const load = () => {
    setLoading(true)
    categoryService
      .getAll()
      .then(setCategories)
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const toggleParent = (id: number) => {
    setExpandedParents((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await categoryService.create({
      name,
      description: description || null,
      imageUrl: imageUrl || null,
      isMainCategory,
      parentCategoryIds,
    })
    setName('')
    setDescription('')
    setImageUrl('')
    setIsMainCategory(true)
    setParentCategoryIds([])
    load()
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return
    await categoryService.remove(id)
    if (editingId === id) setEditingId(null)
    load()
  }

  const startEdit = (cat: Category) => {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditDescription(cat.description ?? '')
    setEditImageUrl(cat.imageUrl ?? '')
    setEditIsMainCategory(cat.isMainCategory)
    // Sadece hâlâ aktif olan parent ID'leri al (silinmiş kategori referanslarını temizle)
    const activeParentIds = (cat.parentCategoryIds ?? []).filter((id) =>
      categories.some((c) => c.id === id)
    )
    setEditParentIds(activeParentIds)
    setEditError(null)
  }

  const cancelEdit = () => { setEditingId(null); setEditError(null) }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId === null) return
    setSaving(true)
    setEditError(null)
    try {
      await categoryService.update(editingId, {
        name: editName,
        description: editDescription || null,
        imageUrl: editImageUrl || null,
        isMainCategory: editIsMainCategory,
        parentCategoryIds: editParentIds,
      })
      setEditingId(null)
      load()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Kayıt sırasında bir hata oluştu.'
      setEditError(msg)
    } finally {
      setSaving(false)
    }
  }

  const mainCategories = categories.filter((c) => c.isMainCategory)
  const getSubcategoriesOf = (parentId: number) =>
    categories.filter((c) => c.parentCategoryIds.includes(parentId))

  const inputStyle: React.CSSProperties = {
    padding: '10px 12px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--color-border)',
    fontSize: 14,
    background: 'var(--color-surface)',
    color: 'var(--color-text)',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.15s',
  }

  const checkboxLabelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    userSelect: 'none',
  }

  const getCategoryParentNames = (cat: Category) =>
    cat.parentCategoryIds
      .map((pid) => categories.find((c) => c.id === pid)?.name)
      .filter(Boolean) as string[]

  const renderCategoryRow = (cat: Category, isSubcategory = false) => {
    const isEditing = editingId === cat.id
    const subs = getSubcategoriesOf(cat.id)
    const isExpanded = expandedParents.has(cat.id)
    const parentNames = getCategoryParentNames(cat)

    if (isEditing) {
      return (
        <form
          key={cat.id}
          onSubmit={handleUpdate}
          style={{
            padding: 16,
            background: '#fff9fb',
            border: '2px solid var(--color-primary)',
            borderRadius: 'var(--radius)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <strong style={{ fontSize: 13, color: 'var(--color-primary)' }}>
            Kategori Düzenleniyor
          </strong>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <TextField
              label="Kategori Adı"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
            <TextField
              label="Açıklama"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 220 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Resim URL</span>
              <input
                type="url"
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
                placeholder="https://..."
                style={inputStyle}
              />
            </label>

            <div style={{ display: 'flex', alignItems: 'center', minWidth: 220 }}>
              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  checked={editIsMainCategory}
                  onChange={(e) => setEditIsMainCategory(e.target.checked)}
                  style={{ accentColor: 'var(--color-primary)', width: 16, height: 16 }}
                />
                Üst menüde göster (Ana Kategori)
              </label>
            </div>
          </div>

          <ParentMultiSelect
            allCategories={categories}
            selectedIds={editParentIds}
            excludeId={editingId}
            onChange={setEditParentIds}
            label="Üst Kategoriler (birden fazla seçilebilir)"
            style={{ maxWidth: 400 }}
          />

          {editImageUrl && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img
                src={editImageUrl}
                alt="Önizleme"
                style={{
                  width: 80,
                  height: 60,
                  objectFit: 'cover',
                  borderRadius: 8,
                  border: '1px solid var(--color-border)',
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none'
                }}
              />
              <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>Önizleme</span>
            </div>
          )}

          {editError && (
            <div style={{
              padding: '8px 12px',
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: 'var(--radius)',
              color: '#b91c1c',
              fontSize: 13,
            }}>
              {editError}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="submit" disabled={saving}>
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
            <Button type="button" variant="secondary" onClick={cancelEdit}>
              İptal
            </Button>
          </div>
        </form>
      )
    }

    return (
      <div key={cat.id}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: isSubcategory ? '8px 12px' : '12px 14px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            borderLeft: isSubcategory ? '3px solid var(--color-primary)' : undefined,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1, minWidth: 0 }}>
            {cat.imageUrl && (
              <img
                src={cat.imageUrl}
                alt={cat.name}
                style={{
                  width: isSubcategory ? 32 : 40,
                  height: isSubcategory ? 32 : 40,
                  objectFit: 'cover',
                  borderRadius: 6,
                  border: '1px solid var(--color-border)',
                  flexShrink: 0,
                  marginTop: 2,
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none'
                }}
              />
            )}

            {isSubcategory && (
              <span style={{ color: 'var(--color-muted)', fontSize: 13, marginTop: 2 }}>↳</span>
            )}

            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <strong style={{ fontSize: isSubcategory ? 13 : 14 }}>{cat.name}</strong>

                {cat.isMainCategory && !isSubcategory && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, background: '#e8f5e9', color: '#2e7d32',
                    borderRadius: 10, padding: '1px 8px',
                  }}>
                    Ana Kategori
                  </span>
                )}

                {cat.description && (
                  <span style={{ color: 'var(--color-muted)', fontSize: 12 }}>
                    {cat.description}
                  </span>
                )}
                <span style={{ color: 'var(--color-muted)', fontSize: 12 }}>
                  ({cat.productCount} ürün)
                </span>
              </div>

              {/* Parent category badges */}
              {parentNames.length > 0 && (
                <div style={{ marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--color-muted)', marginRight: 4 }}>Üst:</span>
                  {parentNames.map((pname) => (
                    <ParentBadge key={pname} name={pname} />
                  ))}
                </div>
              )}
            </div>

            {!isSubcategory && subs.length > 0 && (
              <button
                type="button"
                onClick={() => toggleParent(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  marginLeft: 8,
                  marginTop: 2,
                  background: isExpanded ? 'var(--color-primary)' : '#fce4ec',
                  color: isExpanded ? '#fff' : 'var(--color-primary)',
                  border: 'none',
                  borderRadius: 20,
                  padding: '3px 10px 3px 8px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.15s, color 0.15s',
                  flexShrink: 0,
                }}
              >
                <ChevronIcon open={isExpanded} />
                {subs.length} alt kategori
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 12 }}>
            <Button variant="secondary" onClick={() => startEdit(cat)}>
              Düzenle
            </Button>
            <Button variant="danger" onClick={() => handleDelete(cat.id)}>
              Sil
            </Button>
          </div>
        </div>

        {!isSubcategory && isExpanded && subs.length > 0 && (
          <div
            style={{
              marginLeft: 28,
              marginTop: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {subs.map((sub) => renderCategoryRow(sub, true))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Kategori Yönetimi</h1>

      {/* Bilgi kartı */}
      <div style={{
        background: '#e3f2fd', border: '1px solid #90caf9', borderRadius: 'var(--radius)',
        padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#1565c0', lineHeight: 1.6,
      }}>
        <strong>Çoklu Hiyerarşi:</strong> Bir kategori hem kendi başına <em>Ana Kategori</em> olabilir
        (üst menüde görünür), hem de birden fazla üst kategorinin alt kategorisi olabilir.
        Örneğin <strong>Kozmetik</strong> hem Kadın kategorisinin altında, hem de üst menüde bağımsız olarak görünebilir.
      </div>

      {/* Yeni kategori formu */}
      <form
        onSubmit={handleCreate}
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
          marginBottom: 28,
          flexWrap: 'wrap',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          padding: 16,
        }}
      >
        <TextField
          label="Kategori Adı"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Açıklama"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 220 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Resim URL</span>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            style={inputStyle}
          />
        </label>

        {imageUrl && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <img
              src={imageUrl}
              alt="Önizleme"
              style={{
                width: 56,
                height: 56,
                objectFit: 'cover',
                borderRadius: 8,
                border: '1px solid var(--color-border)',
              }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', paddingTop: 24 }}>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={isMainCategory}
              onChange={(e) => setIsMainCategory(e.target.checked)}
              style={{ accentColor: 'var(--color-primary)', width: 16, height: 16 }}
            />
            Üst menüde göster (Ana Kategori)
          </label>
        </div>

        <ParentMultiSelect
          allCategories={categories}
          selectedIds={parentCategoryIds}
          onChange={setParentCategoryIds}
          label="Üst Kategoriler (opsiyonel)"
          style={{ minWidth: 220 }}
        />

        <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
          <Button type="submit">+ Ekle</Button>
        </div>
      </form>

      {loading ? (
        <Loader />
      ) : (
        <div>
          {/* Ana Kategoriler */}
          {mainCategories.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: 'var(--color-text)' }}>
                Ana Kategoriler
                <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--color-muted)', marginLeft: 8 }}>
                  (üst menüde görünenler)
                </span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {mainCategories.map((category) =>
                  editingId === category.id
                    ? renderCategoryRow(category)
                    : renderCategoryRow(category)
                )}
              </div>
            </div>
          )}

          {/* Sadece alt kategori olanlar (ana kategorisi olmayanlar) */}
          {(() => {
            const subOnly = categories.filter(
              (c) => !c.isMainCategory && c.parentCategoryIds.length > 0
            )
            if (subOnly.length === 0) return null
            return (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: 'var(--color-text)' }}>
                  Yalnızca Alt Kategoriler
                  <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--color-muted)', marginLeft: 8 }}>
                    (üst menüde görünmeyenler)
                  </span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {subOnly.map((cat) => renderCategoryRow(cat, false))}
                </div>
              </div>
            )
          })()}

          {categories.length === 0 && (
            <p style={{ color: 'var(--color-muted)' }}>Henüz kategori eklenmemiş.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminCategoriesPage
