import styles from './PitStop.module.css'
import { pitStop, quickFacts } from '../../data/pitstop'

export default function PitStop() {
  return (
    <section id="pit-stop" className={styles.pitStop} aria-labelledby="pit-stop-title">
      <div className={`pixel-panel ${styles.panel}`}>
        <h2 id="pit-stop-title" className={`pixel-heading ${styles.title}`}>Pit stop</h2>
        <p className={styles.intro}>Off the track.</p>

        <ul className={styles.list}>
          {pitStop.map(item => (
            <li key={item.label} className={styles.item}>
              <span className={styles.label}>{item.label}</span>
              <span>{item.line}</span>
            </li>
          ))}
        </ul>

        <ul className={styles.facts} aria-label="Quick facts">
          {quickFacts.map(fact => (
            <li key={fact.label} className={styles.fact}>
              <span className={styles.factValue}>{fact.value}</span>
              <span className={styles.factLabel}>{fact.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
