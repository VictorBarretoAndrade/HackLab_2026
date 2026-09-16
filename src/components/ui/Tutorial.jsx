import { useEffect, useRef, useState } from 'react'
import { Arvore, Painel, Tesoura } from './icons.jsx'

/**
 * Tutorial de primeira abertura.
 *
 * Tres passos, tres cliques: Próximo, Próximo, Começar. E o teto que o
 * onboarding pode custar antes de virar obstaculo — quem abre uma plataforma
 * quer usar a plataforma, nao ler sobre ela.
 *
 * Cada passo explica um dos tres pilares e termina apontando para a acao
 * concreta que a pessoa deve fazer ao fechar.
 */
const PASSOS = [
  {
    Icone: Arvore,
    titulo: 'Sua árvore cresce com extensão',
    texto:
      'Cada projeto que você conclui vira horas validadas: a árvore cresce e as folhas tomam a cor das competências que você desenvolveu. Atraso e abandono secam a copa e travam as competências de volta.',
    acao: 'Comece clicando em “Marcar como concluído” em qualquer projeto da lista.',
  },
  {
    Icone: Tesoura,
    titulo: 'Volte uma vez por semana',
    texto:
      'O mato cresce no pé da árvore. Capinar rende moedas, e semanas seguidas pagam cada vez mais. Com as moedas você compra enfeites: passarinho, balanço, bandeirinhas, coruja.',
    acao: 'No card Jardim, use “Limpar o mato” e depois compre algo na lojinha.',
  },
  {
    Icone: Painel,
    titulo: 'A coordenação vê os mesmos números',
    texto:
      'A aba Coordenação mostra a turma inteira: quanto cada aluno cumpriu da meta do semestre, quem não consegue mais integralizar no prazo e quais projetos estão perdendo gente.',
    acao: 'Troque de aba lá em cima para ver o outro lado.',
  },
]

export default function Tutorial({ aoFechar }) {
  const [i, setI] = useState(0)
  const botao = useRef(null)
  const ultimo = i === PASSOS.length - 1
  const passo = PASSOS[i]

  useEffect(() => {
    botao.current?.focus()
  }, [i])

  useEffect(() => {
    const esc = (e) => {
      if (e.key === 'Escape') aoFechar()
    }
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [aoFechar])

  return (
    <div className="tutorial-fundo" role="presentation">
      <div
        className="tutorial"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-titulo"
      >
        <div className="tutorial-topo">
          <span className="tutorial-ico" aria-hidden="true">
            <passo.Icone />
          </span>
          <p className="eyebrow">
            Passo {i + 1} de {PASSOS.length}
          </p>
        </div>

        <h2 id="tutorial-titulo">{passo.titulo}</h2>
        <p className="tutorial-txt">{passo.texto}</p>
        <p className="tutorial-acao">{passo.acao}</p>

        <div className="tutorial-pe">
          <div className="tutorial-pontos" aria-hidden="true">
            {PASSOS.map((_, n) => (
              <span key={n} data-ativo={String(n === i)} />
            ))}
          </div>

          <div className="tutorial-botoes">
            {!ultimo ? (
              <button type="button" className="link" onClick={aoFechar}>
                Pular
              </button>
            ) : null}
            <button
              type="button"
              className="btn primary"
              ref={botao}
              onClick={() => (ultimo ? aoFechar() : setI(i + 1))}
            >
              {ultimo ? 'Começar' : 'Próximo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
