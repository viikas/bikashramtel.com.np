import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ArtCanvas from './ArtCanvas'
import styles from './Hero.module.css'

const identities = [
  { text: 'Gamer',     color: 'var(--amber)', desc: "Games are more than entertainment — they're art, story, and adventure. Whether I'm surviving the open plains of Red Dead Redemption 2, building empires in Minecraft, or dropping into a PUBG battleground, every session is a story worth telling." },
  { text: 'Otaku',     color: 'var(--teal)',  desc: "Anime isn't just animation — it's philosophy, emotion, and breathtaking storytelling. Currently sailing the seas with One Piece and diving deep into the lore of the Fate series. Manga, light novels, and late-night episode marathons are a core part of who I am." },
  { text: 'Tinkerer',  color: 'var(--ember)', desc: "Circuits, soldering irons, and sheer curiosity — that's my workshop. I love hacking together electronic gadgets, building drones from scratch, and experimenting with robotics. Right now I'm crafting a bamboo bow and arrow entirely by hand." },
  { text: 'Cinephile', color: 'var(--amber)', desc: "A devoted fan of sci-fi, thrillers, and gripping dramas that make you think long after the credits roll. Recently captivated by A Knight of the Seven Kingdoms, Predator, and the mind-bending scope of 3 Body Problem." },
  { text: 'Painter',   color: 'var(--teal)',  desc: "Putting color on canvas when the mood strikes. Semi-abstract vibes." },
  { text: 'Developer', color: 'var(--ember)', desc: "I design and build resilient distributed systems with a passion for clean architecture. From crafting LLM-powered backends with Node.js to engineering real-time AI pipelines — I thrive where deep system design meets cutting-edge technology." },
]

const CYCLE_INTERVAL = 4200

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

        {/* Subtitle — changes with identity */}
        <div className={styles.subtitleWrap}>
          <AnimatePresence mode="wait">
            <motion.p
              key={identity.text}
              className={styles.subtitle}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {identity.desc}
            </motion.p>
          </AnimatePresence>
        </div>

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
