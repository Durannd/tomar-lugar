import { Link } from 'react-router'
import Reveal from '../shared/Reveal'
import { exposicao, fontes } from '../../data/textos'
import { obras } from '../../data/obras'
import styles from './Epilogo.module.css'

export default function Epilogo() {
  return (
    <footer className={styles.epilogo}>
      <Reveal className={styles.ctas}>
        <p className="eyebrow eyebrow--ouro">Continue a visita</p>
        <div className={styles.ctaGrid}>
          <Link to="/tour" className={styles.cta}>
            <span className={styles.ctaTitulo}>Entrar na galeria</span>
            <span className={styles.ctaDesc}>Tour em primeira pessoa pelo edifício. Caminhe com W A S D e olhe com o mouse.</span>
            <span className={styles.ctaHint}>Abrir tour 3D</span>
          </Link>
          <Link to="/catalogo" className={styles.cta}>
            <span className={styles.ctaTitulo}>Ler o catálogo</span>
            <span className={styles.ctaDesc}>Capa, texto curatorial, planta com legenda e uma ficha por obra. Pronto para salvar em PDF.</span>
            <span className={styles.ctaHint}>Abrir catálogo</span>
          </Link>
        </div>
      </Reveal>

      <div className={styles.creditos}>
        <Reveal>
          <p className="eyebrow">Imagens</p>
          <ul className={styles.lista}>
            {obras.map((o) => (
              <li key={o.n}>
                <span className={styles.n}>{String(o.n).padStart(2, '0')}</span> {o.credito}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow">Fontes</p>
          <ul className={styles.lista}>
            {fontes.map((f) => (
              <li key={f.obra}>
                <strong>{f.obra}</strong>
                {f.itens.map((it) => (
                  <span key={it.label} className={styles.fonte}>
                    {it.url ? (
                      <a href={it.url} target="_blank" rel="noreferrer">
                        {it.label}
                      </a>
                    ) : (
                      it.label
                    )}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className={styles.assinatura}>
        <p className={styles.marca}>
          Tomar <em>Lugar</em>
        </p>
        <p>
          Curadoria de {exposicao.autor} · {exposicao.disciplina} · {exposicao.ano}
        </p>
        <p className={styles.uso}>Reproduções de obras protegidas por direito autoral são usadas aqui exclusivamente para fins educacionais, com crédito completo.</p>
      </div>
    </footer>
  )
}
