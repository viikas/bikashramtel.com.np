import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './Movies.module.css'
import { getMovies } from '../../services/api'
import { fetchAllMovieImages } from '../../services/images'
import { useImages } from '../../hooks/useImages'

const cardVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function Movies() {
  const [data, setData] = useState(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const images = useImages(data?.favorites, fetchAllMovieImages)

  useEffect(() => {
    getMovies().then(setData)
  }, [])

  return (
    <section id="movies" className={styles.section} ref={ref}>
      {!data ? null : (
        <>
          <div className={styles.sectionHeader}>
            <motion.span
              className={styles.tag}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={styles.tagIcon}>🎬</span> MOVIES & TV
            </motion.span>
            <motion.h2
              className={styles.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              What I Watch
            </motion.h2>
          </div>

          {/* Stats */}
          <motion.div
            className={styles.statsBar}
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            {Object.entries(data.stats).map(([key, val]) => (
              <div key={key} className={styles.stat}>
                <span className={styles.statValue}>{val}</span>
                <span className={styles.statLabel}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
            ))}
          </motion.div>

          {/* Currently watching */}
          {data.currentlyWatching && (
            <motion.div
              className={styles.nowWatching}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.nowWatchingBg} style={{ background: data.currentlyWatching.gradient }} />
              <div className={styles.nowWatchingContent}>
                <div className={styles.nowLabel}>
                  <span className={styles.liveIcon} />
                  CURRENTLY WATCHING
                </div>
                <h3 className={styles.nowTitle}>{data.currentlyWatching.title}</h3>
                <span className={styles.nowType}>{data.currentlyWatching.type}</span>
              </div>
            </motion.div>
          )}

          {/* Horizontal scroll row */}
          <div className={styles.scrollContainer}>
            <div className={styles.scrollRow}>
              {data.favorites.map((item, i) => (
                <motion.div
                  key={item.title}
                  className={styles.card}
                  custom={i}
                  initial="hidden"
                  animate={inView ? 'visible' : 'hidden'}
                  variants={cardVariants}
                  whileHover={{ y: -8, scale: 1.03 }}
                >
                  <div className={styles.cardArt} style={{ background: item.gradient }}>
                    {images.get(item.title) && (
                      <img
                        src={images.get(item.title)}
                        alt={item.title}
                        className={styles.cardImage}
                        loading="lazy"
                      />
                    )}
                    <div className={styles.cardYear}>{item.year}</div>
                    <div className={styles.cardRating}>★ {item.rating}</div>
                  </div>
                  <div className={styles.cardInfo}>
                    <h4 className={styles.cardTitle}>{item.title}</h4>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardType}>{item.type}</span>
                      <span className={styles.cardGenre}>{item.genre}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}
