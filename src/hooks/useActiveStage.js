import { useEffect, useState } from 'react'
import { resolveActive, sectionOrder } from '../game/activeStage'

const START = { phase: 'start', stageId: null, index: -1 }

/**
 * Which part of the race the visitor is in, judged by the sections crossing
 * a thin band through the middle of the viewport. Tracks every section in the
 * band (entering and leaving) so a small back-scroll restores the earlier one.
 */
export default function useActiveStage(stageIds) {
  const [active, setActive] = useState(START)
  const key = stageIds.join(',')

  useEffect(() => {
    const ids = key.split(',')
    const visible = new Set()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        const next = resolveActive(visible, ids)
        if (next) setActive(next)
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )

    for (const id of sectionOrder(ids)) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [key])

  return active
}
