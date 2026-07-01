import { forwardRef } from 'react'

export const Select = forwardRef(function Select(
  { label, error, options = [], className = '', placeholder, ...props },
  ref
) {
  return (
    <div>
      {label && <label className="form-label">{label}</label>}
      <select
        ref={ref}
        className={`form-input ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="form-error">{error}</p>}
    </div>
  )
})
