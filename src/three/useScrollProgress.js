import { useEffect, useRef, useState } from 'react'

/**
 * Scroll position as a 0..1 ref, plus the active chapter index as state.
 *
 * Everything is derived from the sections' current rects, every frame. Two
 * earlier attempts cached measurements and both broke:
 *
 *   - Dividing the track into equal parts assumed every chapter was one
 *     viewport tall. The listings chapter is roughly six (its filmstrip
 *     scrolls sideways as you scroll down), so every chapter after it
 *     reported wrong.
 *   - Caching each section's absolute top and re-measuring on resize still
 *     went stale, because the listings section sets its own height in JS after
 *     the strip knows how wide it is. The rail then lagged a whole chapter
 *     behind on a sequential scroll.
 *
 * Reading five rects per frame is cheap, and it cannot go stale.
 *
 * `progress` is deliberately a ref, not state: the render loop reads it every
 * frame, and putting it in state would re-render the tree on every scroll
 * event. Only the chapter index - which changes a handful of times per page -
 * is state.
 */
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

export function useScrollProgress() {
  const progress = useRef(0)
  const [chapter, setChapter] = useState(0)

  useEffect(() => {
    let frame = 0

    const read = () => {
      frame = 0

      const sections = document.querySelectorAll('#chapter-track .ch')
      if (sections.length < 2) return

      const viewport = window.innerHeight
      const rects = []
      for (const section of sections) rects.push(section.getBoundingClientRect())

      // The last section whose top has passed the middle of the screen.
      let index = 0
      for (let i = 0; i < rects.length; i++) {
        if (rects[i].top <= viewport * 0.5) index = i
      }
      index = Math.min(index, rects.length - 2)

      // The camera holds on a chapter's keyframe for as long as that chapter
      // is on screen, then moves to the next one as the next section rises
      // through the viewport. That is what lets you read a tall section
      // without the building drifting the whole way down it.
      const local = clamp01((viewport - rects[index + 1].top) / viewport)

      progress.current = clamp01((index + local) / (rects.length - 1))

      const next = local > 0.5 ? index + 1 : index
      setChapter((current) => (current === next ? current : next))
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      if (frame) cancelAnimationFrame(frame)
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
