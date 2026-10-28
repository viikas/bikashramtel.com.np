import styles from './Stage.module.css'

export default function Stage({ stage, isCurrentLap = false }) {
  const titleId = `stage-${stage.id}-title`
  const meta = [stage.role, stage.place, stage.dates].filter(Boolean)

  return (
    <section id={`stage-${stage.id}`} className={styles.stage} aria-labelledby={titleId}>
      <article className={`pixel-panel ${styles.panel} ${isCurrentLap ? styles.current : ''}`}>
        {isCurrentLap && <span className={styles.ribbon}>Current lap</span>}

        <header className={styles.header}>
          <span className={styles.badge}>Stage {stage.number}</span>
          <h2 id={titleId} className={`pixel-heading ${styles.company}`}>{stage.company}</h2>
          <p className={styles.meta}>{meta.join(' · ')}</p>
        </header>

        <ul className={styles.bullets}>
          {stage.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}
        </ul>

        <ul className={styles.chips} aria-label="Stack">
          {stage.loadout.map(item => <li key={item} className={styles.chip}>{item}</li>)}
        </ul>
      </article>
    </section>
  )
}
