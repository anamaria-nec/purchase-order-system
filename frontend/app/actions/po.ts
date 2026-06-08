'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { apiFetch } from '@/lib/api'

export async function createPO(prevState: string | null, formData: FormData): Promise<string | null> {
  const res = await apiFetch('/purchase-orders', {
    method: 'POST',
    body: JSON.stringify({
      title: formData.get('title'),
      amount: parseFloat(formData.get('amount') as string),
      category: formData.get('category'),
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    return err.detail ?? 'Eroare la creare.'
  }
  redirect('/')
}

export async function approvePO(po_id: number, _formData: FormData) {
  await apiFetch(`/purchase-orders/${po_id}/approve`, { method: 'POST' })
  revalidatePath(`/purchase-orders/${po_id}`)
  redirect(`/purchase-orders/${po_id}`)
}

export async function rejectPO(po_id: number, formData: FormData) {
  const comment = formData.get('comment') as string
  await apiFetch(`/purchase-orders/${po_id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ comment }),
  })
  revalidatePath(`/purchase-orders/${po_id}`)
  redirect(`/purchase-orders/${po_id}`)
}

export async function resubmitPO(po_id: number, prevState: string | null, formData: FormData): Promise<string | null> {
  const res = await apiFetch(`/purchase-orders/${po_id}/resubmit`, {
    method: 'POST',
    body: JSON.stringify({
      title: formData.get('title'),
      amount: parseFloat(formData.get('amount') as string),
      category: formData.get('category'),
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    return err.detail ?? 'Eroare la retrimitere.'
  }
  redirect('/')
}
