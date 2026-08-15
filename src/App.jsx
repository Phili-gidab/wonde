import ConstructionBanner from './components/ConstructionBanner.jsx'
import Hero from './components/Hero.jsx'
import Highlights from './components/Highlights.jsx'
import TrustStrip from './components/TrustStrip.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <ConstructionBanner />
      <Hero />
      <main className="wrap">
        <Highlights />
        <TrustStrip />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
