import { useEffect, useState } from 'react'
import styles from './FinishLine.module.css'
import { career } from '../../data/career'
import { socialLinks, contactInfo } from '../../data/contact'

export default function FinishLine() {
  const [count, setCount] = useState(9)

  useEffect(() => {
    if (count === 0) return
    const id = setTimeout(() => setCount(c => c - 1), 1000)
    return () => clearTimeout(id)
  }, [count])

  const linkProps = external => (external ? { target: '_blank', rel: 'noopener noreferrer' } : {})

  return (
    <section id="finish" className={styles.finish} aria-labelledby="finish-title">
      <div className={styles.flag} aria-hidden="true" />
      <div className={`pixel-panel ${styles.panel}`}>
        <h2 id="finish-title" className={`pixel-heading ${styles.title}`}>
          Continue? <span className={styles.count} aria-hidden="true">{count}</span>
        </h2>
        <p className={styles.lead}>Building something in logistics, tracking, or AI automation? Let's talk.</p>

        <ul className={styles.links}>
          {contactInfo.map(item => (
            <li key={item.href}>
              <a className={`pixel-btn ${styles.link}`} href={item.href} {...linkProps(item.external)}>
                {item.label}
              </a>
            </li>
          ))}
          {socialLinks.map(item => (
            <li key={item.url}>
              <a className={`pixel-btn ${styles.link} ${styles.social}`} href={item.url} {...linkProps(true)}>
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
                  <path d={item.iconPath} />
                </svg>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <p className={styles.education}>
          <span className={styles.eduLabel}>Education</span>
          {career.education.degree} · {career.education.school}
        </p>
      </div>
      <p className={styles.copy}>© {new Date().getFullYear()} {career.name}</p>
    </section>
  )
}
