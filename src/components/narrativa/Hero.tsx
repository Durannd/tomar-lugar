import { motion, useMotionValue, useSpring, useMotionTemplate } from 'motion/react'
import { useEffect } from 'react'
import { exposicao } from '../../data/textos'
import { obraPorNumero } from '../../data/obras'
import styles from './Hero.module.css'

const artemisia = obraPorNumero(10)

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.9 + i * 0.14, duration: 1.1, ease: [0.22, 1, 0.36, 1] as const } }),
}

export default function Hero() {
  const mx = useMotionValue(0.62)
  const my = useMotionValue(0.42)
  const sx = useSpring(mx, { stiffness: 40, damping: 18, mass: 0.8 })
  const sy = useSpring(my, { stiffness: 40, damping: 18, mass: 0.8 })
  const light = useMotionTemplate`radial-gradient(38vmax circle at calc(${sx} * 100%) calc(${sy} * 100%), rgba(0,0,0,0) 0%, rgba(11,9,8,0.55) 38%, rgba(11,9,8,0.96) 70%)`
  const glow = useMotionTemplate`radial-gradient(28vmax circle at calc(${sx} * 100%) calc(${sy} * 100%), rgba(228,189,106,0.16), rgba(228,189,106,0) 60%)`

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth)
      my.set(e.clientY / window.innerHeight)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [mx, my])

  return (
    <section className={styles.hero} aria-label="Abertura">
      <motion.div
        className={styles.figure}
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <img src={artemisia.imagem} alt="" fetchPriority="high" />
        <motion.div className={styles.shadow} style={{ backgroundImage: light }} />
        <motion.div className={styles.glow} style={{ backgroundImage: glow }} />
      </motion.div>

      <div className={styles.content}>
        <motion.p className={`eyebrow ${styles.eyebrow}`} custom={0} variants={fadeUp} initial="hidden" animate="show">
          {exposicao.disciplina} · Temática: {exposicao.tematica}
        </motion.p>
        <motion.h1 className={styles.title} custom={1} variants={fadeUp} initial="hidden" animate="show">
          <span className={styles.titleLine}>Tomar</span>
          <span className={`${styles.titleLine} ${styles.titleItalic}`}>Lugar</span>
        </motion.h1>
        <motion.p className={styles.subtitle} custom={2} variants={fadeUp} initial="hidden" animate="show">
          {exposicao.subtitulo}
        </motion.p>
        <motion.dl className={styles.meta} custom={3} variants={fadeUp} initial="hidden" animate="show">
          <div>
            <dt>Curadoria</dt>
            <dd>{exposicao.autor}</dd>
          </div>
          <div>
            <dt>Artista recebida</dt>
            <dd>{exposicao.artistaRecebida}</dd>
          </div>
          <div>
            <dt>Obras</dt>
            <dd>10, em seis movimentos</dd>
          </div>
        </motion.dl>
      </div>

      <motion.a
        href="#conceito"
        className={styles.scrollHint}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
        aria-label="Descer para o conceito"
      >
        <span />
      </motion.a>

      <p className={styles.caption}>
        {artemisia.artista}, <i>{artemisia.titulo}</i>, {artemisia.ano} · detalhe
      </p>
    </section>
  )
}
