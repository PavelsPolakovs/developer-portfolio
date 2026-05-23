import { useEffect, useRef } from 'react'

// ── constants ─────────────────────────────────────────────────────────────────

const LINE_GAP = 20
const TEXT_OFFSET = 72
const HIT_RADIUS = 55
const COMET_DELAY_MS = 300

// ── data ──────────────────────────────────────────────────────────────────────

const SKILL_DATA = [
  {
    id: 'typescript',
    label: 'TypeScript',
    orbit: 'TYPESCRIPT',
    sub: 'Types · Interfaces · Generics',
    desc: 'Strict mode on every project',
    rx: 0.12,
    ry: 0.25,
  },
  {
    id: 'react',
    label: 'React',
    orbit: 'REACT',
    sub: 'UI · Components · Hooks',
    desc: 'Core of every project',
    rx: 0.37,
    ry: 0.25,
  },
  {
    id: 'nodejs',
    label: 'Node.js',
    orbit: 'NODE.JS',
    sub: 'APIs · Streams · Events',
    desc: 'Full-stack, one language',
    rx: 0.63,
    ry: 0.25,
  },
  {
    id: 'tailwind',
    label: 'Tailwind',
    orbit: 'TAILWIND',
    sub: 'CSS · Utility · Responsive',
    desc: 'Design without leaving JSX',
    rx: 0.88,
    ry: 0.25,
  },
  {
    id: 'vite',
    label: 'Vite',
    orbit: 'VITE',
    sub: 'Build · HMR · Plugins',
    desc: 'Dev server that stays fast',
    rx: 0.12,
    ry: 0.75,
  },
  {
    id: 'playwright',
    label: 'Playwright',
    orbit: 'PLAYWRIGHT',
    sub: 'E2E · Testing · Browsers',
    desc: 'Tests that catch real bugs',
    rx: 0.37,
    ry: 0.75,
  },
  {
    id: 'postgres',
    label: 'PostgreSQL',
    orbit: 'POSTGRES',
    sub: 'SQL · Indexes · Relations',
    desc: 'Reliable relational storage',
    rx: 0.63,
    ry: 0.75,
  },
  {
    id: 'docker',
    label: 'Docker',
    orbit: 'DOCKER',
    sub: 'Containers · Images · Compose',
    desc: 'Same env, every machine',
    rx: 0.88,
    ry: 0.75,
  },
] as const

type SkillId = (typeof SKILL_DATA)[number]['id']

const CONNECTORS: Array<{ from: SkillId; to: SkillId }> = [
  { from: 'react', to: 'typescript' },
  { from: 'react', to: 'vite' },
  { from: 'react', to: 'tailwind' },
  { from: 'nodejs', to: 'typescript' },
  { from: 'nodejs', to: 'postgres' },
  { from: 'nodejs', to: 'docker' },
  { from: 'playwright', to: 'nodejs' },
]

// ── types ─────────────────────────────────────────────────────────────────────

type CharM = { ch: string; x: number; w: number }
type Comet = {
  x: number
  y: number
  xEnd: number
  speed: number
  tail: { x: number; y: number }[]
  done: boolean
}
type FallLetter = {
  ch: string
  x: number
  y: number
  vy: number
  delay: number
  opacity: number
  key: 'title' | 'sub' | 'desc'
  idx: number
  font: string
  started: boolean
}

interface SkillNode {
  id: SkillId
  label: string
  orbit: string
  sub: string
  desc: string
  rx: number
  ry: number
  // computed
  x: number
  y: number
  canvasW: number
  fonts: { title: string; sub: string; desc: string }
  // particles / rays
  particles: { angle: number; radius: number; speed: number; size: number; opacity: number }[]
  rays: { angle: number; length: number }[]
  t: number
  // interaction state
  hovered: boolean
  active: boolean
  isPulsing: boolean
  pulseT: number
  wasHovered: boolean
  orbitOpacity: number
  // text reveal
  titleBright: number[]
  subBright: number[]
  descBright: number[]
  titleM: CharM[] | null
  subM: CharM[] | null
  descM: CharM[] | null
  comet: Comet | null
  falling: FallLetter[]
  isFalling: boolean
}

interface ThemeColors {
  bg: string
  accent: [number, number, number]
  fg: [number, number, number]
}

// ── helpers ───────────────────────────────────────────────────────────────────

function hexToRGB(hex: string): [number, number, number] {
  const h = hex.replace('#', '').replace(/\s/g, '').padEnd(6, '0')
  return [
    parseInt(h.slice(0, 2), 16) || 0,
    parseInt(h.slice(2, 4), 16) || 0,
    parseInt(h.slice(4, 6), 16) || 0,
  ]
}

function readTheme(): ThemeColors {
  const cs = getComputedStyle(document.documentElement)
  return {
    bg: cs.getPropertyValue('--bg').trim() || '#161a18',
    accent: hexToRGB(cs.getPropertyValue('--accent').trim() || '#5cb88a'),
    fg: hexToRGB(cs.getPropertyValue('--fg').trim() || '#dbe2dc'),
  }
}

function getFonts(w: number) {
  const sm = w < 640
  return {
    title: `700 ${sm ? 17 : 22}px 'Syne', sans-serif`,
    sub: `400 ${sm ? 9 : 10}px 'JetBrains Mono', monospace`,
    desc: `300 ${sm ? 9 : 10}px 'JetBrains Mono', monospace`,
  }
}

function measureLine(
  ctx: CanvasRenderingContext2D,
  text: string,
  font: string,
  cx: number,
): CharM[] {
  ctx.save()
  ctx.font = font
  const total = ctx.measureText(text).width
  let ox = cx - total / 2
  const chars: CharM[] = []
  for (const ch of text) {
    const w = ctx.measureText(ch).width
    chars.push({ ch, x: ox + w / 2, w })
    ox += w
  }
  ctx.restore()
  return chars
}

function createNode(data: (typeof SKILL_DATA)[number]): SkillNode {
  return {
    ...data,
    x: 0,
    y: 0,
    canvasW: 0,
    fonts: getFonts(0),
    particles: Array.from({ length: 40 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 55 + Math.random() * 90,
      speed: (0.0003 + Math.random() * 0.0005) * (Math.random() > 0.5 ? 1 : -1),
      size: 0.5 + Math.random() * 1.5,
      opacity: 0.1 + Math.random() * 0.4,
    })),
    rays: Array.from({ length: 6 }, (_, i) => ({
      angle: (i / 6) * Math.PI * 2 + Math.PI / 12,
      length: 60 + Math.random() * 30,
    })),
    t: Math.random() * Math.PI * 2,
    hovered: false,
    active: false,
    isPulsing: false,
    pulseT: 0,
    wasHovered: false,
    orbitOpacity: 1,
    titleBright: new Array(data.label.length).fill(0),
    subBright: new Array(data.sub.length).fill(0),
    descBright: new Array(data.desc.length).fill(0),
    titleM: null,
    subM: null,
    descM: null,
    comet: null,
    falling: [],
    isFalling: false,
  }
}

function ensureMeasures(ctx: CanvasRenderingContext2D, node: SkillNode, canvasW: number) {
  if (node.titleM && node.canvasW === canvasW) return
  node.canvasW = canvasW
  node.fonts = getFonts(canvasW)
  node.titleM = measureLine(ctx, node.label, node.fonts.title, node.x)
  node.subM = measureLine(ctx, node.sub, node.fonts.sub, node.x)
  node.descM = measureLine(ctx, node.desc, node.fonts.desc, node.x)
  if (node.titleBright.length !== node.label.length)
    node.titleBright = new Array(node.label.length).fill(0)
  if (node.subBright.length !== node.sub.length) node.subBright = new Array(node.sub.length).fill(0)
  if (node.descBright.length !== node.desc.length)
    node.descBright = new Array(node.desc.length).fill(0)
}

function launchComet(node: SkillNode) {
  if (!node.active || !node.titleM || !node.subM || !node.descM) return
  const allX = [...node.titleM, ...node.subM, ...node.descM].map((c) => c.x)
  const minX = Math.min(...allX) - 40
  const maxX = Math.max(...allX) + 40
  node.comet = {
    x: minX,
    y: node.y + TEXT_OFFSET - 10,
    xEnd: maxX,
    speed: (maxX - minX) / 55,
    tail: [],
    done: false,
  }
}

function updateComet(node: SkillNode) {
  const comet = node.comet
  if (!comet || comet.done) return
  comet.tail.unshift({ x: comet.x, y: comet.y })
  if (comet.tail.length > 28) comet.tail.pop()
  comet.x += comet.speed

  const textY = node.y + TEXT_OFFSET
  const lineYs = [textY, textY + LINE_GAP, textY + LINE_GAP * 2]
  const RADIUS = 38

  function illuminate(c: Comet, measures: CharM[], bright: number[]) {
    measures.forEach((m, i) => {
      lineYs.forEach((ly) => {
        const dx = c.x - m.x
        const dy = c.y - ly
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < RADIUS) bright[i] = Math.min(1, bright[i] + (1 - d / RADIUS) * 1.4)
      })
    })
  }

  if (node.titleM) illuminate(comet, node.titleM, node.titleBright)
  if (node.subM) illuminate(comet, node.subM, node.subBright)
  if (node.descM) illuminate(comet, node.descM, node.descBright)

  if (comet.x > comet.xEnd) {
    comet.done = true
    node.comet = null
  }
}

function decayBrightness(node: SkillNode) {
  if (!node.active) return
  const decay = 0.018
  node.titleBright = node.titleBright.map((b) => (b > 0.95 ? Math.max(0.95, b - decay) : b))
  node.subBright = node.subBright.map((b) => (b > 0.75 ? Math.max(0.75, b - decay) : b))
  node.descBright = node.descBright.map((b) => (b > 0.55 ? Math.max(0.55, b - decay) : b))
}

function launchFall(node: SkillNode) {
  if (!node.titleM || !node.subM || !node.descM) return
  node.falling = []
  node.isFalling = true
  const textY = node.y + TEXT_OFFSET
  const lines = [
    {
      measures: node.titleM,
      bright: node.titleBright,
      key: 'title' as const,
      y: textY,
      font: node.fonts.title,
    },
    {
      measures: node.subM,
      bright: node.subBright,
      key: 'sub' as const,
      y: textY + LINE_GAP,
      font: node.fonts.sub,
    },
    {
      measures: node.descM,
      bright: node.descBright,
      key: 'desc' as const,
      y: textY + LINE_GAP * 2,
      font: node.fonts.desc,
    },
  ]
  lines.forEach((line) => {
    line.measures.forEach((m, i) => {
      const startOpacity = line.bright[i]
      if (startOpacity < 0.01) return
      node.falling.push({
        ch: m.ch,
        x: m.x - m.w / 2,
        y: line.y,
        vy: 1.2 + Math.random() * 2.5,
        delay: Math.floor(Math.random() * 18),
        opacity: startOpacity,
        key: line.key,
        idx: i,
        font: line.font,
        started: false,
      })
    })
  })
}

function updateFall(node: SkillNode) {
  if (!node.isFalling) return
  node.falling.forEach((l) => {
    if (l.delay > 0) {
      l.delay--
      return
    }
    if (!l.started) {
      l.started = true
      if (l.key === 'title') node.titleBright[l.idx] = 0
      if (l.key === 'sub') node.subBright[l.idx] = 0
      if (l.key === 'desc') node.descBright[l.idx] = 0
    }
    l.y += l.vy
    l.vy += 0.18
    l.opacity -= 0.012
  })
  node.falling = node.falling.filter((l) => l.opacity > 0.01)
  if (node.falling.length === 0) node.isFalling = false
}

// ── draw functions ────────────────────────────────────────────────────────────

function drawFalling(ctx: CanvasRenderingContext2D, node: SkillNode, fg: [number, number, number]) {
  const [fr, fg2, fb] = fg
  node.falling.forEach((l) => {
    if (l.delay > 0) return
    ctx.save()
    ctx.font = l.font
    ctx.textBaseline = 'middle'
    ctx.fillStyle = `rgba(${fr},${fg2},${fb},${l.opacity})`
    ctx.fillText(l.ch, l.x, l.y)
    ctx.restore()
  })
}

function drawText(ctx: CanvasRenderingContext2D, node: SkillNode, theme: ThemeColors) {
  if (!node.titleM) return
  const [fr, fg, fb] = theme.fg
  const [ar, ag, ab] = theme.accent
  const textY = node.y + TEXT_OFFSET

  function drawLine(measures: CharM[], bright: number[], font: string, y: number) {
    ctx.save()
    ctx.font = font
    ctx.textBaseline = 'middle'
    measures.forEach((m, i) => {
      const b = bright[i]
      if (b < 0.01) return
      // blend fg → accent as brightness peaks above 0.95
      const blend = Math.max(0, (b - 0.95) / 0.05)
      const r = Math.round(fr + (ar - fr) * blend)
      const g = Math.round(fg + (ag - fg) * blend)
      const bl = Math.round(fb + (ab - fb) * blend)
      ctx.fillStyle = `rgba(${r},${g},${bl},${b})`
      ctx.fillText(m.ch, m.x - m.w / 2, y)
    })
    ctx.restore()
  }

  drawLine(node.titleM, node.titleBright, node.fonts.title, textY)
  if (node.subM) drawLine(node.subM, node.subBright, node.fonts.sub, textY + LINE_GAP)
  if (node.descM) drawLine(node.descM, node.descBright, node.fonts.desc, textY + LINE_GAP * 2)
}

function drawComet(
  ctx: CanvasRenderingContext2D,
  node: SkillNode,
  accent: [number, number, number],
) {
  const comet = node.comet
  if (!comet) return
  const [ar, ag, ab] = accent
  for (let i = 0; i < comet.tail.length; i++) {
    const frac = 1 - i / comet.tail.length
    ctx.beginPath()
    ctx.arc(comet.tail[i].x, comet.tail[i].y, frac * 3, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${Math.min(255, ar + Math.round((255 - ar) * frac * 0.4))},${Math.min(255, ag + Math.round((255 - ag) * frac * 0.4))},${Math.min(255, ab + Math.round((255 - ab) * frac * 0.4))},${frac * 0.9})`
    ctx.fill()
  }
  const g = ctx.createRadialGradient(comet.x, comet.y, 0, comet.x, comet.y, 14)
  g.addColorStop(
    0,
    `rgba(${Math.min(255, ar + 60)},${Math.min(255, ag + 60)},${Math.min(255, ab + 60)},0.95)`,
  )
  g.addColorStop(0.4, `rgba(${ar},${ag},${ab},0.4)`)
  g.addColorStop(1, 'transparent')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(comet.x, comet.y, 14, 0, Math.PI * 2)
  ctx.fill()
}

function drawNode(
  ctx: CanvasRenderingContext2D,
  node: SkillNode,
  accent: [number, number, number],
) {
  const {
    x: cx,
    y: cy,
    active,
    hovered,
    isPulsing,
    pulseT,
    orbitOpacity,
    t,
    particles,
    rays,
    orbit,
  } = node
  const [ar, ag, ab] = accent

  // background glow
  const bgGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, active ? 180 : 120)
  bgGlow.addColorStop(0, `rgba(${ar},${ag},${ab},${active ? 0.06 : hovered ? 0.04 : 0.015})`)
  bgGlow.addColorStop(1, 'transparent')
  ctx.fillStyle = bgGlow
  ctx.beginPath()
  ctx.arc(cx, cy, 250, 0, Math.PI * 2)
  ctx.fill()

  // pulse ring
  if (isPulsing) {
    const pr = (1 - Math.pow(1 - pulseT, 3)) * 180
    ctx.beginPath()
    ctx.arc(cx, cy, pr, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(${ar},${ag},${ab},${(1 - pulseT) * 0.7})`
    ctx.lineWidth = 1.5
    ctx.stroke()
  }

  // orbiting particles
  particles.forEach((p) => {
    p.angle += p.speed * (active ? 2 : hovered ? 1.8 : 1)
    const r = active ? p.radius * 0.88 : p.radius
    const px = cx + Math.cos(p.angle) * r
    const py = cy + Math.sin(p.angle) * r
    const d = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2)
    ctx.beginPath()
    ctx.arc(px, py, p.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${ar},${ag},${ab},${p.opacity * Math.max(0, 1 - d / 180) * (active ? 1 : hovered ? 0.8 : 0.5)})`
    ctx.fill()
  })

  // rays
  rays.forEach((ray) => {
    const a = ray.angle + t * 0.3
    const len = active ? ray.length * 1.8 : hovered ? ray.length * 1.4 : ray.length
    const r0 = active ? 30 : hovered ? 26 : 20
    const x1 = cx + Math.cos(a) * r0
    const y1 = cy + Math.sin(a) * r0
    const x2 = cx + Math.cos(a) * len
    const y2 = cy + Math.sin(a) * len
    const g = ctx.createLinearGradient(x1, y1, x2, y2)
    g.addColorStop(0, `rgba(${ar},${ag},${ab},${active ? 0.6 : hovered ? 0.4 : 0.15})`)
    g.addColorStop(1, 'transparent')
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.strokeStyle = g
    ctx.lineWidth = active ? 1.5 : 1
    ctx.stroke()
  })

  // dashed orbit ring
  const rr = active ? 42 : hovered ? 36 : 30
  ctx.beginPath()
  ctx.arc(cx, cy, rr, 0, Math.PI * 2)
  ctx.strokeStyle = `rgba(${ar},${ag},${ab},${active ? 0.45 : hovered ? 0.3 : 0.1})`
  ctx.lineWidth = 1
  ctx.setLineDash([3, 6])
  ctx.lineDashOffset = -t * 20
  ctx.stroke()
  ctx.setLineDash([])

  // orbit label (counter-clockwise rotation of text with radial pulse)
  if (orbitOpacity > 0.01) {
    const charCount = orbit.length
    const angleStep = (Math.PI * 2) / charCount
    const baseAngle = -t * 0.8 - Math.PI / 2
    const pulse = Math.sin(t * 2.5) * 5

    ctx.save()
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.font = "600 8px 'JetBrains Mono', monospace"
    for (let i = 0; i < charCount; i++) {
      const a = baseAngle + i * angleStep
      const ORBIT_R = rr + 14 + pulse
      const lx = cx + Math.cos(a) * ORBIT_R
      const ly = cy + Math.sin(a) * ORBIT_R
      ctx.save()
      ctx.translate(lx, ly)
      ctx.rotate(a + Math.PI / 2)
      ctx.fillStyle = `rgba(${ar},${ag},${ab},${orbitOpacity * (hovered ? 0.85 : 0.5)})`
      ctx.fillText(orbit[i], 0, 0)
      ctx.restore()
    }
    ctx.restore()
  }

  // core glow
  const cr = active ? 32 : hovered ? 26 : 20
  const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr)
  coreGlow.addColorStop(0, `rgba(${ar},${ag},${ab},${active ? 1 : hovered ? 0.7 : 0.4})`)
  coreGlow.addColorStop(0.4, `rgba(${ar},${ag},${ab},${active ? 0.35 : 0.1})`)
  coreGlow.addColorStop(1, 'transparent')
  ctx.fillStyle = coreGlow
  ctx.beginPath()
  ctx.arc(cx, cy, cr, 0, Math.PI * 2)
  ctx.fill()

  // core dot (flickering brightness, fixed size)
  const flicker = 0.5 + 0.5 * Math.sin(t * 3.5)
  const coreR = active ? 9 : hovered ? 7 : 5
  const coreA = active ? 1 : hovered ? 0.9 : 0.4 + flicker * 0.5
  ctx.beginPath()
  ctx.arc(cx, cy, coreR, 0, Math.PI * 2)
  ctx.fillStyle = active ? `rgba(255,255,255,${coreA})` : `rgba(${ar},${ag},${ab},${coreA})`
  ctx.fill()
}

// ── component ─────────────────────────────────────────────────────────────────

export function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const nodes: SkillNode[] = SKILL_DATA.map(createNode)
    const nodeById = new Map(nodes.map((n) => [n.id, n]))
    const timers: ReturnType<typeof setTimeout>[] = []
    let activeNode: SkillNode | null = null

    function updatePositions() {
      const w = canvas!.width
      const h = canvas!.height
      nodes.forEach((node) => {
        node.x = node.rx * w
        node.y = node.ry * h
        node.titleM = null // invalidate measures on resize
      })
    }

    function resize() {
      canvas!.width = canvas!.offsetWidth
      canvas!.height = canvas!.offsetHeight
      updatePositions()
    }
    resize()
    window.addEventListener('resize', resize)

    let theme = readTheme()
    let themeFrame = 0

    function activate(node: SkillNode) {
      if (activeNode && activeNode !== node) {
        activeNode.active = false
        activeNode.comet = null
        launchFall(activeNode)
      }
      activeNode = node
      node.active = true
      node.isPulsing = true
      node.pulseT = 0
      ensureMeasures(ctx!, node, canvas!.width)
      const timer = setTimeout(() => {
        launchComet(node)
      }, COMET_DELAY_MS)
      timers.push(timer)
    }

    function deactivate() {
      if (!activeNode) return
      activeNode.active = false
      activeNode.comet = null
      launchFall(activeNode)
      activeNode = null
    }

    let raf: number

    function draw() {
      raf = requestAnimationFrame(draw)
      if (!canvas || !ctx) return
      if (themeFrame % 60 === 0) theme = readTheme()
      themeFrame++

      ctx.fillStyle = theme.bg
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // connector lines between related technologies
      const [cr, cg, cb] = theme.accent
      CONNECTORS.forEach(({ from, to }) => {
        const a = nodeById.get(from)
        const b = nodeById.get(to)
        if (!a || !b) return
        const lit = a.active || b.active || a.hovered || b.hovered
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${lit ? 0.3 : 0.08})`
        ctx.lineWidth = 1
        ctx.stroke()
      })

      nodes.forEach((node) => {
        node.t += 0.008

        if (node.hovered && !node.wasHovered) {
          node.isPulsing = true
          node.pulseT = 0
        }
        node.wasHovered = node.hovered

        if (node.isPulsing) {
          node.pulseT += 0.025
          if (node.pulseT >= 1) node.isPulsing = false
        }

        node.orbitOpacity = node.active
          ? Math.max(0, node.orbitOpacity - 0.04)
          : Math.min(1, node.orbitOpacity + 0.03)

        ensureMeasures(ctx, node, canvas.width)
        updateComet(node)
        decayBrightness(node)
        updateFall(node)
        drawNode(ctx, node, theme.accent)
        drawComet(ctx, node, theme.accent)
        drawText(ctx, node, theme)
        drawFalling(ctx, node, theme.fg)
      })
    }

    draw()

    function getNodeAt(mx: number, my: number): SkillNode | undefined {
      return nodes.find((n) => {
        const dx = mx - n.x
        const dy = my - n.y
        return Math.sqrt(dx * dx + dy * dy) < HIT_RADIUS
      })
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      nodes.forEach((n) => {
        const dx = mx - n.x
        const dy = my - n.y
        n.hovered = Math.sqrt(dx * dx + dy * dy) < HIT_RADIUS
      })
      canvas!.style.cursor = nodes.some((n) => n.hovered) ? 'pointer' : 'default'
    }

    function onClick(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect()
      const clicked = getNodeAt(e.clientX - rect.left, e.clientY - rect.top)
      if (clicked && !clicked.active) {
        activate(clicked)
      } else if (!clicked && activeNode) {
        deactivate()
      }
    }

    function onTouchEnd(e: TouchEvent) {
      e.preventDefault()
      const touch = e.changedTouches[0]
      if (!touch) return
      const rect = canvas!.getBoundingClientRect()
      const clicked = getNodeAt(touch.clientX - rect.left, touch.clientY - rect.top)
      if (clicked && !clicked.active) {
        activate(clicked)
      } else if (!clicked && activeNode) {
        deactivate()
      }
    }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('click', onClick)
    canvas.addEventListener('touchend', onTouchEnd, { passive: false })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('click', onClick)
      canvas.removeEventListener('touchend', onTouchEnd)
      timers.forEach(clearTimeout)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="block h-full w-full" data-testid="constellation-canvas" />
  )
}
