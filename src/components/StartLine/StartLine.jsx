import styles from './StartLine.module.css'
import { career } from '../../data/career'

export default function StartLine({ onStart }) {
  const { headline } = career

  return (
    <section id="start" className={styles.start} aria-labelledby="start-title">
      <div className={`pixel-panel ${styles.titleCard}`}>
        <p className={styles.player}>1P · {career.location.toUpperCase()}</p>
        <h1 id="start-title" className={styles.logo}>
          <span>BIKASH</span> <span>RAMTEL</span>
        </h1>
        <p className={`pixel-heading ${styles.subtitle}`}>{career.title}</p>
        <p className={styles.headline}>
          {headline.role} <span className={styles.at}>@</span> {headline.company}
        </p>

        <ul className={styles.stats}>
          {headline.stats.map(stat => (
            <li key={stat.label} className={styles.stat}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </li>
          ))}
        </ul>

        <button type="button" className={`pixel-btn ${styles.startBtn}`} onClick={onStart}>
          Press start <span className="blink" aria-hidden="true">▶</span>
        </button>
      </div>

      <p className={`pixel-panel ${styles.summary}`}>{career.summary}</p>
    </section>
  )
}
