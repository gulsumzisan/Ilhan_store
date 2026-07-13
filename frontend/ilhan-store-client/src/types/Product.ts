// ClothingSize enum'u (backend'de sayısal olarak serialize ediliyor)
export const ClothingSize = {
  XS: 0,
  S: 1,
  M: 2,
  L: 3,
  XL: 4,
  XXL: 5,
} as const

export type ClothingSize = (typeof ClothingSize)[keyof typeof ClothingSize]

export const ClothingSizeLabels: Record<ClothingSize, string> = {
  [ClothingSize.XS]: 'XS',
  [ClothingSize.S]: 'S',
  [ClothingSize.M]: 'M',
  [ClothingSize.L]: 'L',
  [ClothingSize.XL]: 'XL',
  [ClothingSize.XXL]: 'XXL',
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  discountPrice?: number | null
  stockQuantity: number
  brand?: string | null
  color?: string | null
  size: ClothingSize
  imageUrl?: string | null
  categoryId: number
  categoryName?: string | null
}

export interface CreateProductRequest {
  name: string
  description: string
  price: number
  discountPrice?: number | null
  stockQuantity: number
  brand?: string | null
  color?: string | null
  size: ClothingSize
  imageUrl?: string | null
  categoryId: number
}

export type UpdateProductRequest = CreateProductRequest

export interface ProductSearchParams {
  searchTerm?: string
  categoryId?: number
  minPrice?: number
  maxPrice?: number
}
