import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Listings from './components/Listings.jsx'
import Offer from './components/Offer.jsx'
import Pillars from './components/Pillars.jsx'
import Why from './components/Why.jsx'
import Delivered from './components/Delivered.jsx'
import Commercial from './components/Commercial.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import CallBar from './components/CallBar.jsx'

/**
 * A plain scrolling page. The listings lead, and the 4.6 million offer sits
 * directly under the posters so the price lands after the buyer has seen them.
 */
export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Listings />
        <Offer />
        <Pillars />
        <Why />
        <Delivered />
        <Commercial />
        <Contact />
      </main>
      <Footer />
      <CallBar />
    </>
  )
}
