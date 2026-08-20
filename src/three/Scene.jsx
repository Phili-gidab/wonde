import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import Tower from './Tower.jsx'
import Ground from './Ground.jsx'
import { sampleCameraPath, PORTRAIT_ASPECT } from './cameraPath.js'

/**
 * Daylight palette, for a white page.
 *
 * This scene was a dusk shot: a hot amber key against near-black, with the
 * building emerging out of the dark. On white that inverts - the page is now
 * the brightest thing in frame, so a dark render reads as a hole cut in the
 * page. The light is late-morning instead: a warm white key, a bright sky
 * fill, and a near-white ground that the fog dissolves into the page itself.
 *
 * Contrast now has to come from *shading* rather than from the background:
 * the key stays firmly on one side so the building keeps a visibly darker
 * face, and the ambient is deliberately not lifted far enough to fill it in.
 * Flatten that and the tower washes out into the white behind it.
 */
const KEY = '#ffeccd'
const FILL = '#cfe1f4'
const GROUND = '#f3f5f8'

/**
 * Drives the default camera along the scroll-bound path.
 *
 * Damping is applied to the *sampled* target rather than to scroll itself, so
 * fast flicks still settle smoothly instead of snapping.
 */
function CameraRig({ progress, reducedMotion, pointer }) {
  const { camera } = useThree()

  const desiredPosition = useMemo(() => new THREE.Vector3(), [])
  const desiredTarget = useMemo(() => new THREE.Vector3(), [])
  const currentTarget = useRef(new THREE.Vector3(0, 4.2, 0))
  const started = useRef(false)

  useFrame((_, delta) => {
    // Portrait viewports get their own keyframes - see cameraPath.js.
    const variant = camera.aspect < PORTRAIT_ASPECT ? 'mobile' : 'desktop'
    const fov = sampleCameraPath(progress.current, desiredPosition, desiredTarget, variant)

    // Gentle parallax so the shot feels hand-held rather than on rails.
    if (!reducedMotion) {
      desiredPosition.x += pointer.current.x * 0.9
      desiredPosition.y += pointer.current.y * 0.5
    }

    // Frame-rate independent damping.
    const alpha = reducedMotion ? 1 : 1 - Math.pow(0.0016, delta)

    if (!started.current) {
      camera.position.copy(desiredPosition)
      currentTarget.current.copy(desiredTarget)
      started.current = true
    } else {
      camera.position.lerp(desiredPosition, alpha)
      currentTarget.current.lerp(desiredTarget, alpha)
    }

    camera.lookAt(currentTarget.current)

    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov += (fov - camera.fov) * alpha
      camera.updateProjectionMatrix()
    }
  })

  return null
}

/**
 * Procedural environment - no HDRI download. A handful of Lightformers give
 * the glass and metal something structured to reflect, which is what actually
 * sells the material quality.
 */
function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      {/* warm band low and wide - the sun's side of the sky */}
      <Lightformer
        intensity={2.1}
        color={KEY}
        position={[-6, 3, -8]}
        scale={[14, 6, 1]}
        target={[0, 3, 0]}
      />
      {/*
        The rest of the sky. Deliberately not raised to match the key: an
        environment of uniform brightness is what turns glazing into flat light
        grey, because a mirror with nothing to reflect reflects an average. The
        glass needs somewhere bright and somewhere dark, which is what the
        strips below and the unlit lower hemisphere provide.
      */}
      <Lightformer
        intensity={1.35}
        color={FILL}
        position={[8, 7, 6]}
        scale={[12, 10, 1]}
        target={[0, 4, 0]}
      />
      {/* narrow vertical strips read as window highlights on the glazing */}
      <Lightformer intensity={3.4} color="#ffffff" position={[5, 6, -6]} scale={[0.6, 9, 1]} />
      <Lightformer intensity={2.6} color="#ffffff" position={[-7, 5, 4]} scale={[0.4, 8, 1]} />
      <Lightformer intensity={2.2} color="#ffffff" position={[-3, 7, -7]} scale={[0.3, 10, 1]} />
      {/* overhead bounce */}
      <Lightformer
        intensity={1.1}
        color="#e8f1fa"
        position={[0, 14, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[16, 16, 1]}
      />
    </Environment>
  )
}

function Lights() {
  return (
    <>
      {/*
        On a dark page the building had to be the brightest thing in frame. On
        a white one it has to be the *darkest*: a mid-toned mass on paper, not
        white on white. That is the whole reason the ambient sits at 0.45 and
        not the 1.15 it was first raised to - lifting it far enough to "read"
        the facade lifted it past the page, and the tower dissolved into the
        background it was supposed to stand against.

        There is still nothing filling the front.
      */}
      <hemisphereLight args={[FILL, GROUND, 0.45]} />
      <directionalLight
        position={[-9, 13, 7]}
        intensity={2.4}
        color={KEY}
        castShadow
        // The building rotates, so this re-renders every frame - 2048, not the
        // 4096 that was affordable back when the map could be baked once.
        shadow-mapSize={[2048, 2048]}
        // Acne on the ground plane was invisible at 0.02 against near-black
        // and is a field of grey speckle against white.
        shadow-bias={-0.0004}
        shadow-normalBias={0.07}
      >
        {/*
          The frustum must cover the whole *visible* ground, not just the
          tower. Ground.jsx fades out at roughly 30 units, and a frustum
          smaller than that ends in a hard straight line across the ground
          where shadowing simply stops - which reads as a rectangular plinth
          under the building.

          It is symmetric at 42 now, not 32 x -8. The old bottom edge sat 8
          units behind the tower, well inside the ground, and on a white page
          that line was plainly visible; on the dark one it was not. Texel
          density drops from 32/unit to 24/unit, which the shadow is soft
          enough to absorb.
        */}
        <orthographicCamera attach="shadow-camera" args={[-42, 42, 42, -42, 1, 100]} />
      </directionalLight>
      {/*
        Rim from behind. On the dark version this drew a bright edge against
        the background; on white it does the opposite job, keeping the back of
        the building from going flat where the page is brightest.
      */}
      <directionalLight position={[10, 6, -9]} intensity={0.85} color={FILL} />
    </>
  )
}

export default function Scene({ progress, reducedMotion, quality = 'high' }) {
  const pointer = useRef({ x: 0, y: 0 })

  const onPointerMove = (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1
    const y = (event.clientY / window.innerHeight) * 2 - 1
    pointer.current.x = x
    pointer.current.y = -y
  }

  return (
    <Canvas
      className="scene-canvas"
      shadows={quality === 'high'}
      dpr={[1, quality === 'high' ? 1.75 : 1.25]}
      gl={{
        antialias: false, // SMAA in the composer handles this more cheaply
        powerPreference: 'high-performance',
        alpha: true,
      }}
      camera={{ position: [7.5, 2, 15.5], fov: 42, near: 0.1, far: 120 }}
      onPointerMove={onPointerMove}
      onCreated={({ gl, scene, camera }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        // The building is faced in white brick, white ribbed panel and pale
        // plaster - its own textures average 230/255. On a white page that is
        // white on white unless the render is graded down to let the material
        // read, so exposure sits below 1 rather than above it. 1.18 clipped
        // the lit faces to paper and took the base-colour maps with them.
        gl.toneMappingExposure = 0.86
        // Handle for scripts/shoot.mjs to inspect framing. Harmless in prod.
        window.__stage = { scene, camera, THREE }
      }}
    >
      {/*
        The fog colour is the page colour. That is what makes the ground
        dissolve into the document instead of ending somewhere - there is no
        horizon line and no visible edge to the render.

        It must start beyond the building, though. The cameras sit 17 to 22
        units out and the tower is 8 across, so anything nearer than about 30
        puts haze on the far half of the facade - which on a white page is
        indistinguishable from the building being washed out. Starting at 34
        keeps the fog for the ground, where it is doing a job, and off the
        subject, where it was only bleaching it.
      */}
      <fog attach="fog" args={[GROUND, 34, 82]} />

      <Suspense fallback={null}>
        <Tower spin={reducedMotion ? 0 : 0.015} />
        <Ground />
        <Studio />
      </Suspense>

      <Lights />

      <CameraRig progress={progress} reducedMotion={reducedMotion} pointer={pointer} />

      {/*
        Antialiasing is the composer's own WebGL2 MSAA, not an SMAA pass.
        An <SMAA/> pass here floods the console with
        "glBlitFramebuffer: Read and write depth stencil attachments cannot be
        the same image" on every frame - bisected to SMAA specifically
        (composer on + SMAA off is clean, every other effect off still errors).

        No vignette any more. It darkened the corners to hold the eye inside a
        dark frame; against a white page the same pass draws four grey smudges
        around the edge of an otherwise clean document.

        Bloom is pulled back hard for the same reason. At the old threshold
        nearly every lit surface was over the line once the scene was
        brightened, and the whole tower hazed.
      */}
      {quality === 'high' && (
        <EffectComposer multisampling={4} disableNormalPass>
          <Bloom
            intensity={0.32}
            luminanceThreshold={0.92}
            luminanceSmoothing={0.25}
            mipmapBlur
          />
          <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.12} />
        </EffectComposer>
      )}
    </Canvas>
  )
}
