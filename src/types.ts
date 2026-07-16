export type Role = 'CUSTOMER' | 'WAREHOUSE_STAFF' | 'ADMIN'

export interface User {
  userId: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: Role
  token: string
}

export interface Page<T> {
  content: T[]
  totalPages: number
  totalElements?: number
  number?: number
  size?: number
}

export type ReturnStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'LABEL_GENERATED'
  | 'SHIPPED'
  | 'RECEIVED'
  | 'INSPECTED'
  | 'REFUND_PROCESSING'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED'

export type ReturnReason =
  | 'DEFECTIVE_PRODUCT'
  | 'WRONG_ITEM_RECEIVED'
  | 'CHANGED_MIND'
  | 'DAMAGED_IN_SHIPPING'
  | 'NOT_AS_DESCRIBED'
  | 'SIZE_OR_FIT_ISSUE'
  | 'DUPLICATE_ORDER'
  | 'ARRIVED_TOO_LATE'
  | 'MISSING_PARTS'
  | 'OTHER'

export type ReturnType = 'REFUND' | 'EXCHANGE' | 'STORE_CREDIT'

export interface ReturnItem {
  id?: string
  productId: string
  productName: string
  sku?: string
  quantity: number
  unitPrice?: number
}

export interface ReturnRequest {
  id: string
  returnNumber: string
  orderId: string
  orderNumber: string
  reason: ReturnReason
  reasonDescription?: string
  returnType: ReturnType
  status: ReturnStatus
  customerId: string
  customerEmail: string
  customerName: string
  trackingNumber?: string
  carrierName?: string
  refundAmount?: number
  adminNotes?: string
  createdAt: string
  items: ReturnItem[]
}

export type WarehouseItemStatus = 'RECEIVED' | 'INSPECTING' | 'INSPECTION_DONE'

export type InspectionResult =
  | 'APPROVED_FULL_REFUND'
  | 'APPROVED_PARTIAL_REFUND'
  | 'APPROVED_EXCHANGE'
  | 'REJECTED_NOT_ELIGIBLE'
  | 'REJECTED_POLICY_VIOLATION'

export interface WarehouseItem {
  id: string
  returnId: string
  returnNumber: string
  trackingNumber: string
  warehouseLocation?: string
  receivedBy?: string
  receivedAt: string
  status: WarehouseItemStatus
  inspectionResult?: InspectionResult
  inspectedBy?: string
  inspectionNotes?: string
  approvedRefundAmount?: number
  restockable?: boolean
}
