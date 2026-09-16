/**
 * Icones.
 *
 * Os tres primeiros (Certo, Atencao, Errado) sao o CANAL SECUNDARIO
 * obrigatorio do status. O par verde<->vermelho da paleta de status mede
 * dE 4,1 sob deuteranopia, entao a cor nunca carrega sentido sozinha: cada
 * status vem com um icone de FORMA distinta (marca de certo, triangulo,
 * circulo com x) e com a palavra escrita.
 */

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const Certo = (p) => (
  <svg {...base} strokeWidth="2.6" {...p}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

export const Atencao = (p) => (
  <svg {...base} strokeWidth="2.2" {...p}>
    <path d="M12 9.2v5" />
    <path d="M12 17.6v.01" />
    <path d="M10.3 3.9L2.4 18a1.9 1.9 0 0 0 1.7 2.9h15.8a1.9 1.9 0 0 0 1.7-2.9L13.7 3.9a1.9 1.9 0 0 0-3.4 0z" />
  </svg>
)

export const Errado = (p) => (
  <svg {...base} strokeWidth="2.4" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15 9l-6 6M9 9l6 6" />
  </svg>
)

export const Pausa = (p) => (
  <svg {...base} strokeWidth="2.2" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M10 9.5v5M14 9.5v5" />
  </svg>
)

export const Relogio = (p) => (
  <svg {...base} strokeWidth="2" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.2V12l3.2 2" />
  </svg>
)

export const Arvore = (p) => (
  <svg {...base} strokeWidth="1.9" {...p}>
    <path d="M12 21v-8" />
    <path d="M12 16l-4-3M12 14l4-3" />
    <circle cx="12" cy="6.4" r="3.1" />
    <circle cx="7.2" cy="9.6" r="2.4" />
    <circle cx="16.8" cy="9.6" r="2.4" />
  </svg>
)

export const Painel = (p) => (
  <svg {...base} strokeWidth="1.9" {...p}>
    <rect x="3" y="3" width="8" height="10" rx="1.6" />
    <rect x="13" y="3" width="8" height="6" rx="1.6" />
    <rect x="3" y="15" width="8" height="6" rx="1.6" />
    <rect x="13" y="11" width="8" height="10" rx="1.6" />
  </svg>
)

export const Documento = (p) => (
  <svg {...base} strokeWidth="1.7" {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M9 14h6" />
  </svg>
)

export const Ajuda = (p) => (
  <svg {...base} strokeWidth="2" {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M9.6 9.4a2.5 2.5 0 1 1 3.3 2.4c-.6.2-.9.8-.9 1.4v.5" />
    <path d="M12 16.6v.01" />
  </svg>
)

export const Moeda = (p) => (
  <svg {...base} strokeWidth="1.9" {...p}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="M14.4 9.4a3 3 0 0 0-4.8 1.1c-.5 1.6 1 2.2 2.4 2.6s2.9 1 2.4 2.6a3 3 0 0 1-4.8 1.1" />
    <path d="M12 6.6v1.4M12 16v1.4" />
  </svg>
)

export const Tesoura = (p) => (
  <svg {...base} strokeWidth="1.9" {...p}>
    <circle cx="6.5" cy="17.5" r="2.6" />
    <circle cx="17.5" cy="17.5" r="2.6" />
    <path d="M8.4 15.6L18.5 4M15.6 15.6L5.5 4" />
  </svg>
)

export const Sol = (p) => (
  <svg {...base} strokeWidth="2" {...p}>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.4v2.2M12 19.4v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.4 12h2.2M19.4 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
  </svg>
)

export const Lua = (p) => (
  <svg {...base} strokeWidth="2" {...p}>
    <path d="M20.5 14.3A8.6 8.6 0 0 1 9.7 3.5a8.6 8.6 0 1 0 10.8 10.8z" />
  </svg>
)

export const Monitor = (p) => (
  <svg {...base} strokeWidth="2" {...p}>
    <rect x="2.6" y="4" width="18.8" height="12.4" rx="2" />
    <path d="M8.6 20.4h6.8M12 16.4v4" />
  </svg>
)

/** Icone do status de faixa, escolhido pela forma e nao pela cor. */
export const ICONE_FAIXA = {
  bom: Certo,
  atencao: Atencao,
  critico: Errado,
}

/** Icone do status de projeto. */
export const ICONE_STATUS = {
  concluido: Certo,
  ativo: Relogio,
  atrasado: Atencao,
  abandonado: Pausa,
}
