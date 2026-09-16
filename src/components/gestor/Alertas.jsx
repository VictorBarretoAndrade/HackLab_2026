import { Atencao, Certo, Errado } from '../ui/icons.jsx'

const ICONE = { crit: Errado, warn: Atencao, good: Certo }

/** Alertas derivados dos dados. Cada um traz a acao recomendada, nao so o diagnostico. */
export default function Alertas({ itens }) {
  return (
    <section className="card">
      <div className="chead">
        <div>
          <h2>O que exige ação agora</h2>
          <p className="sub">Gerado a partir dos dados do recorte selecionado.</p>
        </div>
      </div>

      {itens.length === 0 ? (
        <p className="vazio">Nada exige ação neste recorte.</p>
      ) : (
        <div className="alertas">
          {itens.map((a) => {
            const Icone = ICONE[a.sev]
            return (
              <article className="alerta" data-sev={a.sev} key={a.id}>
                <span className="ic">
                  <Icone />
                </span>
                <div>
                  <h3>{a.titulo}</h3>
                  <p>{a.texto}</p>
                  <span className="quem">{a.quem}</span>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
