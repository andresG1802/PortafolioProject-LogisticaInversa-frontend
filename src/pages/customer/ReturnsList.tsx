import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { returnApi } from '../../api/returnApi'
import { useAuth } from '../../context/AuthContext'
import { ReturnCard } from '../../components/returns/ReturnCard'
import { PageSpinner } from '../../components/common/Spinner'
import type { ReturnRequest, ReturnStatus } from '../../types'

const STATUSES: { value: ReturnStatus | ''; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'APPROVED', label: 'Aprobado' },
  { value: 'SHIPPED', label: 'Enviado' },
  { value: 'RECEIVED', label: 'Recibido' },
  { value: 'COMPLETED', label: 'Completado' },
  { value: 'REJECTED', label: 'Rechazado' },
]

export default function ReturnsList() {
  const { user } = useAuth()
  const [returns, setReturns] = useState<ReturnRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<ReturnStatus | ''>('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    returnApi
      .getByCustomer(user.userId, { page, size: 10, ...(status && { status }) })
      .then((r) => {
        setReturns(r.data.content ?? [])
        setTotalPages(r.data.totalPages ?? 0)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user, status, page])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Mis devoluciones</h1>
        <Link to="/returns/new" className="btn-primary">
          <Plus size={16} /> Nueva
        </Link>
      </div>

      <div className="flex gap-2">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => { setStatus(s.value); setPage(0) }}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors
              ${status === s.value
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-gray-200 bg-white text-gray-600 hover:border-brand-400'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <PageSpinner />
      ) : returns.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 py-12 text-center">
          <Search size={36} className="text-gray-300" />
          <p className="text-gray-500">No hay devoluciones con ese filtro</p>
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {returns.map((r) => <ReturnCard key={r.id} ret={r} />)}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="btn-secondary btn-sm"
          >
            Anterior
          </button>
          <span className="flex items-center px-3 text-sm text-gray-600">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="btn-secondary btn-sm"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}
