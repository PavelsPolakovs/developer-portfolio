import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { HeroCanvas } from './HeroCanvas'
import { HeroCard } from './HeroCard'
import { TechTicker } from './TechTicker'
import { fadeInUp, staggerContainer } from '../../lib/animation-variants'

function Avatar() {
  return (
    // Replace the initials div with an <img> when a real photo is available.
    <div className="bg-accent text-accent-fg ring-accent/20 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold ring-4 select-none">
      LP
    </div>
  )
}

export function Hero() {
  const [overlayVisible, setOverlayVisible] = useState(false)
  const isTouchRef = useRef(false)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    isTouchRef.current =
      typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [])

  const showOverlay = useCallback(() => {
    if (!isTouchRef.current) setOverlayVisible(true)
  }, [])

  const hideOverlay = useCallback(() => {
    if (!isTouchRef.current) setOverlayVisible(false)
  }, [])

  const handleTap = useCallback(() => {
    if (!isTouchRef.current) return
    setOverlayVisible(true)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => setOverlayVisible(false), 5000)
  }, [])

  return (
    <section id="hero" className="border-border relative overflow-hidden border-b">
      {/* background grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(color-mix(in oklab, var(--border) 60%, transparent) 1px, transparent 1px),
            linear-gradient(90deg, color-mix(in oklab, var(--border) 60%, transparent) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* glow blobs */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 h-72 w-72 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-6xl px-6 pt-28 pb-0 sm:pt-32">
        <motion.div
          className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* ── Left column ── */}
          <div className="flex flex-1 flex-col gap-6">
            <motion.div variants={fadeInUp}>
              <Avatar />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h1 className="text-fg text-4xl font-bold tracking-tight sm:text-5xl">Lex Polaris</h1>
              <p className="text-accent mt-1 text-lg font-medium">Full-Stack Engineer</p>
            </motion.div>

            <motion.p className="text-muted max-w-md text-base leading-relaxed" variants={fadeInUp}>
              Ten years shipping calm, fast web products in tight teams — TypeScript on both sides
              of the wire. Bias toward boring technology, small PRs, and tools that feel inevitable.
            </motion.p>

            <motion.div className="flex flex-wrap gap-3" variants={fadeInUp}>
              <a
                href="#projects"
                className="bg-accent text-accent-fg rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 active:scale-95"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="border-border text-fg hover:bg-surface rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors active:scale-95"
              >
                Contact Me
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="border-border text-muted hover:bg-surface hover:text-fg rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors active:scale-95"
              >
                GitHub ↗
              </a>
            </motion.div>
          </div>

          {/* ── Right column ── */}
          <motion.div
            className="flex flex-1 items-center justify-center lg:justify-end"
            variants={fadeInUp}
          >
            <div
              data-testid="animation-wrapper"
              className="relative w-full max-w-md"
              onMouseEnter={showOverlay}
              onMouseLeave={hideOverlay}
              onTouchStart={handleTap}
            >
              <HeroCanvas overlayVisible={overlayVisible} />
              {/* HeroCard fades out when overlay is active */}
              <div
                data-testid="hero-card-container"
                className={[
                  'pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-200',
                  overlayVisible ? 'opacity-0' : 'opacity-100',
                ].join(' ')}
              >
                <HeroCard />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Tech ticker ── */}
      <motion.div
        className="mt-12"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.45, ease: 'easeOut', delay: 0.5 }}
      >
        <TechTicker />
      </motion.div>
    </section>
  )
}
