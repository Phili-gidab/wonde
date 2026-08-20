/**
 * The ground, which is a shadow and nothing else.
 *
 * The GLB ships a site plate - a 12-triangle slab with the paving details laid
 * on top - which ends in a hard straight edge. Lit from the side it reads as a
 * diorama on a plinth: the building looks like a model on a table rather than
 * a building on ground. Tower.jsx hides those plate meshes and this stands in
 * for them.
 *
 * It used to stand in with a lit plane that faded out through an alpha map,
 * which worked on a dark page because the fade ran from near-black into black.
 * On white it cannot: the cameras sit two units off the ground, and at that
 * height the last ten units of a receding plane compress into about thirty
 * pixels of screen. Any fade, however gentle in world space, arrives as a hard
 * grey horizon ruled across the page. Fog used to cover that, and pushing the
 * fog out past the building - which it had to be, or it bleached the facade -
 * took the cover away with it.
 *
 * So the plane keeps only the thing it was there for. `shadowMaterial` draws
 * where the building blocks the key light and is fully transparent everywhere
 * else, which puts the shadow on the page with no plane to see the edge of.
 * No horizon, at any camera height or fog setting.
 *
 * There was briefly a soft radial "contact pool" under the tower here as well,
 * for the occlusion a cast shadow cannot give you because it lands off to one
 * side. Any disc large enough to see is read as a second shadow - the client
 * spotted it immediately - and one honest shadow beats two competing ones.
 */
export default function Ground({ radius = 60, color = '#22303f', opacity = 0.34 }) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
      // Render before the building's transparent glazing so it composites
      // correctly against it.
      renderOrder={-2}
    >
      <circleGeometry args={[radius, 96]} />
      <shadowMaterial color={color} opacity={opacity} transparent depthWrite={false} />
    </mesh>
  )
}
