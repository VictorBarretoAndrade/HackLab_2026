import { SKILLS } from '../data/skills.js'
import { HORAS_EXTENSAO, HORAS_POR_SEMESTRE, NIVEIS, clamp } from './curriculo.js'

/**
 * Motor da visao do aluno.
 *
 * O UNICO estado mutavel do app e o `status` de cada projeto. Tudo aqui e
 * recalculado do zero a cada render — nao existe `horas += 40` em lugar nenhum.
 *
 * A consequencia pratica e que toda acao e reversivel de graca: "Reabrir
 * projeto" devolve as horas, rebaixa o nivel e TRAVA de volta uma competencia
 * ja conquistada. Isso nao foi programado como caso especial; cai fora da
 * arquitetura.
 */
export function derivar(projetos, aluno) {
  const concluidos = projetos.filter((p) => p.status === 'concluido')
  const ativos = projetos.filter((p) => p.status === 'ativo').length
  const atrasados = projetos.filter((p) => p.status === 'atrasado').length
  const abandonados = projetos.filter((p) => p.status === 'abandonado').length

  const horasSemestre = concluidos.reduce((s, p) => s + p.horas, 0)
  const horasTotais = aluno.horasAnteriores + horasSemestre

  // Abandonar custa quase o dobro de atrasar; concluir compensa sem anular o dano.
  const vitalidade = clamp(
    88 - 16 * atrasados - 28 * abandonados + 4 * concluidos.length,
    8,
    100,
  )

  let nivel = 0
  for (let i = 0; i < NIVEIS.length; i++) if (horasTotais >= NIVEIS[i].min) nivel = i
  const proximo = NIVEIS[nivel + 1] || null

  const skills = SKILLS.map((s) => {
    const feitos = concluidos.filter((p) => p.skills.includes(s.id)).length
    return { ...s, feitos: Math.min(feitos, s.req), ok: feitos >= s.req }
  })
  const ativas = skills.filter((s) => s.ok)

  // As horas dao o porte; a vitalidade ENCOLHE a copa. Uma arvore doente perde
  // volume, nao so cor — por isso o multiplicador, e nao um filtro de cor.
  const crescimento =
    Math.min(1, horasTotais / HORAS_EXTENSAO) * (0.55 + 0.45 * (vitalidade / 100))

  // Aderencia ao semestre — o mesmo numero que a coordenacao ve.
  const metaSemestre = HORAS_POR_SEMESTRE * aluno.semestre
  const aderencia = (horasTotais / metaSemestre) * 100

  return {
    concluidos: concluidos.length,
    ativos,
    atrasados,
    abandonados,
    horasSemestre,
    horasTotais,
    vitalidade,
    nivel,
    proximo,
    skills,
    ativas,
    crescimento,
    metaSemestre,
    aderencia,
  }
}

/** Legenda do estado da arvore: porte (nivel) + saude (vitalidade). */
export function legendaArvore(d) {
  const v = d.vitalidade / 100
  const porte = [
    'Ainda é uma semente no chão',
    'Um broto de dois palmos',
    'Muda firme, tronco já definido',
    'Árvore jovem, copa tomando forma',
    'Copa larga, galhos em três níveis',
    'Árvore frondosa, crescimento máximo',
  ][d.nivel]

  const saude =
    v >= 0.85
      ? 'verde e cheia — entregas em dia.'
      : v >= 0.65
        ? 'verde, mas sentindo a pressão dos prazos.'
        : v >= 0.45
          ? 'com folhas amarelando: há entregas escorregando.'
          : v >= 0.25
            ? 'rala — retome os projetos parados antes que sequem.'
            : 'quase sem folhas: o semestre foi abandonado.'

  return `${porte}, ${saude}`
}
