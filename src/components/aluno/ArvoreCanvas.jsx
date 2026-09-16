import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { mix, mulberry32, rgba, token } from '../../lib/cor.js'

/**
 * A arvore, desenhada por codigo a cada frame. Sem sprites, sem imagens,
 * sem biblioteca.
 *
 * ARQUITETURA: todo o estado da animacao vive num ref, nunca em useState.
 * Re-renders do React nao podem reiniciar o loop nem perder a posicao das
 * particulas. As props so movem os ALVOS; os valores exibidos perseguem esses
 * alvos por interpolacao, e e isso que faz a arvore *crescer* em vez de
 * *saltar* de tamanho.
 */

const SEMENTE = 20260916
const TRONCO_U = 100 // tronco nominal, em unidades do espaco de geracao

/**
 * Gera a arvore em ESPACO UNITARIO e acumula a bounding box.
 *
 * O desenho depois escala isso para caber no canvas. Foi essa mudanca que
 * corrigiu o bug em que a arvore nunca crescia: a versao anterior limitava o
 * tronco por `min(tronco, alturaMax * 0.6)` com `alturaMax = H - baseY - 26`,
 * que e o espaco ABAIXO da base (~12 px) e nao acima. O tronco ficava travado
 * em ~7 px por mais horas que o aluno acumulasse.
 */
function gerar(growth, tempo, vento) {
  const rnd = mulberry32(SEMENTE)
  const galhos = []
  const pontas = []
  const prof = Math.round(3 + growth * 5) // 3 a 8 niveis
  let minX = 0
  let maxX = 0
  let minY = 0

  const marcar = (x, y) => {
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
  }

  function ramo(x, y, ang, comp, esp, d) {
    const bal = Math.sin(tempo * 0.0009 + d * 0.7 + x * 0.02) * 0.02 * (prof - d + 1) * vento
    const a = ang + bal
    const x2 = x + Math.cos(a) * comp
    const y2 = y + Math.sin(a) * comp
    galhos.push({ x1: x, y1: y, x2, y2, w: esp })
    marcar(x2, y2)

    if (d <= 1 || comp < 6) {
      const n = 2 + Math.floor(rnd() * 2)
      for (let i = 0; i < n; i++) {
        const lx = x2 + (rnd() - 0.5) * comp * 1.1
        const ly = y2 + (rnd() - 0.5) * comp * 1.1
        pontas.push({
          x: lx,
          y: ly,
          r: 5.5 + rnd() * 4,
          a: a + (rnd() - 0.5) * 1.6,
          tom: rnd(),
          dist: 0,
        })
        marcar(lx, ly)
      }
      return
    }

    const abertura = 0.4 + rnd() * 0.26
    const filhos = d >= prof - 1 && rnd() < 0.45 ? 3 : 2
    for (let i = 0; i < filhos; i++) {
      const lado = filhos === 3 ? i - 1 : i === 0 ? -1 : 1
      const jit = (rnd() - 0.5) * 0.3
      ramo(x2, y2, a + abertura * lado + jit, comp * (0.7 + rnd() * 0.1), esp * 0.68, d - 1)
    }
  }

  ramo(0, 0, -Math.PI / 2, TRONCO_U, 9, prof)

  // Folhas ordenadas de dentro para fora: quando a vitalidade cai, as
  // externas somem primeiro — que e como uma arvore seca de verdade.
  const cy = minY * 0.55
  for (const p of pontas) p.dist = p.x * p.x + (p.y - cy) * (p.y - cy)
  pontas.sort((a, b) => a.dist - b.dist)

  return { galhos, pontas, minX, maxX, minY }
}

const ArvoreCanvas = forwardRef(function ArvoreCanvas(
  { crescimento, vitalidade, frutos, descricao },
  ref,
) {
  const cvRef = useRef(null)
  const S = useRef({
    g: 0.05,
    v: 0.8,
    alvoG: 0.05,
    alvoV: 0.8,
    frutos: [],
    folhas: 0,
    pulso: 0,
    parts: [],
    poeira: [],
    pal: null,
    W: 0,
    H: 0,
    reduz: false,
    montado: false,
  })

  /* ---- alvos vindos das props ---- */
  useEffect(() => {
    const s = S.current
    s.alvoG = crescimento
    s.alvoV = vitalidade
    if (!s.montado) {
      s.montado = true
      s.v = vitalidade
      s.g = crescimento * 0.45 // abre crescendo, nao no tamanho final
    }
  }, [crescimento, vitalidade])

  /* ---- frutos, preservando a animacao de entrada dos que ja existiam ---- */
  useEffect(() => {
    const s = S.current
    s.frutos = frutos.map((f) => {
      const velho = s.frutos.find((o) => o.id === f.id)
      return { id: f.id, cor: f.cor, pop: velho ? velho.pop : 0.15 }
    })
  }, [frutos])

  /* ---- acoes imperativas ---- */
  useImperativeHandle(ref, () => ({
    pulsar() {
      S.current.pulso = 1
    },
    faiscar(n = 14, cor) {
      const s = S.current
      const c = cor || (s.pal ? s.pal.leafLive : '#6FA347')
      for (let i = 0; i < n; i++) {
        s.parts.push({
          x: s.W * 0.5 + (Math.random() - 0.5) * s.W * 0.5,
          y: s.H * 0.85 + Math.random() * 20,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(0.9 + Math.random() * 1.3),
          rot: 0,
          vr: 0,
          r: 1.3 + Math.random() * 1.8,
          vida: 1,
          cor: c,
          folha: false,
        })
      }
    },
  }))

  /* ---- loop principal ---- */
  useEffect(() => {
    const cv = cvRef.current
    const ctx = cv.getContext('2d')
    const s = S.current
    const pai = cv.parentElement

    for (let i = 0; i < 14; i++) {
      s.poeira.push({
        x: Math.random(),
        y: Math.random(),
        v: 0.05 + Math.random() * 0.1,
        r: 0.6 + Math.random() * 1.2,
        f: Math.random() * 6.28,
      })
    }

    const lerPaleta = () => {
      s.pal = {
        skyTop: token('--sky-top'),
        skyBot: token('--sky-bot'),
        barkLive: token('--bark-live'),
        barkDead: token('--bark-dead'),
        leafLive: token('--leaf-live'),
        leafDeep: token('--leaf-deep'),
        leafDead: token('--leaf-dead'),
        leafAsh: token('--leaf-ash'),
        soil: token('--soil'),
        halo: token('--halo'),
      }
    }

    const dimensionar = () => {
      const r = pai.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      s.W = Math.max(1, Math.round(r.width))
      s.H = Math.max(1, Math.round(r.height))
      cv.width = Math.round(s.W * dpr)
      cv.height = Math.round(s.H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const mqReduz = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mqTema = window.matchMedia('(prefers-color-scheme: dark)')
    const sincReduz = () => {
      s.reduz = mqReduz.matches
    }

    sincReduz()
    lerPaleta()
    dimensionar()

    const ro = new ResizeObserver(dimensionar)
    ro.observe(pai)
    mqTema.addEventListener('change', lerPaleta)
    mqReduz.addEventListener('change', sincReduz)
    const mo = new MutationObserver(lerPaleta)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    let frame = 0

    function desenhar(t) {
      const { W, H, pal } = s
      const g = s.g
      const v = s.v
      const seco = 1 - v

      ctx.clearRect(0, 0, W, H)

      const ceu = ctx.createLinearGradient(0, 0, 0, H)
      ceu.addColorStop(0, pal.skyTop)
      ceu.addColorStop(1, pal.skyBot)
      ctx.fillStyle = ceu
      ctx.fillRect(0, 0, W, H)

      // polen — so quando a arvore esta saudavel
      if (!s.reduz && v > 0.45) {
        for (const p of s.poeira) {
          p.y -= p.v * 0.0016
          if (p.y < -0.04) {
            p.y = 1.04
            p.x = Math.random()
          }
          ctx.fillStyle = rgba(
            pal.leafLive,
            (v - 0.45) * 0.5 * (0.5 + 0.5 * Math.sin(t * 0.001 + p.f)),
          )
          ctx.beginPath()
          ctx.arc(p.x * W + Math.sin(t * 0.0006 + p.f) * 10, p.y * H, p.r, 0, 6.2832)
          ctx.fill()
        }
      }

      // O balanco AUMENTA conforme a arvore seca: galho sem folha chacoalha mais.
      const vento = s.reduz ? 0 : 0.6 + seco * 1.5
      const arv = gerar(g, t, vento)

      // --- enquadramento por bounding box ---
      const baseY = H - Math.max(30, H * 0.085)
      const dispH = baseY - 16
      const dispW = W - 30
      const alturaAlvo = dispH * (0.42 + 0.54 * g) // 42% como semente, 96% frondosa
      const k = Math.min(
        alturaAlvo / Math.max(1, -arv.minY),
        dispW / Math.max(1, arv.maxX - arv.minX),
      )
      const baseX = W * 0.5 - ((arv.minX + arv.maxX) / 2) * k * 0.35
      const TX = (x) => baseX + x * k
      const TY = (y) => baseY + y * k

      // halo de saude
      if (v > 0.22) {
        const hx = TX((arv.minX + arv.maxX) / 2)
        const hy = TY(arv.minY * 0.55)
        const hr = Math.max(50, (arv.maxX - arv.minX) * k * 0.62)
        const halo = ctx.createRadialGradient(hx, hy, 0, hx, hy, hr)
        halo.addColorStop(0, pal.halo)
        halo.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.globalAlpha = (v - 0.22) * 0.95
        ctx.fillStyle = halo
        ctx.fillRect(0, 0, W, H)
        ctx.globalAlpha = 1
      }

      // solo
      const raio = 44 + TRONCO_U * k * 0.95
      ctx.fillStyle = pal.soil
      ctx.globalAlpha = 0.5 + v * 0.4
      ctx.beginPath()
      ctx.ellipse(baseX, baseY + 5, raio, 10 + 7 * g, 0, 0, 6.2832)
      ctx.fill()
      ctx.globalAlpha = 1

      // raizes — crescem com as horas acumuladas
      const casca = mix(pal.barkLive, pal.barkDead, seco * 0.85)
      ctx.strokeStyle = casca
      ctx.globalAlpha = 0.3 + v * 0.18
      ctx.lineCap = 'round'
      const rz = mulberry32(SEMENTE + 7)
      for (let i = 0; i < 5; i++) {
        const dir = (i - 2) / 2
        const comp = raio * (0.42 + rz() * 0.55) * (0.5 + g * 0.6)
        ctx.lineWidth = Math.max(1, (4 - Math.abs(dir) * 1.4) * (0.5 + g))
        ctx.beginPath()
        ctx.moveTo(baseX, baseY)
        ctx.quadraticCurveTo(
          baseX + dir * comp * 0.7,
          baseY + 4,
          baseX + dir * comp,
          baseY + 12 + rz() * 6,
        )
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      // pulso de crescimento
      if (s.pulso > 0) {
        s.pulso = Math.max(0, s.pulso - 0.015)
        const p = 1 - s.pulso
        ctx.strokeStyle = rgba(pal.leafLive, s.pulso * 0.55)
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.ellipse(
          baseX,
          baseY + 2,
          30 + p * raio * 1.6,
          (30 + p * raio * 1.6) * 0.22,
          0,
          0,
          6.2832,
        )
        ctx.stroke()
      }

      // galhos
      ctx.strokeStyle = casca
      for (const b of arv.galhos) {
        ctx.lineWidth = Math.max(0.6, b.w * k)
        ctx.beginPath()
        ctx.moveTo(TX(b.x1), TY(b.y1))
        ctx.lineTo(TX(b.x2), TY(b.y2))
        ctx.stroke()
      }

      // folhas
      const total = arv.pontas.length
      const alvoFolhas = Math.round(total * (0.1 + 0.9 * Math.pow(v, 1.25)))

      if (s.folhas > alvoFolhas + 0.6 && !s.reduz) {
        for (let i = 0; i < 3; i++) {
          const f = arv.pontas[Math.max(0, Math.round(s.folhas) - 1 - i)]
          if (f)
            s.parts.push({
              x: TX(f.x),
              y: TY(f.y),
              vx: (Math.random() - 0.5) * 0.6,
              vy: 0.25 + Math.random() * 0.4,
              rot: Math.random() * 6.28,
              vr: (Math.random() - 0.5) * 0.08,
              r: f.r * k,
              vida: 1,
              cor: mix(pal.leafDead, pal.leafAsh, 0.4),
              folha: true,
            })
        }
      }
      s.folhas += (alvoFolhas - s.folhas) * (s.reduz ? 1 : 0.08)
      const mostrar = Math.round(s.folhas)

      for (let i = 0; i < mostrar && i < total; i++) {
        const f = arv.pontas[i]
        const viva = mix(pal.leafDeep, pal.leafLive, f.tom)
        const morta = mix(pal.leafDead, pal.leafAsh, f.tom)
        ctx.fillStyle = mix(viva, morta, Math.pow(seco, 0.8))
        ctx.save()
        ctx.translate(TX(f.x), TY(f.y))
        ctx.rotate(f.a)
        ctx.beginPath()
        ctx.ellipse(0, 0, f.r * k * (0.7 + v * 0.45), f.r * k * 0.5, 0, 0, 6.2832)
        ctx.fill()
        ctx.restore()
      }

      // frutos: uma competencia desbloqueada = um fruto luminoso
      for (let i = 0; i < s.frutos.length; i++) {
        const o = s.frutos[i]
        o.pop += (1 - o.pop) * 0.1
        const idx = Math.min(
          total - 1,
          Math.floor(total * (0.35 + 0.58 * ((i + 0.5) / s.frutos.length))),
        )
        const anc = arv.pontas[idx]
        if (!anc) continue
        const bob = s.reduz ? 0 : Math.sin(t * 0.0016 + i * 1.7) * 2.2
        const fx = TX(anc.x)
        const fy = TY(anc.y) + bob
        const rr = (5.5 + 2.5 * g) * o.pop
        const gg = ctx.createRadialGradient(fx, fy, 0, fx, fy, rr * 3.4)
        gg.addColorStop(0, rgba(o.cor, 0.75))
        gg.addColorStop(1, rgba(o.cor, 0))
        ctx.fillStyle = gg
        ctx.beginPath()
        ctx.arc(fx, fy, rr * 3.4, 0, 6.2832)
        ctx.fill()
        ctx.fillStyle = o.cor
        ctx.beginPath()
        ctx.arc(fx, fy, rr, 0, 6.2832)
        ctx.fill()
        ctx.fillStyle = 'rgba(255,255,255,.55)'
        ctx.beginPath()
        ctx.arc(fx - rr * 0.3, fy - rr * 0.35, rr * 0.28, 0, 6.2832)
        ctx.fill()
      }

      // particulas
      for (let i = s.parts.length - 1; i >= 0; i--) {
        const p = s.parts[i]
        p.x += p.vx + (p.folha ? Math.sin(t * 0.002 + p.rot) * 0.5 : 0)
        p.y += p.vy
        p.vy = Math.min(p.vy + (p.folha ? 0.008 : 0.014), 1.4)
        p.rot += p.vr
        p.vida -= p.folha ? 0.006 : 0.014
        if (p.vida <= 0 || p.y > H + 20) {
          s.parts.splice(i, 1)
          continue
        }
        ctx.globalAlpha = Math.max(0, Math.min(1, p.vida))
        ctx.fillStyle = p.cor
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.beginPath()
        ctx.ellipse(0, 0, p.r, p.r * (p.folha ? 0.5 : 1), 0, 0, 6.2832)
        ctx.fill()
        ctx.restore()
        ctx.globalAlpha = 1
      }
    }

    function loop(t) {
      const fator = s.reduz ? 1 : 0.055
      s.g += (s.alvoG - s.g) * fator
      s.v += (s.alvoV - s.v) * fator
      if (s.pal && s.W > 0) desenhar(t)
      frame = requestAnimationFrame(loop)
    }

    frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      mo.disconnect()
      mqTema.removeEventListener('change', lerPaleta)
      mqReduz.removeEventListener('change', sincReduz)
      s.poeira = []
      s.parts = []
      s.montado = false
    }
  }, [])

  return (
    <>
      <canvas ref={cvRef} aria-hidden="true" />
      <p className="sr" role="status" aria-live="polite">
        {descricao}
      </p>
    </>
  )
})

export default ArvoreCanvas
