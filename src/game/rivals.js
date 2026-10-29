/**
 * Rival riders on the road ahead. They cruise at RIVAL_SPEED: scroll faster
 * and you overtake them (they respawn far ahead); idle and they pull away
 * toward the horizon. z is the depth ahead of the camera, in road units.
 */

import { OFFSET_PER_SPEED } from './speed.js'

export const RIVAL_SPEED = 160

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

export function spawnRivals(farZ) {
  return [
    { z: farZ * 0.35, lane: -0.5, jacket: 'blue' },
    { z: farZ * 0.7, lane: 0.45, jacket: 'green' },
  ]
}

export function stepRivals({ rivals, playerSpeed, dt, farZ, nearZ, rand = Math.random }) {
  const closing = (playerSpeed - RIVAL_SPEED) * OFFSET_PER_SPEED * clamp(dt, 0, 0.1)
  return rivals.map(r => {
    const z = r.z - closing
    if (z < nearZ) return { ...r, z: farZ * (0.85 + rand() * 0.1), lane: rand() < 0.5 ? -0.5 : 0.45 }
    return { ...r, z: Math.min(z, farZ) }
  })
}
