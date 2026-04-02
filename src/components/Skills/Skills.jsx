import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './Skills.module.css'
import { getSkills } from '../../services/api'

const catVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
}

const chipVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.03, duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function Skills() {
  const [data, setData] = useState(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  useEffect(() => {
    getSkills().then(setData)
  }, [])

  return (
    <section id="skills" className={styles.section} ref={ref}>
      {!data ? null : (
        <>
          <div className={styles.sectionHeader}>
            <motion.span
              className={styles.tag}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={styles.tagIcon}>💻</span> SKILLS & TECH
            </motion.span>
            <motion.h2
              className={styles.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              The Stack
            </motion.h2>
            <motion.p
              className={styles.tagline}
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              {data.tagline}
            </motion.p>
          </div>

          {/* Currently working at */}
          {data.currentWork && (
            <motion.a
              href={data.currentWork.url}
              target="_blank"
              rel="noreferrer"
              className={styles.currentWork}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
            >
              <div className={styles.currentWorkBadge}>
                <span className={styles.liveIcon} />
                CURRENTLY AT
              </div>
              <div className={styles.currentWorkBody}>
                <div className={styles.currentWorkInfo}>
                  <img
                    src="/images/Portpro.png"
                    alt={data.currentWork.company}
                    className={styles.currentWorkName}
                  />
                  <span className={styles.currentWorkRole}>{data.currentWork.role}</span>
                  <p className={styles.currentWorkDesc}>{data.currentWork.description}</p>
                </div>
                {data.currentWork.logo && (
                  <img
                    src={data.currentWork.logo}
                    alt={data.currentWork.company}
                    className={styles.currentWorkLogo}
                  />
                )}
              </div>
              <span className={styles.currentWorkLink}>
                Visit {data.currentWork.company} →
              </span>
            </motion.a>
          )}

          {/* Stats */}
          <motion.div
            className={styles.statsBar}
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            {Object.entries(data.stats).map(([key, val]) => (
              <div key={key} className={styles.stat}>
                <span className={styles.statValue}>{val}</span>
                <span className={styles.statLabel}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
            ))}
          </motion.div>

          {/* Skill categories — chip layout */}
          <div className={styles.grid}>
            {data.categories.map((cat, ci) => (
              <motion.div
                key={cat.title}
                className={styles.card}
                custom={ci}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                variants={catVariants}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>{cat.icon}</span>
                  <h3 className={styles.cardTitle}>{cat.title}</h3>
                </div>
                <div className={styles.chips}>
                  {cat.items.map((skill, si) => (
                    <motion.span
                      key={skill}
                      className={styles.chip}
                      data-tier={cat.title}
                      custom={si}
                      initial="hidden"
                      animate={inView ? 'visible' : 'hidden'}
                      variants={chipVariants}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
