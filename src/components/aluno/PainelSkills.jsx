/** Bosque de competencias. Cada uma desbloqueada tinge uma faixa das folhas. */
export default function PainelSkills({ skills, novas }) {
  const ativas = skills.filter((s) => s.ok).length

  return (
    <section className="card">
      <div className="chead">
        <div>
          <h2>Soft skills</h2>
          <p className="sub">Cada competência exige 2 projetos concluídos que a exercitem.</p>
        </div>
        <span className="sub tnum">
          {ativas} / {skills.length} · tingem a copa
        </span>
      </div>

      <div className="bosque">
        {skills.map((s) => (
          <div
            className="skill"
            key={s.id}
            data-ok={String(s.ok)}
            data-novo={String(novas.has(s.id))}
            style={{ '--o': s.cor }}
          >
            <span className="ico">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={s.d} />
              </svg>
            </span>
            <b>{s.nome}</b>
            <div className="prog">
              <div className="track">
                <i style={{ width: (s.feitos / s.req) * 100 + '%' }} />
              </div>
              <span className="n">
                {s.feitos}/{s.req}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
