import { useCallback, useEffect, useLayoutEffect, useState } from 'react'

/**
 * Tour de primeira abertura, com DESTAQUE nos elementos reais.
 *
 * O publico de teste sao coordenadores, nem todos com familiaridade digital.
 * Um cartao centralizado descrevendo a tela nao resolve para eles: precisa
 * apontar o botao, com o botao visivel e recortado no escuro. Cada passo
 * termina com a frase do que clicar quando o tour acabar.
 *
 * Tres passos, tres cliques: Próximo, Próximo, Começar.
 *
 * Se um alvo nao existir na tela (a lista de projetos pode nao ter nenhum em
 * andamento, por exemplo), o passo cai para um cartao centralizado em vez de
 * apontar para o vazio.
 */
const PASSOS = [
  {
    alvo: '[data-tour="concluir"]',
    titulo: 'Conclua um projeto aqui',
    texto:
      'Esta é a lista de projetos de extensão do aluno. Este botão marca o projeto como concluído: as horas entram na conta, a árvore cresce na hora e as folhas ganham a cor da competência que o projeto desenvolve.',
    acao: 'Ao fechar, clique neste botão e olhe a árvore.',
  },
  {
    alvo: '[data-tour="capinar"]',
    titulo: 'Volte uma vez por semana',
    texto:
      'Nasce mato no pé da árvore com o passar dos dias. Este botão limpa e paga moedas — e semanas seguidas pagam cada vez mais. Logo abaixo dele fica a lojinha de enfeites.',
    acao: 'Você já começa com moedas de sobra para comprar todos os enfeites.',
  },
  {
    alvo: '[data-tour="abas"]',
    titulo: 'Troque para o lado da coordenação',
    texto:
      'Estas duas abas mudam o ponto de vista. Em Coordenação você vê a turma inteira: quanto cada aluno já cumpriu da meta do semestre, quem não consegue mais integralizar no prazo e quais projetos estão perdendo gente.',
    acao: 'Ao fechar, clique em “Coordenação” aqui em cima.',
  },
]

const MARGEM = 8
const BALAO = 340

export default function Tutorial({ aoFechar }) {
  const [i, setI] = useState(0)
  const [caixa, setCaixa] = useState(null)
  const ultimo = i === PASSOS.length - 1
  const passo = PASSOS[i]

  const medir = useCallback(() => {
    const el = document.querySelector(PASSOS[i].alvo)
    if (!el) {
      setCaixa(null)
      return
    }
    const r = el.getBoundingClientRect()
    setCaixa({ top: r.top, left: r.left, width: r.width, height: r.height })
  }, [i])

  // Leva o alvo para o centro da tela antes de medir: sem isso o destaque
  // cairia fora da area visivel em telas pequenas.
  useEffect(() => {
    const el = document.querySelector(PASSOS[i].alvo)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const t = setTimeout(medir, 420)
    return () => clearTimeout(t)
  }, [i, medir])

  useLayoutEffect(medir, [medir])

  useEffect(() => {
    window.addEventListener('resize', medir)
    window.addEventListener('scroll', medir, true)
    return () => {
      window.removeEventListener('resize', medir)
      window.removeEventListener('scroll', medir, true)
    }
  }, [medir])

  useEffect(() => {
    const esc = (e) => {
      if (e.key === 'Escape') aoFechar()
    }
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [aoFechar])

  const avancar = () => (ultimo ? aoFechar() : setI(i + 1))

  // Balao abaixo do alvo quando cabe; acima quando nao cabe.
  let estiloBalao = {}
  if (caixa) {
    const abaixo = window.innerHeight - (caixa.top + caixa.height) > 250
    const meio = caixa.left + caixa.width / 2
    estiloBalao = {
      top: abaixo ? caixa.top + caixa.height + 16 : caixa.top - 16,
      left: Math.min(Math.max(meio, BALAO / 2 + 12), window.innerWidth - BALAO / 2 - 12),
      transform: abaixo ? 'translateX(-50%)' : 'translate(-50%, -100%)',
    }
  }

  return (
    <>
      {/* Engole cliques perdidos enquanto o tour esta aberto. */}
      <div className="tour-bloqueio" onClick={avancar} role="presentation" />

      {caixa ? (
        <div
          className="tour-foco"
          style={{
            top: caixa.top - MARGEM,
            left: caixa.left - MARGEM,
            width: caixa.width + MARGEM * 2,
            height: caixa.height + MARGEM * 2,
          }}
          aria-hidden="true"
        />
      ) : null}

      <div
        className={'tour-balao' + (caixa ? '' : ' centrado')}
        style={estiloBalao}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-titulo"
      >
        <p className="eyebrow">
          Passo {i + 1} de {PASSOS.length}
        </p>
        <h2 id="tour-titulo">{passo.titulo}</h2>
        <p className="tour-txt">{passo.texto}</p>
        <p className="tour-acao">{passo.acao}</p>

        <div className="tour-pe">
          <div className="tour-pontos" aria-hidden="true">
            {PASSOS.map((_, n) => (
              <span key={n} data-ativo={String(n === i)} />
            ))}
          </div>
          <div className="tour-botoes">
            {!ultimo ? (
              <button type="button" className="link" onClick={aoFechar}>
                Pular
              </button>
            ) : null}
            <button type="button" className="btn primary" autoFocus onClick={avancar}>
              {ultimo ? 'Começar' : 'Próximo'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
