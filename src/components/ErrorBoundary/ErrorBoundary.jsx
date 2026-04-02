import { Component } from 'react'
import styles from './ErrorBoundary.module.css'

const funnyMessages = [
  { icon: '🤕', text: 'I stumbled and fell down. Help me get back up!', btn: 'Pick me up' },
  { icon: '💀', text: 'YOU DIED.', btn: 'Respawn' },
  { icon: '🫠', text: 'This section melted. Let me pull myself together.', btn: 'Reassemble' },
  { icon: '👻', text: 'This section ghosted us. Awkward.', btn: 'Summon it back' },
  { icon: '🧊', text: 'Brain freeze! Give me a sec...', btn: 'Defrost' },
  { icon: '🪦', text: 'RIP this section. Press F to pay respects.', btn: 'Press F' },
  { icon: '🍜', text: 'Went to grab ramen. Be right back.', btn: 'Call them back' },
  { icon: '😵‍💫', text: 'Critical hit! This section took too much damage.', btn: 'Use potion' },
]

function getRandomMessage() {
  return funnyMessages[Math.floor(Math.random() * funnyMessages.length)]
}

/**
 * Catches render errors in child components so a single broken section
 * doesn't white-screen the entire site. Wraps each section individually.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: null }
  }

  static getDerivedStateFromError() {
    return { hasError: true, message: getRandomMessage() }
  }

  componentDidCatch(error, info) {
    console.error(`[${this.props.name || 'Section'}] Error:`, error, info)
  }

  render() {
    if (this.state.hasError) {
      const { icon, text, btn } = this.state.message
      return (
        <section className={styles.fallback}>
          <span className={styles.icon}>{icon}</span>
          <p className={styles.text}>{text}</p>
          <button
            className={styles.retry}
            onClick={() => this.setState({ hasError: false, message: null })}
          >
            {btn}
          </button>
        </section>
      )
    }

    return this.props.children
  }
}
