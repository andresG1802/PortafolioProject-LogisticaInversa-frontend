import api from './axiosConfig'

export const warehouseApi = {
  receiveReturn: (data) => api.post('/api/warehouse/receive', data),
  inspect: (id, data) => api.patch(`/api/warehouse/${id}/inspect`, data),
  getById: (id) => api.get(`/api/warehouse/${id}`),
  getByReturnId: (returnId) => api.get(`/api/warehouse/return/${returnId}`),
  getAll: (params) => api.get('/api/warehouse', { params }),
}
