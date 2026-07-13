import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  fullWidth?: boolean
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: { background: 'var(--color-primary)', color: '#fff' },
  secondary: {
    background: 'var(--color-surface)',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
  },
  danger: { background: 'var(--color-danger)', color: '#fff' },
  ghost: { background: 'transparent', color: 'var(--color-primary)' },
}

export function Button({
  variant = 'primary',
  fullWidth,
  style,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled}
      style={{
        padding: '10px 16px',
        borderRadius: 'var(--radius)',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 14,
        fontWeight: 600,
        opacity: disabled ? 0.6 : 1,
        width: fullWidth ? '100%' : undefined,
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </button>
  )
}
