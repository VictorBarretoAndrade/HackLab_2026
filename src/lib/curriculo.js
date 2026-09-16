/**
 * Regra curricular que ancora as DUAS visoes.
 *
 * Resolucao CNE/CES no 7/2018: no minimo 10% da carga horaria total do curso
 * em atividades de extensao. Engenharia de Computacao tem 3.600 h, logo 360 h
 * de extensao, distribuidas em 10 semestres => 36 h por semestre.
 *
 * Nas versoes anteriores dos prototipos o aluno via uma escala de XP (210 h /
 * 1.050 XP) e o gestor via as 360 h da CNE — duas escalas para a mesma
 * grandeza. Aqui existe so esta: horas validadas de extensao.
 */

export const HORAS_CURSO = 3600
export const PERCENTUAL_EXTENSAO = 0.1
export const HORAS_EXTENSAO = HORAS_CURSO * PERCENTUAL_EXTENSAO // 360
export const SEMESTRES = 10
export const HORAS_POR_SEMESTRE = HORAS_EXTENSAO / SEMESTRES // 36

/** Acima disso a coordenacao considera o ritmo inexequivel. */
export const TETO_VIAVEL = 60

/**
 * Niveis da arvore, medidos nas MESMAS horas que o gestor enxerga.
 * Chegar a "Arvore frondosa" exige 320 h — ou seja, mais de um semestre.
 * Isso e proposital: extensao e uma jornada plurissemestral, e a arvore
 * deve comunicar isso.
 */
export const NIVEIS = [
  { min: 0, nome: 'Semente' },
  { min: 60, nome: 'Broto' },
  { min: 120, nome: 'Muda' },
  { min: 190, nome: 'Árvore jovem' },
  { min: 260, nome: 'Copa firme' },
  { min: 320, nome: 'Árvore frondosa' },
]

/** Faixas de aderencia usadas nas duas visoes. */
export function faixaDe(aderencia) {
  if (aderencia >= 90) return 'bom'
  if (aderencia >= 70) return 'atencao'
  return 'critico'
}

export const ROTULO_FAIXA = {
  bom: 'Em dia',
  atencao: 'Atenção',
  critico: 'Crítico',
}

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

/* ---------- formatacao pt-BR ---------- */
export const n0 = (v) => Math.round(v).toLocaleString('pt-BR')
export const n1 = (v) =>
  v.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
