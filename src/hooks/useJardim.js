import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  JARDIM_INICIAL,
  VERSAO_JARDIM,
  adiantarSemana,
  alternar,
  comprar,
  estadoJardim,
  limpar,
  naArvore,
  porTodos,
  tirarTodos,
} from '../lib/jardim.js'

const CHAVE = 'mytree:jardim'

function carregar() {
  try {
    const bruto = JSON.parse(localStorage.getItem(CHAVE))
    // Estado de uma versao anterior da economia e descartado: senao quem ja
    // testou a build antiga ficaria sem o saldo de boas-vindas.
    if (bruto && typeof bruto === 'object' && bruto.versao === VERSAO_JARDIM) {
      return {
        ...JARDIM_INICIAL,
        ...bruto,
        comprados: Array.isArray(bruto.comprados) ? bruto.comprados : [],
        guardados: Array.isArray(bruto.guardados) ? bruto.guardados : [],
      }
    }
  } catch {
    /* storage indisponivel ou corrompido: comeca do zero */
  }
  return { ...JARDIM_INICIAL }
}

/**
 * Estado acumulado do jardim, persistido no navegador.
 *
 * Diferente do motor do aluno, que e derivado dos status dos projetos, aqui a
 * memoria e obrigatoria: moedas gastas nao dao para recalcular.
 *
 * `tick` existe para o mato crescer sozinho com a pagina aberta — sem isso a
 * barra so mudaria depois de um F5.
 */
export function useJardim() {
  const [jardim, setJardim] = useState(carregar)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(jardim))
    } catch {
      /* sem persistencia neste navegador */
    }
  }, [jardim])

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60000)
    return () => clearInterval(id)
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const estado = useMemo(() => estadoJardim(jardim), [jardim, tick])

  const zerar = useCallback(() => setJardim({ ...JARDIM_INICIAL }), [])

  const acoes = useMemo(
    () => ({
      limpar() {
        const r = limpar(jardim)
        if (r.ganho > 0) setJardim(r.jardim)
        return r
      },
      comprar(enfeite) {
        const depois = comprar(jardim, enfeite)
        if (depois !== jardim) setJardim(depois)
        return depois !== jardim
      },
      alternar(id) {
        setJardim((j) => alternar(j, id))
      },
      tirarTodos() {
        setJardim(tirarTodos)
      },
      porTodos() {
        setJardim(porTodos)
      },
      adiantar() {
        setJardim(adiantarSemana)
      },
      zerar,
    }),
    [jardim, zerar],
  )

  const chaveEnfeites = naArvore(jardim).join(',')
  const enfeites = useMemo(
    () => naArvore(jardim),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chaveEnfeites],
  )

  return { jardim, estado, enfeites, acoes }
}
