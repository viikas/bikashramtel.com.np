import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ArtCanvas from './ArtCanvas'
import styles from './Hero.module.css'

const identities = [
  { text: 'Gamer',     color: 'var(--amber)' },
  { text: 'Otaku',     color: 'var(--teal)' },
  { text: 'Tinkerer',  color: 'var(--ember)' },
  { text: 'Cinephile', color: 'var(--amber)' },
  { text: 'Painter',   color: 'var(--teal)' },
  { text: 'Developer', color: 'var(--ember)' },
]

const CYCLE_INTERVAL = 2200

export default function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % identities.length),
      CYCLE_INTERVAL,
    )
    return () => clearInterval(timer)
  }, [])

  const identity = identities[index]

  return (
    <section className={styles.hero} id="home">
      {/* Gradient backdrop */}
      <div className={styles.backdrop} />

      {/* Scanline overlay */}
      <div className={styles.scanlines} />

      {/* p5.js algorithmic art */}
      <ArtCanvas style={{ zIndex: 2 }} />

      {/* Grid pattern */}
      <div className={styles.grid} />

      {/* Content */}
      <div className={styles.content}>
        {/* Status indicator */}
        <motion.div
          className={styles.status}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.statusDot} />
          <span className={styles.statusText}>ONLINE</span>
        </motion.div>

        {/* Main heading */}
        <motion.div
          className={styles.heading}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className={styles.name}>Bikash Ramtel</h1>

          <div className={styles.identityRow}>
            <span className={styles.iAm}>I am a </span>
            <div className={styles.identitySlot}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={identity.text}
                  className={styles.identity}
                  style={{ color: identity.color }}
                  initial={{ y: 30, opacity: 0, filter: 'blur(8px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: -30, opacity: 0, filter: 'blur(8px)' }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {identity.text}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Building things IRL & in code from Kathmandu, Nepal.
          <br />
          Soulslike enthusiast. One Piece faithful. Maker of random things.
        </motion.p>

        {/* Quick identity badges */}
        <motion.div
          className={styles.badges}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {identities.map((id, i) => (
            <motion.span
              key={id.text}
              className={`${styles.badge} ${i === index ? styles.badgeActive : ''}`}
              style={i === index ? { borderColor: id.color, color: id.color } : {}}
              whileHover={{ scale: 1.05, y: -2 }}
              onClick={() => setIndex(i)}
            >
              {id.text}
            </motion.span>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className={styles.scrollHint}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <motion.div
            className={styles.scrollLine}
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className={styles.scrollLabel}>SCROLL</span>
        </motion.div>
      </div>

      {/* Decorative corner elements */}
      <div className={`${styles.corner} ${styles.cornerTL}`} />
      <div className={`${styles.corner} ${styles.cornerBR}`} />

      {/* Bottom progress accent */}
      <motion.div
        className={styles.accentBar}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      />
    </section>
  )
}
