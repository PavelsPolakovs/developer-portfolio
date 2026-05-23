import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { TimelineItem, type TimelineItemData } from './TimelineItem'
import { fadeInUp, staggerContainerDelayed } from '../../lib/animation-variants'

const STATS = [
  { value: '4+', label: 'Years experience' },
  { value: '20+', label: 'Projects shipped' },
  { value: '8', label: 'Technologies' },
  { value: '∞', label: 'Cups of coffee', full: true },
]

const TIMELINE_ITEMS: TimelineItemData[] = [
  {
    year: '2026',
    title: 'This Portfolio',
    description: 'Pulled everything best into one place',
    modalText:
      'Built this portfolio from scratch using React, Vite and Tailwind. Every animation is hand-crafted with CSS keyframes — no animation libraries. The goal was to make something that feels alive without being distracting.',
  },
  {
    year: '2024',
    title: 'Claude Code Era',
    description: 'AI became part of the workflow',
    modalText:
      'Started integrating AI into daily engineering work. Not as a replacement but as a thinking partner. Improved throughput significantly while keeping quality high. Wrote internal guidelines for the team.',
  },
  {
    year: '2023',
    title: 'Senior Engineer',
    description: 'Led a cross-functional product team',
    modalText:
      'Promoted to Senior Engineer. Led a team of five building a real-time collaboration platform. Shipped the v2 rewrite on time, cutting load times by 60% and eliminating a class of race-condition bugs.',
  },
  {
    year: '2022',
    title: 'Open Source Contribution',
    description: 'Merged into a top-100 npm package',
    modalText:
      'Contributed a performance patch to a widely-used open-source library. The fix reduced memory allocations by ~30% in hot paths. PR merged in 48 hours, now used by thousands of projects.',
  },
  {
    year: '2021',
    title: 'First Production TypeScript',
    description: 'Migrated a 80k-LOC codebase',
    modalText:
      'Drove the migration of an 80k-line JavaScript codebase to strict TypeScript. Caught 47 latent bugs during the migration. Established typing conventions still in use by the team today.',
  },
]

function useTypewriter(text: string, running: boolean, speed = 22) {
  const [displayed, setDisplayed] = useState('')
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (frameRef.current) clearTimeout(frameRef.current)

    if (!running) {
      frameRef.current = setTimeout(() => setDisplayed(''), 0)
      return () => {
        if (frameRef.current) clearTimeout(frameRef.current)
      }
    }

    let index = 0
    function tick() {
      setDisplayed(text.slice(0, index))
      index += 1
      if (index <= text.length) {
        frameRef.current = setTimeout(tick, speed)
      }
    }
    frameRef.current = setTimeout(tick, 0)
    return () => {
      if (frameRef.current) clearTimeout(frameRef.current)
    }
  }, [text, running, speed])

  return displayed
}

interface ModalProps {
  item: TimelineItemData
  onClose: () => void
}

function Modal({ item, onClose }: ModalProps) {
  const text = useTypewriter(item.modalText, true)
  const done = text.length === item.modalText.length

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      data-testid="modal-backdrop"
      role="button"
      aria-label="Close modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        data-testid="modal-panel"
        className="bg-surface border-border relative w-full max-w-lg rounded-2xl border p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          data-testid="modal-close"
          type="button"
          onClick={onClose}
          className="text-muted hover:text-fg absolute top-4 right-4 text-lg leading-none transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        <p
          className="font-mono text-[11px] tracking-[0.12em] uppercase"
          style={{ color: 'var(--accent)' }}
        >
          {item.year}
        </p>
        <h3 className="text-fg mt-1 text-xl font-bold tracking-tight">{item.title}</h3>

        <p className="text-fg mt-6 text-sm leading-relaxed">
          {text}
          {!done && (
            <span
              className="ml-px inline-block h-[1em] w-[2px] align-middle"
              style={{
                background: 'var(--accent)',
                animation: 'var(--animate-typewriter-cursor)',
              }}
            />
          )}
        </p>
      </div>
    </div>
  )
}

export function AboutSection() {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [modalItem, setModalItem] = useState<TimelineItemData | null>(null)

  function handleItemClick(index: number) {
    setActiveIndex(index)
    setModalItem(TIMELINE_ITEMS[index])
  }

  function closeModal() {
    setModalItem(null)
  }

  return (
    <>
      <motion.section
        id="about"
        data-testid="about-section"
        className="border-border bg-surface/40 border-t px-6 py-24 sm:py-32"
        variants={staggerContainerDelayed}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <motion.div variants={fadeInUp}>
            <h2 className="text-fg text-3xl font-bold tracking-tight sm:text-4xl">About</h2>
            <p className="text-muted mt-4 max-w-2xl text-base leading-relaxed">
              Ten years of shipping in tight teams, mostly TypeScript on both sides of the wire.
              Comfortable in the design tool and the terminal. Bias toward boring technology, fast
              feedback loops and writing the smallest thing that could possibly work.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-10 flex flex-wrap items-end gap-x-10 gap-y-4"
            variants={staggerContainerDelayed}
          >
            {STATS.filter((s) => !s.full).map((stat) => (
              <motion.div key={stat.label} className="flex flex-col" variants={fadeInUp}>
                <span className="text-accent font-mono text-3xl font-bold">{stat.value}</span>
                <span className="text-muted mt-0.5 text-xs tracking-wide">{stat.label}</span>
              </motion.div>
            ))}
            <div className="w-full" />
            {STATS.filter((s) => s.full).map((stat) => (
              <motion.div key={stat.label} className="flex flex-col" variants={fadeInUp}>
                <span className="text-accent font-mono text-3xl font-bold">{stat.value}</span>
                <span className="text-muted mt-0.5 text-xs tracking-wide">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Timeline */}
          <div className="mt-16 ml-4 sm:ml-16">
            <div className="relative flex flex-col">
              {/* Vertical connector line */}
              <div
                className="pointer-events-none absolute top-8 bottom-8 left-8 w-px"
                style={{ background: 'color-mix(in oklab, var(--border) 80%, transparent)' }}
              />

              <motion.div
                className="flex flex-col gap-10"
                data-testid="timeline"
                variants={staggerContainerDelayed}
              >
                {TIMELINE_ITEMS.map((item, i) => (
                  <motion.div key={item.year} variants={fadeInUp}>
                    <TimelineItem
                      {...item}
                      active={activeIndex === i}
                      onClick={() => handleItemClick(i)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {modalItem && <Modal item={modalItem} onClose={closeModal} />}
    </>
  )
}
