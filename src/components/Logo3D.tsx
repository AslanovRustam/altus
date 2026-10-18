import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const WORD = 'ALTUS'
/** extrusion slices behind each letter's face */
const DEPTH_LAYERS = 12
const LAYER_GAP = 2.6
/** letters sit at slightly different depths so the tilt reads as parallax */
const LETTER_Z = [0, 18, 34, 18, 0]
/** shared by the 3D letters and their hit zones so both line up */
const TYPE =
  "flex text-[clamp(5rem,23vw,21rem)] leading-[0.82] font-black tracking-[-0.04em] [font-family:'Asap_Sharp',sans-serif]"

/**
 * Extruded wordmark: tilts toward the cursor, stands up as it scrolls into view,
 * and each letter springs forward and lights up on hover.
 */
export default function Logo3D() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const stage = root.current!.querySelector<HTMLElement>('[data-stage]')!
      const tilt = root.current!.querySelector<HTMLElement>('[data-tilt]')!
      const letters = gsap.utils.toArray<HTMLElement>('[data-letter]')

      letters.forEach((el, i) => gsap.set(el, { z: LETTER_Z[i] }))

      // Scroll: the wordmark rises and stands up as the footer comes in
      gsap.fromTo(
        stage,
        { rotateX: 48, yPercent: 22 },
        {
          rotateX: 0,
          yPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
        },
      )

      const mm = gsap.matchMedia()
      mm.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        // Mouse: gentle tilt of the whole wordmark
        const rx = gsap.quickTo(tilt, 'rotationX', { duration: 1.2, ease: 'power3.out' })
        const ry = gsap.quickTo(tilt, 'rotationY', { duration: 1.2, ease: 'power3.out' })
        const footer = root.current!.closest('footer') ?? root.current!

        const onMove = (e: PointerEvent) => {
          const r = root.current!.getBoundingClientRect()
          const nx = ((e.clientX - r.left) / r.width - 0.5) * 2 // -1 … 1
          const ny = ((e.clientY - r.top) / r.height - 0.5) * 2
          ry(gsap.utils.clamp(-1, 1, nx) * 16)
          rx(gsap.utils.clamp(-1.5, 1.5, ny) * -10)
        }
        const onLeave = () => {
          rx(0)
          ry(0)
        }
        footer.addEventListener('pointermove', onMove as EventListener)
        footer.addEventListener('pointerleave', onLeave)

        // Hover: each letter springs forward with a little twist.
        // Pointer events come from flat, static hit zones — the moving 3D letters would
        // otherwise slide out from under the cursor (and the tilted edges overlap neighbours).
        const hits = gsap.utils.toArray<HTMLElement>('[data-hit]')
        const cleanups = letters.map((el, i) => {
          const hit = hits[i]
          const enter = () => {
            el.toggleAttribute('data-lit', true)
            gsap.to(el, {
              z: LETTER_Z[i] + 90,
              y: -18,
              rotateY: i % 2 ? 22 : -22,
              rotateX: 14,
              scale: 1.06,
              duration: 0.7,
              ease: 'back.out(2.2)',
              overwrite: 'auto',
            })
          }
          const leave = () => {
            el.toggleAttribute('data-lit', false)
            gsap.to(el, {
              z: LETTER_Z[i],
              y: 0,
              rotateY: 0,
              rotateX: 0,
              scale: 1,
              duration: 1.1,
              ease: 'elastic.out(1, 0.45)',
              overwrite: 'auto',
            })
          }
          hit.addEventListener('pointerenter', enter)
          hit.addEventListener('pointerleave', leave)
          return () => {
            hit.removeEventListener('pointerenter', enter)
            hit.removeEventListener('pointerleave', leave)
          }
        })

        return () => {
          footer.removeEventListener('pointermove', onMove as EventListener)
          footer.removeEventListener('pointerleave', onLeave)
          cleanups.forEach((fn) => fn())
        }
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <div ref={root} aria-hidden className="relative mt-20 flex justify-center select-none [perspective:1400px]">
      <div data-stage className="pointer-events-none [transform-style:preserve-3d]">
        <div data-tilt className={`${TYPE} [transform-style:preserve-3d]`}>
          {[...WORD].map((ch, i) => (
            <span
              key={i}
              data-letter
              className="logo3d-letter relative inline-block px-[0.01em] [transform-style:preserve-3d]"
            >
              {/* extrusion: slices fading into the dark */}
              {Array.from({ length: DEPTH_LAYERS }).map((_, l) => (
                <span
                  key={l}
                  className="logo3d-slice absolute inset-0 px-[0.01em]"
                  style={{
                    transform: `translateZ(${-(l + 1) * LAYER_GAP}px)`,
                    opacity: 1 - (l / DEPTH_LAYERS) * 0.75,
                  }}
                >
                  {ch}
                </span>
              ))}
              {/* front face */}
              <span className="logo3d-face relative block">{ch}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Static hit zones laid out exactly like the untransformed word */}
      <div className={`absolute inset-0 justify-center text-transparent ${TYPE}`}>
        {[...WORD].map((ch, i) => (
          <span key={i} data-hit className="inline-block px-[0.01em]">
            {ch}
          </span>
        ))}
      </div>
    </div>
  )
}
