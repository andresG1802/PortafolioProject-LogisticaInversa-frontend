import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { PrivateRoute } from './routes/PrivateRoute'
import { Layout } from './components/layout/Layout'

import Login        from './pages/auth/Login'
import Register     from './pages/auth/Register'
import Dashboard    from './pages/customer/Dashboard'
import ReturnsList  from './pages/customer/ReturnsList'
import CreateReturn from './pages/customer/CreateReturn'
import ReturnDetail from './pages/customer/ReturnDetail'
import WarehouseDashboard from './pages/warehouse/WarehouseDashboard'
import ReceivePackage     from './pages/warehouse/ReceivePackage'
import InspectPackage     from './pages/warehouse/InspectPackage'
import AdminDashboard     from './pages/admin/AdminDashboard'
import NotFound           from './pages/NotFound'

function HomeRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'WAREHOUSE_STAFF') return <Navigate to="/warehouse" replace />
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />
  return <Navigate to="/dashboard" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Públicas */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Privadas con layout */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<HomeRedirect />} />

              {/* Cliente */}
              <Route element={<PrivateRoute allowedRoles={['CUSTOMER', 'ADMIN']} />}>
                <Route path="/dashboard"    element={<Dashboard />} />
                <Route path="/returns"      element={<ReturnsList />} />
                <Route path="/returns/new"  element={<CreateReturn />} />
                <Route path="/returns/:id"  element={<ReturnDetail />} />
              </Route>

              {/* Almacén */}
              <Route element={<PrivateRoute allowedRoles={['WAREHOUSE_STAFF', 'ADMIN']} />}>
                <Route path="/warehouse"              element={<WarehouseDashboard />} />
                <Route path="/warehouse/receive"      element={<ReceivePackage />} />
                <Route path="/warehouse/:id/inspect"  element={<InspectPackage />} />
              </Route>

              {/* Admin */}
              <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
