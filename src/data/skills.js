/**
 * As seis competencias, compartilhadas pelas duas visoes.
 *
 * A COR e o elo visual entre as telas: a mesma cor aparece no ponto da tag do
 * projeto, no icone do card de competencia e nas folhas que ela tinge na copa. O
 * gestor ve a mesma cor na cobertura da turma.
 */

export const SKILLS = [
  {
    id: 'comunicacao',
    nome: 'Comunicação',
    req: 2,
    cor: '#5BC8F5',
    d: 'M21 12a8 8 0 0 1-8 8H7l-4 3v-6.7A8 8 0 0 1 11 4h2a8 8 0 0 1 8 8z',
  },
  {
    id: 'lideranca',
    nome: 'Liderança',
    req: 2,
    cor: '#F3C16B',
    d: 'M12 3.2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 8.9l5.4-.8z',
  },
  {
    id: 'equipe',
    nome: 'Trabalho em equipe',
    req: 2,
    cor: '#8CC96A',
    d: 'M9 11a2.6 2.6 0 1 0 0-5.2A2.6 2.6 0 0 0 9 11zM16.4 11.6a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4zM3.5 19c0-3 2.5-4.7 5.5-4.7s5.5 1.7 5.5 4.7M16 14.6c2.6.2 4.5 1.7 4.5 4.4',
  },
  {
    id: 'problemas',
    nome: 'Resolução de problemas',
    req: 2,
    cor: '#C78BF0',
    d: 'M9.5 18.2h5M10.5 21h3M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 1.9h5c.1-.7.5-1.4 1.1-1.9A6 6 0 0 0 12 3z',
  },
  {
    id: 'empatia',
    nome: 'Empatia',
    req: 2,
    cor: '#FF8F9E',
    d: 'M12 20.3s-7.2-4.4-7.2-9.3a4.1 4.1 0 0 1 7.2-2.7 4.1 4.1 0 0 1 7.2 2.7c0 4.9-7.2 9.3-7.2 9.3z',
  },
  {
    id: 'tempo',
    nome: 'Gestão do tempo',
    req: 2,
    cor: '#4ED6BA',
    d: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7.2V12l3.2 2',
  },
]

export const skillPorId = (id) => SKILLS.find((s) => s.id === id)
