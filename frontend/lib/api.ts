import { cookies } from 'next/headers'

const API_URL = process.env.API_URL ?? 'http://localhost:8000'

export async function apiFetch(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return fetch(`${API_URL}${path}`, { ...options, headers, cache: 'no-store' })
}

export async function apiLogin(email: string, password: string) {
  const body = new URLSearchParams({ username: email, password })
  return fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
}
