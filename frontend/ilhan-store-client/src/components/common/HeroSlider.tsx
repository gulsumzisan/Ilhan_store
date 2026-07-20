import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import slider1 from '@/assets/images/slider1.png'
import slider2 from '@/assets/images/slider2.png'

const slides = [
  {
    image: slider1,
    title: 'YENİ SEZON\nTRENDLERİ',
    subtitle: 'Moda Tutkunları İçin\nEn Şık Seçkiler',
    cta: 'ŞİMDİ KEŞFET',
    link: '/products',
  },
  {
    image: slider2,
    title: 'MODA\nMEYDANI',
    subtitle: 'Moda Tutkunları İçin\nEn Şık Seçkiler',
    cta: 'KOLEKS­İYONU GÖR',
    link: '/categories',
  },
]

export function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const goTo = useCallback((index: number) => {
    if (animating) return
    setAnimating(true)
    setTimeout(() => {
      setCurrent(index)
      setAnimating(false)
    }, 400)
  }, [animating])

  const prev = () => goTo((current - 1 + slides.length) % slides.length)
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  const slide = slides[current]

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        aspectRatio: '16 / 7',
        minHeight: 340,
        maxHeight: 600,
        background: '#111',
        userSelect: 'none',
      }}
    >
      {/* Background image */}
      <img
        key={current}
        src={slide.image}
        alt={slide.title}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: animating ? 0 : 1,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
        }}
      />

      {/* Text content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '32px 48px',
          opacity: animating ? 0 : 1,
          transition: 'opacity 0.4s ease',
        }}
      >
        <h1
          style={{
            margin: '0 0 12px',
            color: '#fff',
            fontSize: 'clamp(22px, 3.5vw, 46px)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.5px',
            textShadow: '0 2px 8px rgba(0,0,0,0.35)',
            whiteSpace: 'pre-line',
          }}
        >
          {slide.title}
        </h1>
        <p
          style={{
            margin: '0 0 24px',
            color: 'rgba(255,255,255,0.88)',
            fontSize: 'clamp(13px, 1.4vw, 17px)',
            lineHeight: 1.5,
            textShadow: '0 1px 4px rgba(0,0,0,0.3)',
            whiteSpace: 'pre-line',
          }}
        >
          {slide.subtitle}
        </p>
        <Link to={slide.link}>
          <button
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#fff',
              color: '#1a1a1a',
              border: 'none',
              borderRadius: 'var(--radius)',
              padding: '11px 24px',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.8,
              cursor: 'pointer',
              transition: 'background 0.2s, transform 0.15s',
              boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget as HTMLButtonElement
              btn.style.background = 'var(--color-primary)'
              btn.style.color = '#fff'
              btn.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget as HTMLButtonElement
              btn.style.background = '#fff'
              btn.style.color = '#1a1a1a'
              btn.style.transform = 'translateY(0)'
            }}
          >
            {slide.cta} ›
          </button>
        </Link>
      </div>

      {/* Prev / Next arrows */}
      {[
        { dir: 'prev', label: '‹', onClick: prev, side: { left: 16 } },
        { dir: 'next', label: '›', onClick: next, side: { right: 16 } },
      ].map(({ dir, label, onClick, side }) => (
        <button
          key={dir}
          type="button"
          onClick={onClick}
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            ...side,
            background: 'rgba(255,255,255,0.18)',
            border: '1.5px solid rgba(255,255,255,0.35)',
            backdropFilter: 'blur(6px)',
            color: '#fff',
            width: 40,
            height: 40,
            borderRadius: '50%',
            fontSize: 22,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
            lineHeight: 1,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.32)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.18)' }}
        >
          {label}
        </button>
      ))}

      {/* Dots */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 8,
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              borderRadius: 999,
              background: i === current ? '#fff' : 'rgba(255,255,255,0.45)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'width 0.3s, background 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSlider
