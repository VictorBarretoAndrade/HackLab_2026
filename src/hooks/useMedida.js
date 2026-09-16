import { useEffect, useRef, useState } from 'react'

/**
 * Devolve [ref, largura] observando o elemento com ResizeObserver.
 *
 * Graficos SVG precisam da largura real em pixels: usar viewBox com
 * preserveAspectRatio="none" distorceria o texto dos eixos, e um viewBox fixo
 * encolheria a tipografia junto com o cartao.
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
    setLargura(Math.round(el.getBoundingClientRect().width))

    return () => ro.disconnect()
  }, [])

  return [ref, largura]
}
