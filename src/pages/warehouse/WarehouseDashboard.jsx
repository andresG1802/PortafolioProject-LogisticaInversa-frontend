import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScanBarcode, ClipboardCheck, Clock, ChevronRight } from 'lucide-react'
import { warehouseApi } from '../../api/warehouseApi'
import { PageSpinner } from '../../components/common/Spinner'
import { Badge } from '../../components/common/Badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const STATUS_CFG = {
  RECEIVED:        { label: 'Recibido',         variant: 'blue'   },
  INSPECTING:      { label: 'Inspeccionando',   variant: 'yellow' },
  INSPECTION_DONE: { label: 'Inspección lista', variant: 'green'  },
}

export default function WarehouseDashboard() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    warehouseApi.getAll({ page, size: 15 })
      .then((r) => {
        setItems(r.data.content ?? [])
        setTotalPages(r.data.totalPages ?? 0)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page])

  const pending   = items.filter((i) => i.status === 'RECEIVED').length
  const inspected = items.filter((i) => i.status === 'INSPECTION_DONE').length

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Panel de almacén</h1>
        <button onClick={() => navigate('/warehouse/receive')} className="btn-primary">
          <ScanBarcode size={16} /> Recibir paquete
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
            <Clock size={20} className="text-yellow-600" />
          </div>
          <div><p className="text-2xl font-bold">{pending}</p><p className="text-xs text-gray-500">Pendientes de inspección</p></div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
            <ClipboardCheck size={20} className="text-green-600" />
          </div>
          <div><p className="text-2xl font-bold">{inspected}</p><p className="text-xs text-gray-500">Inspeccionados</p></div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100">
            <ScanBarcode size={20} className="text-brand-600" />
          </div>
          <div><p className="text-2xl font-bold">{items.length}</p><p className="text-xs text-gray-500">Total recibidos</p></div>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Paquetes recibidos
        </h2>
        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">No hay paquetes recibidos aún</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {items.map((item) => {
              const cfg = STATUS_CFG[item.status] ?? { label: item.status, variant: 'gray' }
              return (
                <div
                  key={item.id}
                  onClick={() => navigate(`/warehouse/${item.id}/inspect`)}
                  className="flex cursor-pointer items-center justify-between py-3 hover:bg-gray-50 px-2 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.returnNumber}</p>
                    <p className="text-xs text-gray-400">Tracking: {item.trackingNumber}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge label={cfg.label} variant={cfg.variant} />
                    <span className="text-xs text-gray-400">
                      {format(new Date(item.receivedAt), 'dd MMM', { locale: es })}
                    </span>
                    {item.status === 'RECEIVED' && (
                      <ChevronRight size={16} className="text-gray-400" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="btn-secondary btn-sm">Anterior</button>
            <span className="flex items-center px-3 text-sm text-gray-600">{page + 1} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="btn-secondary btn-sm">Siguiente</button>
          </div>
        )}
      </div>
    </div>
  )
}
