import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { movimentos, type Movimento } from '../../data/movimentos'
import { obraPorNumero, type Obra } from '../../data/obras'
import { narrativa } from '../../data/textos'
import { exhibitionStore, useExhibition } from '../../store/exhibition'
import PlantaSVG from '../shared/PlantaSVG'
import Reveal from '../shared/Reveal'
import styles from './Percurso.module.css'

/** Marca o elemento como "atual" quando cruza a faixa central da viewport. */
function useCenterObserver<T extends HTMLElement>(onEnter: () => void) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) onEnter()
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [onEnter])
  return ref
}

function ObraBlock({ obra, movimento }: { obra: Obra; movimento: Movimento }) {
  const ref = useCenterObserver<HTMLElement>(() => {
    exhibitionStore.setObraAtual(obra.n)
    exhibitionStore.setMovimentoAtual(movimento.ordem)
  })
  const retrato = obra.proporcao < 1
  const destaque = obra.n === 10

  return (
    <article ref={ref} id={`obra-${obra.n}`} className={`${styles.obra} ${destaque ? styles.obraDestaque : ''}`}>
      <motion.figure
        className={`${styles.figure} ${retrato ? styles.figureRetrato : ''}`}
        initial={{ clipPath: 'inset(8% 0 8% 0)', opacity: 0 }}
        whileInView={{ clipPath: 'inset(0 0 0 0)', opacity: 1 }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.img
          src={obra.imagem}
          alt={`${obra.artista}, ${obra.titulo}, ${obra.ano}`}
          loading="lazy"
          decoding="async"
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <figcaption className={styles.credito}>{obra.credito}</figcaption>
      </motion.figure>

      <Reveal className={styles.texto}>
        <p className={styles.numero} aria-label={`Obra ${obra.n}`}>
          <span>{String(obra.n).padStart(2, '0')}</span>
          <span className={styles.numeroSep} aria-hidden="true" />
          <span />
        </p>
        <p className={styles.onde}>{obra.onde}</p>
        <h3 className={styles.obraTitulo}>
          <span className={styles.artista}>{obra.artista}</span>
          <em>{obra.titulo}</em>
        </h3>
        <p className={styles.ficha}>
          {obra.ano} · {obra.tecnica} · {obra.acervo}
        </p>
        <p className={styles.justificativa}>{obra.justificativa}</p>
        <aside className={styles.porque}>
          <p className="eyebrow">Por que aqui</p>
          <p>{obra.porQueAqui}</p>
        </aside>
      </Reveal>
    </article>
  )
}

function MovimentoSection({ mov }: { mov: Movimento }) {
  const ref = useCenterObserver<HTMLDivElement>(() => exhibitionStore.setMovimentoAtual(mov.ordem))
  return (
    <section className={styles.movimento} id={mov.id} aria-labelledby={`mov-${mov.id}`}>
      <div ref={ref} className={styles.movHeader}>
        <Reveal>
          <p className="eyebrow eyebrow--ouro">
            Movimento {mov.ordem} de 6 · {mov.espaco}
          </p>
          <h2 id={`mov-${mov.id}`} className={styles.movTitulo}>
            {mov.titulo}
          </h2>
          <p className={styles.movTexto}>{mov.texto}</p>
        </Reveal>
      </div>
      <div className={styles.obras}>
        {mov.obras.map((n) => (
          <ObraBlock key={n} obra={obraPorNumero(n)} movimento={mov} />
        ))}
      </div>
    </section>
  )
}

function Saida() {
  const ref = useCenterObserver<HTMLElement>(() => exhibitionStore.setMovimentoAtual(7))
  return (
    <section ref={ref} className={styles.saida} aria-label="Saída">
      <Reveal>
        <p className="eyebrow eyebrow--ouro">Saída</p>
        <h2 className={styles.movTitulo}>O percurso é um círculo.</h2>
        <p className={styles.movTexto}>{narrativa.saida}</p>
        <p className={styles.nota}>{narrativa.portaSalaB}</p>
      </Reveal>
    </section>
  )
}

export default function Percurso() {
  const { obraAtual, movimentoAtual } = useExhibition()
  const movAtual = movimentos.find((m) => m.ordem === movimentoAtual)
  const obra = obraAtual ? obraPorNumero(obraAtual) : undefined

  const irPara = (n: number) => {
    document.getElementById(`obra-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section className={styles.percurso} id="percurso" aria-label="Percurso e obras">
      <div className={styles.coluna}>
        {movimentos.map((m) => (
          <MovimentoSection key={m.id} mov={m} />
        ))}
        <Saida />
      </div>

      <aside className={styles.plantaWrap} aria-label="Planta baixa">
        <div className={styles.plantaSticky}>
          <div className={styles.plantaInfo}>
            <p className="eyebrow">{movimentoAtual >= 7 ? 'Saída' : movAtual ? `${movAtual.ordem} · ${movAtual.titulo}` : 'Planta baixa'}</p>
            <p className={styles.plantaObra}>{obra ? `${obra.n}. ${obra.artista}` : 'Percurso sugerido'}</p>
          </div>
          <PlantaSVG obraAtual={obraAtual} movimentoAtual={movimentoAtual} onObraClick={irPara} />
        </div>
      </aside>
    </section>
  )
}
