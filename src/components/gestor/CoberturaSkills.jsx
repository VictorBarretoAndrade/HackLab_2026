import { Linha, useTooltip } from '../ui/Tooltip.jsx'

/**
 * Serie unica, uma cor so. Todas as barras levam rotulo direto: o aqua mede
 * 2,74:1 contra a superficie clara, abaixo de 3:1, e a regra de relevo exige
 * rotulo visivel ou vista de tabela.
 */
export default function CoberturaSkills({ cobertura, total }) {
  const tip = useTooltip()

  return (
    <section className="card">
      <div className="chead">
        <div>
          <h2>Cobertura de soft skills na turma</h2>
          <p className="sub">Percentual de alunos que já desenvolveram cada competência.</p>
        </div>
      </div>

      <div className="barras">
        {total === 0 ? (
          <p className="barras-pe">Nenhum aluno neste recorte.</p>
        ) : (
          cobertura.map((c) => (
            <div className="barra" key={c.id}>
              <span className="nm">{c.nome}</span>
              <span
                className="pista"
                tabIndex={0}
                role="img"
                aria-label={`${c.nome}: ${Math.round(c.pct)} por cento da turma`}
                {...tip(
                  <>
                    <b>{c.nome}</b>
                    <Linha rotulo="Alunos com a competência" valor={`${c.q} de ${total}`} />
                  </>,
                )}
              >
                <i data-faixa="serie" style={{ width: c.pct + '%' }} />
              </span>
              <span className="vl">{Math.round(c.pct)}%</span>
            </div>
          ))
        )}
      </div>

      <p className="barras-pe">
        {total > 0
          ? `Base: ${total} aluno${total > 1 ? 's' : ''} no recorte. Contabilizada após 2 projetos concluídos que a exercitem.`
          : 'Ajuste o recorte para ver a cobertura.'}
      </p>
    </section>
  )
}
