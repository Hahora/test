// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Types for API requests and responses
export interface LoginRequest {
  login: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
  }
}

export interface UploadResponse {
  doc_id: string
  filename: string
  upload_date: string
  status: 'processing' | 'completed' | 'error'
}

export interface ErrorPoint {
  gostNumber: string
  section: string
  description: string
  severity: 'critical' | 'warning' | 'info'
  line?: number
  page?: number
}

export interface ErrorCounts {
  [gostNumber: string]: number
  total: number
}

export interface HistoryItem {
  id: number
  doc_id: number
  filename: string
  upload_date: string
  error_points: string[]
  error_counts: ErrorCounts
  total_violations: number
  status: 'processing' | 'completed' | 'error' // Добавлено поле статуса
}

export interface DetailedResult {
  id: string
  filename: string
  upload_date: string
  error_points: string[]
  error_counts: ErrorCounts
  total_violations: number
  full_report: string
}

export class ApiError extends Error {
  code?: string
  status?: number

  constructor({ message, code, status }: { message: string; code?: string; status?: number }) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status

    // Сохраняем стек вызовов (опционально, но рекомендуется)
    // Используем проверку через 'in' для совместимости с браузерами
    if ('captureStackTrace' in Error) {
      ;(Error as any).captureStackTrace(this, ApiError)
    }
  }
}

// JWT Token Management
class TokenManager {
  private static readonly TOKEN_KEY = 'jwt_token'

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY)
  }

  static isTokenExpired(token: string): boolean {
    try {
      const tokenParts = token.split('.')
      if (tokenParts.length !== 3) {
        return true
      }

      const payloadBase64 = tokenParts[1]
      if (!payloadBase64) {
        return true
      }

      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
      const payloadJson = atob(base64)
      const payload = JSON.parse(payloadJson)

      const currentTime = Date.now() / 1000
      return typeof payload.exp === 'number' && payload.exp < currentTime
    } catch (error) {
      return true
    }
  }

  static isAuthenticated(): boolean {
    const token = this.getToken()
    return token !== null && !this.isTokenExpired(token)
  }
}

// HTTP Client with JWT Authentication
class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private getAuthHeaders(): HeadersInit {
    const token = TokenManager.getToken()
    const headers: HeadersInit = {}

    if (token && !TokenManager.isTokenExpired(token)) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      let errorCode = response.status.toString()

      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
        errorCode = errorData.code || errorCode
      } catch {
        // If response is not JSON, use default error message
      }

      const error = new ApiError({
        message: errorMessage,
        code: errorCode,
        status: response.status,
      })

      // Handle authentication errors
      if (response.status === 401) {
        TokenManager.removeToken()
        error.message = 'Authentication failed. Please login again.'
      }

      throw error
    }

    // Handle different content types
    const contentType = response.headers.get('content-type')

    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }

    // For file downloads, return the response itself
    return response as unknown as T
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    try {
      const response = await fetch(url, options)
      return await this.handleResponse<T>(response)
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError({
          message: 'Network error. Please check your connection.',
          code: 'NETWORK_ERROR',
        })
      }
      throw error
    }
  }

  // 1. POST /login - Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<any>('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: credentials.login,
        password: credentials.password,
      }),
    })

    // Store JWT token after successful login
    TokenManager.setToken(response.access_token)

    return {
      token: response.access_token,
      user: {
        id: response.user?.id || credentials.login,
        name: response.user?.name || credentials.login,
        email: response.user?.email || '',
      },
    }
  }

  // 2. POST /upload - File Upload
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    return await this.request<UploadResponse>('/upload', {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        // Don't set Content-Type for FormData
      },
      body: formData,
    })
  }

  // 3. GET /download/{doc_id} - File Download
  async downloadFile(docId: string): Promise<Blob> {
    const response = await this.request<Response>(`/download/${docId}`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    })

    if (response instanceof Response) {
      return await response.blob()
    }

    throw new ApiError({
      message: 'Invalid response format for file download',
      code: 'INVALID_RESPONSE',
    })
  }

  // 4. GET /download_annotated/{doc_id} - Annotated File Download
  async downloadAnnotatedFile(docId: string): Promise<Blob> {
    const response = await this.request<Response>(`/download_annotated/${docId}`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    })

    if (response instanceof Response) {
      return await response.blob()
    }

    throw new ApiError({
      message: 'Invalid response format for annotated file download',
      code: 'INVALID_RESPONSE',
    })
  }

  // 5. GET /history - Get User's Check History
  async getHistory(): Promise<HistoryItem[]> {
    return await this.request<HistoryItem[]>('/history', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
    })
  }

  // 6. GET /result/{doc_id} - Get Detailed Result
  async getResult(docId: string): Promise<DetailedResult> {
    return await this.request<DetailedResult>(`/result/${docId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
    })
  }

  // Logout - Clear stored token
  logout(): void {
    TokenManager.removeToken()
  }

  // Check authentication status
  isAuthenticated(): boolean {
    return TokenManager.isAuthenticated()
  }
}

// Create singleton API client instance
export const apiClient = new ApiClient(API_BASE_URL)

// Convenience API functions
export const api = {
  // Authentication
  login: (login: string, password: string) => apiClient.login({ login, password }),
  logout: () => apiClient.logout(),
  isAuthenticated: () => apiClient.isAuthenticated(),

  // File operations
  uploadFile: (file: File) => apiClient.uploadFile(file),
  downloadFile: (docId: string) => apiClient.downloadFile(docId),
  downloadAnnotatedFile: (docId: string) => apiClient.downloadAnnotatedFile(docId),

  // Data retrieval
  getHistory: () => apiClient.getHistory(),
  getResult: (docId: string) => apiClient.getResult(docId),
}

// Error handling utilities
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}

// Helper function to download file with proper filename
export const downloadFileWithName = async (docId: string, filename?: string): Promise<void> => {
  try {
    const blob = await api.downloadFile(docId)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename || `document_${docId}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    throw new Error(`Failed to download file: ${handleApiError(error)}`)
  }
}

// Helper function to download annotated file with proper filename
export const downloadAnnotatedFileWithName = async (
  docId: string,
  filename?: string,
): Promise<void> => {
  try {
    const blob = await api.downloadAnnotatedFile(docId)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename || `annotated_${docId}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    throw new Error(`Failed to download annotated file: ${handleApiError(error)}`)
  }
}

// Type guards
export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError
}

export const isLoginResponse = (response: unknown): response is LoginResponse => {
  return (
    typeof response === 'object' && response !== null && 'token' in response && 'user' in response
  )
}

// Authentication status checker for route guards
export const checkAuthStatus = (): boolean => {
  return TokenManager.isAuthenticated()
}

// Token refresh checker
export const validateToken = (): boolean => {
  const token = TokenManager.getToken()
  if (!token) return false
  if (TokenManager.isTokenExpired(token)) {
    TokenManager.removeToken()
    return false
  }
  return true
}

// Export token manager for direct access if needed
export { TokenManager }
