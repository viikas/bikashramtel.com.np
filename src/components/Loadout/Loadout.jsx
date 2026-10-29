import styles from './Loadout.module.css'
import { loadout } from '../../data/loadout'

export default function Loadout() {
  return (
    <section id="loadout" className={styles.loadout} aria-labelledby="loadout-title">
      <div className={`pixel-panel ${styles.panel}`}>
        <h2 id="loadout-title" className={`pixel-heading ${styles.title}`}>Equipment</h2>
        <dl className={styles.grid}>
          {loadout.map(row => (
            <div key={row.category} className={styles.row}>
              <dt className={styles.category}>{row.category}</dt>
              <dd className={styles.items}>{row.items}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
