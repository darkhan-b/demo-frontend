const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const cookieString = document.cookie
  const tokenMatch = cookieString.match(/accessToken=([^;]+)/)
  const token = tokenMatch ? tokenMatch[1] : null

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Ошибка запроса' }))
    throw new Error(error.message || 'Ошибка запроса')
  }

  return response.json()
}