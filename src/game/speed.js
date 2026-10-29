/**
 * Scroll-driven road speed. Scrolling (either direction) pushes the bike
 * forward; when scrolling stops it eases back to a slow idle cruise.
 * Units: road units per second.
 */

export const IDLE = 40
export const MAX = 600
export const EASE = 4
// Speed units → road units per second (idle ≈ 0.8 stripes/s, max ≈ 12).
export const OFFSET_PER_SPEED = 4

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

/** Speedometer reading: MAX speed shows 180 MPH. */
export function toMph(speed) {
  return Math.round((speed / MAX) * 180)
}

/** Scroll pixels per frame, rescaled to a 60Hz frame so 120Hz screens feel the same. */
export function normalizedDelta(delta, dt) {
  return dt > 0 ? delta / (dt * 60) : delta
}

export function nextSpeed({ current, scrollDelta, dt, reducedMotion }) {
  if (reducedMotion) return 0
  const target = IDLE + Math.min(Math.abs(scrollDelta) * 8, MAX - IDLE)
  const step = Math.min(1, EASE * clamp(dt, 0, 0.1))
  return clamp(current + (target - current) * step, 0, MAX)
}
