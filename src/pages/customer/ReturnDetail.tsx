import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, Truck, Warehouse, CheckCircle, XCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { returnApi } from '../../api/returnApi'
import { ReturnStatusBadge } from '../../components/returns/ReturnStatusBadge'
import { PageSpinner } from '../../components/common/Spinner'
import { Modal } from '../../components/common/Modal'
import { getErrorMessage } from '../../utils/getErrorMessage'
import type { ReturnRequest, ReturnStatus } from '../../types'

interface Step {
  key: ReturnStatus
  label: string
  Icon: LucideIcon
}

const STEPS: Step[] = [
  { key: 'PENDING',           label: 'Solicitud',     Icon: Package },
  { key: 'APPROVED',          label: 'Aprobado',      Icon: CheckCircle },
  { key: 'LABEL_GENERATED',   label: 'Etiqueta',      Icon: Package },
  { key: 'SHIPPED',           label: 'Enviado',       Icon: Truck },
  { key: 'RECEIVED',          label: 'Recibido',      Icon: Warehouse },
  { key: 'INSPECTED',         label: 'Inspeccionado', Icon: CheckCircle },
  { key: 'REFUND_PROCESSING', label: 'Reembolso',     Icon: CheckCircle },
  { key: 'COMPLETED',         label: 'Completado',    Icon: CheckCircle },
]

const ORDER = STEPS.map((s) => s.key)

function fmtDate(d?: string) {
  if (!d) return '—'
  return format(new Date(d), "d MMM yyyy, HH:mm", { locale: es })
}

export default function ReturnDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [ret, setRet] = useState<ReturnRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelModal, setCancelModal] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    if (!id) return
    returnApi.getById(id)
      .then((r) => setRet(r.data))
      .catch(() => navigate('/returns'))
      .finally(() => setLoading(false))
  }, [id])

  const handleCancel = async () => {
    if (!id) return
    setCancelling(true)
    try {
      const r = await returnApi.cancel(id)
      setRet(r.data)
      setCancelModal(false)
    } catch (e) {
      alert(getErrorMessage(e, 'No se pudo cancelar'))
    } finally {
      setCancelling(false)
    }
  }

  if (loading) return <PageSpinner />
  if (!ret) return null

  const currentIdx = ORDER.indexOf(ret.status)
  const canCancel = ['PENDING', 'APPROVED'].includes(ret.status)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-secondary btn-sm">
            <ArrowLeft size={14} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{ret.returnNumber}</h1>
            <p className="text-xs text-gray-500">Pedido {ret.orderNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ReturnStatusBadge status={ret.status} />
          {canCancel && (
            <button onClick={() => setCancelModal(true)} className="btn-danger btn-sm">
              <XCircle size={14} /> Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Progress */}
      {!['REJECTED', 'CANCELLED'].includes(ret.status) && (
        <div className="card">
          <div className="relative flex items-center justify-between">
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-200">
              <div
                className="h-full bg-brand-600 transition-all"
                style={{ width: `${(currentIdx / (ORDER.length - 1)) * 100}%` }}
              />
            </div>
            {STEPS.map((step, i) => {
              const done = i <= currentIdx
              return (
                <div key={step.key} className="relative flex flex-col items-center gap-1.5">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 z-10
                      ${done ? 'border-brand-600 bg-brand-600' : 'border-gray-200 bg-white'}`}
                  >
                    <step.Icon size={14} className={done ? 'text-white' : 'text-gray-300'} />
                  </div>
                  <span className={`text-xs ${done ? 'text-brand-700 font-medium' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="card space-y-3">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Información</h2>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div><dt className="text-gray-400">Motivo</dt><dd className="font-medium">{ret.reason?.replace(/_/g, ' ')}</dd></div>
          <div><dt className="text-gray-400">Tipo</dt><dd className="font-medium">{ret.returnType?.replace(/_/g, ' ')}</dd></div>
          {ret.trackingNumber && <div><dt className="text-gray-400">Tracking</dt><dd className="font-medium">{ret.trackingNumber}</dd></div>}
          {ret.carrierName && <div><dt className="text-gray-400">Carrier</dt><dd className="font-medium">{ret.carrierName}</dd></div>}
          {ret.refundAmount && <div><dt className="text-gray-400">Reembolso</dt><dd className="font-medium text-green-600">${ret.refundAmount}</dd></div>}
          <div><dt className="text-gray-400">Creado</dt><dd className="font-medium">{fmtDate(ret.createdAt)}</dd></div>
        </dl>
        {ret.reasonDescription && (
          <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
            {ret.reasonDescription}
          </div>
        )}
        {ret.adminNotes && (
          <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
            <strong>Nota del equipo:</strong> {ret.adminNotes}
          </div>
        )}
      </div>

      {/* Items */}
      <div className="card space-y-3">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Productos ({ret.items?.length})
        </h2>
        <div className="divide-y divide-gray-50">
          {ret.items?.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                <p className="text-xs text-gray-400">{item.sku ?? item.productId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">×{item.quantity}</p>
                {item.unitPrice && <p className="text-xs text-gray-400">${item.unitPrice} c/u</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cancel modal */}
      <Modal open={cancelModal} onClose={() => setCancelModal(false)} title="Cancelar devolución">
        <p className="text-sm text-gray-600">
          ¿Estás seguro de que querés cancelar la devolución <strong>{ret.returnNumber}</strong>?
          Esta acción no se puede deshacer.
        </p>
        <div className="mt-5 flex gap-3">
          <button onClick={() => setCancelModal(false)} className="btn-secondary flex-1">
            No, mantener
          </button>
          <button onClick={handleCancel} disabled={cancelling} className="btn-danger flex-1">
            {cancelling ? 'Cancelando...' : 'Sí, cancelar'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
