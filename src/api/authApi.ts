import api from './axiosConfig'
import type { Role, User } from '../types'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  role: Role
}

export const authApi = {
  login: (data: LoginPayload) => api.post<User>('/api/auth/login', data),
  register: (data: RegisterPayload) => api.post<User>('/api/auth/register', data),
  validate: () => api.get<User>('/api/auth/validate'),
}
