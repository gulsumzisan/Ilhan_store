import { useEffect, useState } from 'react'
import { categoryService } from '@/services'
import { Loader } from '@/components/common/Loader'
import { TextField } from '@/components/ui/TextField'
import { Button } from '@/components/ui/Button'
import type { Category } from '@/types'

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // Yeni kategori formu
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [parentCategoryId, setParentCategoryId] = useState<number | null>(null)

  // Düzenleme durumu
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editParentId, setEditParentId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    categoryService
      .getAll()
      .then(setCategories)
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await categoryService.create({
      name,
      description: description || null,
      parentCategoryId: parentCategoryId || null,
    })
    setName('')
    setDescription('')
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

  const renderCategoryRow = (cat: Category, isSubcategory = false) => {
    const isEditing = editingId === cat.id

    if (isEditing) {
      return (
        <form
          key={cat.id}
          onSubmit={handleUpdate}
          style={{
            padding: 14,
            background: '#fffbeb',
            border: '2px solid var(--color-primary)',
            borderRadius: 'var(--radius)',
            marginLeft: isSubcategory ? 0 : undefined,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <strong style={{ fontSize: 13, color: 'var(--color-primary)' }}>Kategori Düzenleniyor</strong>
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
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Üst Kategori</span>
              <select
                value={editParentId ?? ''}
                onChange={(e) => setEditParentId(e.target.value ? Number(e.target.value) : null)}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--color-border)',
                  fontSize: 14,
                  background: 'var(--color-surface)',
                  minWidth: 180,
                }}
              >
                <option value="">Ana kategori (üst yok)</option>
                {parentOptions.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
          </div>
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: isSubcategory ? '8px 12px' : 12,
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          borderLeft: isSubcategory ? '3px solid var(--color-primary)' : undefined,
          opacity: isSubcategory ? 0.92 : 1,
        }}
      >
        <div>
          {isSubcategory && (
            <span style={{ color: 'var(--color-muted)', marginRight: 6 }}>↳</span>
          )}
          <strong>{cat.name}</strong>
          {cat.description && (
            <span style={{ color: 'var(--color-muted)', marginLeft: 8, fontSize: 13 }}>
              {cat.description}
            </span>
          )}
          <span style={{ color: 'var(--color-muted)', marginLeft: 8 }}>
            ({cat.productCount} ürün)
          </span>
          {!isSubcategory && getSubcategoriesOf(cat.id).length > 0 && (
            <span
              style={{
                marginLeft: 8,
                fontSize: 12,
                background: 'var(--color-primary)',
                color: '#fff',
                borderRadius: 4,
                padding: '2px 6px',
              }}
            >
              {getSubcategoriesOf(cat.id).length} alt kategori
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" onClick={() => startEdit(cat)}>
            Düzenle
          </Button>
          <Button variant="danger" onClick={() => handleDelete(cat.id)}>
            Sil
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1>Kategori Yönetimi</h1>

      <form
        onSubmit={handleCreate}
        style={{ display: 'flex', gap: 12, alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap' }}
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

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Üst Kategori</span>
          <select
            value={parentCategoryId ?? ''}
            onChange={(e) =>
              setParentCategoryId(e.target.value ? Number(e.target.value) : null)
            }
            style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--color-border)',
              fontSize: 14,
              background: 'var(--color-surface)',
              minWidth: 180,
            }}
          >
            <option value="">Ana kategori (üst yok)</option>
            {rootCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <Button type="submit">Ekle</Button>
      </form>

      {loading ? (
        <Loader />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rootCategories.length === 0 && (
            <p style={{ color: 'var(--color-muted)' }}>Henüz kategori eklenmemiş.</p>
          )}

          {rootCategories.map((category) => {
            const subs = getSubcategoriesOf(category.id)
            return (
              <div key={category.id}>
                {renderCategoryRow(category)}

                {subs.length > 0 && (
                  <div style={{ marginLeft: 28, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {subs.map((sub) => renderCategoryRow(sub, true))}
                  </div>
                )}
              </div>
            )
          })}

          {subCategories
            .filter((s) => !categories.find((c) => c.id === s.parentCategoryId))
            .map((orphan) => renderCategoryRow(orphan))}
        </div>
      )}
    </div>
  )
}

export default AdminCategoriesPage
