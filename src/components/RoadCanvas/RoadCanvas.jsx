import { useEffect, useRef } from 'react'
import styles from './RoadCanvas.module.css'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import { curveAt } from '../../game/road'
import { nextSpeed, normalizedDelta, toMph, OFFSET_PER_SPEED } from '../../game/speed'
import { spawnRivals, stepRivals } from '../../game/rivals'
import { canvasLayout, COMPACT_HUD_QUERY } from '../../game/viewport'
import { publishMph } from '../../game/telemetry'
import { drawScene, paintSky, farZFor, NEAR_Z } from './scene'

/*
 * Fixed full-viewport road. Rendered at low resolution with square pixels and
 * scaled up by CSS (image-rendering: pixelated). Scrolling feeds nextSpeed();
 * the stripes, bends, roadside sprites and rival riders advance with it.
 */

const HILL_PARALLAX = 0.004  // road units → background pixels of sideways drift on a bend
const MPH_INTERVAL = 100     // ms between speedometer updates

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

// The desktop HUD covers the bottom edge; the compact HUD sits at the top.
function hudInset() {
  if (window.matchMedia(COMPACT_HUD_QUERY).matches) return 0
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hud-h-desktop')) || 88
}

export default function RoadCanvas({ activeStageId = null }) {
  const canvasRef = useRef(null)
  const stageRef = useRef(activeStageId)
  const redrawRef = useRef(() => {})
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    stageRef.current = activeStageId
    redrawRef.current()
  }, [activeStageId])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const bgCtx = document.createElement('canvas').getContext('2d')

    let width = 0
    let height = 0
    let groundBottom = 0
    let offset = 0
    let speed = 0
    let lean = 0
    let hillShift = 0
    let rivals = []
    let lastY = window.scrollY
    let lastT = null
    let lastMphAt = 0
    let raf = 0

    const resize = () => {
      const layout = canvasLayout({
        cssWidth: canvas.clientWidth || window.innerWidth,
        cssHeight: canvas.clientHeight || window.innerHeight,
        hudInset: hudInset(),
      })
      width = canvas.width = layout.width
      height = canvas.height = layout.height
      groundBottom = layout.groundBottom
      paintSky(bgCtx, width, height, groundBottom)
      rivals = spawnRivals(farZFor(height, groundBottom))
    }

    const render = () => {
      drawScene(ctx, {
        bg: bgCtx.canvas, width, height, groundBottom, offset,
        curve: curveAt(offset), hillShift, lean,
        bob: reducedMotion ? 0 : Math.floor(offset / 90) % 2,
        stageId: stageRef.current, rivals,
      })
    }

    const tick = (t) => {
      const dt = lastT === null ? 0 : (t - lastT) / 1000
      lastT = t
      const y = window.scrollY
      const delta = normalizedDelta(y - lastY, dt)
      lastY = y
      speed = nextSpeed({ current: speed, scrollDelta: delta, dt, reducedMotion: false })
      const step = speed * OFFSET_PER_SPEED * Math.min(dt, 0.1)
      offset += step
      hillShift += curveAt(offset) * step * HILL_PARALLAX
      lean += (clamp(delta / 30, -1, 1) - lean) * Math.min(1, dt * 8)
      rivals = stepRivals({ rivals, playerSpeed: speed, dt, farZ: farZFor(height, groundBottom), nearZ: NEAR_Z })
      if (t - lastMphAt >= MPH_INTERVAL) {
        publishMph(toMph(speed))
        lastMphAt = t
      }
      render()
      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (reducedMotion || raf) return
      lastT = null
      lastY = window.scrollY
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }
    const onVisibility = () => (document.hidden ? stop() : start())
    const onResize = () => {
      resize()
      render()
    }

    resize()
    render()
    if (reducedMotion) publishMph(0)
    redrawRef.current = reducedMotion ? render : () => {}
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    if (!document.hidden) start()

    return () => {
      stop()
      redrawRef.current = () => {}
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reducedMotion])

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
}
