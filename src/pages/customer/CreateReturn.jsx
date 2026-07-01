import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import { returnApi } from '../../api/returnApi'
import { useAuth } from '../../context/AuthContext'
import { Input } from '../../components/common/Input'
import { Select } from '../../components/common/Select'
import { Spinner } from '../../components/common/Spinner'

const REASONS = [
  { value: 'DEFECTIVE_PRODUCT',   label: 'Producto defectuoso' },
  { value: 'WRONG_ITEM_RECEIVED', label: 'Producto incorrecto' },
  { value: 'CHANGED_MIND',        label: 'Cambié de opinión' },
  { value: 'DAMAGED_IN_SHIPPING', label: 'Dañado en el envío' },
  { value: 'NOT_AS_DESCRIBED',    label: 'No coincide con la descripción' },
  { value: 'SIZE_OR_FIT_ISSUE',   label: 'Problema de talla o ajuste' },
  { value: 'DUPLICATE_ORDER',     label: 'Pedido duplicado' },
  { value: 'ARRIVED_TOO_LATE',    label: 'Llegó tarde' },
  { value: 'MISSING_PARTS',       label: 'Faltan partes' },
  { value: 'OTHER',               label: 'Otro' },
]

const RETURN_TYPES = [
  { value: 'REFUND',       label: 'Reembolso al medio de pago' },
  { value: 'EXCHANGE',     label: 'Cambio de producto' },
  { value: 'STORE_CREDIT', label: 'Crédito en la tienda' },
]

export default function CreateReturn() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      items: [{ productId: '', productName: '', sku: '', quantity: 1, unitPrice: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  const onSubmit = async (data) => {
    setServerError('')
    try {
      const payload = {
        ...data,
        customerId:    user.userId,
        customerEmail: user.email,
        customerName:  `${user.firstName} ${user.lastName}`,
        items: data.items.map((item) => ({
          ...item,
          quantity:  Number(item.quantity),
          unitPrice: item.unitPrice ? Number(item.unitPrice) : undefined,
        })),
      }
      const res = await returnApi.create(payload)
      navigate(`/returns/${res.data.id}`)
    } catch (err) {
      setServerError(err.response?.data?.detail ?? 'Error al crear la devolución')
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="btn-secondary btn-sm">
          <ArrowLeft size={14} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nueva devolución</h1>
          <p className="text-sm text-gray-500">Completá el formulario para iniciar el proceso</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Datos del pedido */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Datos del pedido
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="ID del pedido"
              placeholder="ORD-123456"
              error={errors.orderId?.message}
              {...register('orderId', { required: 'Requerido' })}
            />
            <Input
              label="Número de pedido"
              placeholder="#123456"
              error={errors.orderNumber?.message}
              {...register('orderNumber', { required: 'Requerido' })}
            />
          </div>
          <Select
            label="Motivo de devolución"
            options={REASONS}
            placeholder="Seleccionar motivo..."
            error={errors.reason?.message}
            {...register('reason', { required: 'Selecciona un motivo' })}
          />
          <div>
            <label className="form-label">Descripción adicional (opcional)</label>
            <textarea
              rows={3}
              placeholder="Describí el problema con más detalle..."
              className="form-input resize-none"
              {...register('reasonDescription')}
            />
          </div>
          <Select
            label="Tipo de devolución"
            options={RETURN_TYPES}
            placeholder="¿Qué querés recibir?"
            error={errors.returnType?.message}
            {...register('returnType', { required: 'Selecciona el tipo' })}
          />
        </div>

        {/* Productos */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Productos a devolver
            </h2>
            <button
              type="button"
              onClick={() => append({ productId: '', productName: '', sku: '', quantity: 1, unitPrice: '' })}
              className="btn-secondary btn-sm"
            >
              <Plus size={14} /> Agregar
            </button>
          </div>

          {fields.map((field, i) => (
            <div key={field.id} className="rounded-lg border border-gray-100 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Producto {i + 1}</span>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="rounded p-1 text-red-400 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="ID del producto"
                  placeholder="PROD-001"
                  error={errors.items?.[i]?.productId?.message}
                  {...register(`items.${i}.productId`, { required: 'Requerido' })}
                />
                <Input
                  label="Nombre del producto"
                  placeholder="Zapatillas Nike"
                  error={errors.items?.[i]?.productName?.message}
                  {...register(`items.${i}.productName`, { required: 'Requerido' })}
                />
                <Input
                  label="SKU (opcional)"
                  placeholder="NIK-001-BLK"
                  {...register(`items.${i}.sku`)}
                />
                <Input
                  label="Cantidad"
                  type="number"
                  min={1}
                  error={errors.items?.[i]?.quantity?.message}
                  {...register(`items.${i}.quantity`, {
                    required: 'Requerido',
                    min: { value: 1, message: 'Mínimo 1' },
                  })}
                />
                <Input
                  label="Precio unitario (opcional)"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register(`items.${i}.unitPrice`)}
                />
              </div>
            </div>
          ))}
        </div>

        {serverError && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{serverError}</div>
        )}

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">
            Cancelar
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
            {isSubmitting ? <Spinner size="sm" /> : 'Enviar solicitud'}
          </button>
        </div>
      </form>
    </div>
  )
}
