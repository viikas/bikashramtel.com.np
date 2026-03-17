import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './Footer.module.css'
import { socialLinks, contactInfo } from '../../data/contact'

const colVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function Footer() {
  const ref     = useRef(null)
  const inView  = useInView(ref, { once: true, margin: '-60px' })

  const scrollTo = (href) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer id="contact" className={styles.footer} ref={ref}>
      <div className={`glow-orb ${styles.footerOrb}`} />

      <div className={styles.top}>
        {/* Brand */}
        <motion.div
          className={styles.brand}
          custom={0}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={colVariants}
        >
          <span className={styles.logo}>
            Bikash <span className={styles.logoAccent}>Ramtel</span>
          </span>
          <p className={styles.tagline}>
            Passionate developer building digital experiences that matter.
            Always open to new challenges and collaborations.
          </p>
          <div className={styles.social}>
            {socialLinks.map((s) => (
              <motion.a
                key={s.label}
                href={s.url}
                title={s.label}
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                aria-label={s.label}
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d={s.iconPath} />
                </svg>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          className={styles.col}
          custom={1}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={colVariants}
        >
          <h4 className={styles.colTitle}>Navigation</h4>
          {[
            { label: 'Home',     href: '#home' },
            { label: 'Services', href: '#services' },
          ].map((link) => (
            <button
              key={link.href}
              className={styles.link}
              onClick={() => scrollTo(link.href)}
            >
              {link.label}
            </button>
          ))}
        </motion.div>

        {/* Contact */}
        <motion.div
          className={styles.col}
          custom={2}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={colVariants}
        >
          <h4 className={styles.colTitle}>Contact</h4>
          {contactInfo.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={styles.link}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noreferrer' : undefined}
            >
              {item.label}
            </a>
          ))}
        </motion.div>
      </div>

      {/* Bottom bar */}
      <motion.div
        className={styles.bottom}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <p className={styles.copy}>© 2026 Bikash Ramtel. All rights reserved.</p>
        <p className={styles.credit}>
          Designed & built with ♥ by{' '}
          <a href="https://bikashramtel.com.np" target="_blank" rel="noreferrer">
            Bikash Ramtel
          </a>
        </p>
      </motion.div>
    </footer>
  )
}
