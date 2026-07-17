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

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // Yeni kategori formu
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [parentCategoryId, setParentCategoryId] = useState<number | null>(null)

  // Düzenleme durumu
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editImageUrl, setEditImageUrl] = useState('')
  const [editParentId, setEditParentId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

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
      parentCategoryId: parentCategoryId || null,
    })
    setName('')
    setDescription('')
    setImageUrl('')
    setParentCategoryId(null)
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
    setEditParentId(cat.parentCategoryId ?? null)
  }

  const cancelEdit = () => setEditingId(null)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId === null) return
    setSaving(true)
    try {
      await categoryService.update(editingId, {
        name: editName,
        description: editDescription || null,
        imageUrl: editImageUrl || null,
        parentCategoryId: editParentId || null,
      })
      setEditingId(null)
      load()
    } finally {
      setSaving(false)
    }
  }

  const rootCategories = categories.filter((c) => !c.parentCategoryId)
  const subCategories = categories.filter((c) => !!c.parentCategoryId)

  const getSubcategoriesOf = (parentId: number) =>
    subCategories.filter((c) => c.parentCategoryId === parentId)

  const parentOptions = rootCategories.filter((c) => c.id !== editingId)

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

  const renderCategoryRow = (cat: Category, isSubcategory = false) => {
    const isEditing = editingId === cat.id
    const subs = isSubcategory ? [] : getSubcategoriesOf(cat.id)
    const isExpanded = expandedParents.has(cat.id)

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
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Üst Kategori</span>
              <select
                value={editParentId ?? ''}
                onChange={(e) => setEditParentId(e.target.value ? Number(e.target.value) : null)}
                style={{ ...inputStyle, minWidth: 180 }}
              >
                <option value="">Ana kategori (üst yok)</option>
                {parentOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Resim önizleme */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
            {/* Kategori resmi (küçük) */}
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
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none'
                }}
              />
            )}

            {isSubcategory && (
              <span style={{ color: 'var(--color-muted)', fontSize: 13 }}>↳</span>
            )}

            <div>
              <strong style={{ fontSize: isSubcategory ? 13 : 14 }}>{cat.name}</strong>
              {cat.description && (
                <span style={{ color: 'var(--color-muted)', marginLeft: 8, fontSize: 12 }}>
                  {cat.description}
                </span>
              )}
              <span style={{ color: 'var(--color-muted)', marginLeft: 8, fontSize: 12 }}>
                ({cat.productCount} ürün)
              </span>
            </div>

            {/* Alt kategori sayısı rozeti + toggle düğmesi */}
            {!isSubcategory && subs.length > 0 && (
              <button
                type="button"
                onClick={() => toggleParent(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  marginLeft: 8,
                  background: isExpanded ? 'var(--color-primary)' : '#fce4ec',
                  color: isExpanded ? '#fff' : 'var(--color-primary)',
                  border: 'none',
                  borderRadius: 20,
                  padding: '3px 10px 3px 8px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                <ChevronIcon open={isExpanded} />
                {subs.length} alt kategori
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <Button variant="secondary" onClick={() => startEdit(cat)}>
              Düzenle
            </Button>
            <Button variant="danger" onClick={() => handleDelete(cat.id)}>
              Sil
            </Button>
          </div>
        </div>

        {/* Alt kategoriler - sadece expanded ise göster */}
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
            {subs.map((sub) =>
              editingId === sub.id
                ? renderCategoryRow(sub, true)
                : renderCategoryRow(sub, true),
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Kategori Yönetimi</h1>

      {/* Yeni kategori formu */}
      <form
        onSubmit={handleCreate}
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'flex-end',
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

        {/* Resim önizleme */}
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

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Üst Kategori</span>
          <select
            value={parentCategoryId ?? ''}
            onChange={(e) =>
              setParentCategoryId(e.target.value ? Number(e.target.value) : null)
            }
            style={{ ...inputStyle, minWidth: 180 }}
          >
            <option value="">Ana kategori (üst yok)</option>
            {rootCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <Button type="submit">+ Ekle</Button>
      </form>

      {loading ? (
        <Loader />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rootCategories.length === 0 && (
            <p style={{ color: 'var(--color-muted)' }}>Henüz kategori eklenmemiş.</p>
          )}

          {rootCategories.map((category) => renderCategoryRow(category))}

          {/* Üst kategorisi silinmiş alt kategoriler */}
          {subCategories
            .filter((s) => !categories.find((c) => c.id === s.parentCategoryId))
            .map((orphan) => renderCategoryRow(orphan))}
        </div>
      )}
    </div>
  )
}

export default AdminCategoriesPage
