/**
 * Course map maths for the HUD: where each checkpoint sits on the track,
 * where the rider marker sits, and what the HUD label reads.
 */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

export function checkpointPercents(count) {
  return Array.from({ length: count }, (_, i) => ((i + 0.5) * 100) / count)
}

export function markerPercent(activeIndex, count, phase) {
  if (phase === 'start') return 0
  if (phase === 'finish') return 100
  if (activeIndex >= count) return 100
  return clamp(((activeIndex + 0.5) * 100) / count, 0, 100)
}

export function hudLabel(phase, stage) {
  if (phase === 'stage' && stage) return `STAGE ${stage.number} · ${stage.company.toUpperCase()}`
  return phase === 'finish' ? 'FINISH' : 'START'
}
