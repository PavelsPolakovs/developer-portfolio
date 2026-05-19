import { useCallback, useEffect, useRef, useState } from 'react'
import { ANIMATION_CODE } from './animationCode'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  flash: number
}

interface BurstParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  decay: number
  r: number
}

interface Wave {
  speed: number
  amp: number
  freq: number
  hue: number
  alpha: number
  width: number
  offset: number
}

const WAVES: Wave[] = [
  { speed: 0.3, amp: 28, freq: 0.018, hue: 145, alpha: 0.35, width: 2.0, offset: -60 },
  { speed: 1.4, amp: 18, freq: 0.027, hue: 162, alpha: 0.22, width: 1.5, offset: 0 },
  { speed: 0.7, amp: 32, freq: 0.012, hue: 182, alpha: 0.15, width: 1.0, offset: 60 },
]

interface HeroCanvasProps {
  overlayVisible: boolean
}

export function HeroCanvas({ overlayVisible }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const pts: Particle[] = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      r: Math.random() * 1.6 + 0.8,
      flash: 0,
    }))

    let bursts: BurstParticle[] = []

    function spawnBurst(x: number, y: number) {
      const count = 6 + Math.floor(Math.random() * 5)
      for (let i = 0; i < count; i++) {
        const angle = ((Math.PI * 2) / count) * i + (Math.random() - 0.5) * 0.6
        const speed = 0.8 + Math.random() * 2.2
        bursts.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0,
          decay: 0.018 + Math.random() * 0.014,
          r: 0.5 + Math.random() * 0.7,
        })
      }
    }

    const hitCooldown = pts.map(() => WAVES.map(() => 0))
    let t = 0

    function getWaveY(w: Wave, x: number) {
      if (!canvas) return 0
      return canvas.height / 2 + w.offset + Math.sin(x * w.freq + t * w.speed) * w.amp
    }

    function getBgColor() {
      return getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#0d1117'
    }

    function draw() {
      rafRef.current = requestAnimationFrame(draw)
      if (!canvas || !ctx) return

      ctx.fillStyle = getBgColor()
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      t += 0.016

      WAVES.forEach((w) => {
        ctx.save()
        ctx.filter = 'blur(4px)'
        ctx.beginPath()
        for (let n = 0; n <= canvas.width; n++) {
          const y = getWaveY(w, n)
          if (n === 0) ctx.moveTo(n, y)
          else ctx.lineTo(n, y)
        }
        ctx.strokeStyle = `hsla(${w.hue}, 75%, 58%, ${w.alpha * 0.3})`
        ctx.lineWidth = w.width * 2
        ctx.stroke()
        ctx.restore()

        const g = ctx.createLinearGradient(0, 0, canvas.width, 0)
        g.addColorStop(0, `hsla(${w.hue}, 75%, 58%, 0)`)
        g.addColorStop(0.15, `hsla(${w.hue}, 75%, 58%, ${w.alpha})`)
        g.addColorStop(0.85, `hsla(${w.hue + 18}, 68%, 54%, ${w.alpha})`)
        g.addColorStop(1, `hsla(${w.hue + 18}, 68%, 54%, 0)`)

        ctx.beginPath()
        for (let n = 0; n <= canvas.width; n++) {
          const y = getWaveY(w, n)
          if (n === 0) ctx.moveTo(n, y)
          else ctx.lineTo(n, y)
        }
        ctx.strokeStyle = g
        ctx.lineWidth = w.width
        ctx.stroke()
      })

      // network lines
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y)
          if (d < 100) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(74,222,128,${(1 - d / 100) * 0.2})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      // dots + wave hit detection
      pts.forEach((p, pi) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        WAVES.forEach((w, wi) => {
          if (hitCooldown[pi][wi] > 0) {
            hitCooldown[pi][wi]--
            return
          }
          const wy = getWaveY(w, p.x)
          if (Math.abs(p.y - wy) < w.width + 4) {
            p.flash = 1.0
            spawnBurst(p.x, p.y)
            hitCooldown[pi][wi] = 50
          }
        })

        if (p.flash > 0) p.flash = Math.max(0, p.flash - 0.04)

        if (p.flash > 0) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r + 5 + p.flash * 4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(180,255,210,${p.flash * 0.25})`
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r + 3, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(74,222,128,0.1)'
        ctx.fill()

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r + p.flash * 1.5, 0, Math.PI * 2)
        ctx.fillStyle =
          p.flash > 0 ? `rgba(220,255,235,${0.7 + p.flash * 0.3})` : 'rgba(180,255,210,0.9)'
        ctx.fill()
      })

      // burst particles
      bursts = bursts.filter((b) => b.life > 0)
      bursts.forEach((b) => {
        b.x += b.vx
        b.y += b.vy
        b.vx *= 0.97
        b.vy *= 0.97
        b.life -= b.decay

        const alpha = Math.max(0, b.life)
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r + 1, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(74,222,128,${alpha * 0.15})`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,255,220,${alpha})`
        ctx.fill()
      })
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(ANIMATION_CODE).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [])

  return (
    <div className="border-border relative aspect-[4/3] max-h-[300px] w-full overflow-hidden rounded-2xl border shadow-2xl">
      <canvas ref={canvasRef} className="block h-full w-full" />

      {/* overlay with copy button — controlled by parent */}
      <div
        className={[
          'absolute inset-0 flex items-center justify-center transition-opacity duration-200',
          'bg-black/40 backdrop-blur-[2px]',
          overlayVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      >
        <button
          onClick={handleCopy}
          className="bg-surface text-fg border-border hover:bg-accent hover:text-accent-fg hover:border-accent flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition-colors active:scale-95"
        >
          {copied ? (
            <>
              <span>✓</span>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <span>⧉</span>
              <span>Copy Animation</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
