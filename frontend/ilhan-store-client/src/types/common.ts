// Backend'in tüm cevaplarını sardığı standart zarf (ApiResponse<T>)
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T | null
}
