/** Tabela + mini-barra: onde a turma evade, por projeto. */
export default function TabelaProjetos({ projetos }) {
  const total = projetos.reduce((s, p) => s + p.insc, 0)
  const maxEvasao = Math.max(...projetos.map((p) => p.evasao))

  return (
    <section className="card">
      <div className="chead">
        <div>
          <h2>Onde a turma evade — por projeto</h2>
          <p className="sub">
            Todos os {total} vínculos de alunos nos projetos ativos do semestre. Não afetado pelo
            filtro acima.
          </p>
        </div>
      </div>

      <div className="tblwrap">
        <table>
          <caption className="sr">Evasão por projeto de extensão</caption>
          <thead>
            <tr>
              <th>Projeto</th>
              <th>Área</th>
              <th className="n">Inscritos</th>
              <th className="n">Concluíram</th>
              <th className="n">Atrasados</th>
              <th className="n">Abandonos</th>
              <th style={{ minWidth: 180 }}>Evasão</th>
            </tr>
          </thead>
          <tbody>
            {projetos.map((p) => (
              <tr key={p.nome}>
                <td>{p.nome}</td>
                <td style={{ color: 'var(--ink-2)' }}>{p.area}</td>
                <td className="n">{p.insc}</td>
                <td className="n">{p.concl}</td>
                <td className="n">{p.atras}</td>
                <td className="n">{p.aband}</td>
                <td>
                  <span className="minibar" data-alerta={String(p.evasao >= 35)}>
                    <i style={{ width: (p.evasao / maxEvasao) * 100 + '%' }} />
                  </span>
                  <span className="tnum" style={{ fontWeight: 600 }}>
                    {Math.round(p.evasao)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
