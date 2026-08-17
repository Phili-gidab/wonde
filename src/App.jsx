import { useEffect, useMemo, useState } from 'react'
import Scene from './three/Scene.jsx'
import { useScrollProgress, usePrefersReducedMotion } from './three/useScrollProgress.js'
import Nav from './components/Nav.jsx'
import Chapters from './components/Chapters.jsx'
import Footer from './components/Footer.jsx'
import CallBar from './components/CallBar.jsx'
import Loader from './components/Loader.jsx'

/**
 * Cheap capability check. Post-processing and shadows roughly double frame
 * cost, which is fine on a laptop GPU and not fine on a mid-range phone -
 * and phones are most of this audience.
 */
function detectQuality() {
  if (typeof window === 'undefined') return 'high'

  const cores = navigator.hardwareConcurrency ?? 4
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const narrow = window.innerWidth < 900

  if (coarse && narrow) return 'low'
  if (cores <= 4) return 'low'
  return 'high'
}

export default function App() {
  const { progress, chapter } = useScrollProgress()
  const reducedMotion = usePrefersReducedMotion()
  const quality = useMemo(detectQuality, [])
  const [ready, setReady] = useState(false)

  // Lock scrolling until the model is in, so the first thing anyone sees is a
  // composed shot rather than an empty stage.
  useEffect(() => {
    document.body.classList.toggle('is-loading', !ready)
    return () => document.body.classList.remove('is-loading')
  }, [ready])

  return (
    <>
      <div className="stage" aria-hidden="true">
        <Scene progress={progress} reducedMotion={reducedMotion} quality={quality} />
        <div className="stage-grade" />
      </div>

      <Loader onReady={() => setReady(true)} />

      <div className="overlay">
        <Nav chapter={chapter} />
        <Chapters chapter={chapter} />
        <Footer />
      </div>

      <CallBar />
    </>
  )
}
