type SpinnerSize = 'sm' | 'md' | 'lg'

interface SpinnerProps {
  size?: SpinnerSize
  className?: string
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizes: Record<SpinnerSize, string> = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }
  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-200 border-t-brand-600 ${sizes[size]} ${className}`}
    />
  )
}

export function PageSpinner() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}
