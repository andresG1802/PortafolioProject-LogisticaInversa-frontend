import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, ClipboardCheck } from 'lucide-react'
import { warehouseApi } from '../../api/warehouseApi'
import { Select } from '../../components/common/Select'
import { Input } from '../../components/common/Input'
import { PageSpinner, Spinner } from '../../components/common/Spinner'
import { Badge } from '../../components/common/Badge'

const RESULTS = [
  { value: 'APPROVED_FULL_REFUND',      label: 'Aprobado — Reembolso total' },
  { value: 'APPROVED_PARTIAL_REFUND',   label: 'Aprobado — Reembolso parcial' },
  { value: 'APPROVED_EXCHANGE',         label: 'Aprobado — Cambio de producto' },
  { value: 'REJECTED_NOT_ELIGIBLE',     label: 'Rechazado — No elegible' },
  { value: 'REJECTED_POLICY_VIOLATION', label: 'Rechazado — Viola políticas' },
]

export default function InspectPackage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()
  const result = watch('inspectionResult')

  useEffect(() => {
    warehouseApi.getById(id)
      .then((r) => setItem(r.data))
      .catch(() => navigate('/warehouse'))
      .finally(() => setLoading(false))
  }, [id])

  const onSubmit = async (data) => {
    setServerError('')
    try {
      await warehouseApi.inspect(id, {
        ...data,
        approvedRefundAmount: data.approvedRefundAmount
          ? Number(data.approvedRefundAmount)
          : undefined,
        restockable: data.restockable === 'true',
      })
      navigate('/warehouse')
    } catch (err) {
      setServerError(err.response?.data?.detail ?? 'Error al registrar la inspección')
    }
  }

  if (loading) return <PageSpinner />
  if (!item) return null

  const isDone = item.status === 'INSPECTION_DONE'

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/warehouse')} className="btn-secondary btn-sm">
          <ArrowLeft size={14} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inspección</h1>
          <p className="text-sm text-gray-500">{item.returnNumber}</p>
        </div>
      </div>

      <div className="card space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Tracking</span>
          <span className="font-medium text-sm">{item.trackingNumber}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Ubicación</span>
          <span className="font-medium text-sm">{item.warehouseLocation ?? '—'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Estado</span>
          <Badge
            label={item.status.replace('_', ' ')}
            variant={item.status === 'INSPECTION_DONE' ? 'green' : 'yellow'}
          />
        </div>
        {isDone && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Resultado</span>
              <span className="font-medium text-sm">{item.inspectionResult?.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Inspectado por</span>
              <span className="font-medium text-sm">{item.inspectedBy ?? '—'}</span>
            </div>
            {item.approvedRefundAmount && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Reembolso aprobado</span>
                <span className="font-medium text-sm text-green-600">${item.approvedRefundAmount}</span>
              </div>
            )}
            {item.inspectionNotes && (
              <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600 mt-2">
                {item.inspectionNotes}
              </div>
            )}
          </>
        )}
      </div>

      {!isDone && (
        <div className="card space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <ClipboardCheck size={16} className="text-brand-600" />
            Registrar inspección
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Select
              label="Resultado de la inspección"
              options={RESULTS}
              placeholder="Seleccionar resultado..."
              error={errors.inspectionResult?.message}
              {...register('inspectionResult', { required: 'Requerido' })}
            />

            <div>
              <label className="form-label">Notas de inspección</label>
              <textarea
                rows={3}
                placeholder="Describí el estado del producto recibido..."
                className={`form-input resize-none ${errors.inspectionNotes ? 'border-red-400' : ''}`}
                {...register('inspectionNotes', { required: 'Requerido' })}
              />
              {errors.inspectionNotes && <p className="form-error">{errors.inspectionNotes.message}</p>}
            </div>

            <Input
              label="Inspectado por"
              placeholder="Nombre del inspector"
              {...register('inspectedBy')}
            />

            {result?.startsWith('APPROVED') && (
              <Input
                label="Monto de reembolso aprobado"
                type="number"
                step="0.01"
                placeholder="0.00"
                error={errors.approvedRefundAmount?.message}
                {...register('approvedRefundAmount')}
              />
            )}

            <Select
              label="¿El producto es reacondicionable?"
              options={[
                { value: 'true', label: 'Sí, puede reincorporarse al inventario' },
                { value: 'false', label: 'No, debe descartarse' },
              ]}
              placeholder="Seleccionar..."
              {...register('restockable')}
            />

            {serverError && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{serverError}</div>
            )}

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? <Spinner size="sm" /> : 'Confirmar inspección'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
