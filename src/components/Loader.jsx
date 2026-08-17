import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { BRAND } from '../content.js'

/**
 * Load curtain.
 *
 * `useProgress` reads three's DefaultLoadingManager, so this works outside the
 * Canvas. We hold the curtain briefly after 100% to let the first frame render
 * and the camera settle, otherwise the reveal lands on a half-lit frame.
 */
export default function Loader({ onReady }) {
  const { progress, active } = useProgress()
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (active || progress < 100) return

    const timer = setTimeout(() => {
      setHidden(true)
      onReady?.()
    }, 420)

    return () => clearTimeout(timer)
  }, [active, progress, onReady])

  return (
    <div className={`loader${hidden ? ' is-hidden' : ''}`} aria-hidden={hidden}>
      <div className="loader-inner">
        <p className="loader-brand">{BRAND.mark}</p>
        <p className="loader-am">{BRAND.am}</p>

        <div className="loader-track">
          <div className="loader-fill" style={{ transform: `scaleX(${progress / 100})` }} />
        </div>

        <p className="loader-pct">{Math.round(progress)}%</p>
      </div>
    </div>
  )
}
