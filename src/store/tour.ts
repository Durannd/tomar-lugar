import { useSyncExternalStore } from 'react'
import type { Quality } from '../lib/quality'

interface TourState {
  /** obra mais próxima e à frente do visitante (0 = nenhuma) */
  perto: number
  /** obra aberta no info card (0 = nenhum) */
  aberta: number
  /** movimento em que o visitante está (0 = fora) */
  sala: number
  locked: boolean
  quality: Quality
  iniciou: boolean
  /** pedido de teletransporte (svg x, svg y, yaw em rad); consumido pelo Player */
  teleport: { pos: [number, number]; yaw: number } | null
  /** posição atual do visitante em unidades svg (para depuração) */
  pos: [number, number]
}

let state: TourState = { perto: 0, aberta: 0, sala: 0, locked: false, quality: 'high', iniciou: false, teleport: null, pos: [0, 0] }
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

export const tourStore = {
  get: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l)
    return () => listeners.delete(l)
  },
  patch(p: Partial<TourState>) {
    const next = { ...state, ...p }
    if ((Object.keys(p) as (keyof TourState)[]).every((k) => next[k] === state[k])) return
    state = next
    emit()
  },
}

export const useTour = () => useSyncExternalStore(tourStore.subscribe, tourStore.get)
