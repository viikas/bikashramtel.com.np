import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ArtCanvas from './ArtCanvas'
import styles from './Hero.module.css'
import { slides } from '../../data/slides'

const INTERVAL = 5800

/* Framer Motion variants */
const contentVariants = {
  enter: { opacity: 0, y: 28 },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -18,
    transition: { duration: 0.35, ease: [0.55, 0, 1, 0.45] },
  },
}

const tagVariants = {
  enter:  { opacity: 0, x: -12 },
  center: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] } },
  exit:   { opacity: 0, x: 12,  transition: { duration: 0.25 } },
}

const imageVariants = {
  enter:  { opacity: 0, scale: 1.06 },
  center: { opacity: 1, scale: 1,    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
  exit:   { opacity: 0, scale: 0.98, transition: { duration: 0.55 } },
}

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const timerRef = useRef(null)

  const goTo = (idx) => {
    setDirection(idx > current ? 1 : -1)
    setCurrent(idx)
    resetTimer()
  }

  const resetTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length)
      setDirection(1)
    }, INTERVAL)
  }

  useEffect(() => {
    resetTimer()
    return () => clearInterval(timerRef.current)
  }, [])

  const slide = slides[current]

  return (
    <section className={styles.hero} id="home">
      {/* Background image with AnimatePresence */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${current}`}
          className={styles.slideBg}
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          <img src={slide.image} alt={slide.tag} loading="eager" />
        </motion.div>
      </AnimatePresence>

      {/* Dark overlay */}
      <div className={styles.overlay} />

      {/* p5.js algorithmic art */}
      <ArtCanvas style={{ zIndex: 3 }} />

      {/* Slide content */}
      <div className={styles.content}>
        <AnimatePresence mode="wait">
          <motion.div key={`tag-${current}`} variants={tagVariants} initial="enter" animate="center" exit="exit">
            <div className={styles.tag}>
              <span className={styles.tagDot} />
              {slide.tag}
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.h1
            key={`title-${current}`}
            className={styles.title}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            dangerouslySetInnerHTML={{
              __html: slide.title.replace(
                /<span class="titleAccent">/g,
                `<span style="color:var(--amber);font-style:italic;">`
              ),
            }}
          />
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={`desc-${current}`}
            className={styles.desc}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ delay: 0.08 }}
          >
            {slide.desc}
          </motion.p>
        </AnimatePresence>

      </div>

      {/* Dot navigation */}
      <div className={styles.controls}>
        {slides.map((_, i) => (
          <motion.button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => goTo(i)}
            whileHover={{ opacity: 0.8 }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide counter watermark */}
      <motion.div
        className={styles.counter}
        key={`counter-${current}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {String(current + 1).padStart(2, '0')}
      </motion.div>

      {/* Progress bar */}
      <motion.div
        className={styles.progress}
        key={`progress-${current}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
        style={{ width: '100%' }}
      />
    </section>
  )
}
