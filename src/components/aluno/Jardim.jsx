import { ENFEITES } from '../../data/enfeites.js'
import { descreveMato, faltaEmTexto } from '../../lib/jardim.js'
import { Moeda, Tesoura } from '../ui/icons.jsx'

/**
 * Cuidado semanal + lojinha.
 *
 * O loop e simples de proposito: aparecer uma vez por semana, capinar o pe da
 * arvore, receber moedas e gastar em enfeites. A sequencia de semanas aumenta
 * a recompensa, entao faltar custa mais que o dia perdido.
 */
export default function Jardim({ jardim, estado, acoes }) {
  const { mato, pode, faltam, proximoGanho } = estado
  const pctMato = Math.min(100, (mato / 1.5) * 100)

  const corMato = mato < 0.7 ? 'var(--good)' : mato < 1.05 ? 'var(--warn)' : 'var(--crit)'

  return (
    <section className="card">
      <div className="chead">
        <div>
          <h2>Jardim</h2>
          <p className="sub">Capine o pé da árvore uma vez por semana e ganhe moedas.</p>
        </div>
        <span className="saldo" title="Moedas disponíveis">
          <Moeda />
          <b className="tnum">{jardim.moedas}</b>
        </span>
      </div>

      <div className="capina">
        <div className="medidor">
          <div className="medidor-topo">
            <span className="eyebrow">Mato no pé da árvore</span>
            <span className="v">{Math.round(pctMato)}%</span>
          </div>
          <div className="track">
            <i style={{ width: pctMato + '%', background: corMato }} />
          </div>
          <p className="pe">{descreveMato(mato)}</p>
        </div>

        <div className="capina-acao">
          <button
            type="button"
            className="btn primary"
            onClick={acoes.limpar}
            disabled={!pode}
            title={pode ? undefined : `Disponível em ${faltaEmTexto(faltam)}`}
          >
            <Tesoura />
            {pode ? `Limpar o mato · +${proximoGanho}` : `Volte em ${faltaEmTexto(faltam)}`}
          </button>
          <span className="sequencia">
            {jardim.sequencia > 0
              ? `${jardim.sequencia} ${jardim.sequencia > 1 ? 'semanas seguidas' : 'semana'} · próxima limpeza vale ${proximoGanho}`
              : 'Primeira capina: vale 25 moedas'}
          </span>
        </div>
      </div>

      <div className="loja">
        {ENFEITES.map((e) => {
          const comprado = jardim.comprados.includes(e.id)
          const guardado = jardim.guardados.includes(e.id)
          const podeComprar = !comprado && jardim.moedas >= e.preco

          return (
            <div className="enfeite" key={e.id} data-comprado={String(comprado)}>
              <span className="amostra" style={{ '--o': e.cor }} aria-hidden="true" />
              <div className="enfeite-txt">
                <b>{e.nome}</b>
                <span>{e.desc}</span>
              </div>

              {comprado ? (
                <button
                  type="button"
                  className="btn mini"
                  onClick={() => acoes.alternar(e.id)}
                  aria-pressed={!guardado}
                >
                  {guardado ? 'Guardado' : 'Na árvore'}
                </button>
              ) : (
                <button
                  type="button"
                  className={'btn mini' + (podeComprar ? ' primary' : '')}
                  onClick={() => acoes.comprar(e)}
                  disabled={!podeComprar}
                  title={podeComprar ? undefined : `Faltam ${e.preco - jardim.moedas} moedas`}
                >
                  <Moeda />
                  {e.preco}
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className="jardim-pe">
        <span className="nota">Demonstração: a capina real libera a cada 7 dias.</span>
        <button type="button" className="btn" onClick={acoes.adiantar}>
          Adiantar 1 semana
        </button>
      </div>
    </section>
  )
}
