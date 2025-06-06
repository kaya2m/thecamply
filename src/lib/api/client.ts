import { ApiResponse, RequestConfig } from '../types/api'
import { ApiError } from './errors'

class ApiClient {
  private readonly baseURL: string
  private readonly timeout: number

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL!
    this.timeout = 15000

    if (!this.baseURL) {
      throw new Error('API_BASE_URL is not configured')
    }
  }

  private async request<T = unknown>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      data,
      headers = {},
      skipAuth = false,
      timeout = this.timeout,
    } = config

    const url = `${this.baseURL}${endpoint}`
    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    }
    if (!skipAuth && typeof window !== 'undefined') {
      const token = localStorage.getItem('auth-token')
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`
      }
    }

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      signal: AbortSignal.timeout(timeout),
    }

    if (data) {
      requestOptions.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(url, requestOptions)
      const responseData = await this.parseResponse<T>(response)
      if (!response.ok) {
        throw new ApiError(
          responseData.message || `HTTP ${response.status}`,
          response.status,
          responseData
        )
      }

      return responseData
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      if (error instanceof DOMException && error.name === 'TimeoutError') {
        throw new ApiError('Request timeout', 408)
      }

      if (error instanceof TypeError) {
        throw new ApiError('Network error', 0)
      }

      throw new ApiError('Unknown error', 500, error)
    }
  }

  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type')
    if (response.status === 204) {
      return { data: undefined as T, success: true }
    }

    if (contentType?.includes('application/json')) {
      return await response.json()
    }

    const text = await response.text()
    return { data: text as T, success: response.ok }
  }

  async get<T = unknown>(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
    config?: Omit<RequestConfig, 'method' | 'data'>
  ): Promise<T> {
    const url = params
      ? `${endpoint}?${new URLSearchParams(params as Record<string, string>)}`
      : endpoint
    const response = await this.request<T>(url, { ...config, method: 'GET' })
    return response.data
  }

  async post<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: Omit<RequestConfig, 'method'>
  ): Promise<T> {
    const response = await this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      data
    })
    return response.data
  }

  async put<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: Omit<RequestConfig, 'method'>
  ): Promise<T> {
    const response = await this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      data
    })
    return response.data
  }

  async patch<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: Omit<RequestConfig, 'method'>
  ): Promise<T> {
    const response = await this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      data
    })
    return response.data
  }

  async delete<T = unknown>(
    endpoint: string,
    config?: Omit<RequestConfig, 'method' | 'data'>
  ): Promise<T> {
    const response = await this.request<T>(endpoint, {
      ...config,
      method: 'DELETE'
    })
    return response.data
  }
  async upload<T = unknown>(
    endpoint: string,
    formData: FormData,
    config?: Omit<RequestConfig, 'method' | 'data'>
  ): Promise<T> {
    const { headers, ...restConfig } = config || {}
    const uploadHeaders = { ...headers }
    delete uploadHeaders['Content-Type']

    const response = await this.request<T>(endpoint, {
      ...restConfig,
      method: 'POST',
      data: formData,
      headers: uploadHeaders,
    })
    return response.data
  }
}

export const apiClient = new ApiClient()