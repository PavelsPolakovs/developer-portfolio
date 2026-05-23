import { useEffect, useRef, useState } from 'react'

type CursorState = 'idle' | 'hover'

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label'
const ORBIT_HIT_R = 14

const SHADOW_IDLE =
  'drop-shadow(0 0 2px rgba(0,0,0,0.55)) drop-shadow(0 0 3px rgba(255,255,255,0.4))'
const SHADOW_HOVER =
  'drop-shadow(0 0 3px rgba(0,0,0,0.6)) drop-shadow(0 0 5px rgba(255,255,255,0.5))'

function findInteractiveNearby(cx: number, cy: number): Element | null {
  const r = ORBIT_HIT_R
  const points: [number, number][] = [
    [cx, cy],
    [cx + r, cy],
    [cx - r, cy],
    [cx, cy + r],
    [cx, cy - r],
    [cx + r * 0.7, cy + r * 0.7],
    [cx - r * 0.7, cy + r * 0.7],
    [cx + r * 0.7, cy - r * 0.7],
    [cx - r * 0.7, cy - r * 0.7],
  ]
  for (const [x, y] of points) {
    const found = document.elementFromPoint(x, y)?.closest(INTERACTIVE)
    if (found) return found
  }
  return null
}

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [cursorState, setCursorState] = useState<CursorState>('idle')
  const [visible, setVisible] = useState(false)

  // Suppress system cursor on fine-pointer devices
  useEffect(() => {
    if (!(typeof window.matchMedia === 'function' && window.matchMedia('(pointer: fine)').matches))
      return
    document.documentElement.classList.add('cursor-custom')
    return () => document.documentElement.classList.remove('cursor-custom')
  }, [])

  useEffect(() => {
    if (!(typeof window.matchMedia === 'function' && window.matchMedia('(pointer: fine)').matches))
      return
    const el = cursorRef.current
    if (!el) return

    let raf = 0
    let rafPending = false
    let pendingX = 0
    let pendingY = 0
    let isVisible = false
    let currentState: CursorState = 'idle'

    function onMove(e: MouseEvent) {
      pendingX = e.clientX
      pendingY = e.clientY

      if (!isVisible) {
        isVisible = true
        setVisible(true)
      }

      const interactive = findInteractiveNearby(e.clientX, e.clientY)
      const next: CursorState = interactive ? 'hover' : 'idle'
      if (next !== currentState) {
        currentState = next
        setCursorState(next)
      }

      if (!rafPending) {
        rafPending = true
        raf = requestAnimationFrame(() => {
          rafPending = false
          if (el) el.style.transform = `translate(${pendingX - 20}px, ${pendingY - 20}px)`
        })
      }
    }

    function onClick(e: MouseEvent) {
      const atCenter = (e.target as Element)?.closest(INTERACTIVE)
      if (atCenter) return
      const nearby = findInteractiveNearby(e.clientX, e.clientY)
      if (nearby) (nearby as HTMLElement).click()
    }

    function onLeave() {
      if (isVisible) {
        isVisible = false
        setVisible(false)
      }
    }

    function onEnter() {
      if (!isVisible) {
        isVisible = true
        setVisible(true)
      }
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('click', onClick)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('click', onClick)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
    }
  }, [])

  const active = cursorState === 'hover'

  return (
    <div
      ref={cursorRef}
      data-testid="custom-cursor"
      data-state={cursorState}
      className="pointer-events-none fixed top-0 left-0 z-[9999] h-10 w-10"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s',
        willChange: 'transform',
        filter: active ? SHADOW_HOVER : SHADOW_IDLE,
      }}
    >
      {/* Pulse wave — only visible in hover state */}
      {active && (
        <div
          className="border-accent absolute top-1/2 left-1/2 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full border opacity-0"
          style={{ animation: 'var(--animate-wave-expand)' }}
        />
      )}

      {/* Nucleus */}
      <div
        className="absolute top-1/2 left-1/2 z-[2] h-2 w-2 rounded-full"
        style={
          active
            ? { animation: 'var(--animate-nucleus-dim)' }
            : {
                transform: 'translate(-50%, -50%)',
                background: 'var(--cursor-idle)',
              }
        }
      />

      {/* Orbit — inset-[9px] = 22 px diameter, radius ≈ 11 px from center */}
      <div
        className="absolute inset-[9px] rounded-full border-[1.5px]"
        style={
          active
            ? {
                borderColor: 'color-mix(in oklab, var(--accent) 20%, transparent)',
                animation: 'var(--animate-orbit-fast), var(--animate-orbit-flash)',
              }
            : {
                borderColor: 'color-mix(in oklab, var(--cursor-idle) 70%, transparent)',
                animation: 'var(--animate-orbit-slow)',
              }
        }
      >
        {/* Electron */}
        <div
          className="absolute top-[-3px] left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full"
          style={
            active
              ? {
                  background: 'color-mix(in oklab, var(--accent) 60%, transparent)',
                  animation: 'var(--animate-electron-flash)',
                }
              : {
                  background: 'color-mix(in oklab, var(--cursor-idle) 75%, transparent)',
                }
          }
        />
      </div>
    </div>
  )
}
