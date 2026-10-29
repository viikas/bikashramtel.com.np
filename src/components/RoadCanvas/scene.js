/**
 * Draws one frame of the road scene. Shared by the live RoadCanvas and the
 * link-preview image generator (scripts/generate-og-image.html).
 */

import { projectRoad } from '../../game/road'
import { sceneryFor } from '../../game/scenery'
import { billboardsFor } from '../../data/billboards'
import { PALETTE as C, RIDERS, drawSky, drawHills, drawBike, drawSprite, drawBillboard } from './sprites'

export const CAMERA_HEIGHT = 1000   // must match projectRoad's default
export const SPRITE_SPACING = 700   // road units between roadside objects
export const SPRITE_SIZE = 2.6      // sprite local units → pixels at the bottom row
export const NEAR_Z = CAMERA_HEIGHT * 0.55

// The scene is composed above `groundBottom` so the bike isn't hidden by the HUD.
export const horizonFor = groundBottom => Math.round(groundBottom * 0.5)

export const farZFor = (height, groundBottom) => CAMERA_HEIGHT * (height - horizonFor(groundBottom))

// Himalayas behind the Nepal stages, and at the start/finish (home: Kathmandu).
const hasMountains = stageId => stageId === null || sceneryFor(stageId).includes('prayer-flags')

/** Static sky (sun, clouds) — cache it and pass it back to drawScene as `bg`. */
export function paintSky(bgCtx, width, height, groundBottom) {
  bgCtx.canvas.width = width
  bgCtx.canvas.height = height
  drawSky(bgCtx, width, horizonFor(groundBottom))
}

export function drawScene(ctx, {
  bg, width, height, groundBottom, offset, curve = 0, hillShift = 0,
  lean = 0, bob = 0, stageId = null, rivals = [],
}) {
  const horizon = horizonFor(groundBottom)
  ctx.drawImage(bg, 0, 0)
  drawHills(ctx, width, horizon, hasMountains(stageId), hillShift)

  const rows = projectRoad({ width, height, horizon, offset, curve })
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

  // Depth z → screen row, scale and the (curved) road centre at that row.
  const depthRows = height - horizon
  const project = z => {
    const y = horizon - 1 + (CAMERA_HEIGHT * depthRows) / z
    const row = rows[Math.min(rows.length - 1, Math.max(0, Math.round(y) - horizon))]
    return { y, scale: CAMERA_HEIGHT / z, center: row ? row.center : width / 2 }
  }

  // Roadside objects, far to near.
  const kinds = sceneryFor(stageId)
  const messages = billboardsFor(stageId)
  const farZ = CAMERA_HEIGHT * depthRows
  const phase = ((offset % SPRITE_SPACING) + SPRITE_SPACING) % SPRITE_SPACING
  const base = Math.floor(offset / SPRITE_SPACING)
  for (let k = Math.floor(farZ / SPRITE_SPACING); k >= 1; k--) {
    const z = k * SPRITE_SPACING - phase
    if (z < NEAR_Z) continue
    const { y, scale, center } = project(z)
    const size = scale * SPRITE_SIZE
    if (size < 0.15) continue
    const g = base + k
    const side = g % 2 ? -1 : 1
    const roadEdge = 0.9 * (width / 2) * scale * 1.12
    const gap = 24 * size
    const kind = kinds[Math.floor(g / 2) % kinds.length]
    if (kind === 'billboard') {
      drawBillboard(ctx, messages[g % messages.length], center + side * (roadEdge + gap * 0.5), y, size, side)
    } else {
      drawSprite(ctx, kind, center + side * (roadEdge + gap), y, size)
    }
  }

  // Rivals on the road, far to near, then the player.
  for (const r of [...rivals].sort((a, b) => b.z - a.z)) {
    if (r.z < NEAR_Z || r.z > farZ) continue
    const { y, scale, center } = project(r.z)
    if (y > groundBottom + 2) continue
    const halfWidth = 0.9 * (width / 2) * scale
    drawBike(ctx, center + r.lane * halfWidth, y, 0, scale, RIDERS[r.jacket])
  }

  drawBike(ctx, Math.round(width / 2), groundBottom - 4 - bob, lean)
}
