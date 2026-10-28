/**
 * Which part of the race is active, given the set of section ids currently
 * crossing the middle band of the viewport. When two overlap, the later one
 * in page order wins (its top has crossed the middle).
 */

const FINISH_IDS = ['loadout', 'pit-stop', 'finish']

export function sectionOrder(stageIds) {
  return ['start', ...stageIds.map(id => `stage-${id}`), ...FINISH_IDS]
}

export function resolveActive(visible, stageIds) {
  const current = sectionOrder(stageIds).filter(id => visible.has(id)).at(-1)
  if (!current) return null
  if (current === 'start') return { phase: 'start', stageId: null, index: -1 }
  if (FINISH_IDS.includes(current)) return { phase: 'finish', stageId: null, index: -1 }
  const index = stageIds.indexOf(current.replace(/^stage-/, ''))
  return { phase: 'stage', stageId: stageIds[index], index }
}
