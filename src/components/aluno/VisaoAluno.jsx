import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ALUNO, PROJETOS_INICIAIS, ROTULO_STATUS } from '../../data/aluno.js'
import { skillPorId } from '../../data/skills.js'
import { HORAS_EXTENSAO, NIVEIS, n0 } from '../../lib/curriculo.js'
import { derivar, legendaArvore } from '../../lib/motorAluno.js'
import { useJardim } from '../../hooks/useJardim.js'
import { enfeitePorId } from '../../data/enfeites.js'
import { useAvisar } from '../ui/Toasts.jsx'
import ArvoreCanvas from './ArvoreCanvas.jsx'
import Jardim from './Jardim.jsx'
import ListaProjetos from './ListaProjetos.jsx'
import PainelSkills from './PainelSkills.jsx'
import Registro from './Registro.jsx'

const CHAVE = 'raiz:projetos'

const VERBO = {
  concluido: { v: 'Concluído', cor: 'var(--good)' },
  ativo: { v: 'Retomado', cor: 'var(--accent)' },
  atrasado: { v: 'Atrasado', cor: 'var(--warn)' },
  abandonado: { v: 'Abandonado', cor: 'var(--crit)' },
}

function carregar() {
  try {
    const bruto = JSON.parse(localStorage.getItem(CHAVE))
    if (Array.isArray(bruto) && bruto.length === PROJETOS_INICIAIS.length) {
      return PROJETOS_INICIAIS.map((p, i) =>
        ROTULO_STATUS[bruto[i]] ? { ...p, status: bruto[i] } : { ...p },
      )
    }
  } catch {
    /* storage indisponivel ou corrompido: cai no estado inicial */
  }
  return PROJETOS_INICIAIS.map((p) => ({ ...p }))
}

const agora = () => {
  const t = new Date()
  return String(t.getHours()).padStart(2, '0') + ':' + String(t.getMinutes()).padStart(2, '0')
}

export default function VisaoAluno() {
  const [projetos, setProjetos] = useState(carregar)
  const [registro, setRegistro] = useState([])
  const [novas, setNovas] = useState(() => new Set())
  const arvore = useRef(null)
  const avisar = useAvisar()
  const seq = useRef(0)

  const d = useMemo(() => derivar(projetos, ALUNO), [projetos])

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(projetos.map((p) => p.status)))
    } catch {
      /* sem persistencia neste navegador */
    }
  }, [projetos])

  // Limpa a animacao de entrada das competencias recem-desbloqueadas.
  useEffect(() => {
    if (novas.size === 0) return
    const id = setTimeout(() => setNovas(new Set()), 900)
    return () => clearTimeout(id)
  }, [novas])

  const chaveCompetencias = d.ativas.map((s) => s.id).join(',')
  const competencias = useMemo(
    () => d.ativas.map((s) => ({ id: s.id, cor: s.cor })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chaveCompetencias],
  )

  const logar = useCallback((verbo, texto, cor) => {
    setRegistro((r) => [{ id: ++seq.current, hora: agora(), verbo, texto, cor }, ...r])
  }, [])

  /* ---------- jardim: capina semanal, moedas e enfeites ---------- */
  const { jardim, estado, enfeites, acoes: acoesJardim } = useJardim()

  const jardimUI = useMemo(
    () => ({
      limpar() {
        const r = acoesJardim.limpar()
        if (r.ganho <= 0) return
        arvore.current?.faiscar(12, '#E8B44A')
        logar('Capina', `+${r.ganho} moedas`, '#E8B44A')
        avisar(
          r.sequencia > 1
            ? `Pé limpo! +${r.ganho} moedas · ${r.sequencia} semanas seguidas`
            : `Pé limpo! +${r.ganho} moedas`,
          '#E8B44A',
        )
      },
      comprar(e) {
        if (!acoesJardim.comprar(e)) return
        arvore.current?.faiscar(14, e.cor)
        logar('Comprou', e.nome, e.cor)
        avisar(`${e.nome} instalado na árvore.`, e.cor)
      },
      alternar(id) {
        acoesJardim.alternar(id)
        const e = enfeitePorId(id)
        const guardando = !jardim.guardados.includes(id)
        avisar(guardando ? `${e.nome} guardado.` : `${e.nome} de volta à árvore.`, e.cor)
      },
      adiantar() {
        acoesJardim.adiantar()
        avisar('Uma semana adiantada (demonstração).', 'var(--accent)')
      },
    }),
    [acoesJardim, avisar, logar, jardim.guardados],
  )

  const aplicar = useCallback(
    (idProjeto, novoStatus) => {
      const alvo = projetos.find((p) => p.id === idProjeto)
      if (!alvo || alvo.status === novoStatus) return

      const antesD = derivar(projetos, ALUNO)
      const depoisProjetos = projetos.map((p) =>
        p.id === idProjeto ? { ...p, status: novoStatus } : p,
      )
      const depoisD = derivar(depoisProjetos, ALUNO)

      const antes = new Set(antesD.ativas.map((s) => s.id))
      const depois = new Set(depoisD.ativas.map((s) => s.id))
      const ganhas = [...depois].filter((x) => !antes.has(x))
      const perdidas = [...antes].filter((x) => !depois.has(x))

      setProjetos(depoisProjetos)
      if (ganhas.length) setNovas(new Set(ganhas))

      const info = VERBO[novoStatus]
      logar(info.v, alvo.titulo, info.cor)

      if (novoStatus === 'concluido') {
        arvore.current?.pulsar()
        arvore.current?.faiscar(18)
        avisar(`+${alvo.horas} h validadas — a árvore cresceu.`, 'var(--good)')
        if (depoisD.nivel > antesD.nivel) {
          logar('Novo porte', NIVEIS[depoisD.nivel].nome, 'var(--leaf-live)')
          setTimeout(
            () => avisar('Novo porte: ' + NIVEIS[depoisD.nivel].nome, 'var(--leaf-live)'),
            320,
          )
        }
      } else if (novoStatus === 'atrasado') {
        avisar('Atraso registrado. A copa começa a perder folhas.', 'var(--warn)')
      } else if (novoStatus === 'abandonado') {
        avisar('Projeto abandonado. A árvore murcha rápido.', 'var(--crit)')
      } else {
        avisar('Projeto de volta ao ritmo.', 'var(--accent)')
      }

      ganhas.forEach((id) => {
        const s = skillPorId(id)
        logar('Nova cor', 'Soft skill ' + s.nome, s.cor)
        arvore.current?.faiscar(10, s.cor)
        setTimeout(() => avisar('Soft skill desbloqueada: ' + s.nome, s.cor), 260)
      })
      perdidas.forEach((id) => {
        const s = skillPorId(id)
        logar('Cor apagou', 'Soft skill ' + s.nome, 'var(--crit)')
      })
    },
    [projetos, avisar, logar],
  )

  const reiniciar = useCallback(() => {
    setProjetos(PROJETOS_INICIAIS.map((p) => ({ ...p })))
    setRegistro([])
    setNovas(new Set())
    avisar('Simulação reiniciada.', 'var(--accent)')
  }, [avisar])

  const nivel = NIVEIS[d.nivel]
  const pctHoras = Math.min(100, (d.horasTotais / HORAS_EXTENSAO) * 100)
  const corVit =
    d.vitalidade >= 70 ? 'var(--good)' : d.vitalidade >= 40 ? 'var(--warn)' : 'var(--crit)'

  const resumo =
    `Nível ${nivel.nome}, ${n0(d.horasTotais)} de ${n0(HORAS_EXTENSAO)} horas, ` +
    `vitalidade ${d.vitalidade}%, ${d.ativas.length} de ${d.skills.length} soft skills desbloqueadas.`

  return (
    <div className="page">
      <header className="aluno-hero">
        <div>
          <p className="eyebrow">Minha extensão · 2026.1</p>
          <h1>Sua árvore de extensão</h1>
          <p className="lede">
            Cada projeto concluído faz a árvore crescer de verdade. Atrasos e abandonos secam a
            copa — e as competências travam de novo.
          </p>
        </div>
        <div className="identidade">
          <div className="av" aria-hidden="true">
            {ALUNO.iniciais}
          </div>
          <div className="who">
            <b>{ALUNO.nome}</b>
            <span>
              {ALUNO.curso} · {ALUNO.semestre}º semestre
            </span>
          </div>
        </div>
      </header>

      <section className="card copa">
        <div className="palco">
          <div className="palco-tag">
            <span className="brilho" aria-hidden="true" />
            <p className="eyebrow">Estado atual da árvore</p>
          </div>
          <ArvoreCanvas
            ref={arvore}
            crescimento={d.crescimento}
            vitalidade={d.vitalidade / 100}
            competencias={competencias}
            totalCompetencias={d.skills.length}
            mato={estado.mato}
            enfeites={enfeites}
            descricao={resumo}
          />
          <p className="palco-legenda">{legendaArvore(d)}</p>
        </div>

        <aside className="trilha">
          <div>
            <p className="eyebrow">Porte</p>
            <p className="nivel">{nivel.nome}</p>
            <p className="posto">
              Nível {d.nivel + 1} de {NIVEIS.length}
            </p>
          </div>

          <div className="medidor">
            <div className="medidor-topo">
              <span className="eyebrow">Horas de extensão</span>
              <span className="v">
                {n0(d.horasTotais)} / {n0(HORAS_EXTENSAO)} h
              </span>
            </div>
            <div className="track">
              <i className="horas" style={{ width: pctHoras + '%' }} />
              {NIVEIS.slice(1).map((n) => (
                <span
                  className="marca"
                  key={n.min}
                  style={{ left: (n.min / HORAS_EXTENSAO) * 100 + '%' }}
                />
              ))}
            </div>
            <p className="pe">
              {d.proximo
                ? `Faltam ${n0(d.proximo.min - d.horasTotais)} h para virar ${d.proximo.nome}`
                : 'Porte máximo — as 360 h da CNE estão cumpridas.'}
            </p>
          </div>

          <div className="medidor">
            <div className="medidor-topo">
              <span className="eyebrow">Vitalidade</span>
              <span className="v">{d.vitalidade}%</span>
            </div>
            <div className="track">
              <i style={{ width: d.vitalidade + '%', background: corVit }} />
            </div>
            <p className="pe">
              {d.atrasados || d.abandonados
                ? [
                    d.atrasados ? `${d.atrasados} atraso${d.atrasados > 1 ? 's' : ''}` : null,
                    d.abandonados
                      ? `${d.abandonados} abandono${d.abandonados > 1 ? 's' : ''}`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(' e ') + ' drenando a copa'
                : 'Nenhuma pendência drenando a copa'}
            </p>
          </div>

          <div className="medidor">
            <div className="medidor-topo">
              <span className="eyebrow">Aderência ao {ALUNO.semestre}º sem</span>
              <span className="v">{Math.round(d.aderencia)}%</span>
            </div>
            <p className="pe">
              A coordenação vê exatamente este número: {n0(d.horasTotais)} h de{' '}
              {n0(d.metaSemestre)} h esperadas.
            </p>
          </div>

          <div className="contagem">
            <div className="c-good">
              <b>{d.concluidos}</b>
              <span>Concluídos</span>
            </div>
            <div className="c-warn">
              <b>{d.atrasados}</b>
              <span>Atrasados</span>
            </div>
            <div className="c-crit">
              <b>{d.abandonados}</b>
              <span>Abandonos</span>
            </div>
          </div>
        </aside>
      </section>

      <div className="aluno-baixo">
        <div className="aluno-col">
          <ListaProjetos
            projetos={projetos}
            skills={d.skills}
            horasSemestre={d.horasSemestre}
            onAcao={aplicar}
            onReiniciar={reiniciar}
          />
        </div>
        <div className="aluno-col">
          <Jardim jardim={jardim} estado={estado} acoes={jardimUI} />
          <PainelSkills skills={d.skills} novas={novas} />
          <Registro itens={registro} />
        </div>
      </div>
    </div>
  )
}
