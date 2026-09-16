import { n0 } from '../../lib/curriculo.js'
import { useMedida } from '../../hooks/useMedida.js'
import { Linha, useTooltip } from '../ui/Tooltip.jsx'

const ALTURA = 268
const PAD = { t: 22, r: 86, b: 34, l: 46 }
const Y_MAX = 400
const TICKS = [0, 100, 200, 300, 400]

/**
 * Media de horas acumuladas por semestre cursado contra a exigencia.
 *
 * Uma serie de dados (a turma) mais uma linha de REFERENCIA (a exigencia).
 * A referencia e cromo, nao serie — por isso fica em tinta recessiva, solida
 * (nunca tracejada) e com rotulo direto na ponta.
 */
export default function GraficoDefasagem({ pontos }) {
  const [ref, largura] = useMedida()
  const tip = useTooltip()

  const W = Math.max(320, largura - 24)
  const podeDesenhar = pontos.length >= 2 && largura > 0

  const x0 = podeDesenhar ? pontos[0].sem : 0
  const x1 = podeDesenhar ? pontos[pontos.length - 1].sem : 1
  const X = (s) => PAD.l + ((s - x0) / Math.max(1, x1 - x0)) * (W - PAD.l - PAD.r)
  const Y = (v) => PAD.t + (1 - v / Y_MAX) * (ALTURA - PAD.t - PAD.b)

  const caminho = (campo) =>
    pontos.map((p, i) => (i ? 'L' : 'M') + X(p.sem) + ' ' + Y(p[campo])).join(' ')

  const ultimo = podeDesenhar ? pontos[pontos.length - 1] : null

  return (
    <section className="card">
      <div className="chead">
        <div>
          <h2>Onde a defasagem começa</h2>
          <p className="sub">
            Média de horas acumuladas por semestre cursado, contra a exigência curricular.
          </p>
        </div>
      </div>

      <div className="plot" ref={ref}>
        {!podeDesenhar ? (
          <p style={{ padding: '34px 8px 40px', color: 'var(--muted)', fontSize: 13 }}>
            {pontos.length === 1
              ? 'Só um semestre no recorte — a curva precisa de pelo menos dois pontos.'
              : 'Nenhum aluno neste recorte.'}
          </p>
        ) : (
          <svg
            width={W}
            height={ALTURA}
            role="img"
            aria-label="Média de horas acumuladas por semestre contra a exigência curricular"
          >
            {TICKS.map((t) => (
              <g key={t}>
                <line
                  x1={PAD.l}
                  y1={Y(t)}
                  x2={W - PAD.r}
                  y2={Y(t)}
                  stroke="var(--grid)"
                  strokeWidth="1"
                />
                <text
                  x={PAD.l - 9}
                  y={Y(t) + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="var(--muted)"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {t}
                </text>
              </g>
            ))}

            <text x={PAD.l} y={PAD.t - 8} fontSize="10.5" fill="var(--muted)" letterSpacing=".08em">
              HORAS ACUMULADAS
            </text>

            {pontos.map((p) => (
              <text
                key={'x' + p.sem}
                x={X(p.sem)}
                y={ALTURA - PAD.b + 18}
                textAnchor="middle"
                fontSize="11.5"
                fill="var(--muted)"
              >
                {p.sem}º
              </text>
            ))}

            {/* referencia: exigencia acumulada */}
            <path
              d={caminho('meta')}
              fill="none"
              stroke="var(--axis)"
              strokeWidth="1.6"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* serie: media da turma */}
            <path
              d={`${caminho('media')} L${X(ultimo.sem)} ${Y(0)} L${X(pontos[0].sem)} ${Y(0)} Z`}
              fill="var(--series-wash)"
            />
            <path
              d={caminho('media')}
              fill="none"
              stroke="var(--series)"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* marcadores com anel de 2px na cor da superficie */}
            {pontos.map((p) => (
              <circle
                key={'m' + p.sem}
                cx={X(p.sem)}
                cy={Y(p.media)}
                r="4.5"
                fill="var(--series)"
                stroke="var(--surface)"
                strokeWidth="2"
              />
            ))}

            {/* rotulos diretos so nas pontas */}
            <text
              x={X(ultimo.sem) + 10}
              y={Y(ultimo.media) + 4}
              fontSize="12"
              fontWeight="600"
              fill="var(--ink)"
            >
              {n0(ultimo.media)} h
            </text>
            <text
              x={X(ultimo.sem) + 10}
              y={Y(ultimo.meta) + 4}
              fontSize="11.5"
              fill="var(--muted)"
            >
              {n0(ultimo.meta)} h exig.
            </text>

            {/* alvos de hover bem maiores que os marcadores */}
            {pontos.map((p) => (
              <rect
                key={'h' + p.sem}
                x={X(p.sem) - 22}
                y={PAD.t}
                width="44"
                height={ALTURA - PAD.t - PAD.b}
                fill="transparent"
                tabIndex={0}
                role="img"
                aria-label={`${p.sem}º semestre: média ${n0(p.media)} horas, exigido ${n0(p.meta)} horas`}
                {...tip(
                  <>
                    <b>{p.sem}º semestre</b>
                    <Linha rotulo="Média da turma" valor={`${n0(p.media)} h`} />
                    <Linha rotulo="Exigido até aqui" valor={`${n0(p.meta)} h`} />
                    <Linha
                      rotulo="Defasagem"
                      valor={
                        p.meta - p.media > 0
                          ? `−${n0(p.meta - p.media)} h`
                          : `+${n0(p.media - p.meta)} h`
                      }
                    />
                    <Linha rotulo="Alunos" valor={String(p.qtd)} />
                  </>,
                )}
              />
            ))}
          </svg>
        )}
      </div>

      <div className="legenda">
        <span>
          <i style={{ '--k': 'var(--series)' }} />
          Média da turma
        </span>
        <span>
          <i style={{ '--k': 'var(--axis)' }} />
          Exigência acumulada (36 h × semestre)
        </span>
      </div>
    </section>
  )
}
