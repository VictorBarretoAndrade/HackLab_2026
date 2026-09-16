import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const Ctx = createContext(null)

/**
 * Tooltip unico e compartilhado, posicionado em coordenadas de viewport.
 *
 * Regra que ele respeita: tooltip ENRIQUECE, nunca e o unico caminho para um
 * valor. Todo numero mostrado aqui tambem aparece em rotulo direto ou na vista
 * de tabela.
 */
export function TooltipProvider({ children }) {
  const [tip, setTip] = useState(null)

  const api = useMemo(
    () => ({
      mostrar: (conteudo, x, y) => setTip({ conteudo, x, y }),
      esconder: () => setTip(null),
    }),
    [],
  )

  useEffect(() => {
    if (!tip) return
    const fechar = () => setTip(null)
    window.addEventListener('scroll', fechar, true)
    window.addEventListener('resize', fechar)
    return () => {
      window.removeEventListener('scroll', fechar, true)
      window.removeEventListener('resize', fechar)
    }
  }, [tip])

  return (
    <Ctx.Provider value={api}>
      {children}
      {tip ? (
        <div
          className="tip"
          role="tooltip"
          style={{
            left: Math.min(Math.max(tip.x, 140), window.innerWidth - 140),
            top: tip.y,
          }}
        >
          {tip.conteudo}
        </div>
      ) : null}
    </Ctx.Provider>
  )
}

/**
 * Devolve uma funcao que produz os handlers a espalhar no elemento:
 *
 *   const tip = useTooltip()
 *   <span {...tip(<b>Olá</b>)} tabIndex={0} />
 *
 * Inclui onFocus/onBlur, entao o teclado ve o mesmo que o mouse.
 */
export function useTooltip() {
  const api = useContext(Ctx)

  return useMemo(() => {
    return (conteudo) => {
      const abrir = (e) => {
        const r = e.currentTarget.getBoundingClientRect()
        const x = e.clientX || r.left + r.width / 2
        api.mostrar(conteudo, x, r.top)
      }
      return {
        onMouseEnter: abrir,
        onMouseMove: abrir,
        onMouseLeave: api.esconder,
        onFocus: abrir,
        onBlur: api.esconder,
      }
    }
  }, [api])
}

/** Linha rotulo/valor dentro do tooltip. */
export const Linha = ({ rotulo, valor }) => (
  <div className="r">
    <span>{rotulo}</span>
    <span>{valor}</span>
  </div>
)
