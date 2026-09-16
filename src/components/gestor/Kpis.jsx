import { TETO_VIAVEL, n0 } from '../../lib/curriculo.js'

/**
 * Linha de KPIs. Figuras grandes usam algarismos PROPORCIONAIS (sem
 * tabular-nums): largura igual em todo digito deixa "121" frouxo em corpo
 * grande. Tabular fica reservado para colunas que alinham verticalmente.
 */
export default function Kpis({ ag, piorSkill, total }) {
  return (
    <div className="kpis">
      <div className="card tile hero">
        <span className="rot">Aderência da turma à meta curricular</span>
        <span className="val">{Math.round(ag.pct)}%</span>
        <div className="track">
          <i style={{ width: Math.min(100, ag.pct) + '%' }} />
        </div>
        <span className="nota">
          {n0(ag.horas)} h cumpridas de {n0(ag.meta)} h esperadas até aqui
        </span>
      </div>

      <div className="card tile">
        <span className="rot">Sem tempo hábil de integralizar</span>
        <span className="val">{ag.inviaveis}</span>
        <span className="nota">
          {ag.inviaveis
            ? `precisariam de mais de ${TETO_VIAVEL} h/semestre`
            : 'todos ainda conseguem integralizar'}
        </span>
      </div>

      <div className="card tile">
        <span className="rot">Em estado crítico</span>
        <span className="val">{ag.criticos}</span>
        <span className="nota">
          {ag.criticos} de {total} abaixo de 70% da meta
        </span>
      </div>

      <div className="card tile">
        <span className="rot">Competência mais escassa</span>
        <span className="val">{piorSkill ? Math.round(piorSkill.pct) + '%' : '—'}</span>
        <span className="nota">
          {piorSkill ? `da turma desenvolveu ${piorSkill.nome}` : 'sem alunos no recorte'}
        </span>
      </div>
    </div>
  )
}
