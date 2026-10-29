/**
 * Arcade "CONTINUE? 9…0" countdown. Holds at `from` until started
 * (when the visitor reaches the finish), then ticks once a second and loops.
 */

export function countdownValue(startedAt, now, from = 9) {
  if (startedAt === null) return from
  const elapsed = Math.max(0, Math.floor((now - startedAt) / 1000))
  return from - (elapsed % (from + 1))
}
