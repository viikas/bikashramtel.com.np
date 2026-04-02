import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ArtCanvas from './ArtCanvas'
import styles from './Hero.module.css'

const identities = [
  {
    text: 'Gamer', color: 'var(--amber)', icon: '🎮',
    desc: "Games are more than entertainment — they're art, story, and adventure. Whether I'm surviving the open plains of Red Dead Redemption 2, building empires in Minecraft, or dropping into a PUBG battleground, every session is a story worth telling.",
    stats: [
      { label: 'Hours Played', value: '2,400+' },
      { label: 'Fav Genre', value: 'Open World' },
      { label: 'Platform', value: 'PC' },
      { label: 'Now Playing', value: 'Red Dead Redemption 2' },
    ],
  },
  {
    text: 'Otaku', color: 'var(--teal)', icon: '⚔️',
    desc: "Anime isn't just animation — it's philosophy, emotion, and breathtaking storytelling. Currently sailing the seas with One Piece and diving deep into the lore of the Fate series. Manga, light novels, and late-night episode marathons are a core part of who I am.",
    stats: [
      { label: 'Anime Watched', value: '120+' },
      { label: 'Manga Read', value: '45+' },
      { label: 'Fav Studio', value: 'MAPPA' },
      { label: 'Watching', value: 'One Piece' },
    ],
  },
  {
    text: 'Tinkerer', color: 'var(--ember)', icon: '🔧',
    desc: "Circuits, soldering irons, and sheer curiosity — that's my workshop. I love hacking together electronic gadgets, building drones from scratch, and experimenting with robotics. Right now I'm crafting a bamboo bow and arrow entirely by hand. Because why not?",
    stats: [
      { label: 'Projects', value: '18+' },
      { label: 'Fav Tool', value: 'Soldering Iron' },
      { label: 'Building', value: 'Bamboo Bow' },
      { label: 'Style', value: 'DIY or Die' },
    ],
  },
  {
    text: 'Cinephile', color: 'var(--amber)', icon: '🎬',
    desc: "A devoted fan of sci-fi, thrillers, and gripping dramas that make you think long after the credits roll. Recently captivated by A Knight of the Seven Kingdoms, Predator, and the mind-bending scope of 3 Body Problem.",
    stats: [
      { label: 'Movies Seen', value: '500+' },
      { label: 'TV Shows', value: '60+' },
      { label: 'Fav Director', value: 'Nolan' },
      { label: 'Watching', value: '7 Kingdoms' },
    ],
  },
  {
    text: 'Artist', color: 'var(--teal)', icon: '🎨',
    desc: "Putting color on canvas when the mood strikes. Semi-abstract vibes. Taking Pictures of the world around me.",
    stats: [
      { label: 'Paintings', value: '24' },
      { label: 'Medium', value: 'Acrylic' },
      { label: 'Style', value: 'Semi-Abstract' },
      { label: 'Also', value: 'Photography' },
    ],
  },
  {
    text: 'Developer', color: 'var(--ember)', icon: '💻',
    desc: "I design and build resilient distributed systems with a passion for clean architecture. From crafting LLM-powered backends with Node.js to engineering real-time AI pipelines — I thrive where deep system design meets cutting-edge technology.",
    stats: [
      { label: 'Experience', value: '12+ yrs' },
      { label: 'Stack', value: 'React / Node' },
      { label: 'Focus', value: 'AI / LLMs' },
      { label: 'Company', value: 'PortPro' },
    ],
  },
]

const CYCLE_INTERVAL = 4200

// Fan spread positions: rotation and offset for each card relative to active
function getCardTransform(cardIndex, activeIndex, total) {
  const diff = cardIndex - activeIndex
  // Wrap around for circular distance
  let offset = diff
  if (offset > total / 2) offset -= total
  if (offset < -total / 2) offset += total

  const isActive = offset === 0
  const rotation = offset * 8
  const translateX = offset * 38
  const translateY = Math.abs(offset) * 12
  const scale = isActive ? 1 : 0.88 - Math.abs(offset) * 0.03
  const zIndex = total - Math.abs(offset)
  const opacity = isActive ? 1 : Math.max(0.25, 0.7 - Math.abs(offset) * 0.15)

  return { rotation, translateX, translateY, scale, zIndex, opacity, isActive }
}

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

  const handleScroll = () => {
    const main = document.getElementById('gaming')
    if (main) main.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className={styles.hero} id="home">
      <div className={styles.backdrop} />
      <div className={styles.scanlines} />
      <ArtCanvas style={{ zIndex: 2 }} />
      <div className={styles.grid} />

      <div className={styles.heroInner}>
        {/* Left — Content */}
        <div className={styles.content}>
          <motion.div
            className={styles.status}
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.statusDot} />
            <span className={styles.statusText}>ONLINE</span>
          </motion.div>

          <div className={styles.heading}>
            <motion.h1
              className={styles.name}
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Bikash Ramtel
            </motion.h1>
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
          </div>

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

          <div className={styles.ctaRow}>
            <motion.button
              className={styles.cta}
              onClick={handleScroll}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Lets Go!!
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17l9.2-9.2M17 17V7.8H7.8" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Right — Fanned card spread */}
        <div className={styles.cardSide}>
          <div className={styles.cardFan}>
            {identities.map((id, i) => {
              const t = getCardTransform(i, index, identities.length)
              return (
                <motion.div
                  key={id.text}
                  className={`${styles.playerCard} ${t.isActive ? styles.playerCardActive : ''}`}
                  style={{ '--card-color': id.color, zIndex: t.zIndex }}
                  animate={{
                    rotate: t.rotation,
                    x: t.translateX,
                    y: t.translateY,
                    scale: t.scale,
                    opacity: t.opacity,
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setIndex(i)}
                  whileHover={!t.isActive ? { y: t.translateY - 10, scale: t.scale + 0.03 } : {}}
                >
                  {/* Card header */}
                  <div className={styles.cardHead}>
                    <span className={styles.cardIcon}>{id.icon}</span>
                    <div>
                      <div className={styles.cardClass} style={{ color: id.color }}>
                        {id.text}
                      </div>
                      <div className={styles.cardName}>Bikash Ramtel</div>
                    </div>
                  </div>

                  {/* Stats — only visible on active card */}
                  <div className={styles.cardStats}>
                    {id.stats.map((stat) => (
                      <div key={stat.label} className={styles.cardStat}>
                        <span className={styles.cardStatValue}>{stat.value}</span>
                        <span className={styles.cardStatLabel}>{stat.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* XP bar */}
                  <div className={styles.xpSection}>
                    <div className={styles.xpLabel}>
                      <span>LVL 30</span>
                      <span style={{ color: id.color }}>12+ YRS</span>
                    </div>
                    <div className={styles.xpTrack}>
                      <motion.div
                        className={styles.xpFill}
                        style={{ background: id.color }}
                        animate={{ scaleX: t.isActive ? 0.78 : 0.3 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className={styles.scrollHint}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <motion.svg
          className={styles.scrollChevron}
          width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
        <span className={styles.scrollLabel}>SCROLL</span>
      </motion.div>

      <div className={`${styles.corner} ${styles.cornerTL}`} />
      <div className={`${styles.corner} ${styles.cornerBR}`} />

      <motion.div
        className={styles.accentBar}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
    </section>
  )
}
