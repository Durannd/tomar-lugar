import Reveal from '../shared/Reveal'
import { conceito, narrativa } from '../../data/textos'
import styles from './Conceito.module.css'

export default function Conceito() {
  return (
    <section id="conceito" className={styles.section} aria-labelledby="conceito-titulo">
      <div className={styles.grid}>
        <Reveal className={styles.lead}>
          <p className="eyebrow eyebrow--ouro">Conceito curatorial</p>
          <h2 id="conceito-titulo" className={styles.title}>
            Pertencer não é só algo que se <em>tem</em>. Muitas vezes é algo que se <em>conquista</em>.
          </h2>
        </Reveal>

        <Reveal className={styles.col} delay={0.1}>
          <p>{conceito.tese}</p>
          <h3 className={styles.h3}>Por que Artemisia é o centro</h3>
          <p>{conceito.porQueArtemisia}</p>
        </Reveal>

        <Reveal className={styles.col} delay={0.2}>
          <h3 className={styles.h3}>Como as outras nove obras foram escolhidas</h3>
          <ul className={styles.list}>
            {conceito.criterios.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal className={styles.quote} y={40}>
        <blockquote>
          <p className={styles.quoteText}>
            Artemisia seguiu quase tudo do modelo de Ripa,
            <br />
            <strong>menos a mordaça.</strong>
          </p>
          <p className={styles.quoteBody}>{conceito.mordaca}</p>
        </blockquote>
      </Reveal>

      <div className={styles.grid}>
        <Reveal className={styles.lead}>
          <p className="eyebrow eyebrow--ouro">O edifício</p>
          <h2 className={styles.title2}>Uma volta completa, de fora para dentro, até o núcleo.</h2>
        </Reveal>
        <Reveal className={styles.col} delay={0.1}>
          <p>{narrativa.leituraPlanta}</p>
          <p>{narrativa.intro}</p>
        </Reveal>
        <Reveal className={styles.col} delay={0.2}>
          <p>{narrativa.salaA}</p>
        </Reveal>
      </div>
    </section>
  )
}
