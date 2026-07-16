const variants = {
  gray:   'bg-gray-100 text-gray-700',
  blue:   'bg-blue-100 text-blue-700',
  green:  'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  red:    'bg-red-100 text-red-700',
  purple: 'bg-purple-100 text-purple-700',
  orange: 'bg-orange-100 text-orange-700',
  cyan:   'bg-cyan-100 text-cyan-700',
  teal:   'bg-teal-100 text-teal-700',
  indigo: 'bg-indigo-100 text-indigo-700',
}

export type BadgeVariant = keyof typeof variants

interface BadgeProps {
  label: string
  variant?: BadgeVariant
  className?: string
}

export function Badge({ label, variant = 'gray', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
        ${variants[variant] ?? variants.gray} ${className}`}
    >
      {label}
    </span>
  )
}
