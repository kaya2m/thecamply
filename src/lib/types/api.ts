export interface ApiResponse<T = unknown> {
  data: T
  success: boolean
  message?: string
  errors?: Record<string, string[]>
  meta?: {
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
    [key: string]: unknown
  }
}

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  data?: unknown
  headers?: Record<string, string>
  skipAuth?: boolean
  timeout?: number
}

export interface PaginationParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface SearchParams extends PaginationParams {
  q?: string
  filters?: Record<string, unknown>
}