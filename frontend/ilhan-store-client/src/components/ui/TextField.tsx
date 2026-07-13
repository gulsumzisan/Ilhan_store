import type { InputHTMLAttributes } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  selectOnFocus?: boolean
}

export function TextField({ label, id, selectOnFocus, onFocus, ...rest }: TextFieldProps) {
  const inputId = id ?? rest.name

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (selectOnFocus) e.target.select()
    onFocus?.(e)
  }

  return (
    <label
      htmlFor={inputId}
      style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
    >
      <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
      <input
        id={inputId}
        {...rest}
        onFocus={handleFocus}
        style={{
          padding: '10px 12px',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--color-border)',
          fontSize: 14,
          ...rest.style,
        }}
      />
    </label>
  )
}
