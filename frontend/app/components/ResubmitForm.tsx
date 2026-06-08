'use client'

import { useActionState } from 'react'
import type { PurchaseOrder } from '@/lib/types'

type Props = {
  action: (prevState: string | null, formData: FormData) => Promise<string | null>
  po: PurchaseOrder
}

export function ResubmitForm({ action, po }: Props) {
  const [error, formAction, pending] = useActionState(action, null)

  return (
    <div className="mt-4 p-4 border border-orange-200 bg-orange-50 rounded-xl">
      <h3 className="font-medium text-orange-800 mb-3">Retrimite PO-ul cu modificari</h3>
      <form action={formAction} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Titlu</label>
          <input
            name="title"
            required
            defaultValue={po.title}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Suma ($)</label>
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={po.amount}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Categorie</label>
          <select
            name="category"
            defaultValue={po.category}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="SERVICES">Services</option>
            <option value="OFFICE_SUPPLIES">Office Supplies</option>
            <option value="IT_EQUIPMENT">IT Equipment</option>
          </select>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50 transition-colors"
        >
          {pending ? 'Se trimite...' : 'Retrimite'}
        </button>
      </form>
    </div>
  )
}
