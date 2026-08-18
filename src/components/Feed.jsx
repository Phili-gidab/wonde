import { useCallback, useEffect, useRef, useState } from 'react'
import { POSTS, UI } from '../content.js'
import { useLang } from '../i18n.jsx'

/**
 * Chapter 3 - the listings, as a horizontal carousel.
 *
 * Two things drive the design:
 *
 * 1. Every card is the same HEIGHT and keeps its own width. The source assets
 *    are a mix of landscape aerials (1000x520) and portrait posters
 *    (1000x1250); forcing them into a uniform box crops the poster artwork and
 *    the badges off the photos. A fixed-height filmstrip keeps every image
 *    whole and still reads as a tidy row.
 *
 * 2. The posts are Temer's own artwork in green and gold, which fights the
 *    page. They render in an amber duotone and return to their real colours on
 *    hover or tap. That grade is CSS, not baked into the files - reversing a
 *    filter is free, baking it would mean shipping every image twice.
 *
 * Scrolling uses native CSS scroll-snap, so touch gets real momentum and the
 * arrows are only a convenience for pointer users.
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

function Post({ post, revealed, onToggle }) {
  const { t } = useLang()

  const title = text(post.title, t)
  const place = text(post.place, t)
  const detail = text(post.detail, t)
  const kind = post.kind === 'built' ? t(UI.handedOver) : t(UI.offerNow)

  return (
    <button
      type="button"
      className={`post${revealed ? ' is-revealed' : ''}`}
      onClick={onToggle}
      aria-pressed={revealed}
      aria-label={`${title}, ${place}. ${t(UI.trueColour)}`}
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

      <span className="post-kind">{kind}</span>

      <span className="post-meta">
        <span className="post-title">{title}</span>
        <span className="post-place">{place}</span>
        <span className="post-detail">{detail}</span>
      </span>
    </button>
  )
}

export default function Feed() {
  const { t } = useLang()
  const track = useRef(null)

  // Which card is showing its real colours. Hover covers pointer devices; this
  // gives touch users the same affordance.
  const [revealed, setRevealed] = useState(null)
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
    // One card plus its gap, derived from the first card so it stays correct
    // when the card height (and therefore width) changes across breakpoints.
    const card = el.querySelector('.post')
    const step = card ? card.getBoundingClientRect().width + 14 : el.clientWidth * 0.8
    el.scrollBy({ left: step * direction, behavior: 'smooth' })
  }

  return (
    <div className="feed-wrap">
      <div className="feed-head">
        <p className="feed-hint">{t(UI.trueColour)}</p>

        <div className="feed-nav">
          <button
            type="button"
            onClick={nudge(-1)}
            disabled={edges.start}
            aria-label={t(UI.prev)}
          >
            <Chevron back />
          </button>
          <button
            type="button"
            onClick={nudge(1)}
            disabled={edges.end}
            aria-label={t(UI.next)}
          >
            <Chevron />
          </button>
        </div>
      </div>

      <div className="feed" ref={track}>
        {POSTS.map((post) => (
          <Post
            key={post.id}
            post={post}
            revealed={revealed === post.id}
            onToggle={() => setRevealed((current) => (current === post.id ? null : post.id))}
          />
        ))}
      </div>
    </div>
  )
}
