import { useSyncExternalStore } from 'react'
import styles from './Hud.module.css'
import { career } from '../../data/career'
import { checkpointPercents, markerPercent, hudLabel } from '../../game/course'
import { subscribeMph, currentMph } from '../../game/telemetry'

const { stages } = career
const CHECKPOINTS = checkpointPercents(stages.length)

// Live reading from the road canvas; decorative, so hidden from screen readers.
function Speedometer() {
  const mph = useSyncExternalStore(subscribeMph, currentMph, () => 0)
  return (
    <span className={styles.mph} aria-hidden="true">
      {String(mph).padStart(3, '0')}<span className={styles.mphUnit}>MPH</span>
    </span>
  )
}

export default function Hud({ phase, stageId, index }) {
  const stage = stages.find(s => s.id === stageId) ?? null
  const marker = markerPercent(index, stages.length, phase)
  const label = hudLabel(phase, stage)
  const loadout = phase === 'start' ? 'READY' : phase === 'finish' ? 'ALL SYSTEMS' : stage.loadout.join(' · ')

  return (
    <nav className={styles.hud} aria-label="Course">
      <div className={`${styles.box} ${styles.xp}`}>
        <div className={styles.xpTop}>
          <span className={styles.boxLabel}>XP · 12+ YRS</span>
          <Speedometer />
        </div>
        <div className={styles.gauge} aria-hidden="true">
          <div className={styles.gaugeFill} style={{ width: `${Math.max(marker, 4)}%` }} />
        </div>
      </div>

      <div className={`${styles.box} ${styles.course}`}>
        <span className={styles.courseLabel} data-hud-label>{label}</span>
        <div className={styles.track}>
          <span className={styles.marker} style={{ left: `${marker}%` }} aria-hidden="true" />
          {stages.map((s, i) => {
            const state = i === index && phase === 'stage' ? 'current' : (phase === 'finish' || i < index ? 'passed' : 'ahead')
            return (
              <a
                key={s.id}
                href={`#stage-${s.id}`}
                className={`${styles.checkpoint} ${styles[state]}`}
                style={{ left: `${CHECKPOINTS[i]}%` }}
                aria-label={`Stage ${s.number}: ${s.company}`}
                aria-current={state === 'current' ? 'step' : undefined}
              >
                {s.number}
              </a>
            )
          })}
        </div>
      </div>

      <div className={`${styles.box} ${styles.loadout}`}>
        <span className={styles.boxLabel}>LOADOUT</span>
        <span className={styles.loadoutText}>{loadout}</span>
      </div>
    </nav>
  )
}
