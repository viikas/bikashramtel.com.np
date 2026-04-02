import { useRef, useState } from 'react'
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
  const [formState, setFormState] = useState('idle') // idle | sending | sent | error

  const scrollTo = (href) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.target
    const name = form.elements.name.value.trim()
    const email = form.elements.email.value.trim()
    const message = form.elements.message.value.trim()

    if (!name || !email || !message) return

    // Open mailto as fallback (replace with API endpoint when backend is ready)
    const subject = encodeURIComponent(`Message from ${name}`)
    const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`)
    window.open(`mailto:vramtel@gmail.com?subject=${subject}&body=${body}`)
    setFormState('sent')
    form.reset()
    setTimeout(() => setFormState('idle'), 3000)
  }

  return (
    <footer id="contact" className={styles.footer} ref={ref} role="contentinfo">
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
            Gamer. Otaku. Tinkerer. Painter. Also writes code for a living.
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
                aria-label={`${s.label} Profile`}
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
          <h4 className={styles.colTitle}>Explore</h4>
          {[
            { label: 'Gaming', href: '#gaming' },
            { label: 'DIY',    href: '#diy' },
            { label: 'Anime',  href: '#anime' },
            { label: 'Movies', href: '#movies' },
            { label: 'Art',    href: '#art' },
            { label: 'About',  href: '#about' },
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

        {/* Contact info + form */}
        <motion.div
          className={styles.col}
          custom={2}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={colVariants}
        >
          <h4 className={styles.colTitle}>Get in Touch</h4>
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

          {/* Contact form */}
          <form className={styles.form} onSubmit={handleSubmit} aria-label="Contact form">
            <input
              name="name"
              type="text"
              placeholder="Your name"
              className={styles.input}
              required
              aria-label="Your name"
            />
            <input
              name="email"
              type="email"
              placeholder="Your email"
              className={styles.input}
              required
              aria-label="Your email"
            />
            <textarea
              name="message"
              placeholder="Your message..."
              className={styles.textarea}
              rows={3}
              required
              aria-label="Your message"
            />
            <button type="submit" className={styles.formBtn} disabled={formState === 'sending'}>
              {formState === 'sent' ? 'Message Sent!' : 'Send Message'}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <motion.div
        className={styles.bottom}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <p className={styles.copy}>&copy; 2026 Bikash Ramtel. All rights reserved.</p>
        <p className={styles.credit}>
          Built with love & late nights by{' '}
          <a href="https://bikashramtel.com.np" target="_blank" rel="noreferrer">
            Bikash
          </a>
        </p>
      </motion.div>
    </footer>
  )
}
