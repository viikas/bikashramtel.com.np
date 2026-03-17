import Navbar   from './components/Navbar/Navbar'
import Hero     from './components/Hero/Hero'
import Services from './components/Services/Services'
import Footer   from './components/Footer/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
      </main>
      <Footer />
    </>
  )
}
