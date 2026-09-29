export type Quality = 'low' | 'high'

const KEY = 'tomar-lugar:quality'

export function detectQuality(): Quality {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'low' || saved === 'high') return saved
  } catch {
    /* ignore */
  }
  if (typeof window === 'undefined') return 'low'
  const coarse = window.matchMedia?.('(pointer: coarse)').matches
  const cores = navigator.hardwareConcurrency ?? 4
  const canvas = document.createElement('canvas')
  const gl2 = !!canvas.getContext('webgl2')
  return !coarse && gl2 && cores >= 6 && window.devicePixelRatio <= 2.5 ? 'high' : 'low'
}

export function saveQuality(q: Quality) {
  try {
    localStorage.setItem(KEY, q)
  } catch {
    /* ignore */
  }
}

export const isTouchDevice = () => typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
