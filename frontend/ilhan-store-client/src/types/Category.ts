export interface Category {
  id: number
  name: string
  description?: string | null
  imageUrl?: string | null
  parentCategoryId?: number | null
  productCount: number
}

export interface CreateCategoryRequest {
  name: string
  description?: string | null
  imageUrl?: string | null
  parentCategoryId?: number | null
}

export type UpdateCategoryRequest = CreateCategoryRequest
