/** Historico das movimentacoes do semestre. */
export default function Registro({ itens }) {
  return (
    <section className="card">
      <div className="chead">
        <div>
          <h2>Registro</h2>
          <p className="sub">Últimas movimentações.</p>
        </div>
      </div>

      {itens.length === 0 ? (
        <p className="vazio">
          Nenhuma movimentação ainda. As ações dos projetos aparecem aqui.
        </p>
      ) : (
        <div className="registro">
          {itens.slice(0, 12).map((r) => (
            <div className="registro-item" key={r.id}>
              <time>{r.hora}</time>
              <span>
                <b className="verbo" style={{ '--k': r.cor }}>
                  {r.verbo}
                </b>{' '}
                {r.texto}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
