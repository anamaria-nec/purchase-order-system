import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import { apiFetch } from '@/lib/api'
import { getCurrentRole } from '@/lib/auth'
import type { PurchaseOrder, POStatus } from '@/lib/types'

const STATUS_LABEL: Record<POStatus, string> = {
  SUBMITTED: 'Submitted',
  PENDING_MANAGER: 'Pending Manager',
  PENDING_IT: 'Pending IT',
  PENDING_FINANCE: 'Pending Finance',
  NEEDS_REWORK: 'Needs Rework',
  INVOICED: 'Invoiced',
}

const STATUS_COLOR: Record<POStatus, string> = {
  SUBMITTED: 'bg-gray-100 text-gray-700',
  PENDING_MANAGER: 'bg-yellow-100 text-yellow-800',
  PENDING_IT: 'bg-blue-100 text-blue-800',
  PENDING_FINANCE: 'bg-purple-100 text-purple-800',
  NEEDS_REWORK: 'bg-red-100 text-red-700',
  INVOICED: 'bg-green-100 text-green-700',
}

export default async function Home() {
  const cookieStore = await cookies()
  if (!cookieStore.get('token')) redirect('/login')

  const role = await getCurrentRole()
  const res = await apiFetch('/purchase-orders')
  if (res.status === 401) redirect('/login')

  const pos: PurchaseOrder[] = await res.json()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800">Purchase Orders</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{role}</span>
          {role === 'CREATOR' && (
            <Link
              href="/purchase-orders/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              + Nou PO
            </Link>
          )}
          <form action={logout}>
            <button type="submit" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
              Iesire
            </button>
          </form>
        </div>
      </header>

      <main className="p-8">
        {pos.length === 0 ? (
          <p className="text-gray-500">Nu exista purchase orders.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['#', 'Titlu', 'Suma', 'Categorie', 'Status', 'Creator'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pos.map((po) => (
                  <tr key={po.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400">{po.id}</td>
                    <td className="px-4 py-3">
                      <Link href={`/purchase-orders/${po.id}`} className="font-medium text-blue-600 hover:underline">
                        {po.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-700">${parseFloat(po.amount).toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-600">{po.category.replace('_', ' ')}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLOR[po.status]}`}>
                        {STATUS_LABEL[po.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{po.creator.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
