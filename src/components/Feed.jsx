import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { POSTS, UI } from '../content.js'
import { useLang } from '../i18n.jsx'

/**
 * Chapter 3 - the listings.
 *
 * A horizontal filmstrip; clicking a card opens a lightbox carrying that
 * post's full sales copy. That copy is what the client posts to Telegram and
 * it runs long - on the page it would bury the layout, so it lives one click
 * away. Pattern follows the gallery in the RTG project.
 *
 * Two design constraints:
 *
 * 1. Cards share one HEIGHT and keep their own width. The sources mix
 *    landscape aerials (1000x520) with portrait posters (1000x1250); a uniform
 *    box crops the poster artwork and slices the badges off the photos.
 *
 * 2. The posts are Temer's artwork in green and gold, which fights the page.
 *    They render in an amber duotone and return to their real colours on hover
 *    or tap. That grade is CSS, not baked into the files - reversing a filter
 *    is free, baking it would mean shipping every image twice.
 */

/** Some fields are plain strings (proper nouns); others are {en, am} pairs. */
function text(value, t) {
  return typeof value === 'string' ? value : t(value)
}

function Chevron({ back = false }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={back ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Post({ post, index, revealed, onReveal, onOpen }) {
  const { t } = useLang()

  const title = text(post.title, t)
  const place = text(post.place, t)
  const detail = text(post.detail, t)
  const kind = post.kind === 'built' ? t(UI.handedOver) : t(UI.offerNow)

  return (
    <figure className={`post${revealed ? ' is-revealed' : ''}`}>
      <button
        type="button"
        className="post-open"
        onClick={onOpen}
        onMouseEnter={onReveal}
        aria-label={`${title}, ${place}. ${t(UI.readPost)}`}
      >
        <span className="post-media">
          <img
            src={`/posts/${post.id}.webp`}
            width={post.w}
            height={post.h}
            loading="lazy"
            decoding="async"
            alt={`${title} - ${place}`}
          />
        </span>

        <span className="post-idx" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="post-kind">{kind}</span>

        <span className="post-meta">
          <span className="post-title">{title}</span>
          <span className="post-place">{place}</span>
          <span className="post-detail">{detail}</span>
          <span className="post-more">{t(UI.readPost)}</span>
        </span>
      </button>
    </figure>
  )
}


/**
 * Pinned filmstrip.
 *
 * On a wide pointer screen the section is made taller than the viewport and
 * its inner panel sticks; vertical scroll then translates the track sideways,
 * so all nine posts reveal as you scroll and the cards can be much larger than
 * a swipe strip allows.
 *
 * The section height is derived from the track width (travel + one viewport)
 * rather than hard-coded, so it stays correct at any card size or count.
 *
 * Touch and reduced-motion fall back to the native scroll-snap strip: pinning
 * hijacks the scroll, which is hostile on a phone and exactly what
 * prefers-reduced-motion asks us not to do.
 */
function usePinnedStrip(sectionRef, trackRef, enabled) {
  const [state, setState] = useState({ offset: 0, progress: 0 })

  useLayoutEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    if (!enabled) {
      section.style.height = ""
      setState({ offset: 0, progress: 0 })
      return
    }

    let frame = 0
    let travel = 0

    const measure = () => {
      travel = Math.max(0, track.scrollWidth - window.innerWidth)
      section.style.height = `${window.innerHeight + travel}px`
    }

    const read = () => {
      frame = 0
      // Read progress from the rect alone. Combining rect.top with
      // window.scrollY mixes two layout reads that can come from different
      // frames, which left the strip stale partway down and then snapping to
      // the end. rect.top goes negative as the section passes the viewport
      // top, so -rect.top is exactly how far we have scrolled into it.
      const scrolled = -section.getBoundingClientRect().top
      const local = travel > 0 ? scrolled / travel : 0
      const clamped = local < 0 ? 0 : local > 1 ? 1 : local
      setState({ offset: -clamped * travel, progress: clamped })
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(read)
    }

    const onResize = () => {
      measure()
      read()
    }

    measure()
    read()

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    const observer = new ResizeObserver(onResize)
    observer.observe(track)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      observer.disconnect()
      section.style.height = ""
    }
  }, [sectionRef, trackRef, enabled])

  return state
}

/** Pinning is a pointer-and-space affordance; phones keep native swipe. */
function useCanPin() {
  const [can, setCan] = useState(false)

  useEffect(() => {
    const query = window.matchMedia(
      "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    )
    setCan(query.matches)
    const onChange = (event) => setCan(event.matches)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])

  return can
}

export default function Feed() {
  const { t } = useLang()
  const track = useRef(null)
  const section = useRef(null)
  const dialog = useRef(null)

  const pinned = useCanPin()
  const { offset, progress } = usePinnedStrip(section, track, pinned)

  const [revealed, setRevealed] = useState(null)
  const [current, setCurrent] = useState(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  const readEdges = useCallback(() => {
    const el = track.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setEdges({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 })
  }, [])

  useEffect(() => {
    const el = track.current
    if (!el) return
    readEdges()
    el.addEventListener('scroll', readEdges, { passive: true })
    window.addEventListener('resize', readEdges)
    return () => {
      el.removeEventListener('scroll', readEdges)
      window.removeEventListener('resize', readEdges)
    }
  }, [readEdges])

  const nudge = (direction) => () => {
    const el = track.current
    if (!el) return
    const card = el.querySelector('.post')
    const step = card ? card.getBoundingClientRect().width + 14 : el.clientWidth * 0.8
    el.scrollBy({ left: step * direction, behavior: 'smooth' })
  }

  const openAt = (index) => {
    setCurrent(index)
    dialog.current?.showModal()
  }

  // Native <dialog> gives focus trapping, Escape and the backdrop for free;
  // we only add left/right stepping on top.
  const step = (direction) =>
    setCurrent((c) => (c === null ? c : (c + direction + POSTS.length) % POSTS.length))

  const post = current !== null ? POSTS[current] : null
  const title = post ? text(post.title, t) : ''
  const place = post ? text(post.place, t) : ''

  return (
    <div className={`feed-wrap${pinned ? " is-pinned" : ""}`} ref={section}>
      <div className="feed-pin">
      <div className="feed-head">
        <p className="feed-hint">{t(UI.trueColour)}</p>

        {pinned ? (
          <div className="feed-rail" aria-hidden="true">
            <span className="feed-count">
              {String(Math.max(1, Math.ceil(progress * POSTS.length))).padStart(2, "0")}
              {" / "}
              {String(POSTS.length).padStart(2, "0")}
            </span>
            <span className="feed-bar">
              <i style={{ transform: `scaleX(${progress})` }} />
            </span>
          </div>
        ) : (
        <div className="feed-nav">
          <button type="button" onClick={nudge(-1)} disabled={edges.start} aria-label={t(UI.prev)}>
            <Chevron back />
          </button>
          <button type="button" onClick={nudge(1)} disabled={edges.end} aria-label={t(UI.next)}>
            <Chevron />
          </button>
        </div>
        )}
      </div>

      <div
        className="feed"
        ref={track}
        style={pinned ? { transform: `translate3d(${offset}px, 0, 0)` } : undefined}
      >
        {POSTS.map((item, index) => (
          <Post
            key={item.id}
            post={item}
            index={index}
            revealed={revealed === item.id}
            onReveal={() => setRevealed(item.id)}
            onOpen={() => openAt(index)}
          />
        ))}
      </div>
      </div>

      <dialog
        className="lightbox"
        ref={dialog}
        onClose={() => setCurrent(null)}
        onClick={(event) => event.target === dialog.current && dialog.current.close()}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') step(1)
          if (event.key === 'ArrowLeft') step(-1)
        }}
        aria-label={post ? `${title} - ${place}` : undefined}
      >
        {post && (
          <div className="lb-in">
            <div className="lb-img">
              {/* Full colour in here: the poster is the subject now, not a
                  texture inside someone elses layout. */}
              <img src={`/posts/${post.id}.webp`} alt={`${title} - ${place}`} />
              <button
                type="button"
                className="lb-close"
                onClick={() => dialog.current?.close()}
                aria-label={t(UI.close)}
              >
                &#10005;
              </button>
            </div>

            <div className="lb-meta">
              <p className="lb-kind">{post.kind === 'built' ? t(UI.handedOver) : t(UI.offerNow)}</p>
              <h3 className="lb-title">{title}</h3>
              <p className="lb-place">{place}</p>

              <ul className="lb-lines">
                {post.lines?.map((line) => (
                  <li key={line.en}>{t(line)}</li>
                ))}
              </ul>

              <div className="lb-foot">
                <span className="lb-count">
                  {String(current + 1).padStart(2, '0')} / {String(POSTS.length).padStart(2, '0')}
                </span>
                <div className="lb-nav">
                  <button type="button" onClick={() => step(-1)} aria-label={t(UI.prev)}>
                    <Chevron back />
                  </button>
                  <button type="button" onClick={() => step(1)} aria-label={t(UI.next)}>
                    <Chevron />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </div>
  )
}
