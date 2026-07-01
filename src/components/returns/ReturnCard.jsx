import { useNavigate } from 'react-router-dom'
import { Package, ChevronRight, Calendar } from 'lucide-react'
import { ReturnStatusBadge } from './ReturnStatusBadge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const REASON_LABELS = {
  DEFECTIVE_PRODUCT:    'Producto defectuoso',
  WRONG_ITEM_RECEIVED:  'Producto incorrecto',
  CHANGED_MIND:         'Cambié de opinión',
  DAMAGED_IN_SHIPPING:  'Dañado en envío',
  NOT_AS_DESCRIBED:     'No coincide con descripción',
  SIZE_OR_FIT_ISSUE:    'Problema de talla/ajuste',
  DUPLICATE_ORDER:      'Pedido duplicado',
  ARRIVED_TOO_LATE:     'Llegó tarde',
  MISSING_PARTS:        'Partes faltantes',
  OTHER:                'Otro',
}

export function ReturnCard({ ret }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/returns/${ret.id}`)}
      className="card cursor-pointer hover:shadow-md hover:border-brand-200 transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
            <Package size={20} className="text-brand-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{ret.returnNumber}</p>
            <p className="text-xs text-gray-500">Pedido {ret.orderNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ReturnStatusBadge status={ret.status} />
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>{REASON_LABELS[ret.reason] ?? ret.reason}</span>
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {format(new Date(ret.createdAt), 'dd MMM yyyy', { locale: es })}
        </span>
      </div>

      <div className="mt-3 flex gap-2">
        {ret.items?.slice(0, 2).map((item) => (
          <span
            key={item.id}
            className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
          >
            {item.productName} ×{item.quantity}
          </span>
        ))}
        {ret.items?.length > 2 && (
          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-400">
            +{ret.items.length - 2} más
          </span>
        )}
      </div>
    </div>
  )
}
