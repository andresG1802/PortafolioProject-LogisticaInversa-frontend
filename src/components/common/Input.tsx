import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className = '', ...props },
  ref
) {
  return (
    <div>
      {label && <label className="form-label">{label}</label>}
      <input ref={ref} className={`form-input ${error ? 'border-red-400' : ''} ${className}`} {...props} />
      {error && <p className="form-error">{error}</p>}
    </div>
  )
})
