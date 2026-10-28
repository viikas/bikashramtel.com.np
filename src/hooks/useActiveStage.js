import { useEffect, useState } from 'react'

const FINISH_IDS = ['loadout', 'pit-stop', 'finish']
const START = { phase: 'start', stageId: null, index: -1 }

/**
 * Which part of the race the visitor is in, judged by the section crossing
 * a thin line through the middle of the viewport.
 */
export default function useActiveStage(stageIds) {
  const [active, setActive] = useState(START)
  const key = stageIds.join(',')

  useEffect(() => {
    const ids = key.split(',')
    const toState = (sectionId) => {
      if (sectionId === 'start') return START
      if (FINISH_IDS.includes(sectionId)) return { phase: 'finish', stageId: null, index: -1 }
      const index = ids.indexOf(sectionId.replace(/^stage-/, ''))
      return index === -1 ? null : { phase: 'stage', stageId: ids[index], index }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const next = toState(entry.target.id)
          if (next) setActive(next)
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )

    const sectionIds = ['start', ...ids.map(id => `stage-${id}`), ...FINISH_IDS]
    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [key])

  return active
}
