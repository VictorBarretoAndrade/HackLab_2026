/**
 * Jardim: mato, moedas e enfeites.
 *
 * ATENCAO ARQUITETURAL. O motor do aluno (motorAluno.js) e puramente derivado:
 * so existe o status dos projetos e todo o resto e recalculado. O jardim NAO
 * pode ser assim — quantas moedas voce gastou nao da para deduzir do estado
 * dos projetos. Entao ele e um segundo estado, acumulado e persistido, mantido
 * deliberadamente separado do primeiro. As duas coisas nunca se misturam: a
 * arvore cresce por horas de extensao, e os enfeites saem de presenca semanal.
 */

export const SEMANA = 7 * 24 * 60 * 60 * 1000

/**
 * ECONOMIA DE TESTE, nao de producao.
 *
 * Esta build existe para as pessoas experimentarem a plataforma, entao o
 * dinheiro e generoso de proposito: quem abre ja consegue comprar quase metade
 * da loja, e em quatro capinas compra tudo. Num lancamento real, valores mais
 * proximos de 25 / +5 / teto 55 fariam a lojinha durar um semestre.
 *
 * Custo total da loja: 615 moedas.
 * Saldo inicial 300 + capinas de 60, 75, 90 e 105 = 630 na quarta semana.
 */
export const SALDO_INICIAL = 300
export const RECOMPENSA_BASE = 60
export const BONUS_SEQUENCIA = 15
export const RECOMPENSA_MAX = 120

/** Alem de duas semanas sem aparecer, a sequencia zera. */
export const TOLERANCIA = SEMANA * 2

/**
 * Sobe quando a economia muda. O estado salvo de uma versao anterior e
 * descartado, senao quem ja testou ficaria preso ao saldo antigo.
 */
export const VERSAO_JARDIM = 2

export const JARDIM_INICIAL = {
  versao: VERSAO_JARDIM,
  moedas: SALDO_INICIAL,
  sequencia: 0,
  ultimaLimpeza: null, // null = nunca limpou, entao ja tem mato esperando
  deslocamento: 0, // ms somados ao relogio, so para a demo
  comprados: [],
  guardados: [], // comprados, mas fora da arvore
}

/** Quanto cada limpeza paga, dada a sequencia de semanas ja acumulada. */
export function recompensaDe(sequencia) {
  return Math.min(RECOMPENSA_MAX, RECOMPENSA_BASE + sequencia * BONUS_SEQUENCIA)
}

export function estadoJardim(j) {
  const agora = Date.now() + j.deslocamento
  const decorridos = j.ultimaLimpeza == null ? SEMANA : agora - j.ultimaLimpeza
  return {
    agora,
    decorridos,
    // Passa de 1 quando o aluno some: o mato continua subindo ate 1,5.
    mato: Math.max(0, Math.min(1.5, decorridos / SEMANA)),
    pode: decorridos >= SEMANA,
    faltam: Math.max(0, SEMANA - decorridos),
    proximoGanho: recompensaDe(j.sequencia),
  }
}

/** Limpa o mato. Devolve o jardim novo e quanto rendeu. */
export function limpar(j) {
  const { agora, decorridos, pode } = estadoJardim(j)
  if (!pode) return { jardim: j, ganho: 0, sequencia: j.sequencia, manteve: true }

  // A sequencia sobrevive se o aluno voltou em ate duas semanas.
  const manteve = j.ultimaLimpeza != null && decorridos < TOLERANCIA
  const sequencia = manteve ? j.sequencia + 1 : 1
  const ganho = recompensaDe(sequencia - 1)

  return {
    jardim: { ...j, ultimaLimpeza: agora, sequencia, moedas: j.moedas + ganho },
    ganho,
    sequencia,
    manteve,
  }
}

export function comprar(j, enfeite) {
  if (j.comprados.includes(enfeite.id) || j.moedas < enfeite.preco) return j
  return {
    ...j,
    moedas: j.moedas - enfeite.preco,
    comprados: [...j.comprados, enfeite.id],
  }
}

/** Alterna entre deixar o enfeite na arvore ou guardado. */
export function alternar(j, id) {
  if (!j.comprados.includes(id)) return j
  return {
    ...j,
    guardados: j.guardados.includes(id)
      ? j.guardados.filter((x) => x !== id)
      : [...j.guardados, id],
  }
}

/** Tira da arvore tudo o que estiver posto, sem perder a compra. */
export function tirarTodos(j) {
  return { ...j, guardados: [...j.comprados] }
}

/** Devolve a arvore tudo o que estiver guardado. */
export function porTodos(j) {
  return { ...j, guardados: [] }
}

/** Ids dos enfeites que devem aparecer no canvas. */
export const naArvore = (j) => j.comprados.filter((id) => !j.guardados.includes(id))

/** Avanca o relogio simulado. Existe so para a demo nao precisar de 7 dias. */
export function adiantarSemana(j) {
  return { ...j, deslocamento: j.deslocamento + SEMANA }
}

export function descreveMato(mato) {
  if (mato < 0.35) return 'Base limpa, sem mato à vista.'
  if (mato < 0.7) return 'Umas graminhas começando a brotar no pé.'
  if (mato < 1) return 'O mato já está subindo — quase na hora da capina.'
  if (mato < 1.3) return 'Mato tomando conta do pé da árvore.'
  return 'Pé da árvore abandonado, mato por toda parte.'
}

/** Texto do tempo que falta, em dias ou horas. */
export function faltaEmTexto(ms) {
  const horas = Math.ceil(ms / (60 * 60 * 1000))
  if (horas >= 48) return `${Math.ceil(horas / 24)} dias`
  if (horas >= 24) return '1 dia'
  return `${horas} h`
}
