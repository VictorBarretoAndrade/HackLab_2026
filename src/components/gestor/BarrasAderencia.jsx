import { useState } from 'react'
import { HORAS_EXTENSAO, ROTULO_FAIXA, n0, n1 } from '../../lib/curriculo.js'
import { ICONE_FAIXA } from '../ui/icons.jsx'
import { Chip } from '../ui/Chip.jsx'
import { Linha, useTooltip } from '../ui/Tooltip.jsx'

/** Escala 0–120%, entao a linha de meta cai a 100/120 = 83,333% da pista. */
const ESCALA_MAX = 120

const TOM = { bom: 'good', atencao: 'warn', critico: 'crit' }

export default function BarrasAderencia({ alunos }) {
  const [vista, setVista] = useState('grafico')
  const tip = useTooltip()
  const ordenado = [...alunos].sort((a, b) => b.aderencia - a.aderencia)

  return (
    <section className="card">
      <div className="chead">
        <div>
          <h2>Aderência de cada aluno ao seu semestre</h2>
          <p className="sub">
            Horas cumpridas ÷ horas esperadas (36 h × semestre). A linha marca 100%.
          </p>
        </div>
        <div className="vista" role="group" aria-label="Formato de exibição">
          <button
            type="button"
            aria-pressed={vista === 'grafico'}
            onClick={() => setVista('grafico')}
          >
            Gráfico
          </button>
          <button
            type="button"
            aria-pressed={vista === 'tabela'}
            onClick={() => setVista('tabela')}
          >
            Tabela
          </button>
        </div>
      </div>

      {vista === 'grafico' ? (
        <div className="barras">
          {ordenado.length > 0 ? <div className="linha-meta" aria-hidden="true">
            <span>meta 100%</span>
          </div> : null}

          {ordenado.length === 0 ? (
            <p className="barras-pe">Nenhum aluno neste recorte.</p>
          ) : (
            ordenado.map((a) => (
              <div className="barra" key={a.mat}>
                <span className="nm">
                  {a.nome}
                  <small>
                    {a.sem}º sem · {a.mat}
                  </small>
                </span>
                <span
                  className="pista"
                  tabIndex={0}
                  role="img"
                  aria-label={`${a.nome}: ${Math.round(a.aderencia)} por cento da meta, faixa ${ROTULO_FAIXA[a.faixa]}`}
                  {...tip(
                    <>
                      <b>{a.nome}</b>
                      <Linha rotulo="Horas cumpridas" valor={`${n0(a.horas)} h`} />
                      <Linha rotulo={`Esperado no ${a.sem}º sem`} valor={`${n0(a.meta)} h`} />
                      <Linha
                        rotulo={`Faltam para as ${n0(HORAS_EXTENSAO)} h`}
                        valor={`${n0(a.faltam)} h`}
                      />
                      <Linha
                        rotulo="Ritmo necessário"
                        valor={a.restam > 0 ? `${n1(a.ritmo)} h/sem` : 'sem semestres'}
                      />
                    </>,
                  )}
                >
                  <i
                    data-faixa={a.faixa}
                    style={{ width: Math.min(100, (a.aderencia / ESCALA_MAX) * 100) + '%' }}
                  />
                </span>
                <span className="vl">{Math.round(a.aderencia)}%</span>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="tblwrap">
          <table>
            <caption className="sr">
              Aderência de cada aluno à meta curricular do seu semestre
            </caption>
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Matrícula</th>
                <th className="n">Sem.</th>
                <th className="n">Horas</th>
                <th className="n">Esperado</th>
                <th className="n">Aderência</th>
                <th className="n">Ritmo nec.</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {ordenado.map((a) => (
                <tr key={a.mat}>
                  <td>{a.nome}</td>
                  <td className="mono">{a.mat}</td>
                  <td className="n">{a.sem}º</td>
                  <td className="n">{n0(a.horas)} h</td>
                  <td className="n">{n0(a.meta)} h</td>
                  <td className="n">{Math.round(a.aderencia)}%</td>
                  <td className="n">{a.restam > 0 ? `${n1(a.ritmo)} h` : '—'}</td>
                  <td>
                    <Chip tom={TOM[a.faixa]} Icone={ICONE_FAIXA[a.faixa]}>
                      {ROTULO_FAIXA[a.faixa]}
                    </Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="barras-pe">Faixas: em dia ≥ 90% · atenção 70–89% · crítico &lt; 70%.</p>
    </section>
  )
}
