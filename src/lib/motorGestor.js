import { SKILLS } from '../data/skills.js'
import { PROJETOS_TURMA } from '../data/turma.js'
import {
  HORAS_EXTENSAO,
  HORAS_POR_SEMESTRE,
  SEMESTRES,
  TETO_VIAVEL,
  faixaDe,
  n0,
  n1,
} from './curriculo.js'

/**
 * Motor da visao da coordenacao. Funcoes puras sobre a lista de alunos.
 */

export function derivarAluno(a) {
  const meta = HORAS_POR_SEMESTRE * a.sem
  const aderencia = (a.horas / meta) * 100
  const faltam = Math.max(0, HORAS_EXTENSAO - a.horas)
  const restam = SEMESTRES - a.sem
  // Quantas horas por semestre faltam para integralizar as 360 h. E a metrica
  // que o gestor usa para AGIR — aderencia so diz onde a pessoa esta.
  const ritmo = restam > 0 ? faltam / restam : faltam

  return {
    ...a,
    meta,
    aderencia,
    faltam,
    restam,
    ritmo,
    faixa: faixaDe(aderencia),
    inviavel: faltam > 0 && (restam === 0 || ritmo > TETO_VIAVEL),
  }
}

export function coberturas(set) {
  const out = SKILLS.map((s) => {
    const q = set.filter((a) => a.skills.includes(s.id)).length
    return { ...s, q, pct: set.length ? (q / set.length) * 100 : 0 }
  })
  out.sort((a, b) => b.pct - a.pct)
  return out
}

export function agregados(set) {
  const horas = set.reduce((s, a) => s + a.horas, 0)
  const meta = set.reduce((s, a) => s + a.meta, 0)
  return {
    horas,
    meta,
    pct: meta ? (horas / meta) * 100 : 0,
    inviaveis: set.filter((a) => a.inviavel).length,
    criticos: set.filter((a) => a.faixa === 'critico').length,
  }
}

/** Media de horas por semestre cursado, contra a exigencia acumulada. */
export function curvaDefasagem(set) {
  const porSem = {}
  set.forEach((a) => {
    ;(porSem[a.sem] = porSem[a.sem] || []).push(a.horas)
  })
  return Object.keys(porSem)
    .map(Number)
    .sort((x, y) => x - y)
    .map((s) => ({
      sem: s,
      media: porSem[s].reduce((x, y) => x + y, 0) / porSem[s].length,
      meta: HORAS_POR_SEMESTRE * s,
      qtd: porSem[s].length,
    }))
}

export function projetosOrdenados() {
  return PROJETOS_TURMA.map((p) => ({
    ...p,
    evasao: ((p.atras + p.aband) / p.insc) * 100,
  })).sort((a, b) => b.evasao - a.evasao)
}

/**
 * Alertas derivados dos dados — nenhum texto fixo. Cada um traz a acao
 * recomendada, nao so o diagnostico.
 */
export function gerarAlertas(set) {
  const out = []

  set
    .filter((a) => a.inviavel)
    .sort((a, b) => b.ritmo - a.ritmo)
    .forEach((a) => {
      out.push({
        id: 'inv-' + a.mat,
        sev: 'crit',
        titulo:
          a.restam === 0
            ? `Não integraliza: faltam ${n0(a.faltam)} h e não há semestre restante`
            : `Ritmo inviável: precisaria de ${n1(a.ritmo)} h por semestre`,
        texto:
          a.restam === 0
            ? 'Acionar plano emergencial de integralização ou prorrogar a colação.'
            : `Acima do teto de ${TETO_VIAVEL} h/semestre. Realocar em projeto de carga concentrada.`,
        quem: `${a.nome} · ${a.sem}º sem · ${n0(a.horas)} h de ${n0(HORAS_EXTENSAO)} h`,
      })
    })

  set
    .filter((a) => a.faixa === 'critico' && !a.inviavel)
    .sort((a, b) => a.aderencia - b.aderencia)
    .slice(0, 2)
    .forEach((a) => {
      out.push({
        id: 'rec-' + a.mat,
        sev: 'warn',
        titulo: `Aderência de ${Math.round(a.aderencia)}% no ${a.sem}º semestre`,
        texto: `Ainda dá tempo: ${n1(a.ritmo)} h/semestre resolvem. Convocar para orientação de matrícula em extensão.`,
        quem: `${a.nome} · ${n0(a.horas)} h de ${n0(a.meta)} h esperadas`,
      })
    })

  const cob = coberturas(set)
  const pior = cob[cob.length - 1]
  if (pior && pior.pct < 50) {
    out.push({
      id: 'skill-' + pior.id,
      sev: 'warn',
      titulo: `${pior.nome} em ${Math.round(pior.pct)}% da turma`,
      texto:
        'Competência mais escassa do recorte. Abrir vagas de coordenação discente nos projetos existentes.',
      quem: `${pior.q} de ${set.length} alunos`,
    })
  }

  const piorProjeto = projetosOrdenados()[0]
  if (piorProjeto && piorProjeto.evasao >= 35) {
    out.push({
      id: 'proj',
      sev: 'warn',
      titulo: `Evasão de ${Math.round(piorProjeto.evasao)}% em um único projeto`,
      texto:
        'O problema está no projeto, não nos alunos. Revisar carga horária e mentoria antes da próxima oferta.',
      quem: piorProjeto.nome,
    })
  }

  const destaque = [...set].sort((a, b) => b.aderencia - a.aderencia)[0]
  if (destaque && destaque.aderencia >= 100) {
    out.push({
      id: 'top-' + destaque.mat,
      sev: 'good',
      titulo: `Já cumpriu ${Math.round(destaque.aderencia)}% do exigido para o semestre`,
      texto: 'Perfil elegível para mentoria de calouros e coordenação discente de projeto.',
      quem: `${destaque.nome} · ${n0(destaque.horas)} h de ${n0(HORAS_EXTENSAO)} h`,
    })
  }

  return out
}
