import { mix, mulberry32 } from '../../lib/cor.js'

/**
 * Mato do pe da arvore e enfeites da lojinha, desenhados por codigo.
 *
 * Tudo aqui e ESTATICO de proposito. O aluno ja reclamou de coisa piscando na
 * copa: enfeite nao oscila, nao brilha e nao balanca. Sao objetos pousados na
 * arvore, nao efeitos.
 *
 * As ancoras saem da propria geracao da arvore (galhos e pontas de folha).
 * Como o PRNG tem semente fixa, o passarinho pousa sempre no mesmo galho.
 */

const SEMENTE_MATO = 20260916 + 31

/* ============================================================
   Mato
   ============================================================ */

export function desenharMato(ctx, baseX, baseY, raio, mato, k, pal) {
  if (mato <= 0.02) return

  const rz = mulberry32(SEMENTE_MATO)
  const n = 9
  const forca = Math.min(1, mato)

  // Verde-amarelado, distinto da folhagem: mato nao e folha da arvore.
  ctx.strokeStyle = mix(pal.leafLive, '#B9A83C', 0.55)
  ctx.lineCap = 'round'
  ctx.lineWidth = Math.max(1, 1.7 * (0.6 + k * 0.4))

  for (let i = 0; i < n; i++) {
    const t = (i / (n - 1)) * 2 - 1
    const x = baseX + t * raio * 0.9 + (rz() - 0.5) * 10
    const y = baseY + 4 + rz() * 6
    const h = (9 + rz() * 15) * forca * (0.7 + k * 0.5)

    for (let b = 0; b < 3; b++) {
      const dir = (b - 1) * 0.55 + (rz() - 0.5) * 0.3
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.quadraticCurveTo(x + dir * h * 0.5, y - h * 0.6, x + dir * h, y - h)
      ctx.stroke()
    }
  }

  // Passou de uma semana: aparecem umas florzinhas de mato, sinal de descuido.
  if (mato > 1.05) {
    ctx.fillStyle = '#E8DC7A'
    const extra = Math.min(5, Math.round((mato - 1) * 12))
    for (let i = 0; i < extra; i++) {
      const x = baseX + (rz() - 0.5) * raio * 1.7
      const y = baseY + 2 - (6 + rz() * 12) * (0.7 + k * 0.5)
      ctx.beginPath()
      ctx.arc(x, y, Math.max(1.2, 2.1 * (0.6 + k * 0.4)), 0, 6.2832)
      ctx.fill()
    }
  }
}

/* ============================================================
   Enfeites
   ============================================================ */

function passarinho(ctx, x, y, s) {
  ctx.save()
  ctx.translate(x, y)
  ctx.fillStyle = '#7A6A57'
  ctx.beginPath()
  ctx.ellipse(0, -s * 0.55, s * 0.95, s * 0.62, -0.25, 0, 6.2832)
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(-s * 0.8, -s * 0.7)
  ctx.lineTo(-s * 1.9, -s * 1.0)
  ctx.lineTo(-s * 0.85, -s * 0.28)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#D98E5A'
  ctx.beginPath()
  ctx.ellipse(-s * 0.05, -s * 0.42, s * 0.6, s * 0.42, -0.2, 0, 6.2832)
  ctx.fill()
  ctx.fillStyle = '#7A6A57'
  ctx.beginPath()
  ctx.arc(s * 0.68, -s * 1.05, s * 0.46, 0, 6.2832)
  ctx.fill()
  ctx.fillStyle = '#E8B44A'
  ctx.beginPath()
  ctx.moveTo(s * 1.08, -s * 1.1)
  ctx.lineTo(s * 1.65, -s * 0.95)
  ctx.lineTo(s * 1.08, -s * 0.82)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#1B1B18'
  ctx.beginPath()
  ctx.arc(s * 0.8, -s * 1.16, s * 0.11, 0, 6.2832)
  ctx.fill()
  ctx.strokeStyle = '#4A3F33'
  ctx.lineWidth = Math.max(1, s * 0.13)
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(-s * 0.12, -s * 0.02)
  ctx.lineTo(-s * 0.12, -s * 0.16)
  ctx.moveTo(s * 0.26, -s * 0.02)
  ctx.lineTo(s * 0.26, -s * 0.16)
  ctx.stroke()
  ctx.restore()
}

function coruja(ctx, x, y, s) {
  ctx.save()
  ctx.translate(x, y)
  ctx.fillStyle = '#8A7B63'
  ctx.beginPath()
  ctx.ellipse(0, -s * 0.95, s * 0.88, s * 1.05, 0, 0, 6.2832)
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(-s * 0.78, -s * 1.62)
  ctx.lineTo(-s * 0.32, -s * 2.18)
  ctx.lineTo(-s * 0.14, -s * 1.58)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(s * 0.78, -s * 1.62)
  ctx.lineTo(s * 0.32, -s * 2.18)
  ctx.lineTo(s * 0.14, -s * 1.58)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#C8B99A'
  ctx.beginPath()
  ctx.ellipse(0, -s * 0.58, s * 0.5, s * 0.6, 0, 0, 6.2832)
  ctx.fill()
  ctx.fillStyle = '#F3EEE2'
  ctx.beginPath()
  ctx.arc(-s * 0.36, -s * 1.35, s * 0.35, 0, 6.2832)
  ctx.arc(s * 0.36, -s * 1.35, s * 0.35, 0, 6.2832)
  ctx.fill()
  ctx.fillStyle = '#2A241C'
  ctx.beginPath()
  ctx.arc(-s * 0.36, -s * 1.35, s * 0.16, 0, 6.2832)
  ctx.arc(s * 0.36, -s * 1.35, s * 0.16, 0, 6.2832)
  ctx.fill()
  ctx.fillStyle = '#E0A33F'
  ctx.beginPath()
  ctx.moveTo(0, -s * 1.18)
  ctx.lineTo(-s * 0.15, -s * 0.94)
  ctx.lineTo(s * 0.15, -s * 0.94)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function casinha(ctx, x, y, s) {
  const w = s * 1.9
  const h = s * 1.7
  ctx.save()
  ctx.translate(x, y)
  ctx.fillStyle = '#B98B5E'
  ctx.fillRect(-w / 2, 0, w, h)
  ctx.fillStyle = '#8A5F3A'
  ctx.beginPath()
  ctx.moveTo(-w * 0.64, 0)
  ctx.lineTo(0, -h * 0.64)
  ctx.lineTo(w * 0.64, 0)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#3A2C1F'
  ctx.beginPath()
  ctx.arc(0, h * 0.4, s * 0.42, 0, 6.2832)
  ctx.fill()
  ctx.strokeStyle = '#6B4A2E'
  ctx.lineWidth = Math.max(1, s * 0.15)
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(0, h * 0.78)
  ctx.lineTo(0, h * 1.05)
  ctx.stroke()
  ctx.restore()
}

function balanco(ctx, x, y, s) {
  const L = s * 3.2
  const w = s * 1.8
  ctx.strokeStyle = '#C8A879'
  ctx.lineWidth = Math.max(1, s * 0.17)
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(x - w * 0.42, y)
  ctx.lineTo(x - w * 0.42, y + L)
  ctx.moveTo(x + w * 0.42, y)
  ctx.lineTo(x + w * 0.42, y + L)
  ctx.stroke()
  ctx.fillStyle = '#9A6B44'
  ctx.fillRect(x - w * 0.56, y + L, w * 1.12, Math.max(2, s * 0.4))
}

function bandeirinhas(ctx, x1, y1, x2, y2, s) {
  const CORES = ['#E8643C', '#F2C14E', '#4FA3A5', '#E06C9F', '#7FBF5A']
  const sag = Math.abs(x2 - x1) * 0.16 + s * 2.2
  const cx = (x1 + x2) / 2
  const cy = (y1 + y2) / 2 + sag

  ctx.strokeStyle = 'rgba(120,100,80,.85)'
  ctx.lineWidth = Math.max(1, s * 0.11)
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.quadraticCurveTo(cx, cy, x2, y2)
  ctx.stroke()

  const N = 10
  for (let i = 1; i < N; i++) {
    const t = i / N
    const u = 1 - t
    const px = u * u * x1 + 2 * u * t * cx + t * t * x2
    const py = u * u * y1 + 2 * u * t * cy + t * t * y2
    ctx.fillStyle = CORES[i % CORES.length]
    ctx.beginPath()
    ctx.moveTo(px - s * 0.44, py)
    ctx.lineTo(px + s * 0.44, py)
    ctx.lineTo(px, py + s * 1.15)
    ctx.closePath()
    ctx.fill()
  }
}

function bolasDeNatal(ctx, pontos, s) {
  const CORES = ['#D0433B', '#E8B44A', '#3E8E5A', '#4A7FC1', '#C7609E']
  pontos.forEach((p, i) => {
    const fio = s * 0.5
    ctx.strokeStyle = 'rgba(140,120,90,.8)'
    ctx.lineWidth = Math.max(1, s * 0.1)
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
    ctx.lineTo(p.x, p.y + fio)
    ctx.stroke()
    ctx.fillStyle = CORES[i % CORES.length]
    ctx.beginPath()
    ctx.arc(p.x, p.y + fio + s * 0.54, s * 0.54, 0, 6.2832)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,.42)'
    ctx.beginPath()
    ctx.arc(p.x - s * 0.18, p.y + fio + s * 0.38, s * 0.15, 0, 6.2832)
    ctx.fill()
  })
}

/* ============================================================
   Orquestracao
   ============================================================ */

export function desenharEnfeites(ctx, arv, TX, TY, k, ids) {
  if (!ids || ids.length === 0) return

  const s = Math.max(5, 8 * k) // escala dos objetos, com piso para nao sumir
  const tem = (id) => ids.indexOf(id) >= 0

  // Galhos do mais grosso para o mais fino: os pesados vao nos estruturais.
  const grossos = arv.galhos.slice().sort((a, b) => b.w - a.w)
  const pega = (i) => grossos[Math.min(i, grossos.length - 1)]

  if (tem('casinha')) {
    // No meio do tronco, que e sempre o galho mais grosso.
    const t = grossos[0]
    casinha(ctx, TX((t.x1 + t.x2) / 2) + s * 1.4, TY((t.y1 + t.y2) / 2), s)
  }

  if (tem('balanco')) {
    // Prefere um galho mais horizontal que vertical, para a corda cair reto.
    const horizontal = arv.galhos.find(
      (b) => b.w > 2.5 && Math.abs(b.y2 - b.y1) < Math.abs(b.x2 - b.x1),
    )
    const g = horizontal || pega(3)
    balanco(ctx, TX(g.x2), TY(g.y2), s)
  }

  if (tem('bandeirinhas')) {
    // Entre as duas pontas mais afastadas na horizontal.
    let esq = arv.pontas[0]
    let dir = arv.pontas[0]
    for (const p of arv.pontas) {
      if (p.x < esq.x) esq = p
      if (p.x > dir.x) dir = p
    }
    bandeirinhas(ctx, TX(esq.x), TY(esq.y), TX(dir.x), TY(dir.y), s)
  }

  if (tem('natal')) {
    // Seis pontas espalhadas pela metade externa da copa.
    const total = arv.pontas.length
    const pontos = []
    for (let i = 0; i < 6; i++) {
      const idx = Math.min(total - 1, Math.floor(total * (0.45 + 0.52 * (i / 5))))
      const p = arv.pontas[idx]
      if (p) pontos.push({ x: TX(p.x), y: TY(p.y) })
    }
    bolasDeNatal(ctx, pontos, s)
  }

  if (tem('passarinho')) {
    const g = pega(5)
    passarinho(ctx, TX(g.x2), TY(g.y2), s)
  }

  if (tem('coruja')) {
    const g = pega(2)
    coruja(ctx, TX(g.x2), TY(g.y2), s * 1.15)
  }
}
