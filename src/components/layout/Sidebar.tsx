import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, PackageSearch, Plus, Warehouse,
  ScanBarcode, ClipboardList, LogOut, RotateCcw,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface NavItemProps {
  to: string
  icon: LucideIcon
  label: string
}

function NavItem({ to, icon: Icon, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
         ${isActive
           ? 'bg-brand-600 text-white'
           : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  )
}

export function Sidebar() {
  const { user, logout, isAdmin, isWarehouse, isCustomer } = useAuth()

  return (
    <aside className="flex h-screen w-60 flex-col bg-gray-900">
      <div className="flex items-center gap-3 border-b border-gray-800 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
          <RotateCcw size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Log. Inversa</p>
          <p className="text-xs text-gray-400">{user?.role}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {(isCustomer || isAdmin) && (
          <>
            <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Devoluciones
            </p>
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Mi panel" />
            <NavItem to="/returns/new" icon={Plus} label="Nueva devolución" />
            <NavItem to="/returns" icon={PackageSearch} label="Mis devoluciones" />
          </>
        )}

        {(isWarehouse || isAdmin) && (
          <>
            <p className="mb-1 mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Almacén
            </p>
            <NavItem to="/warehouse" icon={Warehouse} label="Panel almacén" />
            <NavItem to="/warehouse/receive" icon={ScanBarcode} label="Recibir paquete" />
          </>
        )}

        {isAdmin && (
          <>
            <p className="mb-1 mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Administración
            </p>
            <NavItem to="/admin" icon={ClipboardList} label="Todas las devoluciones" />
          </>
        )}
      </nav>

      <div className="border-t border-gray-800 px-3 py-4">
        <div className="mb-3 flex items-center gap-3 px-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="truncate text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400
                     hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
