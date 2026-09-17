import { useEffect, useState } from 'react'
import { useTema } from './hooks/useTema.js'
import { ToastsProvider } from './components/ui/Toasts.jsx'
import { TooltipProvider } from './components/ui/Tooltip.jsx'
import { Ajuda, Arvore, Lua, Monitor, Painel, Sol } from './components/ui/icons.jsx'
import Tutorial from './components/ui/Tutorial.jsx'
import VisaoAluno from './components/aluno/VisaoAluno.jsx'
import VisaoGestor from './components/gestor/VisaoGestor.jsx'

const CHAVE_TUTORIAL = 'mytree:tutorial'

const VISOES = {
  aluno: { rotulo: 'Aluno', Icone: Arvore },
  gestor: { rotulo: 'Coordenação', Icone: Painel },
}

const TEMAS = [
  { id: 'light', rotulo: 'Tema claro', Icone: Sol },
  { id: 'system', rotulo: 'Seguir o sistema', Icone: Monitor },
  { id: 'dark', rotulo: 'Tema escuro', Icone: Lua },
]

/**
 * Roteamento por hash (#/aluno, #/gestor).
 *
 * O GitHub Pages nao reescreve rotas para o index.html, entao um roteador de
 * History API daria 404 ao recarregar em /gestor. Com hash, o link continua
 * compartilhavel e nao precisa de 404.html nem de configuracao no servidor.
 */
function visaoDaHash() {
  const h = window.location.hash.replace(/^#\/?/, '')
  return h === 'gestor' ? 'gestor' : 'aluno'
}

export default function App() {
  const [visao, setVisao] = useState(visaoDaHash)
  const [tema, setTema] = useTema()

  // Abre sozinho na primeira visita; depois so pelo botao de ajuda.
  const [tutorial, setTutorial] = useState(() => {
    try {
      return localStorage.getItem(CHAVE_TUTORIAL) !== 'visto'
    } catch {
      return true
    }
  })

  const fecharTutorial = () => {
    setTutorial(false)
    try {
      localStorage.setItem(CHAVE_TUTORIAL, 'visto')
    } catch {
      /* sem persistencia: reaparece na proxima visita */
    }
  }

  useEffect(() => {
    const sincronizar = () => setVisao(visaoDaHash())
    window.addEventListener('hashchange', sincronizar)
    return () => window.removeEventListener('hashchange', sincronizar)
  }, [])

  const trocar = (v) => {
    window.location.hash = '#/' + v
    setVisao(v)
  }

  // Dois dos tres alvos do tour vivem na visao do aluno. Se o tour abrir com a
  // coordenacao na tela, os destaques apontariam para o vazio.
  useEffect(() => {
    if (tutorial && visaoDaHash() !== 'aluno') {
      window.location.hash = '#/aluno'
      setVisao('aluno')
    }
  }, [tutorial])

  return (
    <ToastsProvider>
      <TooltipProvider>
        <header className="topbar">
          <div className="topbar-in">
            <div className="brand">
              <span className="mark" aria-hidden="true">
                <Arvore style={{ color: 'var(--surface)' }} />
              </span>
              <span>
                <b>MyTree</b>
                <span>Extensão universitária gamificada</span>
              </span>
            </div>

            <div className="tabs" role="tablist" aria-label="Escolher visão" data-tour="abas">
              {Object.entries(VISOES).map(([id, v]) => (
                <button
                  type="button"
                  key={id}
                  id={'aba-' + id}
                  role="tab"
                  aria-selected={visao === id}
                  aria-controls="painel"
                  onClick={() => trocar(id)}
                >
                  <v.Icone />
                  {v.rotulo}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="ajuda"
              onClick={() => setTutorial(true)}
              aria-label="Ver o tutorial de novo"
              title="Ver o tutorial de novo"
            >
              <Ajuda />
            </button>

            <div className="theme-toggle" role="group" aria-label="Tema da interface">
              {TEMAS.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  title={t.rotulo}
                  aria-label={t.rotulo}
                  aria-pressed={tema === t.id}
                  onClick={() => setTema(t.id)}
                >
                  <t.Icone />
                </button>
              ))}
            </div>
          </div>
        </header>

        <main id="painel" role="tabpanel" aria-labelledby={'aba-' + visao} tabIndex={-1}>
          {visao === 'gestor' ? <VisaoGestor /> : <VisaoAluno />}
        </main>

        {tutorial ? <Tutorial aoFechar={fecharTutorial} /> : null}
      </TooltipProvider>
    </ToastsProvider>
  )
}
