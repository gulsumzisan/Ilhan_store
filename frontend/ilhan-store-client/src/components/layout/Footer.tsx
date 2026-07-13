export function Footer() {
  return (
    <footer
      style={{
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        marginTop: 40,
      }}
    >
      <div
        className="container"
        style={{
          padding: '20px 16px',
          textAlign: 'center',
          color: 'var(--color-muted)',
          fontSize: 14,
        }}
      >
        © {new Date().getFullYear()} İlhan Store — Tüm hakları saklıdır.
      </div>
    </footer>
  )
}
