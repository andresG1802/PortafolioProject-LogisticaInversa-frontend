import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Package, CheckCircle, Clock, XCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { returnApi } from '../../api/returnApi'
import { useAuth } from '../../context/AuthContext'
import { ReturnCard } from '../../components/returns/ReturnCard'
import { PageSpinner } from '../../components/common/Spinner'
import type { ReturnRequest } from '../../types'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: number
  color: string
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [returns, setReturns] = useState<ReturnRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    returnApi
      .getByCustomer(user.userId, { page: 0, size: 20 })
      .then((r) => setReturns(r.data.content ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  if (!user) return null

  const stats = {
    total:     returns.length,
    active:    returns.filter((r) => !['COMPLETED', 'REJECTED', 'CANCELLED'].includes(r.status)).length,
    completed: returns.filter((r) => r.status === 'COMPLETED').length,
    rejected:  returns.filter((r) => ['REJECTED', 'CANCELLED'].includes(r.status)).length,
  }

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hola, {user.firstName} 👋
          </h1>
          <p className="text-sm text-gray-500">Acá podés ver y gestionar tus devoluciones</p>
        </div>
        <Link to="/returns/new" className="btn-primary">
          <Plus size={16} />
          Nueva devolución
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Package}      label="Total"       value={stats.total}     color="bg-brand-600" />
        <StatCard icon={Clock}        label="En proceso"  value={stats.active}    color="bg-yellow-500" />
        <StatCard icon={CheckCircle}  label="Completadas" value={stats.completed} color="bg-green-500" />
        <StatCard icon={XCircle}      label="Rechazadas"  value={stats.rejected}  color="bg-red-500" />
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold text-gray-900">Devoluciones recientes</h2>
        {returns.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 py-12 text-center">
            <Package size={40} className="text-gray-300" />
            <p className="text-gray-500">No tenés devoluciones todavía</p>
            <Link to="/returns/new" className="btn-primary btn-sm">
              Crear primera devolución
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {returns.slice(0, 6).map((r) => (
              <ReturnCard key={r.id} ret={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
