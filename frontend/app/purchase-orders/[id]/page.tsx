import Link from 'next/link'
import { redirect } from 'next/navigation'
import { apiFetch } from '@/lib/api'
import { getCurrentRole, getCurrentUserId } from '@/lib/auth'
import { approvePO, rejectPO, resubmitPO } from '@/app/actions/po'
import { RejectForm } from '@/app/components/RejectForm'
import { ResubmitForm } from '@/app/components/ResubmitForm'
import type { PurchaseOrder, POStatus, UserRole } from '@/lib/types'

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

const APPROVER_FOR_STATUS: Partial<Record<POStatus, UserRole>> = {
  PENDING_MANAGER: 'MANAGER',
  PENDING_IT: 'IT_REPRESENTATIVE',
  PENDING_FINANCE: 'FINANCE',
}

export default async function PODetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const res = await apiFetch(`/purchase-orders/${id}`)
  if (res.status === 401) redirect('/login')
  if (res.status === 404) redirect('/')

  const po: PurchaseOrder = await res.json()
  const role = await getCurrentRole()
  const userId = await getCurrentUserId()

  const canApproveOrReject = role !== null && APPROVER_FOR_STATUS[po.status] === role
  const canResubmit = role === 'CREATOR' && po.status === 'NEEDS_REWORK' && po.creator.id === userId

  const approveAction = approvePO.bind(null, po.id)
  const rejectAction = rejectPO.bind(null, po.id)
  const resubmitAction = resubmitPO.bind(null, po.id)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 mb-6 inline-block">
          &larr; Inapoi
        </Link>

        <div className="bg-white rounded-2xl shadow p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs text-gray-400 mb-1">PO #{po.id}</p>
              <h1 className="text-xl font-semibold text-gray-800">{po.title}</h1>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLOR[po.status]}`}>
              {STATUS_LABEL[po.status]}
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500 mb-1">Suma</dt>
              <dd className="font-medium text-gray-800">${parseFloat(po.amount).toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-gray-500 mb-1">Categorie</dt>
              <dd className="font-medium text-gray-800">{po.category.replace(/_/g, ' ')}</dd>
            </div>
            <div>
              <dt className="text-gray-500 mb-1">Creator</dt>
              <dd className="font-medium text-gray-800">{po.creator.name}</dd>
            </div>
            <div>
              <dt className="text-gray-500 mb-1">Rolul tau</dt>
              <dd className="font-medium text-gray-800">{role}</dd>
            </div>
          </dl>

          {po.rejection_comment && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-xs font-medium text-red-700 mb-1">Motiv respingere</p>
              <p className="text-sm text-red-800">{po.rejection_comment}</p>
            </div>
          )}

          {canApproveOrReject && (
            <div className="mt-6 flex flex-col gap-3">
              <form action={approveAction}>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Aproba
                </button>
              </form>
              <RejectForm action={rejectAction} />
            </div>
          )}

          {canResubmit && <ResubmitForm action={resubmitAction} po={po} />}
        </div>
      </div>
    </div>
  )
}
