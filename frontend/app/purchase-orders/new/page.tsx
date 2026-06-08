'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { createPO } from '@/app/actions/po'

export default function NewPOPage() {
  const [error, action, pending] = useActionState(createPO, null)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-lg mx-auto">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 mb-6 inline-block">
          &larr; Inapoi
        </Link>
        <div className="bg-white rounded-2xl shadow p-8">
          <h1 className="text-xl font-semibold text-gray-800 mb-6">Purchase Order nou</h1>
          <form action={action} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Titlu</label>
              <input
                name="title"
                required
                placeholder="ex: Laptop Dell XPS"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                placeholder="0.00"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Categorie</label>
              <select
                name="category"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="mt-2 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {pending ? 'Se creeaza...' : 'Creeaza PO'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
