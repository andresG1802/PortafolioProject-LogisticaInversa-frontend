import api from './axiosConfig'
import type { InspectionResult, Page, WarehouseItem } from '../types'

export interface ReceiveReturnPayload {
  returnId: string
  returnNumber: string
  trackingNumber: string
  warehouseLocation?: string
  receivedBy?: string
}

export interface InspectPayload {
  inspectionResult: InspectionResult
  inspectionNotes: string
  inspectedBy?: string
  approvedRefundAmount?: number
  restockable: boolean
}

export interface ListParams {
  page?: number
  size?: number
}

export const warehouseApi = {
  receiveReturn: (data: ReceiveReturnPayload) => api.post<WarehouseItem>('/api/warehouse/receive', data),
  inspect: (id: string, data: InspectPayload) => api.patch<WarehouseItem>(`/api/warehouse/${id}/inspect`, data),
  getById: (id: string) => api.get<WarehouseItem>(`/api/warehouse/${id}`),
  getByReturnId: (returnId: string) => api.get<WarehouseItem>(`/api/warehouse/return/${returnId}`),
  getAll: (params?: ListParams) => api.get<Page<WarehouseItem>>('/api/warehouse', { params }),
}
