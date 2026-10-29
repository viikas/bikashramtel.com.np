/**
 * Tiny store the road canvas publishes its speedometer reading to, so the
 * HUD can show MPH without re-rendering the whole app every frame.
 */

let mph = 0
const listeners = new Set()

export function publishMph(value) {
  if (value === mph) return
  mph = value
  for (const fn of listeners) fn(value)
}

export function subscribeMph(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export const currentMph = () => mph
