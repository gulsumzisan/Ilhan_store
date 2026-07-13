import { useEffect, useState } from 'react'
import { productService } from '@/services'
import { Loader } from '@/components/common/Loader'
import { Button } from '@/components/ui/Button'
import { ProductFormModal } from '@/components/product/ProductFormModal'
import { formatCurrency } from '@/utils/format'
import { ClothingSizeLabels } from '@/types'
import type { CreateProductRequest, Product } from '@/types'

type ModalMode =
  | { open: false }
  | { open: true; product?: Product } // product undefined → yeni ekleme

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<ModalMode>({ open: false })

  const load = () => {
    setLoading(true)
    productService
      .getAll()
      .then(setProducts)
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) return
    await productService.remove(id)
    load()
  }

  const handleSubmit = async (data: CreateProductRequest) => {
    if (modal.open && modal.product) {
      await productService.update(modal.product.id, data)
    } else {
      await productService.create(data)
    }
    load()
  }

  if (loading) return <Loader />

  return (
    <>
      {modal.open && (
        <ProductFormModal
          product={modal.product}
          onSubmit={handleSubmit}
          onClose={() => setModal({ open: false })}
        />
      )}

      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <h1 style={{ margin: 0 }}>Ürün Yönetimi</h1>
          <Button onClick={() => setModal({ open: true, product: undefined })}>
            + Yeni Ürün
          </Button>
        </div>

        {products.length === 0 ? (
          <p style={{ color: 'var(--color-muted)' }}>Henüz ürün yok.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr
                style={{
                  textAlign: 'left',
                  borderBottom: '2px solid var(--color-border)',
                }}
              >
                <th style={cell}>Ad</th>
                <th style={cell}>Kategori</th>
                <th style={cell}>Beden</th>
                <th style={cell}>Fiyat</th>
                <th style={cell}>Stok</th>
                <th style={cell}></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  style={{ borderBottom: '1px solid var(--color-border)' }}
                >
                  <td style={cell}>{product.name}</td>
                  <td style={cell}>{product.categoryName ?? '—'}</td>
                  <td style={cell}>{ClothingSizeLabels[product.size]}</td>
                  <td style={cell}>{formatCurrency(product.price)}</td>
                  <td style={cell}>{product.stockQuantity}</td>
                  <td style={{ ...cell, display: 'flex', gap: 8 }}>
                    <Button
                      variant="secondary"
                      onClick={() => setModal({ open: true, product })}
                    >
                      Düzenle
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(product.id)}
                    >
                      Sil
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

const cell: React.CSSProperties = { padding: '10px 8px' }

export default AdminProductsPage
