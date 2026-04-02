import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './About.module.css'
import { getAbout } from '../../services/api'

const factVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function About() {
  const [data, setData] = useState(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  useEffect(() => {
    getAbout().then(setData)
  }, [])

  return (
    <section id="about" className={styles.section} ref={ref}>
      <div className={`glow-orb ${styles.orb}`} />
      {!data ? null : (
        <>
          <div className={styles.sectionHeader}>
            <motion.span
              className={styles.tag}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={styles.tagIcon}>💻</span> ABOUT
            </motion.span>
            <motion.h2
              className={styles.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Who Am I?
            </motion.h2>
          </div>

          <div className={styles.content}>
            {/* Bio */}
            <motion.div
              className={styles.bio}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className={styles.tagline}>{data.tagline}</p>
              <p className={styles.bioText}>{data.bio}</p>
              <div className={styles.location}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {data.location}
              </div>
            </motion.div>

            {/* Quick facts grid */}
            <div className={styles.factsGrid}>
              {data.quickFacts.map((fact, i) => (
                <motion.div
                  key={fact.label}
                  className={styles.factCard}
                  custom={i}
                  initial="hidden"
                  animate={inView ? 'visible' : 'hidden'}
                  variants={factVariants}
                  whileHover={{ scale: 1.05, y: -4 }}
                >
                  <span className={styles.factValue}>{fact.value}</span>
                  <span className={styles.factLabel}>{fact.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}
