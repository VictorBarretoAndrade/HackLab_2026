/**
 * Turma ficticia sob a coordenacao — 14 alunos entre o 2o e o 9o semestre.
 *
 * Victor Goncalves e o mesmo aluno da visao gamificada: 5o semestre, 126 h,
 * competencia Empatia desbloqueada. Os numeros batem entre as duas telas.
 *
 * O contraste que sustenta o painel: Marcos (60%) e Gustavo (61%) tem aderencia
 * praticamente igual, mas urgencias opostas. Marcos esta no 9o semestre e
 * precisaria de 164 h em um unico semestre; Gustavo esta no 4o e resolve com
 * 45 h/semestre. E o RITMO que separa os dois, nao a aderencia.
 */

export const ALUNOS = [
  { nome: 'Ana Beatriz Rocha', mat: '2021.1.0142', sem: 9, horas: 351, skills: ['comunicacao', 'equipe', 'empatia', 'tempo', 'problemas', 'lideranca'] },
  { nome: 'Caio Menezes Lima', mat: '2021.2.0088', sem: 8, horas: 296, skills: ['comunicacao', 'equipe', 'empatia', 'tempo', 'problemas', 'lideranca'] },
  { nome: 'Isabela Moraes Cunha', mat: '2021.2.0195', sem: 8, horas: 268, skills: ['comunicacao', 'equipe', 'empatia', 'tempo', 'problemas', 'lideranca'] },
  { nome: 'Débora Nascimento Alves', mat: '2022.1.0311', sem: 7, horas: 240, skills: ['comunicacao', 'equipe', 'empatia', 'tempo', 'problemas'] },
  { nome: 'Larissa Ferreira Gomes', mat: '2024.1.0027', sem: 3, horas: 104, skills: ['comunicacao', 'empatia'] },
  { nome: 'Juliana Costa Barros', mat: '2023.2.0402', sem: 4, horas: 132, skills: ['comunicacao', 'equipe', 'empatia'] },
  { nome: 'Nathália Souza Prado', mat: '2023.1.0076', sem: 5, horas: 164, skills: ['comunicacao', 'equipe', 'empatia', 'tempo', 'lideranca'] },
  { nome: 'Camila Duarte Freitas', mat: '2022.2.0154', sem: 6, horas: 172, skills: ['comunicacao', 'equipe', 'empatia', 'tempo'] },
  { nome: 'Rafael Andrade Pinto', mat: '2022.2.0233', sem: 6, horas: 158, skills: ['comunicacao', 'equipe', 'tempo'] },
  { nome: 'Victor Gonçalves', mat: '2023.1.0119', sem: 5, horas: 126, skills: ['empatia'] },
  { nome: 'Gustavo Teixeira Lopes', mat: '2023.2.0361', sem: 4, horas: 88, skills: ['equipe'] },
  { nome: 'Marcos Vinícius Sales', mat: '2021.1.0207', sem: 9, horas: 196, skills: ['comunicacao', 'equipe', 'problemas'] },
  { nome: 'Thiago Barbosa Reis', mat: '2022.1.0290', sem: 7, horas: 138, skills: ['comunicacao', 'equipe'] },
  { nome: 'Pedro Henrique Amaral', mat: '2025.1.0013', sem: 2, horas: 18, skills: [] },
]

/**
 * Projetos ofertados no semestre, com os 137 vinculos de alunos.
 * Escopo diferente do filtro de alunos: aqui o sujeito e o projeto.
 */
export const PROJETOS_TURMA = [
  { nome: 'Feira de Ciências Itinerante SENAI', area: 'Divulgação científica', insc: 30, concl: 16, atras: 7, aband: 7 },
  { nome: 'Robótica Educacional na E.M. Rio Vermelho', area: 'Educação básica', insc: 18, concl: 11, atras: 3, aband: 4 },
  { nome: 'Mutirão Digital na Comunidade do Cabula', area: 'Inclusão digital', insc: 24, concl: 19, atras: 2, aband: 3 },
  { nome: 'Consultoria Jr. para MEIs do Subúrbio', area: 'Empreendedorismo', insc: 15, concl: 12, atras: 2, aband: 1 },
  { nome: 'Letramento Digital para Idosos — Pituba', area: 'Tecnologia assistiva', insc: 16, concl: 13, atras: 2, aband: 1 },
  { nome: 'Plantão de Suporte Técnico Solidário', area: 'Tecnologia social', insc: 12, concl: 10, atras: 1, aband: 1 },
  { nome: 'Horta Urbana Agroecológica do Bairro da Paz', area: 'Sustentabilidade', insc: 22, concl: 20, atras: 1, aband: 1 },
]
