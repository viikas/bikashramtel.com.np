import { useEffect, useRef } from 'react'

/*
 * ALGORITHMIC PHILOSOPHY — "Digital Terrains"
 *
 * Nepal's ridgelines translated into computational topography. Layered Perlin
 * noise builds invisible elevation fields; contour-line marching traces the
 * iso-curves where height meets threshold. Each contour band glows at a
 * different temperature — amber at altitude, teal in the valleys — as though
 * the land breathes warmth from its peaks downward.
 *
 * The algorithm never repeats: a seeded noise field drifts slowly on the Z
 * axis, making every moment a unique cross-section through infinite terrain.
 * Particle scouts float along the steepest-ascent vectors, leaving faint
 * phosphor trails that map the invisible wind.
 */

const SEED   = 42
const COLS   = 80
const ROWS   = 50
const SPEED  = 0.0004
const PARTICLES = 120

export default function ArtCanvas({ style }) {
  const containerRef = useRef(null)
  const sketchRef    = useRef(null)

  useEffect(() => {
    let p5Instance = null

    const initP5 = async () => {
      const P5 = (await import('p5')).default

      const sketch = (p) => {
        let t = 0
        let particles = []

        const palette = {
          bg:     [9,  8,  8],
          c1:     [232, 160, 77,  55],  // amber — high elevation
          c2:     [77,  232, 196, 38],  // teal  — low elevation
          trail:  [232, 160, 77,  14],
        }

        class Particle {
          constructor() { this.reset() }

          reset() {
            this.x  = p.random(p.width)
            this.y  = p.random(p.height)
            this.vx = 0
            this.vy = 0
            this.life   = p.random(80, 200)
            this.maxLife = this.life
            this.speed  = p.random(0.4, 1.2)
          }

          update() {
            const nx = this.x / p.width  * 3
            const ny = this.y / p.height * 3
            const angle = p.noise(nx, ny, t * 3) * p.TWO_PI * 2
            const mag   = this.speed

            this.vx = this.vx * 0.85 + Math.cos(angle) * mag * 0.15
            this.vy = this.vy * 0.85 + Math.sin(angle) * mag * 0.15

            this.x += this.vx
            this.y += this.vy
            this.life--

            if (
              this.life <= 0 ||
              this.x < 0 || this.x > p.width ||
              this.y < 0 || this.y > p.height
            ) {
              this.reset()
            }
          }

          draw() {
            const alpha = (this.life / this.maxLife) * palette.trail[3]
            p.stroke(palette.trail[0], palette.trail[1], palette.trail[2], alpha)
            p.strokeWeight(1)
            p.point(this.x, this.y)
          }
        }

        p.setup = () => {
          const canvas = p.createCanvas(
            containerRef.current.offsetWidth,
            containerRef.current.offsetHeight,
          )
          canvas.parent(containerRef.current)
          canvas.style('position', 'absolute')
          canvas.style('top', '0')
          canvas.style('left', '0')
          p.noiseDetail(4, 0.5)
          p.noiseSeed(SEED)
          p.randomSeed(SEED)
          p.frameRate(24)
          p.colorMode(p.RGB, 255)

          for (let i = 0; i < PARTICLES; i++) {
            particles.push(new Particle())
          }
        }

        p.draw = () => {
          // Soft fade — not full clear — for trail effect
          p.noStroke()
          p.fill(palette.bg[0], palette.bg[1], palette.bg[2], 18)
          p.rect(0, 0, p.width, p.height)

          const cw = p.width  / COLS
          const ch = p.height / ROWS

          // Draw contour iso-lines
          for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
              const nx = x / COLS * 2.5
              const ny = y / ROWS * 2.5
              const n  = p.noise(nx, ny, t)

              // Select iso-threshold bands
              const bands = [0.35, 0.42, 0.50, 0.57, 0.65, 0.72]
              for (let b = 0; b < bands.length; b++) {
                const thresh = bands[b]
                if (Math.abs(n - thresh) < 0.018) {
                  const highFrac = b / (bands.length - 1)
                  const r = p.lerp(palette.c2[0], palette.c1[0], highFrac)
                  const g = p.lerp(palette.c2[1], palette.c1[1], highFrac)
                  const bl= p.lerp(palette.c2[2], palette.c1[2], highFrac)
                  const a = p.lerp(palette.c2[3], palette.c1[3], highFrac)
                  p.stroke(r, g, bl, a)
                  p.strokeWeight(0.8)
                  p.point(x * cw + cw * 0.5, y * ch + ch * 0.5)
                }
              }
            }
          }

          // Update & draw particles
          for (const part of particles) {
            part.update()
            part.draw()
          }

          t += SPEED
        }

        p.windowResized = () => {
          if (containerRef.current) {
            p.resizeCanvas(
              containerRef.current.offsetWidth,
              containerRef.current.offsetHeight,
            )
          }
        }
      }

      p5Instance = new P5(sketch)
      sketchRef.current = p5Instance
    }

    initP5()

    return () => {
      if (sketchRef.current) {
        sketchRef.current.remove()
        sketchRef.current = null
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
        ...style,
      }}
    />
  )
}
