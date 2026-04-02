import { useEffect, useRef } from 'react'

/*
 * "Digital Terrains" — lightweight vanilla Canvas replacement for p5.js.
 *
 * Perlin-inspired noise field with contour iso-lines and ambient particles.
 * Amber at altitude, teal in the valleys.
 *
 * ~80 lines vs 1MB p5.js dependency.
 */

// Simple 2D noise (permutation-based, good enough for visual effect)
const PERM = new Uint8Array(512)
;(() => {
  const p = new Uint8Array(256)
  for (let i = 0; i < 256; i++) p[i] = i
  for (let i = 255; i > 0; i--) {
    const j = (i * 16807 + 37) % (i + 1) // seeded shuffle
    ;[p[i], p[j]] = [p[j], p[i]]
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255]
})()

function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10) }
function lerp(a, b, t) { return a + t * (b - a) }
function grad(hash, x, y) {
  const h = hash & 3
  return (h < 2 ? (h === 0 ? x : -x) : 0) + (h < 2 ? 0 : h === 2 ? y : -y)
}

function noise2d(x, y) {
  const xi = Math.floor(x) & 255, yi = Math.floor(y) & 255
  const xf = x - Math.floor(x), yf = y - Math.floor(y)
  const u = fade(xf), v = fade(yf)
  const aa = PERM[PERM[xi] + yi], ab = PERM[PERM[xi] + yi + 1]
  const ba = PERM[PERM[xi + 1] + yi], bb = PERM[PERM[xi + 1] + yi + 1]
  return lerp(
    lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
    lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
    v,
  ) * 0.5 + 0.5 // normalize to 0–1
}

const COLS = 80, ROWS = 50, SPEED = 0.0004, NUM_PARTICLES = 120

const palette = {
  bg: [9, 8, 8],
  high: [232, 160, 77],  // amber
  low:  [77, 232, 196],  // teal
}

export default function ArtCanvas({ style }) {
  const canvasRef = useRef(null)
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

    // Particles
    const particles = Array.from({ length: NUM_PARTICLES }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: 0, vy: 0,
      life: 80 + Math.random() * 120,
      maxLife: 0,
      speed: 0.4 + Math.random() * 0.8,
    }))
    particles.forEach((p) => (p.maxLife = p.life))

    function resetParticle(p) {
      p.x = Math.random() * canvas.width
      p.y = Math.random() * canvas.height
      p.vx = 0; p.vy = 0
      p.life = 80 + Math.random() * 120
      p.maxLife = p.life
      p.speed = 0.4 + Math.random() * 0.8
    }

    let t = 0

    function draw() {
      // Soft fade
      ctx.fillStyle = `rgba(${palette.bg[0]},${palette.bg[1]},${palette.bg[2]},0.07)`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const cw = canvas.width / COLS
      const ch = canvas.height / ROWS
      const bands = [0.35, 0.42, 0.50, 0.57, 0.65, 0.72]

      // Draw contour iso-lines
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const nx = x / COLS * 2.5
          const ny = y / ROWS * 2.5
          const n = noise2d(nx + t * 0.3, ny + t * 0.3)

          for (let b = 0; b < bands.length; b++) {
            if (Math.abs(n - bands[b]) < 0.018) {
              const frac = b / (bands.length - 1)
              const r = lerp(palette.low[0], palette.high[0], frac)
              const g = lerp(palette.low[1], palette.high[1], frac)
              const bl = lerp(palette.low[2], palette.high[2], frac)
              const a = lerp(0.15, 0.22, frac)
              ctx.fillStyle = `rgba(${r|0},${g|0},${bl|0},${a})`
              ctx.fillRect(x * cw + cw * 0.5, y * ch + ch * 0.5, 1.2, 1.2)
            }
          }
        }
      }

      // Particles
      for (const p of particles) {
        const nx = p.x / canvas.width * 3
        const ny = p.y / canvas.height * 3
        const angle = noise2d(nx, ny + t * 2) * Math.PI * 4
        const mag = p.speed

        p.vx = p.vx * 0.85 + Math.cos(angle) * mag * 0.15
        p.vy = p.vy * 0.85 + Math.sin(angle) * mag * 0.15
        p.x += p.vx
        p.y += p.vy
        p.life--

        if (p.life <= 0 || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
          resetParticle(p)
        }

        const alpha = (p.life / p.maxLife) * 0.055
        ctx.fillStyle = `rgba(${palette.high[0]},${palette.high[1]},${palette.high[2]},${alpha})`
        ctx.fillRect(p.x, p.y, 1, 1)
      }

      t += SPEED
      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
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
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
    </div>
  )
}
