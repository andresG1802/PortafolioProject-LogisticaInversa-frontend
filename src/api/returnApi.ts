import api from './axiosConfig'
import type { Page, ReturnReason, ReturnRequest, ReturnStatus, ReturnType } from '../types'

export interface CreateReturnItemPayload {
  productId: string
  productName: string
  sku?: string
  quantity: number
  unitPrice?: number
}

export interface CreateReturnPayload {
  orderId: string
  orderNumber: string
  reason: ReturnReason
  reasonDescription?: string
  returnType: ReturnType
  customerId: string
  customerEmail: string
  customerName: string
  items: CreateReturnItemPayload[]
}

export interface UpdateStatusPayload {
  status: ReturnStatus
  adminNotes?: string
}

export interface ListParams {
  page?: number
  size?: number
  status?: string
}

export const returnApi = {
  create: (data: CreateReturnPayload) => api.post<ReturnRequest>('/api/returns', data),
  getById: (id: string) => api.get<ReturnRequest>(`/api/returns/${id}`),
  getByNumber: (num: string) => api.get<ReturnRequest>(`/api/returns/number/${num}`),
  getByCustomer: (customerId: string, params?: ListParams) =>
    api.get<Page<ReturnRequest>>(`/api/returns/customer/${customerId}`, { params }),
  getAll: (params?: ListParams) => api.get<Page<ReturnRequest>>('/api/returns', { params }),
  updateStatus: (id: string, data: UpdateStatusPayload) =>
    api.patch<ReturnRequest>(`/api/returns/${id}/status`, data),
  cancel: (id: string) => api.patch<ReturnRequest>(`/api/returns/${id}/cancel`),
}
