import { apiRequest } from './api'

export async function getCurrentUser() {
  try {
    return await apiRequest('/users/me')
  } catch (err) {
    return null
  }
}

export async function logout() {
  try {
    await apiRequest('/auth/logout', { method: 'POST' })
  } catch (err) {
    console.error('Logout failed', err)
  }
}