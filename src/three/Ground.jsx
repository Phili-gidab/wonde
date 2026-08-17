import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

/**
 * Infinite-feeling ground.
 *
 * The GLB ships a site plate - a 12-triangle slab with the paving details laid
 * on top - which ends in a hard straight edge. Lit from the side against a dark
 * background it reads as a diorama on a plinth: the building looks like a model
 * on a table rather than a building on ground. Tower.jsx hides those plate
 * meshes and this stands in for them.
 *
 * The trick is the alpha map: a radial falloff so the plane dissolves into the
 * background instead of terminating at an edge. There is no horizon line to
 * give the scale away.
 */

/** White at centre, transparent at the rim, with an eased falloff. */
function radialFadeTexture(size = 512) {
  const data = new Uint8Array(size * size * 4)
  const centre = (size - 1) / 2

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (x - centre) / centre
      const dy = (y - centre) / centre
      const distance = Math.min(1, Math.hypot(dx, dy))

      // Hold opacity close to the building, then fall away. The fade must
      // reach zero well before the geometry's rim (hence /0.45, not /0.9) or
      // the circle's edge shows up as a hard curved horizon once the key light
      // catches it. smoothstep keeps the gradient from banding.
      const t = Math.max(0, Math.min(1, (distance - 0.06) / 0.45))
      const alpha = 1 - t * t * (3 - 2 * t)

      const i = (y * size + x) * 4
      data[i] = 255
      data[i + 1] = 255
      data[i + 2] = 255
      data[i + 3] = Math.round(alpha * 255)
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  texture.needsUpdate = true
  return texture
}

export default function Ground({ radius = 60, color = '#080b11' }) {
  const alphaMap = useMemo(() => radialFadeTexture(512), [])

  useEffect(() => () => alphaMap.dispose(), [alphaMap])

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
      // Render before the building's transparent glazing so it composites
      // correctly against it.
      renderOrder={-1}
    >
      <circleGeometry args={[radius, 96]} />
      {/*
        Low metalness and high roughness on purpose. A polished ground picks up
        the warm key light across its whole span and reads as sand rather than
        as city ground - the building should be the only bright thing in frame.
      */}
      <meshStandardMaterial
        color={color}
        roughness={0.72}
        metalness={0.15}
        alphaMap={alphaMap}
        transparent
        depthWrite={false}
        envMapIntensity={0.3}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}
