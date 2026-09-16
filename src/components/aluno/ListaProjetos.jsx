import { ACOES, ROTULO_STATUS, TOM_STATUS } from '../../data/aluno.js'
import { ICONE_STATUS } from '../ui/icons.jsx'
import { Chip } from '../ui/Chip.jsx'

/** Ledger de projetos: linhas com faixa de status, num unico cartao. */
export default function ListaProjetos({ projetos, skills, onAcao, onReiniciar, horasSemestre }) {
  const totalHoras = projetos.reduce((s, p) => s + p.horas, 0)

  return (
    <section className="card">
      <div className="chead">
        <div>
          <h2>Projetos de extensão</h2>
          <p className="sub">Use as ações para simular o semestre — a árvore reage na hora.</p>
        </div>
      </div>

      <div className="ledger">
        {projetos.map((p) => {
          const Icone = ICONE_STATUS[p.status]
          return (
            <article className="linha" data-status={p.status} key={p.id}>
              <div className="linha-topo">
                <div>
                  <h3 className="titulo">{p.titulo}</h3>
                  <p className="meta">
                    <span>{p.area}</span>
                    <span className="sep">/</span>
                    <span className="tnum">{p.horas} h</span>
                    <span className="sep">/</span>
                    <span>entrega {p.prazo}</span>
                  </p>
                </div>
                <Chip tom={TOM_STATUS[p.status]} Icone={Icone}>
                  {ROTULO_STATUS[p.status]}
                </Chip>
              </div>

              <div className="tags">
                {p.skills.map((id) => {
                  const sk = skills.find((s) => s.id === id)
                  return (
                    <span
                      className="tag"
                      data-ok={String(sk.ok)}
                      style={{ '--o': sk.cor }}
                      key={id}
                    >
                      <span className="o" />
                      {sk.nome}
                    </span>
                  )
                })}
              </div>

              <div className="acoes">
                {ACOES[p.status].map((a) => (
                  <button
                    type="button"
                    className={'btn ' + a.variante}
                    key={a.para}
                    onClick={() => onAcao(p.id, a.para)}
                  >
                    {a.rotulo}
                  </button>
                ))}
              </div>
            </article>
          )
        })}
      </div>

      <div className="ledger-pe">
        <span className="nota tnum">
          {horasSemestre} h de {totalHoras} h concluídas neste semestre
        </span>
        <button type="button" className="btn" onClick={onReiniciar}>
          Reiniciar simulação
        </button>
      </div>
    </section>
  )
}
