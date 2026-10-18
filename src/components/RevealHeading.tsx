import { createElement, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import SplitChars from './SplitChars'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Props = {
  /** Wrap accent fragments in *asterisks* */
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  className?: string
  accentClassName?: string
}

export const CHAR_FROM = { opacity: 0, yPercent: 55, rotateX: -85, filter: 'blur(10px)' }
export const CHAR_TO = { opacity: 1, yPercent: 0, rotateX: 0, filter: 'blur(0px)' }

/**
 * Heading whose characters fall into place with a 3D tilt + blur when scrolled into view.
 * Re-splits on text change (language switch) without replaying once it has been seen.
 */
export default function RevealHeading({
  text,
  as = 'h2',
  className = '',
  accentClassName = 'font-light italic text-mist/80',
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const seen = useRef(false)
  const segments = text.split('*')
  const plain = segments.join('')

  useGSAP(
    () => {
      if (seen.current) return
      const chars = ref.current!.querySelectorAll('[data-char]')
      gsap.set(chars, { ...CHAR_FROM, transformPerspective: 600, transformOrigin: '50% 100%' })
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 86%',
        once: true,
        onEnter: () => {
          seen.current = true
          gsap.to(chars, { ...CHAR_TO, duration: 1.2, ease: 'expo.out', stagger: 0.016 })
        },
      })
    },
    { scope: ref, dependencies: [text], revertOnUpdate: true },
  )

  return createElement(
    as,
    { ref, className, 'aria-label': plain },
    <span aria-hidden>
      {segments.map((seg, i) =>
        i % 2 ? (
          <span key={i} className={accentClassName}>
            <SplitChars text={seg} />
          </span>
        ) : (
          <SplitChars key={i} text={seg} />
        ),
      )}
    </span>,
  )
}
