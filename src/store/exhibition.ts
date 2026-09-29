import { useSyncExternalStore } from 'react'

interface State {
  /** obra em foco na narrativa (0 = nenhuma / hero) */
  obraAtual: number
  /** movimento em foco (0 = hero) */
  movimentoAtual: number
}

let state: State = { obraAtual: 0, movimentoAtual: 0 }
const listeners = new Set<() => void>()

const emit = () => listeners.forEach((l) => l())

export const exhibitionStore = {
  get: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l)
    return () => listeners.delete(l)
  },
  setObraAtual(n: number) {
    if (state.obraAtual === n) return
    state = { ...state, obraAtual: n }
    emit()
  },
  setMovimentoAtual(n: number) {
    if (state.movimentoAtual === n) return
    state = { ...state, movimentoAtual: n }
    emit()
  },
}

export const useExhibition = () => useSyncExternalStore(exhibitionStore.subscribe, exhibitionStore.get)
