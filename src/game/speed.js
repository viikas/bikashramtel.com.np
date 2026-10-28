/**
 * Scroll-driven road speed. Scrolling (either direction) pushes the bike
 * forward; when scrolling stops it eases back to a slow idle cruise.
 * Units: road units per second.
 */

export const IDLE = 40
export const MAX = 600
export const EASE = 4

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

export function nextSpeed({ current, scrollDelta, dt, reducedMotion }) {
  if (reducedMotion) return 0
  const target = IDLE + Math.min(Math.abs(scrollDelta) * 8, MAX - IDLE)
  const step = Math.min(1, EASE * clamp(dt, 0, 0.1))
  return clamp(current + (target - current) * step, 0, MAX)
}
