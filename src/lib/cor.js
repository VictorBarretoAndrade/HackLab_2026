/**
 * Utilidades de cor e aleatoriedade para o canvas.
 *
 * O canvas nao tem cor fixa no JavaScript: le os tokens CSS e interpola entre
 * eles. Assim o desenho acompanha o tema do usuario sem duplicar a paleta.
 */

/** PRNG com semente — a mesma sequencia a cada frame mantem a silhueta estavel. */
export function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Le um custom property do :root. */
export function token(nome) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(nome).trim()
  return v || '#888888'
}

/**
 * Converte uma cor em [r, g, b].
 *
 * Aceita hex (#abc, #aabbcc) E a forma rgb()/rgba(), porque mix() devolve
 * rgb() e o resultado dele volta para ca em composicoes aninhadas
 * (mix(mix(a,b), c)). Enquanto isto so lia hex, um mix aninhado produzia
 * parseInt('rg', 16) = NaN e devolvia "rgb(NaN,NaN,55)". O canvas trata cor
 * invalida ignorando a atribuicao e MANTENDO o fillStyle anterior — entao as
 * folhas da copa saiam todas na cor do solo, sem tingimento e sem amarelar.
 */
function canal(cor) {
  const c = String(cor).trim()

  const rgbMatch = c.match(/^rgba?\(([^)]+)\)$/i)
  if (rgbMatch) {
    const p = rgbMatch[1].split(',').map((v) => parseFloat(v))
    return [p[0] || 0, p[1] || 0, p[2] || 0]
  }

  let h = c.replace('#', '')
  if (h.length === 3)
    h = h
      .split('')
      .map((x) => x + x)
      .join('')
  return [parseInt(h.slice(0, 2), 16) || 0, parseInt(h.slice(2, 4), 16) || 0, parseInt(h.slice(4, 6), 16) || 0]
}

/** Interpolacao linear entre duas cores. t = 0 devolve a, t = 1 devolve b. */
export function mix(a, b, t) {
  const A = canal(a)
  const B = canal(b)
  return (
    'rgb(' +
    Math.round(A[0] + (B[0] - A[0]) * t) +
    ',' +
    Math.round(A[1] + (B[1] - A[1]) * t) +
    ',' +
    Math.round(A[2] + (B[2] - A[2]) * t) +
    ')'
  )
}

export function rgba(cor, alpha) {
  const c = canal(cor)
  return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + alpha + ')'
}
