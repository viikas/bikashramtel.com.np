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
      <Navbar />
      <main>
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
