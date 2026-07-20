export interface Category {
  id: number
  name: string
  description?: string | null
  imageUrl?: string | null
  isMainCategory: boolean
  parentCategoryIds: number[]
  productCount: number
}

export interface CreateCategoryRequest {
  name: string
  description?: string | null
  imageUrl?: string | null
  isMainCategory: boolean
  parentCategoryIds: number[]
}

export type UpdateCategoryRequest = CreateCategoryRequest
