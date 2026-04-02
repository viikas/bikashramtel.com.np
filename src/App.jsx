import Navbar         from './components/Navbar/Navbar'
import ErrorBoundary  from './components/ErrorBoundary/ErrorBoundary'
import Hero           from './components/Hero/Hero'
import Gaming         from './components/Gaming/Gaming'
import DIY            from './components/DIY/DIY'
import Anime          from './components/Anime/Anime'
import Movies         from './components/Movies/Movies'
import About          from './components/About/About'
import Art            from './components/Art/Art'
import Skills         from './components/Skills/Skills'
import Footer         from './components/Footer/Footer'

export default function App() {
  return (
    <>
      <a href="#main" className="sr-only" style={{ position: 'absolute', top: 0, left: 0, zIndex: 9999, padding: '12px 24px', background: 'var(--amber)', color: 'var(--bg)', fontWeight: 700 }}>
        Skip to content
      </a>
      <Navbar />
      <main id="main" role="main">
        <ErrorBoundary name="Hero"><Hero /></ErrorBoundary>
        <ErrorBoundary name="Gaming"><Gaming /></ErrorBoundary>
        <ErrorBoundary name="DIY"><DIY /></ErrorBoundary>
        <ErrorBoundary name="Anime"><Anime /></ErrorBoundary>
        <ErrorBoundary name="Movies"><Movies /></ErrorBoundary>
        <ErrorBoundary name="Art"><Art /></ErrorBoundary>
        <ErrorBoundary name="Skills"><Skills /></ErrorBoundary>
        <ErrorBoundary name="About"><About /></ErrorBoundary>
      </main>
      <Footer />
    </>
  )
}
