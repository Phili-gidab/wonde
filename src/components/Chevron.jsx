/**
 * Carousel/lightbox stepper arrow. Shared by the listings strip and the
 * delivery gallery so the two sets of controls cannot drift apart.
 */
export default function Chevron({ back = false }) {
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
