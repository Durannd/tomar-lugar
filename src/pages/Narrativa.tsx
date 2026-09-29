import { useEffect } from 'react'
import Lenis from 'lenis'
import Nav from '../components/shared/Nav'
import Hero from '../components/narrativa/Hero'
import Conceito from '../components/narrativa/Conceito'
import Percurso from '../components/narrativa/Percurso'
import Epilogo from '../components/narrativa/Epilogo'
import { isTouchDevice, prefersReducedMotion } from '../lib/quality'
import { exhibitionStore } from '../store/exhibition'

export default function Narrativa() {
  useEffect(() => {
    exhibitionStore.setObraAtual(0)
    exhibitionStore.setMovimentoAtual(0)
    if (isTouchDevice() || prefersReducedMotion()) return
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 })
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Conceito />
        <Percurso />
      </main>
      <Epilogo />
    </>
  )
}
