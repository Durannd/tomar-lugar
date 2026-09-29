import { useMemo } from 'react'
import { ancoras, fenda, portas, rotaIda, rotaSaida, salas, walls, SVG_VIEWBOX } from '../../data/planta'
import { movimentos } from '../../data/movimentos'
import { obras } from '../../data/obras'
import { lengthUntilNearest, polylineLength, polylineToPath } from '../../lib/planta-geom'
import styles from './PlantaSVG.module.css'

interface Props {
  /** 'tela' = escura, interativa; 'print' = clara, com legenda completa */
  modo?: 'tela' | 'print'
  obraAtual?: number
  movimentoAtual?: number
  /** desenha a legenda à direita (só faz sentido em print ou telas largas) */
  legenda?: boolean
  className?: string
  onObraClick?: (n: number) => void
}

const R = 11

export default function PlantaSVG({ modo = 'tela', obraAtual = 0, movimentoAtual = 0, legenda = false, className, onObraClick }: Props) {
  const print = modo === 'print'
  const idaPath = useMemo(() => polylineToPath(rotaIda), [])
  const saidaPath = useMemo(() => polylineToPath(rotaSaida), [])
  const idaLen = useMemo(() => polylineLength(rotaIda), [])
  const saidaLen = useMemo(() => polylineLength(rotaSaida), [])

  // Quanto do percurso já foi "caminhado" até a obra atual (modo tela)
  const progresso = useMemo(() => {
    if (print) return { ida: idaLen, saida: saidaLen }
    if (obraAtual <= 0) return { ida: 0, saida: 0 }
    const alvo = ancoras[obraAtual].vista
    if (obraAtual >= 10) return { ida: idaLen, saida: obraAtual === 10 && movimentoAtual > 6 ? saidaLen : 0 }
    return { ida: lengthUntilNearest(rotaIda, alvo) + 30, saida: 0 }
  }, [print, obraAtual, movimentoAtual, idaLen, saidaLen])

  const movAtivo = movimentos.find((m) => m.ordem === movimentoAtual)
  const salaAtiva = print ? undefined : movAtivo?.salaId
  const vb = legenda ? `0 0 ${SVG_VIEWBOX.w} ${SVG_VIEWBOX.h}` : `24 40 500 560`

  return (
    <svg
      viewBox={vb}
      className={`${styles.svg} ${print ? styles.print : styles.tela} ${className ?? ''}`}
      role="img"
      aria-label="Planta baixa da exposição com as dez obras numeradas e o percurso sugerido"
      fontSize="13"
    >
      <defs>
        <marker id="pl-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" className={styles.arrowHead} />
        </marker>
        <marker id="pl-arrow-saida" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" className={styles.arrowHeadSaida} />
        </marker>
        <radialGradient id="pl-glow">
          <stop offset="0" stopColor="var(--ouro-2)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--ouro-2)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* salas */}
      <g className={styles.salas}>
        {salas.map((s) => {
          const [x1, y1, x2, y2] = s.rect
          const ativa = s.id === salaAtiva
          return (
            <g key={s.id}>
              <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} className={`${styles.sala} ${ativa ? styles.salaAtiva : ''}`} />
              <text
                x={s.label[0]}
                y={s.label[1]}
                textAnchor="middle"
                className={`${styles.salaNome} ${ativa ? styles.salaNomeAtiva : ''}`}
                transform={s.labelRot ? `rotate(${s.labelRot} ${s.label[0]} ${s.label[1]})` : undefined}
              >
                {s.nome}
              </text>
            </g>
          )
        })}
      </g>

      {/* fenda Shibboleth */}
      <path d={polylineToPath(fenda)} className={`${styles.fenda} ${obraAtual === 5 ? styles.fendaAtiva : ''}`} />

      {/* portas (marcas discretas) */}
      <g className={styles.portas}>
        {portas.map((p) => (
          <line key={p.id} x1={p.a[0]} y1={p.a[1]} x2={p.b[0]} y2={p.b[1]} className={p.noPercurso ? styles.porta : styles.portaFora} />
        ))}
      </g>

      {/* paredes */}
      <g className={styles.paredes}>
        {walls.map((w, i) => (
          <line key={i} x1={w.a[0]} y1={w.a[1]} x2={w.b[0]} y2={w.b[1]} />
        ))}
      </g>

      {/* percurso */}
      <path
        d={idaPath}
        className={`${styles.rota} ${styles.rotaIda}`}
        markerEnd={progresso.ida >= idaLen - 1 ? 'url(#pl-arrow)' : undefined}
        style={{ strokeDasharray: idaLen, strokeDashoffset: idaLen - progresso.ida }}
        pathLength={idaLen}
      />
      <path
        d={saidaPath}
        className={`${styles.rota} ${styles.rotaSaida}`}
        markerEnd={progresso.saida >= saidaLen - 1 ? 'url(#pl-arrow-saida)' : undefined}
        style={{ strokeDasharray: saidaLen, strokeDashoffset: saidaLen - progresso.saida }}
        pathLength={saidaLen}
      />
      {print && (
        <>
          <path d={idaPath} className={styles.rotaPrint} markerEnd="url(#pl-arrow)" />
          <path d={saidaPath} className={styles.rotaPrintSaida} markerEnd="url(#pl-arrow-saida)" />
        </>
      )}

      {/* obras */}
      <g className={styles.obras}>
        {obras.map((o) => {
          const a = ancoras[o.n]
          const [px, py] = a.pos
          const [nx, ny] = a.normal
          const cx = px + nx * 13
          const cy = py + ny * 13
          const ativa = o.n === obraAtual
          const visitada = !print && obraAtual > o.n
          return (
            <g
              key={o.n}
              className={`${styles.obra} ${ativa ? styles.obraAtiva : ''} ${visitada ? styles.obraVisitada : ''} ${o.n === 10 ? styles.obraArtemisia : ''}`}
              onClick={onObraClick ? () => onObraClick(o.n) : undefined}
              role={onObraClick ? 'button' : undefined}
              tabIndex={onObraClick ? 0 : undefined}
            >
              <title>{`${o.n} — ${o.artista}, ${o.titulo}`}</title>
              {ativa && <circle cx={cx} cy={cy} r={R * 3} fill="url(#pl-glow)" className={styles.glow} />}
              <circle cx={cx} cy={cy} r={R} className={styles.dot} />
              <text x={cx} y={cy + 4} textAnchor="middle" className={styles.num}>
                {o.n}
              </text>
            </g>
          )
        })}
      </g>

      <text x={440} y={588} textAnchor="middle" className={styles.entrada}>
        Entrada / Saída
      </text>

      {legenda && (
        <g className={styles.legenda} transform="translate(516 0)">
          <text x={0} y={70} className={styles.legendaTitulo}>
            Legenda
          </text>
          {obras.map((o, i) => {
            const mov = movimentos.find((m) => m.id === o.movimento)!
            const y = 96 + i * 40
            return (
              <g key={o.n} className={o.n === 10 ? styles.obraArtemisia : undefined}>
                <circle cx={11} cy={y} r={R} className={styles.dot} />
                <text x={11} y={y + 4} textAnchor="middle" className={styles.num}>
                  {o.n}
                </text>
                <text x={30} y={y + 4} className={styles.legendaNome}>
                  {o.artista}
                </text>
                <text x={30} y={y + 20} className={styles.legendaLocal}>
                  {mov.espaco.split(' — ')[0]} · {mov.titulo}
                </text>
              </g>
            )
          })}
          <line x1={0} y1={506} x2={32} y2={506} className={styles.legendaIda} />
          <text x={40} y={510} className={styles.legendaTexto}>
            Percurso sugerido
          </text>
          <line x1={0} y1={528} x2={32} y2={528} className={styles.legendaSaida} />
          <text x={40} y={532} className={styles.legendaTexto}>
            Saída pelo mesmo acesso
          </text>
        </g>
      )}
    </svg>
  )
}
