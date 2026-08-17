import { useEffect, useRef, useState } from 'react'
import { chapterAt } from './cameraPath.js'

/**
 * Scroll position as a 0..1 ref, plus the active chapter index as state.
 *
 * Progress is measured across the **chapter track only** (`#chapter-track`),
 * not the whole document. The page continues past the last chapter into the
 * assurances strip, the commercial section and the footer; measuring against
 * document height would mean chapter 5 was still reporting ~50% when it filled
 * the screen, so it never became active and its copy stayed at opacity 0.
 *
 * Past the end of the track, progress pins at 1 and the camera simply holds
 * the final framing while the rest of the page is read.
 *
 * The raw progress is deliberately a ref, not state: the render loop reads it
 * every frame, and putting it in state would re-render the whole tree on every
 * scroll event. Only the chapter index - which changes a handful of times per
 * page - is state.
 */
export function useScrollProgress() {
  const progress = useRef(0)
  const [chapter, setChapter] = useState(0)

  useEffect(() => {
    let frame = 0

    const read = () => {
      frame = 0

      const track = document.getElementById('chapter-track')
      let value = 0

      if (track) {
        const top = track.getBoundingClientRect().top + window.scrollY
        // Each chapter is one viewport tall, so the usable travel is the
        // track height minus one viewport: that puts progress 0 on the first
        // chapter and 1 on the last, both fully framed.
        const span = track.offsetHeight - window.innerHeight
        value = span > 0 ? (window.scrollY - top) / span : 0
      }

      value = value < 0 ? 0 : value > 1 ? 1 : value
      progress.current = value

      const next = chapterAt(value)
      setChapter((current) => (current === next ? current : next))
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    // Fonts and the model both change layout height after first paint.
    const settle = setTimeout(read, 600)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      clearTimeout(settle)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return { progress, chapter }
}

/** Respects prefers-reduced-motion; we drop the camera animation when set. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)

    const onChange = (event) => setReduced(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}
