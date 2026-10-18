import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

const WORD = 'ALTUS'
/** extrusion slices behind each letter's face */
const DEPTH_LAYERS = 12
const LAYER_GAP = 2.6
/** shared by the 3D letters and their hit zones so both line up */
const TYPE =
  "flex text-[clamp(5rem,23vw,21rem)] leading-[0.82] font-black tracking-[-0.04em] [font-family:'Asap_Sharp',sans-serif]"

/** Extruded wordmark: each letter springs forward and lights up on hover. */
export default function Logo3D() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const letters = gsap.utils.toArray<HTMLElement>('[data-letter]')

      const mm = gsap.matchMedia()
      mm.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        // Hover: each letter springs forward with a little twist.
        // Pointer events come from flat, static hit zones — the moving 3D letter would
        // otherwise slide out from under the cursor.
        const hits = gsap.utils.toArray<HTMLElement>('[data-hit]')
        const cleanups = letters.map((el, i) => {
          const hit = hits[i]
          const enter = () => {
            el.toggleAttribute('data-lit', true)
            gsap.to(el, {
              z: 90,
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
              z: 0,
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

        return () => cleanups.forEach((fn) => fn())
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <div ref={root} aria-hidden className="relative mt-20 flex justify-center select-none [perspective:1400px]">
      <div className={`pointer-events-none ${TYPE} [transform-style:preserve-3d]`}>
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
