import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import styles from './Art.module.css'
import { getArtworks } from '../../services/api'

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function Art() {
  const [data, setData] = useState(null)
  const [selected, setSelected] = useState(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  useEffect(() => {
    getArtworks().then(setData)
  }, [])

  return (
    <section id="art" className={styles.section} ref={ref}>
      {!data ? null : (
        <>
          <div className={styles.sectionHeader}>
            <motion.span
              className={styles.tag}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={styles.tagIcon}>🎨</span> ART & PAINTING
            </motion.span>
            <motion.h2
              className={styles.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              The Gallery
            </motion.h2>
          </div>

          {/* Stats */}
          <motion.div
            className={styles.statsRow}
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

          {/* Masonry grid */}
          <div className={styles.grid}>
            {data.pieces.map((piece, i) => (
              <motion.div
                key={piece.title}
                className={`${styles.card} ${i % 3 === 0 ? styles.cardTall : ''}`}
                custom={i}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                onClick={() => setSelected(piece)}
              >
                <div className={styles.cardArt} style={piece.css} />
                <div className={styles.cardShimmer} />
                <div className={styles.cardOverlay}>
                  <h4 className={styles.cardTitle}>{piece.title}</h4>
                  <span className={styles.cardMedium}>{piece.medium}</span>
                  <span className={styles.cardYear}>{piece.year}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Lightbox */}
          <AnimatePresence>
            {selected && (
              <motion.div
                className={styles.lightbox}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelected(null)}
              >
                <motion.div
                  className={styles.lightboxContent}
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={styles.lightboxArt} style={selected.css} />
                  <div className={styles.lightboxInfo}>
                    <h3 className={styles.lightboxTitle}>{selected.title}</h3>
                    <p className={styles.lightboxMedium}>{selected.medium}</p>
                    <p className={styles.lightboxYear}>{selected.year}</p>
                  </div>
                  <button className={styles.lightboxClose} onClick={() => setSelected(null)}>
                    ✕
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </section>
  )
}
