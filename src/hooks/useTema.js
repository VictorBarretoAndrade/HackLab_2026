import { useEffect, useState } from 'react'

const CHAVE = 'raiz:tema'

/**
 * Tres estados: 'light', 'dark' e 'system'.
 *
 * 'system' REMOVE o atributo data-theme, deixando so o prefers-color-scheme
 * decidir — que e exatamente o estado em que a maioria dos visitantes chega.
 * Escrever data-theme="system" quebraria o padrao de tokens.
 */
export function useTema() {
  const [tema, setTema] = useState(() => {
    try {
      const v = localStorage.getItem(CHAVE)
      return v === 'dark' || v === 'light' ? v : 'system'
    } catch {
      return 'system'
    }
  })

  useEffect(() => {
    const el = document.documentElement
    if (tema === 'system') el.removeAttribute('data-theme')
    else el.setAttribute('data-theme', tema)

    try {
      if (tema === 'system') localStorage.removeItem(CHAVE)
      else localStorage.setItem(CHAVE, tema)
    } catch {
      /* modo privado: a escolha vale so para esta sessao */
    }
  }, [tema])

  return [tema, setTema]
}
