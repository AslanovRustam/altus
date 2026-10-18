/** Touch devices get lighter motion: no animated blur filters (expensive on mobile GPUs). */
export const LITE = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

/** `filter: blur()` for tweens — omitted entirely on touch devices */
export const blur = (px: number) => (LITE ? {} : { filter: `blur(${px}px)` })
