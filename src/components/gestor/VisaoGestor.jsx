import { useMemo, useState } from 'react'
import { ALUNOS } from '../../data/turma.js'
import {
  HORAS_CURSO,
  HORAS_EXTENSAO,
  HORAS_POR_SEMESTRE,
  SEMESTRES,
  n0,
} from '../../lib/curriculo.js'
import {
  agregados,
  coberturas,
  curvaDefasagem,
  derivarAluno,
  gerarAlertas,
  projetosOrdenados,
} from '../../lib/motorGestor.js'
import { Documento } from '../ui/icons.jsx'
import Kpis from './Kpis.jsx'
import BarrasAderencia from './BarrasAderencia.jsx'
import Alertas from './Alertas.jsx'
import CoberturaSkills from './CoberturaSkills.jsx'
import GraficoDefasagem from './GraficoDefasagem.jsx'
import TabelaProjetos from './TabelaProjetos.jsx'

const FILTROS = [
  { id: 'todos', rotulo: `Todos os ${ALUNOS.length}`, cor: null },
  { id: 'bom', rotulo: 'Em dia', cor: 'var(--good)' },
  { id: 'atencao', rotulo: 'Atenção', cor: 'var(--warn)' },
  { id: 'critico', rotulo: 'Crítico', cor: 'var(--crit)' },
]

export default function VisaoGestor() {
  const [filtro, setFiltro] = useState('todos')

  const todos = useMemo(() => ALUNOS.map(derivarAluno), [])
  const recorte = useMemo(
    () => (filtro === 'todos' ? todos : todos.filter((a) => a.faixa === filtro)),
    [todos, filtro],
  )

  const ag = useMemo(() => agregados(recorte), [recorte])
  const cob = useMemo(() => coberturas(recorte), [recorte])
  const curva = useMemo(() => curvaDefasagem(recorte), [recorte])
  const alertas = useMemo(() => gerarAlertas(recorte), [recorte])
  const projetos = useMemo(() => projetosOrdenados(), [])

  return (
    <div className="page">
      <header className="gestor-hero">
        <div>
          <p className="eyebrow">Coordenação de extensão · 2026.1</p>
          <h1>Engenharia de Computação — acompanhamento curricular</h1>
          <p className="lede">
            Quanto cada aluno já cumpriu das horas de extensão obrigatórias, medido contra o
            semestre em que ele está. Dados fictícios para demonstração.
          </p>
        </div>
        <div className="regra">
          <Documento />
          <span>
            Resolução <b>CNE/CES 7/2018</b>: 10% da carga do curso em extensão →{' '}
            <b>{n0(HORAS_EXTENSAO)} h</b> em {SEMESTRES} semestres,{' '}
            <b>{HORAS_POR_SEMESTRE} h por semestre</b> (curso de {n0(HORAS_CURSO)} h).
          </span>
        </div>
      </header>

      <div className="filtros">
        <span className="rot">Recorte da turma:</span>
        <div className="seg" role="group" aria-label="Filtrar alunos por situação">
          {FILTROS.map((f) => (
            <button
              type="button"
              key={f.id}
              aria-pressed={filtro === f.id}
              onClick={() => setFiltro(f.id)}
            >
              {f.cor ? <span className="kdot" style={{ '--k': f.cor }} /> : null}
              {f.rotulo}
            </button>
          ))}
        </div>
      </div>

      <Kpis ag={ag} piorSkill={cob[cob.length - 1]} total={recorte.length} />

      <div className="linha-7-5">
        <BarrasAderencia alunos={recorte} />
        <Alertas itens={alertas} />
      </div>

      <div className="linha-5-7">
        <CoberturaSkills cobertura={cob} total={recorte.length} />
        <GraficoDefasagem pontos={curva} />
      </div>

      <TabelaProjetos projetos={projetos} />

      <p className="sr" role="status" aria-live="polite">
        Recorte com {recorte.length} alunos.
      </p>
    </div>
  )
}
