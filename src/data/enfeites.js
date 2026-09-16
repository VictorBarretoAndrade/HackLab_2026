/**
 * Catalogo da lojinha.
 *
 * A `cor` de cada enfeite e a cor dominante com que ele e desenhado no canvas.
 * O mesmo valor pinta a bolinha no card da loja, entao o aluno reconhece na
 * arvore o que acabou de comprar.
 *
 * Precos calibrados contra a recompensa semanal (25 a 55 moedas, conforme a
 * sequencia): o passarinho sai na primeira semana e a coruja leva uns tres
 * meses de presenca.
 */
export const ENFEITES = [
  {
    id: 'passarinho',
    nome: 'Passarinho',
    preco: 25,
    cor: '#D98E5A',
    desc: 'Um sabiá pousa num galho da copa.',
  },
  {
    id: 'casinha',
    nome: 'Casinha de passarinho',
    preco: 50,
    cor: '#B98B5E',
    desc: 'Presa ao tronco, com poleiro embaixo.',
  },
  {
    id: 'balanco',
    nome: 'Balanço de corda',
    preco: 80,
    cor: '#C8A879',
    desc: 'Pendurado num galho firme.',
  },
  {
    id: 'bandeirinhas',
    nome: 'Bandeirinhas de festa junina',
    preco: 110,
    cor: '#E8643C',
    desc: 'Um varal atravessando a copa.',
  },
  {
    id: 'natal',
    nome: 'Enfeites de Natal',
    preco: 150,
    cor: '#D0433B',
    desc: 'Bolas coloridas nas pontas dos galhos.',
  },
  {
    id: 'coruja',
    nome: 'Coruja',
    preco: 200,
    cor: '#8A7B63',
    desc: 'Fica de vigia no galho mais grosso.',
  },
]

export const enfeitePorId = (id) => ENFEITES.find((e) => e.id === id)
