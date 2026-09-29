import { Link } from 'react-router'
import Nav from '../components/shared/Nav'
import PlantaSVG from '../components/shared/PlantaSVG'
import { movimentos } from '../data/movimentos'
import { obras, obraPorNumero } from '../data/obras'
import { conceito, exposicao, fontes, narrativa } from '../data/textos'
import { salas } from '../data/planta'
import styles from './Catalogo.module.css'
import '../styles/print.css'

export default function Catalogo() {
  return (
    <div className={styles.root}>
      <Nav />
      <div className={`${styles.barra} no-print`}>
        <p>
          Este catálogo é o entregável em PDF. Use <kbd>Ctrl</kbd>+<kbd>P</kbd> e escolha “Salvar como PDF”, em A4, com fundos ativados.
        </p>
        <div className={styles.barraAcoes}>
          <Link to="/" className="btn">
            Voltar à exposição
          </Link>
          <button type="button" className="btn btn--solid" onClick={() => window.print()}>
            Salvar PDF
          </button>
        </div>
      </div>

      <main className={styles.doc}>
        {/* ---------- Capa ---------- */}
        <section className={`${styles.pagina} ${styles.capa}`}>
          <p className={styles.capaEyebrow}>{exposicao.disciplina}</p>
          <h1 className={styles.capaTitulo}>
            Tomar <em>Lugar</em>
          </h1>
          <p className={styles.capaSub}>{exposicao.subtitulo}</p>
          <dl className={styles.capaMeta}>
            <div>
              <dt>Curadoria</dt>
              <dd>{exposicao.autor}</dd>
            </div>
            <div>
              <dt>Temática</dt>
              <dd>{exposicao.tematica}</dd>
            </div>
            <div>
              <dt>Artista recebida</dt>
              <dd>{exposicao.artistaRecebida}</dd>
            </div>
            <div>
              <dt>Ano</dt>
              <dd>{exposicao.ano}</dd>
            </div>
          </dl>
          <figure className={styles.capaFigura}>
            <img src={obraPorNumero(10).imagem} alt="" />
            <figcaption>{obraPorNumero(10).credito}</figcaption>
          </figure>
        </section>

        {/* ---------- Conceito ---------- */}
        <section className={styles.pagina}>
          <p className={styles.eyebrow}>1 · Conceito curatorial</p>
          <h2 className={styles.h2}>Pertencer não é só algo que se tem; muitas vezes é algo que se conquista.</h2>
          <p>{conceito.tese}</p>
          <h3 className={styles.h3}>Por que Artemisia é o centro</h3>
          <p>{conceito.porQueArtemisia}</p>
          <p>{conceito.mordaca}</p>
          <h3 className={styles.h3}>Critérios de seleção das outras nove obras</h3>
          <ul className={styles.lista}>
            {conceito.criterios.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>

        {/* ---------- Narrativa ---------- */}
        <section className={styles.pagina}>
          <p className={styles.eyebrow}>2 · Percurso e narrativa</p>
          <h2 className={styles.h2}>Uma volta completa pelo edifício, de fora para dentro, até o núcleo.</h2>
          <p>{narrativa.leituraPlanta}</p>
          <p>{narrativa.intro}</p>
          <ol className={styles.movimentos}>
            {movimentos.map((m) => (
              <li key={m.id}>
                <strong>{m.titulo}</strong> <span className={styles.espaco}>— {m.espaco}</span>
                <p>{m.texto}</p>
              </li>
            ))}
          </ol>
          <p>
            <strong>Saída:</strong> {narrativa.saida}
          </p>
          <p>
            <strong>Porta inferior da Sala B:</strong> {narrativa.portaSalaB}
          </p>
          <p>{narrativa.salaA}</p>
        </section>

        {/* ---------- Planta ---------- */}
        <section className={styles.pagina}>
          <p className={styles.eyebrow}>3 · Planta baixa, legenda e percurso</p>
          <h2 className={styles.h2}>As dez obras numeradas na ordem do percurso.</h2>
          <p>{narrativa.posicionamento}</p>
          <div className={styles.planta}>
            <PlantaSVG modo="print" legenda />
          </div>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Espaço</th>
                <th>Onde fica na planta</th>
                <th>Movimento</th>
              </tr>
            </thead>
            <tbody>
              {salas.map((s) => {
                const mov = movimentos.find((m) => m.salaId === s.id)
                return (
                  <tr key={s.id}>
                    <td>{s.nome}</td>
                    <td>{descricaoSala(s.id)}</td>
                    <td>{mov ? `${mov.ordem}. ${mov.titulo}` : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>

        {/* ---------- Fichas ---------- */}
        {obras.map((o) => {
          const mov = movimentos.find((m) => m.id === o.movimento)!
          const retrato = o.proporcao < 1
          return (
            <section key={o.n} className={`${styles.pagina} ${styles.ficha} ${retrato ? styles.fichaRetrato : ''}`}>
              <p className={styles.eyebrow}>
                Obra {o.n} · Movimento {mov.ordem}: {mov.titulo} · {mov.espaco}
              </p>
              <figure className={styles.fichaFigura}>
                <img src={o.imagem} alt={`${o.artista}, ${o.titulo}`} />
                <figcaption>{o.credito}</figcaption>
              </figure>
              <div className={styles.fichaTexto}>
                <h2 className={styles.fichaTitulo}>
                  <span>{o.artista}</span>
                  <em>{o.titulo}</em>
                </h2>
                <p className={styles.fichaTecnica}>
                  {o.ano} · {o.tecnica} · {o.acervo}
                </p>
                <h3 className={styles.h3}>Justificativa</h3>
                <p>{o.justificativa}</p>
                <h3 className={styles.h3}>Posição na planta</h3>
                <p>
                  <strong>{o.onde}.</strong> {o.porQueAqui}
                </p>
                {o.aConfirmar && <p className={styles.nota}>A confirmar antes da entrega: {o.aConfirmar}</p>}
              </div>
            </section>
          )
        })}

        {/* ---------- Tabela de posicionamento ---------- */}
        <section className={styles.pagina}>
          <p className={styles.eyebrow}>4 · Justificativa do posicionamento</p>
          <h2 className={styles.h2}>Por que cada obra está onde está.</h2>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Nº</th>
                <th>Obra</th>
                <th>Onde fica</th>
                <th>Por que aqui</th>
              </tr>
            </thead>
            <tbody>
              {obras.map((o) => (
                <tr key={o.n}>
                  <td>{o.n}</td>
                  <td>
                    {o.artista}, <em>{o.titulo}</em>
                  </td>
                  <td>{o.onde}</td>
                  <td>{o.porQueAqui}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ---------- Fontes ---------- */}
        <section className={styles.pagina}>
          <p className={styles.eyebrow}>5 · Fontes e créditos</p>
          <h2 className={styles.h2}>Fontes</h2>
          <ul className={styles.lista}>
            {fontes.map((f) => (
              <li key={f.obra}>
                <strong>{f.obra}</strong>
                <ul>
                  {f.itens.map((it) => (
                    <li key={it.label}>
                      {it.label}
                      {it.url && <span className={styles.url}> — {it.url}</span>}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className={styles.nota}>
            Velázquez, Artemisia Gentileschi e Almeida Júnior estão em domínio público; as demais obras são protegidas por direito autoral e aparecem aqui como uso educacional, sempre com crédito completo.
          </p>
          <p className={styles.assinatura}>
            Tomar Lugar · curadoria de {exposicao.autor} · {exposicao.ano}
          </p>
        </section>
      </main>
    </div>
  )
}

function descricaoSala(id: string) {
  switch (id) {
    case 'hall':
      return 'Quadrante inferior direito, abaixo do bloco interno. Entrada externa; passagem baixa para a Galeria Oeste; porta inferior da Sala B.'
    case 'galeria':
      return 'Quadrante inferior esquerdo. Liga-se ao Hall (passagem baixa), ao Corredor Oeste e à porta inferior da Sala A.'
    case 'corredor-oeste':
      return 'Faixa estreita à esquerda do bloco interno. Liga a Galeria Oeste ao Corredor Norte.'
    case 'corredor-norte':
      return 'Faixa larga acima do bloco interno. Liga-se ao Corredor Oeste e à porta superior da Sala B.'
    case 'sala-b':
      return 'Sala interna menor, à direita. Porta de cima (Corredor Norte), porta de baixo (Hall) e abertura para a Sala A.'
    case 'sala-a':
      return 'Sala interna maior, à esquerda, cercada por todos os outros espaços. Abertura para a Sala B e porta inferior para a Galeria Oeste.'
    default:
      return ''
  }
}
