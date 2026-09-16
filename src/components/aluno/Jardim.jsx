import { ENFEITES } from '../../data/enfeites.js'
import { SALDO_INICIAL, descreveMato, faltaEmTexto } from '../../lib/jardim.js'
import { Moeda, Tesoura } from '../ui/icons.jsx'

/**
 * Cuidado semanal + lojinha.
 *
 * O loop e simples de proposito: aparecer uma vez por semana, capinar o pe da
 * arvore, receber moedas e gastar em enfeites. A sequencia de semanas aumenta
 * a recompensa, entao faltar custa mais que o dia perdido.
 *
 * Os botoes dos enfeites dizem a ACAO ("Tirar", "Pôr"), nao o estado. Um botao
 * rotulado com o estado atual e sempre ambiguo: nao da para saber se ele
 * descreve onde a coisa esta ou o que o clique vai fazer.
 */
export default function Jardim({ jardim, estado, acoes }) {
  const { mato, pode, faltam, proximoGanho } = estado
  const pctMato = Math.min(100, (mato / 1.5) * 100)
  const corMato = mato < 0.7 ? 'var(--good)' : mato < 1.05 ? 'var(--warn)' : 'var(--crit)'

  const naArvore = jardim.comprados.filter((id) => !jardim.guardados.includes(id))
  const temPostos = naArvore.length > 0
  const temGuardados = jardim.guardados.length > 0

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
            data-tour="capinar"
            onClick={acoes.limpar}
            disabled={!pode}
            title={pode ? undefined : `Disponível em ${faltaEmTexto(faltam)}`}
          >
            <Tesoura />
            {pode ? `Limpar o mato · +${proximoGanho}` : `Volte em ${faltaEmTexto(faltam)}`}
          </button>
          <span className="sequencia">
            {jardim.sequencia > 0
              ? `${jardim.sequencia} ${jardim.sequencia > 1 ? 'semanas seguidas' : 'semana'} · a próxima vale ${proximoGanho}`
              : `Primeira capina: vale ${proximoGanho} moedas`}
          </span>
        </div>
      </div>

      <div className="loja">
        {ENFEITES.map((e) => {
          const comprado = jardim.comprados.includes(e.id)
          const guardado = jardim.guardados.includes(e.id)
          const posto = comprado && !guardado
          const podeComprar = !comprado && jardim.moedas >= e.preco

          return (
            <div
              className="enfeite"
              key={e.id}
              data-comprado={String(comprado)}
              data-posto={String(posto)}
            >
              <span className="amostra" style={{ '--o': e.cor }} aria-hidden="true" />
              <div className="enfeite-txt">
                <b>{e.nome}</b>
                <span>{posto ? 'Na árvore agora' : comprado ? 'Guardado' : e.desc}</span>
              </div>

              {comprado ? (
                <button
                  type="button"
                  className={'btn mini' + (guardado ? ' primary' : '')}
                  onClick={() => acoes.alternar(e.id)}
                >
                  {guardado ? 'Pôr' : 'Tirar'}
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
        <div className="jardim-botoes">
          {temPostos ? (
            <button type="button" className="btn" onClick={acoes.tirarTodos}>
              Tirar todos da árvore
            </button>
          ) : null}
          {temGuardados ? (
            <button type="button" className="btn" onClick={acoes.porTodos}>
              Pôr todos na árvore
            </button>
          ) : null}
          <button type="button" className="btn" onClick={acoes.adiantar}>
            Adiantar 1 semana
          </button>
        </div>
        <p className="nota">
          Ambiente de teste: você começa com {SALDO_INICIAL} moedas e a capina paga mais que o
          normal, para dar tempo de experimentar todos os enfeites.{' '}
          <button type="button" className="link" onClick={acoes.zerar}>
            Reiniciar jardim
          </button>
        </p>
      </div>
    </section>
  )
}
