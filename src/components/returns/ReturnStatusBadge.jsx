import { Badge } from '../common/Badge'

const STATUS_MAP = {
  PENDING:           { label: 'Pendiente',        variant: 'yellow'  },
  APPROVED:          { label: 'Aprobado',          variant: 'blue'    },
  LABEL_GENERATED:   { label: 'Etiqueta lista',    variant: 'indigo'  },
  SHIPPED:           { label: 'Enviado',           variant: 'purple'  },
  RECEIVED:          { label: 'Recibido',          variant: 'cyan'    },
  INSPECTED:         { label: 'Inspeccionado',     variant: 'teal'    },
  REFUND_PROCESSING: { label: 'Reembolso en curso',variant: 'orange'  },
  COMPLETED:         { label: 'Completado',        variant: 'green'   },
  REJECTED:          { label: 'Rechazado',         variant: 'red'     },
  CANCELLED:         { label: 'Cancelado',         variant: 'gray'    },
}

export function ReturnStatusBadge({ status }) {
  const cfg = STATUS_MAP[status] ?? { label: status, variant: 'gray' }
  return <Badge label={cfg.label} variant={cfg.variant} />
}
