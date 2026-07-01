import api from './axiosConfig'

export const returnApi = {
  create: (data) => api.post('/api/returns', data),
  getById: (id) => api.get(`/api/returns/${id}`),
  getByNumber: (num) => api.get(`/api/returns/number/${num}`),
  getByCustomer: (customerId, params) =>
    api.get(`/api/returns/customer/${customerId}`, { params }),
  getAll: (params) => api.get('/api/returns', { params }),
  updateStatus: (id, data) => api.patch(`/api/returns/${id}/status`, data),
  cancel: (id) => api.patch(`/api/returns/${id}/cancel`),
}
