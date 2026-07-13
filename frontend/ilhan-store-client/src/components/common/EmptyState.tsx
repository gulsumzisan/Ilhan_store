interface EmptyStateProps {
  title: string
  description?: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div
      style={{
        padding: 48,
        textAlign: 'center',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--color-border)',
      }}
    >
      <h3 style={{ margin: '0 0 8px' }}>{title}</h3>
      {description && (
        <p style={{ margin: 0, color: 'var(--color-muted)' }}>{description}</p>
      )}
    </div>
  )
}
