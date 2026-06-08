export type UserRole = 'CREATOR' | 'MANAGER' | 'IT_REPRESENTATIVE' | 'FINANCE'
export type POStatus = 'SUBMITTED' | 'PENDING_MANAGER' | 'PENDING_IT' | 'PENDING_FINANCE' | 'NEEDS_REWORK' | 'INVOICED'
export type POCategory = 'SERVICES' | 'OFFICE_SUPPLIES' | 'IT_EQUIPMENT'

export type POUser = {
  id: number
  name: string
  email: string
  role: UserRole
}

export type PurchaseOrder = {
  id: number
  title: string
  amount: string
  category: POCategory
  status: POStatus
  rejection_comment: string | null
  creator: POUser
}
