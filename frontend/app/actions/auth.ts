'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { apiLogin } from '@/lib/api'

function decodeJwtPayload(token: string): Record<string, string> {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(Buffer.from(base64, 'base64').toString())
}

export async function login(prevState: string | null, formData: FormData): Promise<string | null> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const res = await apiLogin(email, password)
  if (!res.ok) return 'Email sau parola incorecta.'

  const data = await res.json()
  const payload = decodeJwtPayload(data.access_token)

  const cookieStore = await cookies()
  const cookieOpts = { httpOnly: true, path: '/', maxAge: 60 * 60 } as const
  cookieStore.set('token', data.access_token, cookieOpts)
  cookieStore.set('role', payload.role, cookieOpts)
  cookieStore.set('user_id', payload.sub, cookieOpts)

  redirect('/')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('token')
  cookieStore.delete('role')
  cookieStore.delete('user_id')
  redirect('/login')
}
