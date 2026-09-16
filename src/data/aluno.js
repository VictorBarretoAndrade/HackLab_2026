/**
 * Dados do aluno logado na visao gamificada.
 *
 * E o MESMO Victor Goncalves que aparece na tabela da coordenacao: 5o semestre,
 * 126 h validadas (62 h de semestres anteriores + as 64 h ja concluidas neste
 * semestre). Os dois paineis mostram a mesma pessoa com o mesmo numero.
 */

export const ALUNO = {
  nome: 'Victor Gonçalves',
  iniciais: 'VG',
  matricula: '2023.1.0119',
  curso: 'Engenharia de Computação',
  semestre: 5,
  /** Horas de extensao validadas em semestres anteriores. */
  horasAnteriores: 62,
}

/** Os projetos do semestre corrente. 210 h no total. */
export const PROJETOS_INICIAIS = [
  {
    id: 'p1',
    titulo: 'Mutirão Digital na Comunidade do Cabula',
    area: 'Inclusão digital',
    horas: 40,
    prazo: '12 abr',
    status: 'concluido',
    skills: ['comunicacao', 'empatia'],
  },
  {
    id: 'p2',
    titulo: 'Robótica Educacional na E.M. Rio Vermelho',
    area: 'Educação básica',
    horas: 60,
    prazo: '30 mai',
    status: 'ativo',
    skills: ['lideranca', 'equipe', 'problemas'],
  },
  {
    id: 'p3',
    titulo: 'Consultoria Jr. para MEIs do Subúrbio',
    area: 'Empreendedorismo',
    horas: 30,
    prazo: '18 mai',
    status: 'ativo',
    skills: ['comunicacao', 'problemas', 'tempo'],
  },
  {
    id: 'p4',
    titulo: 'Horta Urbana Agroecológica do Bairro da Paz',
    area: 'Sustentabilidade',
    horas: 24,
    prazo: '05 abr',
    status: 'concluido',
    skills: ['equipe', 'empatia'],
  },
  {
    id: 'p5',
    titulo: 'Feira de Ciências Itinerante SENAI',
    area: 'Divulgação científica',
    horas: 36,
    prazo: '22 abr',
    status: 'atrasado',
    skills: ['lideranca', 'comunicacao'],
  },
  {
    id: 'p6',
    titulo: 'Plantão de Suporte Técnico Solidário',
    area: 'Tecnologia social',
    horas: 20,
    prazo: '14 jun',
    status: 'ativo',
    skills: ['problemas', 'tempo'],
  },
]

export const ROTULO_STATUS = {
  concluido: 'Concluído',
  ativo: 'Em andamento',
  atrasado: 'Atrasado',
  abandonado: 'Abandonado',
}

export const TOM_STATUS = {
  concluido: 'good',
  ativo: 'accent',
  atrasado: 'warn',
  abandonado: 'idle',
}

/** Acoes oferecidas conforme o status atual do projeto. */
export const ACOES = {
  concluido: [{ rotulo: 'Reabrir projeto', para: 'ativo', variante: '' }],
  ativo: [
    { rotulo: 'Marcar como concluído', para: 'concluido', variante: 'primary' },
    { rotulo: 'Reportar atraso', para: 'atrasado', variante: 'warn' },
    { rotulo: 'Abandonar', para: 'abandonado', variante: 'danger' },
  ],
  atrasado: [
    { rotulo: 'Entregar mesmo assim', para: 'concluido', variante: 'primary' },
    { rotulo: 'Voltar ao ritmo', para: 'ativo', variante: '' },
    { rotulo: 'Abandonar', para: 'abandonado', variante: 'danger' },
  ],
  abandonado: [{ rotulo: 'Retomar projeto', para: 'ativo', variante: '' }],
}
