import { useEffect, useRef, useState } from 'react'

type CursorState = 'idle' | 'hover'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [cursorState, setCursorState] = useState<CursorState>('idle')
  const [visible, setVisible] = useState(false)

  // Add cursor-custom class to <html> to suppress the system cursor (only on fine-pointer devices)
  useEffect(() => {
    if (!(typeof window.matchMedia === 'function' && window.matchMedia('(pointer: fine)').matches))
      return
    document.documentElement.classList.add('cursor-custom')
    return () => document.documentElement.classList.remove('cursor-custom')
  }, [])

  // Track mouse position and interactive hover state
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

      if (!rafPending) {
        rafPending = true
        raf = requestAnimationFrame(() => {
          rafPending = false
          if (el) el.style.transform = `translate(${pendingX - 20}px, ${pendingY - 20}px)`
        })
      }
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

    function onOver(e: MouseEvent) {
      const target = e.target as Element
      const isInteractive = !!target.closest(
        'a, button, [role="button"], input, textarea, select, label',
      )
      const next: CursorState = isInteractive ? 'hover' : 'idle'
      if (next !== currentState) {
        currentState = next
        setCursorState(next)
      }
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
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
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s', willChange: 'transform' }}
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
                background: 'color-mix(in oklab, var(--accent) 70%, transparent)',
              }
        }
      />

      {/* Orbit */}
      <div
        className="absolute inset-[6px] rounded-full border-[1.5px]"
        style={
          active
            ? {
                borderColor: 'color-mix(in oklab, var(--accent) 20%, transparent)',
                animation: 'var(--animate-orbit-fast), var(--animate-orbit-flash)',
              }
            : {
                borderColor: 'color-mix(in oklab, var(--accent) 40%, transparent)',
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
                  background: 'color-mix(in oklab, var(--accent) 50%, transparent)',
                }
          }
        />
      </div>
    </div>
  )
}
