import { useCallback, useEffect, useRef, useState } from 'react'
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

export default function Feed() {
  const { t } = useLang()
  const track = useRef(null)
  const dialog = useRef(null)

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
    <div className="feed-wrap">
      <div className="feed-head">
        <p className="feed-hint">{t(UI.trueColour)}</p>

        <div className="feed-nav">
          <button type="button" onClick={nudge(-1)} disabled={edges.start} aria-label={t(UI.prev)}>
            <Chevron back />
          </button>
          <button type="button" onClick={nudge(1)} disabled={edges.end} aria-label={t(UI.next)}>
            <Chevron />
          </button>
        </div>
      </div>

      <div className="feed" ref={track}>
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
