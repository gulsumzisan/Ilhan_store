import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { fetchCategories } from '@/store/slices/categorySlice'
import { CategoryCard } from '@/components/category/CategoryCard'
import { Loader } from '@/components/common/Loader'
import { EmptyState } from '@/components/common/EmptyState'

export function CategoriesPage() {
  const dispatch = useAppDispatch()
  const { items, status } = useAppSelector((state) => state.categories)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  return (
    <div>
      <h1>Kategoriler</h1>
      {status === 'loading' ? (
        <Loader />
      ) : items.length === 0 ? (
        <EmptyState title="Kategori bulunamadı" />
      ) : (
        <div className="grid grid-products">
          {items.filter((c) => c.isMainCategory).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoriesPage
