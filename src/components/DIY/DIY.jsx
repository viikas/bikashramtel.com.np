import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './DIY.module.css'
import { getDIYProjects } from '../../services/api'

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function DIY() {
  const [data, setData] = useState(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  useEffect(() => {
    getDIYProjects().then(setData)
  }, [])

  return (
    <section id="diy" className={styles.section} ref={ref}>
      {!data ? null : (
        <>
          <div className={styles.sectionHeader}>
            <motion.span
              className={styles.tag}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={styles.tagIcon}>🔧</span> DIY & TECH
            </motion.span>
            <motion.h2
              className={styles.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              The Workshop
            </motion.h2>
            <motion.p
              className={styles.desc}
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              {data.stats.motto}
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div
            className={styles.statsBar}
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {Object.entries(data.stats)
              .filter(([key]) => key !== 'motto')
              .map(([key, val]) => (
                <div key={key} className={styles.stat}>
                  <span className={styles.statValue}>{val}</span>
                  <span className={styles.statLabel}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
              ))}
          </motion.div>

          {/* Project cards */}
          <div className={styles.grid}>
            {data.projects.map((project, i) => (
              <motion.div
                key={project.title}
                className={styles.card}
                custom={i}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                variants={cardVariants}
                whileHover={{ y: -6 }}
              >
                <div className={styles.cardHeader} style={{ background: project.gradient }}>
                  <div className={styles.cardStatus} data-status={project.status}>
                    {project.status === 'In Progress' && <span className={styles.liveIcon} />}
                    {project.status}
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <h4 className={styles.cardTitle}>{project.title}</h4>
                  <p className={styles.cardDesc}>{project.description}</p>
                  <div className={styles.cardTags}>
                    {project.tags.map((tag) => (
                      <span key={tag} className={styles.cardTag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
