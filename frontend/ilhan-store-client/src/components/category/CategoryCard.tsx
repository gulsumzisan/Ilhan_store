import { Link } from 'react-router-dom'
import type { Category } from '@/types'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/products?categoryId=${category.id}`}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
        padding: 16,
        display: 'block',
      }}
    >
      <img
        src={category.imageUrl || 'https://placehold.co/300x160?text=Kategori'}
        alt={category.name}
        style={{
          width: '100%',
          height: 120,
          objectFit: 'cover',
          borderRadius: 'var(--radius)',
          marginBottom: 12,
        }}
      />
      <h3 style={{ margin: '0 0 4px', fontSize: 16 }}>{category.name}</h3>
      <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>
        {category.productCount} ürün
      </span>
    </Link>
  )
}
