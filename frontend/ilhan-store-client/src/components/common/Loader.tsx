interface LoaderProps {
  message?: string
}

export function Loader({ message = 'Yükleniyor...' }: LoaderProps) {
  return (
    <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-muted)' }}>
      {message}
    </div>
  )
}
