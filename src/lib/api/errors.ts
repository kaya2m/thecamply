export class ApiError extends Error {
  public readonly status: number
  public readonly code?: string
  public readonly details?: unknown

  constructor(
    message: string,
    status: number = 500,
    details?: unknown,
    code?: string
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }
  }

  public isClientError(): boolean {
    return this.status >= 400 && this.status < 500
  }

  public isServerError(): boolean {
    return this.status >= 500
  }

  public isNetworkError(): boolean {
    return this.status === 0
  }

  public isTimeout(): boolean {
    return this.status === 408
  }

  public isUnauthorized(): boolean {
    return this.status === 401
  }

  public isForbidden(): boolean {
    return this.status === 403
  }

  public isNotFound(): boolean {
    return this.status === 404
  }

  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      details: this.details,
    }
  }
}

// Error handler utility
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return error.message || 'Geçersiz istek'
      case 401:
        return 'Oturum süreniz dolmuş, lütfen tekrar giriş yapın'
      case 403:
        return 'Bu işlem için yetkiniz bulunmuyor'
      case 404:
        return 'Aradığınız içerik bulunamadı'
      case 408:
        return 'İstek zaman aşımına uğradı, lütfen tekrar deneyin'
      case 429:
        return 'Çok fazla istek gönderdiniz, lütfen biraz bekleyin'
      case 500:
        return 'Sunucu hatası, lütfen daha sonra tekrar deneyin'
      default:
        return error.message || 'Beklenmeyen bir hata oluştu'
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Bilinmeyen bir hata oluştu'
}