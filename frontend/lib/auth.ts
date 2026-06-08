import { cookies } from 'next/headers'
import type { UserRole } from './types'

export async function getCurrentRole(): Promise<UserRole | null> {
  const cookieStore = await cookies()
  return (cookieStore.get('role')?.value as UserRole) ?? null
}

export async function getCurrentUserId(): Promise<number | null> {
  const cookieStore = await cookies()
  const id = cookieStore.get('user_id')?.value
  return id ? parseInt(id) : null
}
