import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './Services.module.css'
import { services } from '../../data/services'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const cardVariants = {
  hidden:  { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

const headerVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
}

export default function Services() {
  const sectionRef  = useRef(null)
  const isInView    = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section id="services" className={styles.section} ref={sectionRef}>
      <div className={`glow-orb ${styles.orb}`} />

      {/* Header */}
      <motion.div
        className={styles.header}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={headerVariants}
      >
        <div className={styles.sectionTag}>Services</div>
        <h2 className={styles.sectionTitle}>
          What I <em>Do</em>
        </h2>
        <p className={styles.sectionSub}>
          Specialised skills that help turn your digital vision into something real.
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div
        className={styles.grid}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        {services.map((svc, i) => (
          <ServiceCard key={svc.id} svc={svc} index={i} total={services.length} />
        ))}
      </motion.div>
    </section>
  )
}

function ServiceCard({ svc, index, total }) {
  const tiltRef = useRef(null)

  const handleMouseMove = (e) => {
    const card = tiltRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    card.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`
  }

  const handleMouseLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = ''
  }

  return (
    <motion.div
      ref={tiltRef}
      className={styles.card}
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {index < total - 1 && <div className={styles.cardSeparator} />}

      <span className={styles.numLabel}>
        {String(svc.id).padStart(2, '0')}
      </span>

      <div className={styles.iconWrap}>{svc.icon}</div>

      <h3 className={styles.cardTitle}>{svc.title}</h3>
      <p className={styles.cardDesc}>{svc.desc}</p>

      <span className={styles.cardArrow}>
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </span>
    </motion.div>
  )
}
