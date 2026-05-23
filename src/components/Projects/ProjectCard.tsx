import { useEffect, useRef, useState } from 'react'

export interface ProjectCardProps {
  title: string
  description: string
  tech: readonly string[]
  repoUrl: string
}

const TAG_ORIGINS: ReadonlyArray<{ readonly x: number; readonly y: number }> = [
  { x: 0, y: -120 },
  { x: 160, y: 0 },
  { x: 0, y: 120 },
  { x: -160, y: 0 },
  { x: 0, y: -120 },
]

export function ProjectCard({ title, description, tech, repoUrl }: ProjectCardProps) {
  const [flipped, setFlipped] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(pointer: coarse)').matches)
  const [typedText, setTypedText] = useState('')
  const [showCursor, setShowCursor] = useState(false)
  const [visibleTags, setVisibleTags] = useState<boolean[]>([])
  const [showLink, setShowLink] = useState(false)

  const badgeRef = useRef<HTMLDivElement>(null)
  const badgeCanvasRef = useRef<HTMLCanvasElement>(null)
  const typeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pendingTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  // Subscribe to pointer type changes (e.g. tablet with keyboard attached)
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Badge comet canvas animation — continuous, reads theme accent color each frame
  useEffect(() => {
    const badge = badgeRef.current
    const bc = badgeCanvasRef.current
    if (!badge || !bc) return
    const bctx = bc.getContext('2d')
    if (!bctx) return

    let rafId = 0
    let initTimerId: ReturnType<typeof setTimeout> | undefined

    function hexToRgb(hex: string): [number, number, number] {
      const h = hex.replace('#', '').replace(/\s/g, '').padEnd(6, '0')
      return [
        parseInt(h.slice(0, 2), 16) || 0,
        parseInt(h.slice(2, 4), 16) || 0,
        parseInt(h.slice(4, 6), 16) || 0,
      ]
    }

    function getAccent(): [number, number, number] {
      const raw = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
      return hexToRgb(raw || '#5cb88a')
    }

    function init() {
      if (!badge || !bc) return
      const rect = badge.getBoundingClientRect()
      const bW = rect.width
      const bH = rect.height
      if (bW === 0) {
        initTimerId = setTimeout(init, 100)
        return
      }

      const OFF = 7
      const BR = 6
      bc.width = Math.round(bW) + OFF * 2 - 1
      bc.height = Math.round(bH) + OFF * 2

      const BTAIL = 80
      const BSPEED = 0.35

      function buildPerimeter(): { x: number; y: number }[] {
        const pts: { x: number; y: number }[] = []
        const step = 1
        const x0 = OFF,
          y0 = OFF,
          x1 = OFF + bW,
          y1 = OFF + bH
        for (let x = x0 + BR; x <= x1 - BR; x += step) pts.push({ x, y: y0 })
        for (let a = -Math.PI / 2; a <= 0; a += step / BR)
          pts.push({ x: x1 - BR + Math.cos(a) * BR, y: y0 + BR + Math.sin(a) * BR })
        for (let y = y0 + BR; y <= y1 - BR; y += step) pts.push({ x: x1, y })
        for (let a = 0; a <= Math.PI / 2; a += step / BR)
          pts.push({ x: x1 - BR + Math.cos(a) * BR, y: y1 - BR + Math.sin(a) * BR })
        for (let x = x1 - BR; x >= x0 + BR; x -= step) pts.push({ x, y: y1 })
        for (let a = Math.PI / 2; a <= Math.PI; a += step / BR)
          pts.push({ x: x0 + BR + Math.cos(a) * BR, y: y1 - BR + Math.sin(a) * BR })
        for (let y = y1 - BR; y >= y0 + BR; y -= step) pts.push({ x: x0, y })
        for (let a = Math.PI; a <= (3 * Math.PI) / 2; a += step / BR)
          pts.push({ x: x0 + BR + Math.cos(a) * BR, y: y0 + BR + Math.sin(a) * BR })
        return pts
      }

      const peri = buildPerimeter()
      const total = peri.length
      let pos = 0

      function draw() {
        if (!bctx || !bc) return
        const [ar, ag, ab] = getAccent()
        bctx.clearRect(0, 0, bc.width, bc.height)

        for (let i = 0; i < BTAIL; i++) {
          const pt = peri[(Math.floor(pos) - i + total) % total]
          const p = 1 - i / BTAIL
          const alpha = p * p * 0.7
          const size = i === 0 ? 0 : p * p * p

          const g = bctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, size * 2)
          g.addColorStop(0, `rgba(${ar},${ag},${ab},${alpha * 0.3})`)
          g.addColorStop(1, `rgba(${ar},${ag},${ab},0)`)
          bctx.beginPath()
          bctx.arc(pt.x, pt.y, size * 2, 0, Math.PI * 2)
          bctx.fillStyle = g
          bctx.fill()

          bctx.beginPath()
          bctx.arc(pt.x, pt.y, size, 0, Math.PI * 2)
          bctx.fillStyle = `rgba(${ar},${ag},${ab},${alpha})`
          bctx.fill()
        }

        const h = peri[Math.floor(pos) % total]
        const hg = bctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, 6)
        hg.addColorStop(0, `rgba(${ar},${ag},${ab},0.5)`)
        hg.addColorStop(1, `rgba(${ar},${ag},${ab},0)`)
        bctx.beginPath()
        bctx.arc(h.x, h.y, 6, 0, Math.PI * 2)
        bctx.fillStyle = hg
        bctx.fill()

        bctx.beginPath()
        bctx.arc(h.x, h.y, 1.8, 0, Math.PI * 2)
        bctx.fillStyle = '#fff'
        bctx.fill()

        pos = (pos + BSPEED) % total
        rafId = requestAnimationFrame(draw)
      }

      draw()
    }

    initTimerId = setTimeout(init, 100)

    return () => {
      clearTimeout(initTimerId)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // Back-face animation: typewriter → tags fly in → link fades
  // All setState calls are deferred into setTimeout/setInterval callbacks per the
  // react-hooks/set-state-in-effect rule (matches the useTypewriter pattern in About).
  useEffect(() => {
    if (typeIntervalRef.current) {
      clearInterval(typeIntervalRef.current)
      typeIntervalRef.current = null
    }
    pendingTimers.current.forEach(clearTimeout)
    pendingTimers.current = []

    if (!flipped) {
      const t = setTimeout(() => {
        setTypedText('')
        setShowCursor(false)
        setVisibleTags(new Array(tech.length).fill(false))
        setShowLink(false)
      }, 0)
      pendingTimers.current.push(t)
      return () => {
        pendingTimers.current.forEach(clearTimeout)
        pendingTimers.current = []
      }
    }

    // 400ms delay matches the flip animation start; init + typewriter inside callback
    const startTimer = setTimeout(() => {
      setShowCursor(true)
      setTypedText('')
      setVisibleTags(new Array(tech.length).fill(false))
      setShowLink(false)

      let charIdx = 0
      typeIntervalRef.current = setInterval(() => {
        charIdx++
        setTypedText(description.slice(0, charIdx))

        if (charIdx >= description.length) {
          clearInterval(typeIntervalRef.current!)
          typeIntervalRef.current = null
          setShowCursor(false)

          tech.forEach((_, idx) => {
            const tagTimer = setTimeout(() => {
              setVisibleTags((prev) => prev.map((v, i) => (i === idx ? true : v)))
            }, idx * 120)
            pendingTimers.current.push(tagTimer)
          })

          const linkTimer = setTimeout(() => setShowLink(true), tech.length * 120 + 100)
          pendingTimers.current.push(linkTimer)
        }
      }, 18)
    }, 400)

    pendingTimers.current.push(startTimer)

    return () => {
      if (typeIntervalRef.current) {
        clearInterval(typeIntervalRef.current)
        typeIntervalRef.current = null
      }
      pendingTimers.current.forEach(clearTimeout)
      pendingTimers.current = []
    }
  }, [flipped, description, tech])

  function handleClick() {
    if (isMobile) setFlipped((f) => !f)
  }

  return (
    <div
      className="relative aspect-[3/2] w-full cursor-pointer select-none"
      style={{ perspective: '1000px' }}
      onMouseEnter={!isMobile ? () => setFlipped(true) : undefined}
      onMouseLeave={!isMobile ? () => setFlipped(false) : undefined}
      onClick={handleClick}
      data-testid="project-card"
    >
      <div
        className="relative h-full w-full"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* ── FRONT ── */}
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl border border-[#2a3142] shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
          style={{
            background: '#fff',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {/* Fake browser chrome */}
          <div className="flex h-6 items-center gap-1.5 border-b border-slate-200 bg-slate-100 px-2.5">
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#ff5f57]" />
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#febc2e]" />
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#28c840]" />
            <span className="ml-1.5 h-3 flex-1 rounded border border-slate-200 bg-white" />
          </div>

          {/* Fake page content */}
          <div className="flex flex-col" style={{ height: 'calc(100% - 24px)' }}>
            <div className="flex h-7 items-center border-b border-slate-100 bg-white px-3">
              <span className="h-2 w-12 rounded bg-green-400" />
              <div className="ml-auto flex gap-1.5">
                <span className="h-1.5 w-7 rounded bg-slate-200" />
                <span className="h-1.5 w-7 rounded bg-slate-200" />
                <span className="h-1.5 w-7 rounded bg-slate-200" />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-1.5 bg-gradient-to-br from-green-50 to-white p-3">
              <span className="h-3 w-32 rounded bg-slate-900/80" />
              <span className="h-2 w-24 rounded bg-green-400/70" />
              <span className="mt-1 h-1.5 w-28 rounded bg-slate-300" />
              <span className="h-1.5 w-20 rounded bg-slate-200" />
              <span className="mt-2 h-4 w-16 rounded bg-green-400/90" />
            </div>
          </div>

          {/* Mobile mockup — overhangs bottom-right, clipped by overflow-hidden */}
          <div className="absolute right-3 bottom-[-28px] z-[5] h-36 w-20 overflow-hidden rounded-[13px] border-[1.5px] border-slate-200 bg-white shadow-xl">
            <div className="flex h-3 items-center justify-center border-b border-slate-200 bg-slate-100">
              <span className="h-1 w-5 rounded bg-slate-300" />
            </div>
            <div className="flex flex-col gap-1 p-1.5">
              <span className="h-3 rounded border border-slate-200 bg-slate-100" />
              <span className="mt-0.5 h-7 rounded bg-gradient-to-br from-green-100 to-green-50" />
              <span className="h-1 rounded bg-slate-200" />
              <span className="h-1 w-[55%] rounded bg-slate-100" />
              <span className="h-1 rounded bg-slate-200" />
            </div>
          </div>

          {/* Name badge with orbiting comet */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <div
              ref={badgeRef}
              className="border-accent/35 relative inline-flex items-center overflow-visible rounded-md border bg-black/45 px-[9px] py-[3px] backdrop-blur-md"
            >
              <canvas
                ref={badgeCanvasRef}
                className="pointer-events-none absolute -top-[7px] -left-[7px] z-[3]"
              />
              <span
                className="relative z-[2] text-[10px] font-extrabold tracking-[0.05em] text-green-50 [paint-order:stroke_fill]"
                style={{ WebkitTextStroke: '1px #14532d' }}
              >
                {title}
              </span>
            </div>
          </div>
        </div>

        {/* ── BACK ── */}
        <div
          className="border-border bg-surface absolute inset-0 flex flex-col gap-2.5 overflow-hidden rounded-2xl border p-5 shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
          style={{
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {/* Typewriter description */}
          <p className="text-fg min-h-[2.4em] font-mono text-[9px] leading-relaxed">
            {typedText}
            {showCursor && (
              <span
                className="animate-typewriter-cursor bg-accent ml-px inline-block w-px align-middle"
                style={{ height: '0.9em' }}
              />
            )}
          </p>

          {/* Tech tags — fly in from card edges */}
          <div className="mt-1 flex flex-wrap gap-1.5">
            {tech.map((tag, idx) => {
              const origin = TAG_ORIGINS[idx % TAG_ORIGINS.length]
              return (
                <span
                  key={tag}
                  className="border-accent/30 bg-accent/[0.07] text-accent rounded border px-[7px] py-[2px] font-mono text-[8px]"
                  style={{
                    opacity: visibleTags[idx] ? 1 : 0,
                    transform: visibleTags[idx]
                      ? 'translate(0,0)'
                      : `translate(${origin.x}px,${origin.y}px)`,
                    transition: 'opacity 0.45s ease, transform 0.45s ease',
                  }}
                >
                  {tag}
                </span>
              )
            })}
          </div>

          {/* GitHub link — fades in last */}
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent mt-auto font-mono text-[9px]"
            style={{ opacity: showLink ? 1 : 0, transition: 'opacity 0.4s ease' }}
            onClick={(e) => e.stopPropagation()}
          >
            ↗ GitHub
          </a>
        </div>
      </div>
    </div>
  )
}
