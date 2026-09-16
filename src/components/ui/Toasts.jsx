import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

const Ctx = createContext(() => {})

/** Avisos flutuantes. `avisar(texto, cor)` — cor e um valor CSS (token ou hex). */
export function ToastsProvider({ children }) {
  const [lista, setLista] = useState([])
  const seq = useRef(0)

  const avisar = useCallback((texto, cor = 'var(--accent)') => {
    const id = ++seq.current
    setLista((l) => [...l, { id, texto, cor, saindo: false }])

    setTimeout(() => {
      setLista((l) => l.map((t) => (t.id === id ? { ...t, saindo: true } : t)))
      setTimeout(() => setLista((l) => l.filter((t) => t.id !== id)), 320)
    }, 3200)
  }, [])

  const valor = useMemo(() => avisar, [avisar])

  return (
    <Ctx.Provider value={valor}>
      {children}
      <div className="toasts" aria-live="polite" aria-atomic="false">
        {lista.map((t) => (
          <div key={t.id} className="toast" data-saindo={String(t.saindo)}>
            <span className="dot" style={{ '--k': t.cor }} />
            <span>{t.texto}</span>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export const useAvisar = () => useContext(Ctx)
