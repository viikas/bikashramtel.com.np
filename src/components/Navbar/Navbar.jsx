import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Navbar.module.css'

/* Desktop shows a curated set; mobile shows everything */
const desktopLinks = [
  { label: 'Gaming', href: '#gaming' },
  { label: 'Watchlist', href: '#anime' },
  { label: 'DIY',    href: '#diy' },
  { label: 'About',  href: '#about' },
  { label: 'Skills', href: '#skills' },
]

const allLinks = [
  { label: 'Home',   href: '#home' },
  { label: 'Gaming', href: '#gaming' },
  { label: 'DIY',    href: '#diy' },
  { label: 'Watchlist', href: '#anime' },
  { label: 'Movies', href: '#movies' },
  { label: 'About',  href: '#about' },
  { label: 'Art',    href: '#art' },
  { label: 'Skills', href: '#skills' },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLink = (href) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.nav
        className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <motion.div
          className={styles.logo}
          whileHover={{ scale: 1.02 }}
          onClick={() => handleLink('#home')}
        >
          Bikash <span className={styles.logoAccent}>Ramtel</span>
        </motion.div>

        {/* Desktop links */}
        <div className={styles.links}>
          {desktopLinks.map((link) => (
            <button
              key={link.href}
              className={styles.link}
              onClick={() => handleLink(link.href)}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerActive : ''}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </motion.nav>

      {/* Mobile overlay — shows all links */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {allLinks.map((link, i) => (
              <motion.button
                key={link.href}
                className={styles.mobileLink}
                onClick={() => handleLink(link.href)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
