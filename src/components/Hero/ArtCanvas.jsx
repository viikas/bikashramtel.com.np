import { useEffect, useRef } from 'react'

/*
 * "Identity Mesh" — layered generative canvas combining:
 *
 * 1. Constellation network — floating nodes with connection lines (gaming skill tree / neural net)
 * 2. Circuit board traces — PCB-style paths with glowing junction points (tinkerer)
 * 3. Floating glyphs — kanji + code symbols drifting upward (otaku + developer)
 *
 * Mouse interaction: nodes subtly gravitate toward cursor.
 */

const COLORS = {
  amber:  [232, 160, 77],
  teal:   [77, 232, 196],
  ember:  [232, 93, 64],
  cream:  [245, 241, 234],
}

function rgba(c, a) { return `rgba(${c[0]},${c[1]},${c[2]},${a})` }

// ─── Floating glyphs (kanji + code + nepali script) ────────────────────────────────
const GLYPHS = [
  // Kanji / Japanese
  '侍', '竜', '風', '光', '夢', '力', '炎', '星', '魂', '道',
  '刀', '忍', '鬼', '神', '月', '影', '雷', '氷', '剣', '武',
  '桜', '虎', '海', '空', '心', '闘', '王', '拳', '血', '戦',
  // Katakana
  'ア', 'カ', 'サ', 'タ', 'ナ', 'ハ', 'マ', 'ヤ', 'ラ', 'ワ',
  'ガ', 'ザ', 'ダ', 'バ', 'パ',
  // Code symbols
  '{ }', '//', '=>', '&&', '<>', '[]', '::', '**', '$$', '##',
  '!=', '++', '--', '||', '??', '~>', '<<', '>>', '/*', '*/',
  '<%', '%>', '$()', '@_', '#!', '&=',
  // Tech / gaming / dev
  '0x', 'fn', 'AI', 'GG', 'HP', 'XP', 'LV', 'OK', 'OP',
  'npm', 'git', 'ssh', 'api', 'jsx', 'css', 'dom', 'tcp',
  'sudo', 'root', 'null', 'true', 'void', 'async', 'React',
  // Emoticon fragments
  '^_^', '-_-', 'o_O', '>.<', ':3',
  // Binary / hex
  '01', '10', '0xFF', '1010', '0b01',
  'B', 'I', 'K', 'A', 'S', 'H', 'R', 'A', 'M', 'T', 'E', 'L',
   'क','ख','ग','घ','ङ','च','छ','ज','झ','ञ','ट','ठ','ड','ढ','ण','त','थ','द','ध','न','प','फ','ब','भ','म','य','र','ल','व','श','ष','स','ह', 'क्ष', 'त्र', 'ज्ञ'
]

export default function ArtCanvas({ style }) {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth
      canvas.height = canvas.parentElement.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    window.addEventListener('mousemove', onMouse, { passive: true })

    // ── Constellation nodes ──────────────────────────────
    const NUM_NODES = 45
    const CONNECT_DIST = 140
    const nodes = Array.from({ length: NUM_NODES }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 1.5 + Math.random() * 2,
      color: [COLORS.amber, COLORS.teal, COLORS.ember][Math.floor(Math.random() * 3)],
    }))

    // ── Circuit traces (static paths) ────────────────────
    const NUM_TRACES = 12
    const traces = Array.from({ length: NUM_TRACES }, () => {
      const startX = Math.random() * canvas.width
      const startY = Math.random() * canvas.height
      const segments = []
      let cx = startX, cy = startY
      const numSegs = 3 + Math.floor(Math.random() * 5)
      for (let s = 0; s < numSegs; s++) {
        // PCB-style: only horizontal or vertical
        const horizontal = Math.random() > 0.5
        const len = 30 + Math.random() * 80
        const nx = horizontal ? cx + (Math.random() > 0.5 ? len : -len) : cx
        const ny = horizontal ? cy : cy + (Math.random() > 0.5 ? len : -len)
        segments.push({ x1: cx, y1: cy, x2: nx, y2: ny })
        cx = nx
        cy = ny
      }
      return {
        segments,
        color: Math.random() > 0.5 ? COLORS.teal : COLORS.amber,
        pulseOffset: Math.random() * Math.PI * 2,
      }
    })

    // ── Floating glyphs ──────────────────────────────────
    const NUM_GLYPHS = 50
    const glyphs = Array.from({ length: NUM_GLYPHS }, () => ({
      char: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vy: -(0.15 + Math.random() * 0.3),
      vx: (Math.random() - 0.5) * 0.1,
      size: 10 + Math.random() * 14,
      alpha: 0.04 + Math.random() * 0.08,
      color: [COLORS.amber, COLORS.teal, COLORS.cream][Math.floor(Math.random() * 3)],
    }))

    function resetGlyph(g) {
      g.char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      g.x = Math.random() * canvas.width
      g.y = canvas.height + 20
      g.vy = -(0.15 + Math.random() * 0.3)
      g.vx = (Math.random() - 0.5) * 0.1
      g.size = 10 + Math.random() * 14
      g.alpha = 0.04 + Math.random() * 0.08
      g.color = [COLORS.amber, COLORS.teal, COLORS.cream][Math.floor(Math.random() * 3)]
    }

    let t = 0

    function draw() {
      const W = canvas.width, H = canvas.height
      const mx = mouseRef.current.x, my = mouseRef.current.y

      // Soft fade
      ctx.fillStyle = 'rgba(9,8,8,0.08)'
      ctx.fillRect(0, 0, W, H)

      // ── Layer 1: Circuit traces ──────────────────────
      for (const trace of traces) {
        const pulse = (Math.sin(t * 1.5 + trace.pulseOffset) + 1) / 2
        const alpha = 0.03 + pulse * 0.04

        ctx.strokeStyle = rgba(trace.color, alpha)
        ctx.lineWidth = 0.8
        ctx.beginPath()
        for (const seg of trace.segments) {
          ctx.moveTo(seg.x1, seg.y1)
          ctx.lineTo(seg.x2, seg.y2)
        }
        ctx.stroke()

        // Junction dots
        for (const seg of trace.segments) {
          ctx.fillStyle = rgba(trace.color, alpha + 0.04)
          ctx.beginPath()
          ctx.arc(seg.x2, seg.y2, 1.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // ── Layer 2: Constellation network ───────────────
      // Update nodes
      for (const n of nodes) {
        // Mouse attraction
        const dx = mx - n.x, dy = my - n.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 200 && dist > 0) {
          const force = 0.015 * (1 - dist / 200)
          n.vx += (dx / dist) * force
          n.vy += (dy / dist) * force
        }

        n.x += n.vx
        n.y += n.vy

        // Damping
        n.vx *= 0.995
        n.vy *= 0.995

        // Wrap edges
        if (n.x < 0) n.x = W
        if (n.x > W) n.x = 0
        if (n.y < 0) n.y = H
        if (n.y > H) n.y = 0
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < CONNECT_DIST) {
            const alpha = (1 - d / CONNECT_DIST) * 0.08
            ctx.strokeStyle = rgba(nodes[i].color, alpha)
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        // Glow
        ctx.fillStyle = rgba(n.color, 0.04)
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2)
        ctx.fill()

        // Core
        ctx.fillStyle = rgba(n.color, 0.2)
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // ── Layer 3: Floating glyphs ─────────────────────
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (const g of glyphs) {
        g.x += g.vx
        g.y += g.vy

        if (g.y < -30) resetGlyph(g)

        // Fade near edges
        const edgeFade = Math.min(g.y / 100, (H - g.y) / 100, 1)
        const a = g.alpha * Math.max(0, edgeFade)

        ctx.font = `${g.size}px "JetBrains Mono", monospace`
        ctx.fillStyle = rgba(g.color, a)
        ctx.fillText(g.char, g.x, g.y)
      }

      t += 0.008
      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'auto' }}
      />
    </div>
  )
}
