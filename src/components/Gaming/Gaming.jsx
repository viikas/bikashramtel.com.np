import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './Gaming.module.css'
import { getGaming } from '../../services/api'
import { fetchAllGameImages } from '../../services/images'
import { useImages } from '../../hooks/useImages'

const cardVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function Gaming() {
  const [data, setData] = useState(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const images = useImages(data?.favorites, fetchAllGameImages)

  useEffect(() => {
    getGaming().then(setData)
  }, [])

  return (
    <section id="gaming" className={styles.section} ref={ref}>
      {!data ? null : (
        <>
          <div className={styles.sectionHeader}>
            <motion.span
              className={styles.tag}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={styles.tagIcon}>🎮</span> GAMING
            </motion.span>
            <motion.h2
              className={styles.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              My Game Library
            </motion.h2>
          </div>

          {/* Currently playing highlight */}
          {data.currentlyPlaying && (
            <motion.div
              className={styles.nowPlaying}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.nowPlayingBg} style={{ background: data.currentlyPlaying.gradient }} />
              <div className={styles.nowPlayingContent}>
                <div className={styles.nowPlayingLabel}>
                  <span className={styles.liveIcon} />
                  NOW PLAYING
                </div>
                <h3 className={styles.nowPlayingTitle}>{data.currentlyPlaying.title}</h3>
                <div className={styles.nowPlayingMeta}>
                  <span className={styles.metaBadge}>{data.currentlyPlaying.platform}</span>
                  <span className={styles.metaHours}>{data.currentlyPlaying.hours}h played</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats bar */}
          <motion.div
            className={styles.statsBar}
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {Object.entries(data.stats).map(([key, val]) => (
              <div key={key} className={styles.stat}>
                <span className={styles.statValue}>{val}</span>
                <span className={styles.statLabel}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
            ))}
          </motion.div>

          {/* Horizontal scroll row */}
          <div className={styles.scrollContainer}>
            <div className={styles.scrollRow}>
              {data.favorites.map((game, i) => (
                <motion.div
                  key={game.title}
                  className={styles.card}
                  custom={i}
                  initial="hidden"
                  animate={inView ? 'visible' : 'hidden'}
                  variants={cardVariants}
                  whileHover={{ y: -8, scale: 1.03 }}
                >
                  <div className={styles.cardArt} style={{ background: game.gradient }}>
                    {images.get(game.title) && (
                      <img
                        src={images.get(game.title)}
                        alt={game.title}
                        className={styles.cardImage}
                        loading="lazy"
                      />
                    )}
                    <span className={styles.cardRating}>{game.rating}</span>
                  </div>
                  <div className={styles.cardInfo}>
                    <h4 className={styles.cardTitle}>{game.title}</h4>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardPlatform}>{game.platform}</span>
                      <span className={styles.cardGenre}>{game.genre}</span>
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
