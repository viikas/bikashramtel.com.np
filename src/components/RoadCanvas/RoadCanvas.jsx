import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import styles from './RoadCanvas.module.css'
import { projectRoad } from '../../game/road'
import { nextSpeed } from '../../game/speed'
import { sceneryFor } from '../../game/scenery'
import { PALETTE as C, drawSky, drawHills, drawBike, drawSprite } from './sprites'

/*
 * Fixed full-viewport road. Rendered at low resolution with square pixels and
 * scaled up by CSS (image-rendering: pixelated). Scrolling feeds nextSpeed();
 * the stripes and roadside sprites advance with it.
 */

const CAMERA_HEIGHT = 1000   // must match projectRoad's default
const OFFSET_PER_SPEED = 4   // speed units → road units/sec (idle ≈ 0.8 stripes/s, max ≈ 12)
const SPRITE_SPACING = 700   // road units between roadside objects
const SPRITE_SIZE = 2.6      // sprite local units → pixels at the bottom row

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

// Whole-number pixel size so pixels stay square on any viewport.
function internalSize(cssW, cssH) {
  const px = clamp(Math.round(Math.min(cssW, cssH) / 180), 2, 6)
  return { width: Math.ceil(cssW / px), height: Math.ceil(cssH / px) }
}

function drawFrame(ctx, bg, width, height, offset, lean, bob, kinds) {
  const horizon = Math.round(height * 0.5)
  ctx.drawImage(bg, 0, 0)

  const rows = projectRoad({ width, height, horizon, offset })
  for (const r of rows) {
    ctx.fillStyle = r.stripe ? C.grass1 : C.grass2
    ctx.fillRect(0, r.y, width, 1)
    const edge = Math.round(r.halfWidth + r.rumbleWidth)
    ctx.fillStyle = r.stripe ? C.rumble : C.white
    ctx.fillRect(Math.round(r.center - edge), r.y, edge * 2, 1)
    const half = Math.round(r.halfWidth)
    ctx.fillStyle = r.stripe ? '#7a7a86' : '#6c6c78'
    ctx.fillRect(Math.round(r.center - half), r.y, half * 2, 1)
    if (r.stripe === 0) {
      const lane = Math.max(1, Math.round(r.laneWidth))
      ctx.fillStyle = C.white
      ctx.fillRect(Math.round(r.center - lane / 2), r.y, lane, 1)
    }
  }

  // Roadside objects, far to near. z = depth ahead of the camera.
  const depthRows = height - horizon
  const farZ = CAMERA_HEIGHT * depthRows
  const phase = ((offset % SPRITE_SPACING) + SPRITE_SPACING) % SPRITE_SPACING
  const base = Math.floor(offset / SPRITE_SPACING)
  const count = Math.floor(farZ / SPRITE_SPACING)
  for (let k = count; k >= 1; k--) {
    const z = k * SPRITE_SPACING - phase
    if (z < CAMERA_HEIGHT * 0.55) continue
    const scale = CAMERA_HEIGHT / z
    if (scale * SPRITE_SIZE < 0.15) continue
    const g = base + k
    const kind = kinds[Math.floor(g / 2) % kinds.length]
    const y = horizon - 1 + (CAMERA_HEIGHT * depthRows) / z
    const roadEdge = 0.9 * (width / 2) * scale * 1.12
    const gap = 24 * SPRITE_SIZE * scale
    const x = width / 2 + (g % 2 ? -1 : 1) * (roadEdge + gap)
    drawSprite(ctx, kind, x, y, scale * SPRITE_SIZE)
  }

  drawBike(ctx, Math.round(width / 2), height - 4 - bob, lean)
}

export default function RoadCanvas({ activeStageId = null }) {
  const canvasRef = useRef(null)
  const stageRef = useRef(activeStageId)
  const redrawRef = useRef(() => {})
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    stageRef.current = activeStageId
    redrawRef.current()
  }, [activeStageId])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const bg = document.createElement('canvas')
    const bgCtx = bg.getContext('2d')

    let width = 0
    let height = 0
    let bgStage
    let offset = 0
    let speed = 0
    let lean = 0
    let lastY = window.scrollY
    let lastT = null
    let raf = 0

    const buildBackground = () => {
      const horizon = Math.round(height * 0.5)
      bg.width = width
      bg.height = height
      drawSky(bgCtx, width, horizon)
      // Himalayas behind the Nepal stages, and at the start/finish (home: Kathmandu).
      const stage = stageRef.current
      drawHills(bgCtx, width, horizon, stage === null || sceneryFor(stage).includes('prayer-flags'))
      bgStage = stageRef.current
    }

    const resize = () => {
      const size = internalSize(canvas.clientWidth || window.innerWidth, canvas.clientHeight || window.innerHeight)
      width = canvas.width = size.width
      height = canvas.height = size.height
      buildBackground()
    }

    const render = () => {
      if (bgStage !== stageRef.current) buildBackground()
      const bob = reducedMotion ? 0 : Math.floor(offset / 90) % 2
      drawFrame(ctx, bg, width, height, offset, lean, bob, sceneryFor(stageRef.current))
    }

    const tick = (t) => {
      const dt = lastT === null ? 0 : (t - lastT) / 1000
      lastT = t
      const y = window.scrollY
      const delta = y - lastY
      lastY = y
      speed = nextSpeed({ current: speed, scrollDelta: delta, dt, reducedMotion: false })
      offset += speed * OFFSET_PER_SPEED * Math.min(dt, 0.1)
      lean += (clamp(delta / 30, -1, 1) - lean) * Math.min(1, dt * 8)
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
