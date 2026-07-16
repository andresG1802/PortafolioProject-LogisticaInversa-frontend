import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { returnApi } from '../../api/returnApi'
import { ReturnStatusBadge } from '../../components/returns/ReturnStatusBadge'
import { PageSpinner } from '../../components/common/Spinner'
import { Modal } from '../../components/common/Modal'
import { Select } from '../../components/common/Select'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { getErrorMessage } from '../../utils/getErrorMessage'
import type { ReturnRequest, ReturnStatus } from '../../types'

const NEXT_STATUSES: Partial<Record<ReturnStatus, ReturnStatus[]>> = {
  PENDING:           ['APPROVED', 'REJECTED'],
  APPROVED:          ['LABEL_GENERATED', 'CANCELLED'],
  LABEL_GENERATED:   ['SHIPPED'],
  SHIPPED:           ['RECEIVED'],
  RECEIVED:          ['INSPECTED'],
  INSPECTED:         ['REFUND_PROCESSING', 'REJECTED'],
  REFUND_PROCESSING: ['COMPLETED'],
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [returns, setReturns] = useState<ReturnRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [statusModal, setStatusModal] = useState<ReturnRequest | null>(null)
  const [newStatus, setNewStatus] = useState<ReturnStatus | ''>('')
  const [adminNotes, setAdminNotes] = useState('')
  const [updating, setUpdating] = useState(false)

  const fetchReturns = () => {
    setLoading(true)
    returnApi.getAll({ page, size: 15 })
      .then((r) => {
        setReturns(r.data.content ?? [])
        setTotalPages(r.data.totalPages ?? 0)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(fetchReturns, [page])

  const openModal = (ret: ReturnRequest) => {
    setStatusModal(ret)
    setNewStatus('')
    setAdminNotes('')
  }

  const handleStatusUpdate = async () => {
    if (!newStatus || !statusModal) return
    setUpdating(true)
    try {
      await returnApi.updateStatus(statusModal.id, { status: newStatus, adminNotes })
      setStatusModal(null)
      fetchReturns()
    } catch (err) {
      alert(getErrorMessage(err, 'Error al actualizar'))
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <PageSpinner />

  const nextOpts = statusModal
    ? (NEXT_STATUSES[statusModal.status] ?? []).map((s) => ({ value: s, label: s.replace(/_/g, ' ') }))
    : []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Administración — Todas las devoluciones</h1>

      <div className="card">
        <div className="divide-y divide-gray-50">
          {returns.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">No hay devoluciones</p>
          ) : returns.map((ret) => (
            <div key={ret.id} className="flex items-center justify-between py-3 px-1">
              <div
                className="flex flex-1 cursor-pointer items-center gap-4"
                onClick={() => navigate(`/returns/${ret.id}`)}
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{ret.returnNumber}</p>
                  <p className="text-xs text-gray-400">
                    {ret.customerEmail} · {format(new Date(ret.createdAt), 'dd MMM yyyy', { locale: es })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ReturnStatusBadge status={ret.status} />
                {NEXT_STATUSES[ret.status] && (
                  <button
                    onClick={() => openModal(ret)}
                    className="btn-secondary btn-sm"
                  >
                    Cambiar estado
                  </button>
                )}
                <ChevronRight
                  size={16}
                  className="cursor-pointer text-gray-400"
                  onClick={() => navigate(`/returns/${ret.id}`)}
                />
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="btn-secondary btn-sm">Anterior</button>
            <span className="flex items-center px-3 text-sm text-gray-600">{page + 1} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="btn-secondary btn-sm">Siguiente</button>
          </div>
        )}
      </div>

      <Modal
        open={!!statusModal}
        onClose={() => setStatusModal(null)}
        title={`Actualizar estado — ${statusModal?.returnNumber}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Estado actual: <ReturnStatusBadge status={statusModal?.status} />
          </p>
          <Select
            label="Nuevo estado"
            options={nextOpts}
            placeholder="Seleccioná el nuevo estado..."
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as ReturnStatus)}
          />
          <div>
            <label className="form-label">Nota interna (opcional)</label>
            <textarea
              rows={2}
              className="form-input resize-none"
              placeholder="Nota para el equipo..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStatusModal(null)} className="btn-secondary flex-1">Cancelar</button>
            <button
              onClick={handleStatusUpdate}
              disabled={!newStatus || updating}
              className="btn-primary flex-1"
            >
              {updating ? 'Guardando...' : 'Confirmar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
