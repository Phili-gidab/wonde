import { LISTINGS, POSTS, UI } from '../content.js'
import { useLang } from '../i18n.jsx'
import SectionHead from './SectionHead.jsx'

/**
 * The running offers, one under another.
 *
 * This used to be a horizontal filmstrip with the sales copy behind a click.
 * Listed vertically there is room for the copy beside each poster, so it is
 * shown in full and there is nothing to open. Posters keep their own aspect
 * ratio - they come in 4:5 and 1:1, and cropping slices off the badges.
 */

/** Some fields are plain strings (proper nouns); others are {en, am} pairs. */
function text(value, t) {
  return typeof value === 'string' ? value : t(value)
}

function Listing({ post, index }) {
  const { t } = useLang()
  const title = text(post.title, t)
  const place = text(post.place, t)

  return (
    <article className="listing">
      <div className="listing-media">
        <img
          src={`/posts/${post.id}.webp`}
          width={post.w}
          height={post.h}
          loading={index < 2 ? 'eager' : 'lazy'}
          decoding="async"
          alt={`${title} - ${place}`}
        />
      </div>

      <div className="listing-body">
        <p className="listing-tag">
          <span>{t(UI.offerNow)}</span>
          <span className="listing-detail">{text(post.detail, t)}</span>
        </p>
        <h3 className="listing-title">{title}</h3>
        <p className="listing-place">{place}</p>

        {post.lines && (
          <ul className="listing-lines">
            {post.lines.map((line) => (
              <li key={line.en}>{t(line)}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

export default function Listings() {
  return (
    <section className="section listings" id="listings">
      <div className="container">
        <SectionHead eyebrow={LISTINGS.eyebrow} heading={LISTINGS.heading} />

        <div className="listing-list">
          {POSTS.map((post, index) => (
            <Listing key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
