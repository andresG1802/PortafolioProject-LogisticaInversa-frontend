import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { authApi, type LoginPayload, type RegisterPayload } from '../api/authApi'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<User>
  register: (formData: RegisterPayload) => Promise<User>
  logout: () => void
  isAdmin: boolean
  isWarehouse: boolean
  isCustomer: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? (JSON.parse(stored) as User) : null
    } catch {
      return null
    }
  })

  const login = useCallback(async (email: string, password: string) => {
    const payload: LoginPayload = { email, password }
    const { data } = await authApi.login(payload)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
    return data
  }, [])

  const register = useCallback(async (formData: RegisterPayload) => {
    const { data } = await authApi.register(formData)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  const isAdmin = user?.role === 'ADMIN'
  const isWarehouse = user?.role === 'WAREHOUSE_STAFF'
  const isCustomer = user?.role === 'CUSTOMER'

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, isWarehouse, isCustomer }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
