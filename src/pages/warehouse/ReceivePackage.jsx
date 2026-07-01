import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, ScanBarcode } from 'lucide-react'
import { warehouseApi } from '../../api/warehouseApi'
import { Input } from '../../components/common/Input'
import { Spinner } from '../../components/common/Spinner'

export default function ReceivePackage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    setServerError('')
    try {
      const res = await warehouseApi.receiveReturn(data)
      setSuccess(res.data)
      reset()
    } catch (err) {
      setServerError(err.response?.data?.detail ?? 'Error al registrar la recepción')
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/warehouse')} className="btn-secondary btn-sm">
          <ArrowLeft size={14} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recibir paquete</h1>
          <p className="text-sm text-gray-500">Registrá la llegada de una devolución al almacén</p>
        </div>
      </div>

      {success && (
        <div className="card border-green-200 bg-green-50">
          <p className="font-medium text-green-700">Paquete registrado correctamente</p>
          <p className="text-sm text-green-600">Devolución: {success.returnNumber}</p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => navigate(`/warehouse/${success.id}/inspect`)} className="btn-primary btn-sm">
              Ir a inspección
            </button>
            <button onClick={() => setSuccess(null)} className="btn-secondary btn-sm">
              Recibir otro
            </button>
          </div>
        </div>
      )}

      <div className="card space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
          <ScanBarcode size={16} className="text-brand-600" />
          Datos del paquete
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="ID de devolución"
            placeholder="UUID de la solicitud de devolución"
            error={errors.returnId?.message}
            {...register('returnId', { required: 'Requerido' })}
          />
          <Input
            label="Número de devolución"
            placeholder="RET-1234567890"
            error={errors.returnNumber?.message}
            {...register('returnNumber', { required: 'Requerido' })}
          />
          <Input
            label="Número de tracking"
            placeholder="1Z999AA10123456784"
            error={errors.trackingNumber?.message}
            {...register('trackingNumber', { required: 'Requerido' })}
          />
          <Input
            label="Ubicación en almacén (opcional)"
            placeholder="Pasillo A / Estante 3"
            {...register('warehouseLocation')}
          />
          <Input
            label="Recibido por"
            placeholder="Nombre del operador"
            {...register('receivedBy')}
          />

          {serverError && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{serverError}</div>
          )}

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? <Spinner size="sm" /> : 'Confirmar recepción'}
          </button>
        </form>
      </div>
    </div>
  )
}
