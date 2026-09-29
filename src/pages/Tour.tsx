import { Suspense, useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls, Preload } from '@react-three/drei'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router'
import Nav from '../components/shared/Nav'
import Gallery from '../components/tour/Gallery'
import Artworks from '../components/tour/Artworks'
import Plaques from '../components/tour/Plaques'
import FloorArrows from '../components/tour/FloorArrows'
import Crack from '../components/tour/Crack'
import Lights from '../components/tour/Lights'
import Player, { type Controls } from '../components/tour/Player'
import Effects from '../components/tour/Effects'
import { obraPorNumero } from '../data/obras'
import { movimentos } from '../data/movimentos'
import { detectQuality, isTouchDevice, saveQuality, type Quality } from '../lib/quality'
import { tourStore, useTour } from '../store/tour'
import styles from './Tour.module.css'

const keyMap: { name: Controls; keys: string[] }[] = [
  { name: 'forward', keys: ['KeyW', 'ArrowUp'] },
  { name: 'back', keys: ['KeyS', 'ArrowDown'] },
  { name: 'left', keys: ['KeyA', 'ArrowLeft'] },
  { name: 'right', keys: ['KeyD', 'ArrowRight'] },
  { name: 'run', keys: ['ShiftLeft', 'ShiftRight'] },
  { name: 'interact', keys: ['KeyE'] },
]

function relock() {
  const el = document.querySelector('canvas')
  el?.requestPointerLock?.()
}

function InfoCard({ n }: { n: number }) {
  const o = obraPorNumero(n)
  const mov = movimentos.find((m) => m.id === o.movimento)!
  const fechar = () => {
    tourStore.patch({ aberta: 0 })
    relock()
  }
  return (
    <motion.div className={styles.cardBackdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={fechar}>
      <motion.aside
        className={styles.card}
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        role="dialog"
        aria-modal="true"
        aria-label={`${o.artista}, ${o.titulo}`}
        onClick={(e) => e.stopPropagation()}
      >
        <figure className={styles.cardFigura}>
          <img src={o.imagem} alt={`${o.artista}, ${o.titulo}`} className={styles.cardImg} />
          <figcaption>{o.credito}</figcaption>
        </figure>
        <div className={styles.cardBody}>
          <div className={styles.cardScroll}>
          <p className="eyebrow eyebrow--ouro">
            Obra {o.n} · Movimento {mov.ordem}: {mov.titulo} · {mov.espaco}
          </p>
          <h2 className={styles.cardTitulo}>
            <span>{o.artista}</span>
            <em>{o.titulo}</em>
          </h2>
          <p className={styles.cardFicha}>
            {o.ano} · {o.tecnica} · {o.acervo}
          </p>
          <p className={styles.cardTexto}>{o.placa}</p>
          <h3 className={styles.cardH3}>Justificativa</h3>
          <p className={styles.cardJust}>{o.justificativa}</p>
          <h3 className={styles.cardH3}>Por que aqui</h3>
          <p className={styles.cardJust}>
            <strong>{o.onde}.</strong> {o.porQueAqui}
          </p>
          </div>
          <div className={styles.cardFooter}>
            <button type="button" className="btn btn--solid" onClick={fechar}>
              Voltar à galeria · Esc
            </button>
            <span className={styles.cardDica}>Role para ler tudo</span>
          </div>
        </div>
      </motion.aside>
    </motion.div>
  )
}

export default function Tour() {
  const [quality, setQuality] = useState<Quality>(() => detectQuality())
  const touch = useMemo(() => isTouchDevice(), [])
  const { perto, aberta, sala, locked, iniciou } = useTour()
  const movAtual = movimentos.find((m) => m.ordem === sala)

  useEffect(() => {
    tourStore.patch({ quality, aberta: 0, perto: 0, locked: false, iniciou: false })
  }, [quality])

  // acesso de depuração (só em desenvolvimento): window.__tour.patch({ teleport: { pos, yaw } })
  useEffect(() => {
    if (import.meta.env.DEV) (window as unknown as { __tour: typeof tourStore }).__tour = tourStore
  }, [])

  // Esc fecha o card
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape' && tourStore.get().aberta) tourStore.patch({ aberta: 0 })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ao abrir a ficha, libera o mouse para ler e rolar
  useEffect(() => {
    if (aberta && document.pointerLockElement) document.exitPointerLock()
  }, [aberta])

  const trocarQualidade = (q: Quality) => {
    saveQuality(q)
    setQuality(q)
  }

  if (touch) {
    return (
      <div className={styles.mobile}>
        <Nav />
        <div className={styles.mobileBox}>
          <p className="eyebrow eyebrow--ouro">Tour 3D</p>
          <h1 className={styles.mobileTitulo}>A galeria em primeira pessoa pede teclado e mouse.</h1>
          <p>Abra esta página num computador para caminhar pelo edifício com W A S D. No celular, a exposição completa está na página principal, com a planta e todas as obras.</p>
          <Link to="/" className="btn btn--solid">
            Ver a exposição
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <Nav />
      <KeyboardControls map={keyMap}>
        <Canvas
          className={styles.canvas}
          shadows={quality === 'high' ? { type: 2 } : false}
          dpr={quality === "high" ? [1, 1.5] : [1, 1]}
          camera={{ fov: 70, near: 0.05, far: 60 }}
          gl={{ antialias: false, powerPreference: "high-performance", stencil: false }}
          onPointerMissed={() => undefined}
        >
          <color attach="background" args={['#06070a']} />
          <fog attach="fog" args={['#06070a', 14, 30]} />
          <Suspense fallback={null}>
            <Gallery quality={quality} />
            <Artworks />
            <Plaques />
            <FloorArrows />
            <Crack />
            <Lights quality={quality} />
            <Effects quality={quality} />
            <Preload all />
          </Suspense>
          <Player />
        </Canvas>
      </KeyboardControls>

      {/* HUD */}
      <div className={styles.hud} aria-live="polite">
        <div className={styles.hudLeft}>
          <p className="eyebrow">{movAtual ? `Movimento ${movAtual.ordem} · ${movAtual.espaco}` : 'Do lado de fora'}</p>
          <p className={styles.hudTitulo}>{movAtual ? movAtual.titulo : 'Entre pela porta à sua frente'}</p>
        </div>
        <AnimatePresence>
          {locked && perto > 0 && !aberta && (
            <motion.button
              type="button"
              className={styles.hint}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              onClick={() => tourStore.patch({ aberta: perto })}
            >
              <kbd>E</kbd> Ver ficha · {obraPorNumero(perto).artista}
            </motion.button>
          )}
        </AnimatePresence>
        <div className={styles.hudRight}>
          <div className={styles.quality} role="group" aria-label="Qualidade gráfica">
            <button type="button" className={quality === 'low' ? styles.qOn : undefined} onClick={() => trocarQualidade('low')}>
              Leve
            </button>
            <button type="button" className={quality === 'high' ? styles.qOn : undefined} onClick={() => trocarQualidade('high')}>
              Alta
            </button>
          </div>
        </div>
      </div>

      <div className={styles.crosshair} aria-hidden="true" />

      {/* tela inicial / pausa */}
      <AnimatePresence>
        {!locked && !aberta && (
          <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <div className={styles.overlayBox}>
              <p className="eyebrow eyebrow--ouro">Tour em primeira pessoa</p>
              <h1 className={styles.overlayTitulo}>
                Tomar <em>Lugar</em>
              </h1>
              <p className={styles.overlayTexto}>
                Você está do lado de fora, diante da entrada. Entre, siga pela passagem da esquerda e faça a volta completa até a Sala A, onde Artemisia espera sozinha.
              </p>
              <ul className={styles.keys}>
                <li>
                  <kbd>W</kbd>
                  <kbd>A</kbd>
                  <kbd>S</kbd>
                  <kbd>D</kbd> andar
                </li>
                <li>
                  <kbd>Mouse</kbd> olhar
                </li>
                <li>
                  <kbd>Shift</kbd> correr
                </li>
                <li>
                  <kbd>E</kbd> ou clique na obra: ficha
                </li>
                <li>
                  <kbd>Esc</kbd> pausar
                </li>
              </ul>
              <button
                type="button"
                className="btn btn--solid"
                onClick={relock}
              >
                {iniciou ? 'Continuar a visita' : 'Entrar na galeria'}
              </button>
              <p className={styles.overlayNota}>
                Qualidade {quality === 'high' ? 'alta' : 'leve'} detectada. Se travar, mude para “Leve” no canto inferior direito.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{aberta > 0 && <InfoCard key={aberta} n={aberta} />}</AnimatePresence>
    </div>
  )
}
