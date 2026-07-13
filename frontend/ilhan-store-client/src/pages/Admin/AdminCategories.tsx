import { useEffect, useState } from 'react'
import { categoryService } from '@/services'
import { Loader } from '@/components/common/Loader'
import { TextField } from '@/components/ui/TextField'
import { Button } from '@/components/ui/Button'
import type { Category } from '@/types'

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [parentCategoryId, setParentCategoryId] = useState<number | null>(null)

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
    load()
  }

  // Hiyerarşik görüntü için kategorileri düzenle
  const rootCategories = categories.filter((c) => !c.parentCategoryId)
  const subCategories = categories.filter((c) => !!c.parentCategoryId)

  const getSubcategoriesOf = (parentId: number) =>
    subCategories.filter((c) => c.parentCategoryId === parentId)

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
                {/* Ana kategori satırı */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 12,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius)',
                  }}
                >
                  <div>
                    <strong>{category.name}</strong>
                    {category.description && (
                      <span style={{ color: 'var(--color-muted)', marginLeft: 8, fontSize: 13 }}>
                        {category.description}
                      </span>
                    )}
                    <span style={{ color: 'var(--color-muted)', marginLeft: 8 }}>
                      ({category.productCount} ürün)
                    </span>
                    {subs.length > 0 && (
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
                        {subs.length} alt kategori
                      </span>
                    )}
                  </div>
                  <Button variant="danger" onClick={() => handleDelete(category.id)}>
                    Sil
                  </Button>
                </div>

                {/* Alt kategoriler */}
                {subs.length > 0 && (
                  <div style={{ marginLeft: 28, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {subs.map((sub) => (
                      <div
                        key={sub.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          background: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius)',
                          borderLeft: '3px solid var(--color-primary)',
                          opacity: 0.92,
                        }}
                      >
                        <div>
                          <span style={{ color: 'var(--color-muted)', marginRight: 6 }}>↳</span>
                          <strong>{sub.name}</strong>
                          {sub.description && (
                            <span style={{ color: 'var(--color-muted)', marginLeft: 8, fontSize: 13 }}>
                              {sub.description}
                            </span>
                          )}
                          <span style={{ color: 'var(--color-muted)', marginLeft: 8 }}>
                            ({sub.productCount} ürün)
                          </span>
                        </div>
                        <Button variant="danger" onClick={() => handleDelete(sub.id)}>
                          Sil
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {/* ParentCategoryId'si olan ama üst kategorisi silinmiş/bulunamayan kategoriler */}
          {subCategories
            .filter((s) => !categories.find((c) => c.id === s.parentCategoryId))
            .map((orphan) => (
              <div
                key={orphan.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 12,
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                }}
              >
                <div>
                  <strong>{orphan.name}</strong>
                  <span style={{ color: 'var(--color-muted)', marginLeft: 8 }}>
                    ({orphan.productCount} ürün)
                  </span>
                </div>
                <Button variant="danger" onClick={() => handleDelete(orphan.id)}>
                  Sil
                </Button>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default AdminCategoriesPage
