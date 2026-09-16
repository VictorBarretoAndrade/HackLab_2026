import { useEffect, useRef, useState } from 'react'

/**
 * Devolve [ref, largura] observando o elemento com ResizeObserver.
 *
 * Graficos SVG precisam da largura real em pixels: usar viewBox com
 * preserveAspectRatio="none" distorceria o texto dos eixos, e um viewBox fixo
 * encolheria a tipografia junto com o cartao.
 *
 * A largura devolvida e SEMPRE a do content box (ja sem o padding do
 * elemento). O ResizeObserver dispara uma vez no observe(), entao nao ha
 * medicao inicial separada — usar getBoundingClientRect aqui devolveria a
 * largura do border box e o grafico nasceria com 24 px a mais do que cabe,
 * estourando o cartao no celular.
 */
export function useMedida() {
  const ref = useRef(null)
  const [largura, setLargura] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ro = new ResizeObserver((entradas) => {
      const w = Math.round(entradas[0].contentRect.width)
      setLargura((antes) => (antes === w ? antes : w))
    })
    ro.observe(el)

    return () => ro.disconnect()
  }, [])

  return [ref, largura]
}
