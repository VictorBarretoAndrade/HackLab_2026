# Sistema de design — Acompanhamento gamificado de extensão universitária

Documentação de design e implementação dos dois protótipos de frontend para
acompanhamento de alunos em projetos de extensão, com desenvolvimento de soft skills.

| Protótipo | Metáfora | Arquivo | Link |
|---|---|---|---|
| **Árvore de Extensão** | Uma árvore que cresce e murcha | `prototipos/arvore-extensao.html` | https://claude.ai/artifact/JfLUhj5s6sgYRq17ub6ZFm |
| **Xodó de Extensão** | Um bichinho virtual que você cuida | `prototipos/xodo-extensao.html` | https://claude.ai/artifact/5t9kvFk49D1rXY1Kybgp3Q |

Os dois compartilham o **mesmo motor de dados** (mesmas fórmulas, mesmos projetos,
mesmas soft skills) e divergem inteiramente em identidade visual e em como o
progresso é encenado. Isso é proposital: permite validar a mecânica uma vez e
testar duas linguagens visuais com usuários reais.

---

## 1. Princípio orientador

> O aluno não preenche um relatório. Ele cuida de algo que reage.

Três consequências de projeto derivam disso:

1. **Toda ação tem reação imediata e visível.** Nenhum clique resulta apenas em
   uma linha de tabela mudando de cor. Concluir um projeto faz a árvore crescer /
   o bichinho pular, emite partículas, dispara um aviso e escreve no registro.
2. **A regressão é tão visível quanto o progresso.** Atraso e abandono não são
   apenas "status ruim": eles secam a copa, derrubam as antenas, apagam frutos.
   A perda precisa doer visualmente, senão a gamificação vira só enfeite.
3. **Tudo é reversível e derivado.** Nenhum estado é acumulado em variável
   mutável. Ver §4.

---

## 2. Identidade visual

### 2.1 Árvore de Extensão

**Direção:** botânica e institucional. Vidro fosco sobre uma névoa de gradientes
radiais orgânicos. Calma, legível, adequada a um painel que o aluno abre toda
semana.

**Paleta** (tokens do tema claro; o escuro redefine os mesmos nomes)

| Papel | Token | Claro | Escuro |
|---|---|---|---|
| Acento / seiva | `--accent` | `#2F6B4F` | `#79B98C` |
| Folha viva | `--accent-bright` | `#7FAE55` | `#9ED06A` |
| Tinta | `--ink` | `#14231B` | `#E7EFE6` |
| Neutro médio | `--muted` | `#6E7C72` | `#8C9B90` |
| Fundo | `--bg` | `#EFF3EC` | `#0E1713` |
| Concluído | `--good` | `#3E8E5A` | `#6FBF8A` |
| Atrasado | `--warn` | `#C98A28` | `#E0A94A` |
| Abandonado | `--crit` | `#B4553B` | `#DC7C5E` |

Os neutros têm viés verde deliberado (`#6E7C72`, não um cinza puro) para que
nada na página pareça herdado de um framework.

O ferrugem de `--crit` é **o mesmo tom da folha seca** no canvas. Assim a barra
de vitalidade e a copa falam a mesma língua cromática.

**Tipografia**

| Papel | Face | Uso |
|---|---|---|
| Display | **Fraunces** 600/700 | h1, nome do nível, títulos de painel |
| Corpo | **Karla** 400/600/700 | texto corrido, rótulos, botões |
| Dados | **JetBrains Mono** | XP, horas, percentuais, contadores |

Fraunces é uma serifada variável com eixos `SOFT` e `WONK`, usados explicitamente
(`font-variation-settings: "SOFT" 40, "WONK" 1`) para amaciar o desenho e casar
com o tema orgânico. Todos os números usam `font-variant-numeric: tabular-nums`
para não dançarem ao atualizar.

### 2.2 Xodó de Extensão

**Direção:** criatura bioluminescente num terrário. Mais lúdica, mais escura no
centro, com a criatura como única fonte de luz quente.

**Paleta**

| Papel | Token | Claro | Escuro |
|---|---|---|---|
| Acento | `--accent` | `#0E7C6B` | `#4ED6BA` |
| Corpo do Xodó | `--body-live` | `#F3C16B` (nos dois temas) | |
| Corpo apático | `--body-dim` | `#9A958C` | `#7E8A8A` |
| Habitat (topo) | `--hab-1` | `#164046` | `#0F2F35` |
| Habitat (base) | `--hab-2` | `#0B2A2F` | `#061518` |
| Concluído | `--good` | `#4E9A3F` | `#8CC96A` |
| Atrasado | `--warn` | `#B8811C` | `#E5B54A` |
| Abandonado | `--crit` | `#C1503A` | `#E87F63` |

**Decisão central:** o interior da cápsula é sempre mais escuro que a página,
nos dois temas. O âmbar da criatura precisa de um fundo profundo para brilhar;
se o habitat clareasse junto com a página, a criatura perderia contraste e o
efeito de bioluminescência morreria. O preço é que o habitat não segue o tema —
é um mundo próprio, e isso está correto.

**Tipografia**

| Papel | Face | Uso |
|---|---|---|
| Display | **Baloo 2** 800 | h1, nome do Xodó, estágio, pílula de humor |
| Corpo | **Nunito Sans** 400/600/800 | texto, rótulos, botões |
| Dados | **DM Mono** | métricas, horários do diário |

Baloo 2 é arredondada e bem-humorada, mas aparece só nos momentos grandes. O
corpo em Nunito Sans (humanista, ótimo suporte a português) segura a legibilidade.

### 2.3 Cores das soft skills — compartilhadas

As seis competências têm cor fixa nos **dois** protótipos. Isso cria a ponte
entre a lista e a representação visual:

| Competência | Cor | Aparece como |
|---|---|---|
| Comunicação | `#5BC8F5` | fruto / luz orbitando |
| Liderança | `#F3C16B` | fruto / luz orbitando |
| Trabalho em equipe | `#8CC96A` | fruto / luz orbitando |
| Resolução de problemas | `#C78BF0` | fruto / luz orbitando |
| Empatia | `#FF8F9E` | fruto / luz orbitando |
| Gestão do tempo | `#4ED6BA` | fruto / luz orbitando |

A mesma cor aparece em três lugares: o ponto na tag do projeto, o ícone no card
da competência, e o fruto/luz no canvas. O aluno consegue olhar para a copa e
identificar qual competência é cada ponto de luz sem legenda.

---

## 3. Layout

### 3.1 Árvore

Grid de duas faixas, com composição assimétrica:

```
┌───────────────────────────────────────────────┬─────────────┐
│  CANVAS DA ÁRVORE (herói)                     │  Nível      │
│                                               │  XP         │
│                                               │  Vitalidade │
│                                               │  Contadores │
├───────────────────────────────┬───────────────┴─────────────┤
│  Projetos (7fr)               │  Soft skills (5fr)          │
│                               │  Registro                   │
└───────────────────────────────┴─────────────────────────────┘
```

### 3.2 Xodó

Duas colunas, com a cápsula **fixa** (`position: sticky`) à esquerda:

```
┌──────────────┬──────────────────────────────┐
│  CÁPSULA     │  Projetos                    │
│  (sticky)    │                              │
│  canvas      ├──────────────────────────────┤
│  nome+humor  │  Soft skills                 │
│  3 medidores ├──────────────────────────────┤
│  crescimento │  Diário de cuidados          │
└──────────────┴──────────────────────────────┘
```

A criatura nunca sai da tela enquanto o aluno rola a lista de projetos — a
reação é sempre visível no momento do clique. O sticky usa
`top: calc(env(safe-area-inset-top, 0px) + 14px)` para não encostar na barra do
sistema em celular.

### 3.3 Regras comuns

- Gutter lateral mínimo de 16px em qualquer largura, definido uma vez no `body`.
- Empilhamento em coluna única: 980px (árvore) e 1040px (Xodó).
- Grid de competências: 3 colunas → 2 → 1 conforme a largura.
- Projetos são **linhas de um ledger** com faixa de status à esquerda, dentro de
  um único painel — não seis cards soltos. Isso mantém o canvas como o único
  elemento realmente elevado da página.

---

## 4. Motor de gamificação

### 4.1 Estado

O único estado mutável é o `status` de cada projeto:

```
"ativo" | "concluido" | "atrasado" | "abandonado"
```

**Todo o resto é derivado** por `derivar()`, recalculado do zero a cada render.
Não existe `xp += 100` em lugar nenhum. Consequência prática: "Reabrir projeto"
e "Retomar" desfazem de verdade — inclusive **travando de volta** uma soft skill
já conquistada, com a luz/fruto apagando no canvas e a entrada `Fruto caiu` /
`Luz apagou` no registro.

### 4.2 Fórmulas

```js
XP_POR_HORA = 5
xp        = Σ(horas dos projetos concluídos) × 5          // máx. 1050
```

**Níveis** (mesmos limiares nos dois protótipos):

| # | Árvore | Xodó | XP mínimo |
|---|---|---|---|
| 1 | Semente | Ovo | 0 |
| 2 | Broto | Filhote | 120 |
| 3 | Muda | Curioso | 280 |
| 4 | Árvore jovem | Crescido | 450 |
| 5 | Copa firme | Parceiro | 700 |
| 6 | Árvore frondosa | Lendário | 950 |

**Vitalidade / Ânimo** (0–100, limitado entre 8 e 100):

```js
vitalidade = 88 − 16×atrasados − 28×abandonados + 4×concluídos
```

Pesos escolhidos para que **abandonar doa quase o dobro de atrasar**, e para que
concluir compense mas não anule o dano — um aluno com 3 abandonos não volta ao
verde só entregando o resto.

**Métricas exclusivas do Xodó:**

```js
energia = 100 × (total − atrasados − abandonados) / total
vinculo = 100 × (skills desbloqueadas) / 6
humor   = (ânimo × 0.62 + energia × 0.38) / 100      // 0..1, alimenta o canvas
```

**Crescimento visual** — o número que o canvas realmente consome:

```js
crescimento = (xp / XP_MAX) × (0.55 + 0.45 × vitalidade/100)
```

O XP define o porte; a vitalidade **encolhe** a copa. Atrasar não só amarela a
folha: reduz o tamanho da árvore. Isso evita o estado incoerente de uma árvore
enorme e morta.

**Soft skills:** cada competência exige **2 projetos concluídos** que a tenham
como tag. O estado inicial já entrega *Empatia* desbloqueada e *Comunicação* em
1/2 — a primeira conquista está a um clique, o que é essencial numa demo.

### 4.3 Estado inicial

6 projetos reais de extensão (210 h no total), com 2 concluídos, 3 ativos e 1
atrasado. XP = 320, vitalidade = 80%, 1 competência desbloqueada.

A página nunca abre vazia: quem chega já vê o sistema funcionando, com um atraso
presente para deixar claro que a regressão existe.

---

## 5. Renderização em canvas

Nenhum dos dois protótipos usa sprites, imagens ou bibliotecas. Tudo é desenhado
por código a cada frame via `requestAnimationFrame`.

### 5.1 Interpolação de estado

Os valores da UI mudam instantaneamente; os do canvas são interpolados:

```js
A.g += (alvo.g − A.g) × 0.055   // crescimento
A.v += (alvo.v − A.v) × 0.055   // vitalidade
```

É isso que faz a árvore *crescer* em vez de *saltar* de tamanho.

### 5.2 A árvore

**Geração:** ramificação recursiva com PRNG de semente fixa (`mulberry32`,
semente `20260916`). Como o gerador é consumido na mesma ordem a cada frame, a
silhueta é estável — só os parâmetros mudam.

| Parâmetro | Fórmula |
|---|---|
| Profundidade | `round(3 + crescimento × 5)` → 3 a 8 níveis |
| Comprimento do filho | `pai × (0.70 + rnd × 0.10)` |
| Abertura | `0.40 + rnd × 0.26` rad |
| Nº de filhos | 2, com 45% de chance de 3 nos dois primeiros níveis |
| Espessura | `pai × 0.68` |

**Enquadramento — a correção mais importante.** A primeira versão tinha um bug:
o tronco era limitado por `Math.min(tronco, alturaMax × 0.6)` com
`alturaMax = H − baseY − 26`, que é o espaço **abaixo** da base (≈12px), não
acima. O tronco ficava travado em ~7px e a árvore nunca crescia, por mais XP
que o aluno acumulasse.

A correção não foi ajustar a constante, e sim eliminar a classe do problema:

1. A árvore é gerada em **espaço unitário**, com tronco nominal de 100 unidades.
2. Durante a geração, acumula-se a **bounding box** (`minX`, `maxX`, `minY`).
3. No desenho, calcula-se um fator de escala único:

```js
alturaAlvo = alturaDisponível × (0.42 + 0.54 × crescimento)
k = min( alturaAlvo / −minY ,  larguraDisponível / (maxX − minX) )
```

A árvore ocupa 42% da altura útil como semente e 96% como árvore frondosa,
**e nunca transborda o canvas**, em qualquer resolução ou proporção. O
crescimento passou a ser visível em dois eixos ao mesmo tempo: mais ramificação
(profundidade) e mais tamanho (escala).

**Folhas:** coletadas nas pontas e ordenadas por distância do centro da copa.
Quando a vitalidade cai, somem **de fora para dentro** — que é como uma árvore
realmente seca. Cada folha removida vira uma partícula que cai girando.

```js
folhasVisíveis = total × (0.10 + 0.90 × vitalidade^1.25)
```

**Cor:** interpolação contínua, sem estados discretos. Casca
`#4C3A2B → #6F6A62`; folha `verde-seiva → ocre → cinza`. 72% de vitalidade tem
cor própria.

**Outros elementos:** raízes que crescem com o XP (metáfora direta da extensão
fincando raiz na comunidade), halo de saúde atrás da copa que desaparece abaixo
de 22%, pólen flutuante acima de 45%, anel de pulso expandindo na base ao
concluir um projeto, e os frutos luminosos das soft skills.

**Vento:** a amplitude do balanço **aumenta** conforme a árvore seca — galho sem
folha chacoalha mais.

### 5.3 O Xodó

**Corpo:** elipsoide com *squash and stretch* — achata ao pousar, estica no ar.
É o truque clássico de animação que faz uma forma simples parecer viva.

| Traço | Comportamento |
|---|---|
| Antenas | Caem progressivamente: `queda = (1 − humor) × 1.15` rad |
| Olhos | Piscam em intervalo aleatório (2,2–5,4 s); abertura = `piscada × (0.45 + humor × 0.55)` |
| Pupilas | Escolhem um alvo novo a cada ~2 s e interpolam até ele |
| Boca | Curva quadrática; controle = `(humor − 0.5) × raio × 0.30` — sorriso vira bico |
| Bochechas | Só acima de 62% de humor, com alpha proporcional |
| Respiração | Senoide cuja amplitude depende do humor |

**Pulo:** física real, não transição CSS. `hopV = −6.4` no impulso, gravidade
`0.42` por frame, pouso em `hopY = 0`. O *stretch* é derivado de `hopY / 26`.

**Tremor:** senoide amortecida (`tremor *= 0.90`) ao abandonar um projeto.

**Luzes orbitando:** cada soft skill desbloqueada ganha uma luz em órbita
elíptica achatada (`x = cos(θ) × r × 1.85`, `y = sin(θ) × r × 0.52`). Desenhadas
em duas passadas separadas pelo sinal do seno, de modo que passam **atrás** do
corpo em metade da órbita.

**Estágio Ovo:** abaixo de 120 XP, o canvas desenha uma casca (path Bézier) com
uma rachadura cujo comprimento cresce conforme se aproxima de chocar. Só aparece
se o aluno reabrir projetos até perder XP — é um estado de regressão, não o
estado inicial.

### 5.4 Leitura de cores

O canvas não tem cores fixas no JS. Ele lê os tokens CSS via
`getComputedStyle().getPropertyValue()` e guarda em cache. O cache é invalidado
por três gatilhos:

- `ResizeObserver` no contêiner do canvas
- `matchMedia("(prefers-color-scheme: dark)")` → `change`
- `MutationObserver` no atributo `data-theme` do `<html>`

Assim o desenho acompanha o tema do usuário sem duplicar a paleta.

---

## 6. Temas

Os dois protótipos seguem o padrão de três estados:

```css
:root                               { /* paleta clara COMPLETA */ }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"])   { /* redefine só os tokens */ }
}
:root[data-theme="dark"]            { /* redefine de novo */ }
```

Regras que isso impõe:

1. **Todo token é declarado no `:root` puro antes de ser redefinido.** Uma cor
   que só existe dentro de um bloco `@media` ou `[data-theme]` não se aplica
   quando o usuário está no modo "sistema", que não carimba atributo nenhum.
2. Componentes se estilizam **através dos tokens**, nunca com valores literais
   dentro de um bloco de tema.
3. O `body` pinta um `background` explícito a partir de um token.

---

## 7. Acessibilidade

- **Canvas:** `aria-hidden="true"` (é decoração do estado), com um resumo textual
  paralelo em `role="status" aria-live="polite"` que anuncia nível, XP,
  vitalidade/humor e contagem de competências a cada mudança.
- **Avisos:** contêiner com `aria-live="polite" aria-atomic="false"`.
- **Foco:** `:focus-visible` com contorno de 2px na cor de acento e `offset: 2px`
  em todos os botões.
- **Paridade de teclado:** no Xodó, a interação de clicar na criatura tem
  equivalente no botão **Fazer carinho**.
- **Movimento:** `prefers-reduced-motion: reduce` zera vento, partículas, pulo,
  tremor, piscada e poeira luminosa, e reduz as transições a 0,01ms. As mudanças
  de estado passam a ser instantâneas em vez de interpoladas.
- **Semântica:** projetos são `<article>` com `<h3>`; nada de `<div>` clicável.
- **HTML escapado:** todo texto vindo de dados passa por `esc()` antes de entrar
  via `innerHTML`.

---

## 8. Estrutura técnica

- **Zero dependências.** Um arquivo `.html` por protótipo: markup, CSS e JS num
  documento só. A única requisição externa são as fontes do Google.
- **Sem build.** Abre no navegador e funciona.
- **Persistência:** os protótipos registram `window.claude.hot.snapshot()` para
  preservar o estado dos projetos e o registro entre republicações.
- **Sem estado global escondido:** `derivar()` é uma função pura dos `status`.

### Para plugar num backend

Substituir o array `PROJETOS` por um `fetch` e o handler `aplicar()` por um
`PATCH` otimista. Nada mais precisa mudar: toda a camada visual já é uma função
pura do estado dos projetos.

```js
// Contrato esperado por projeto
{
  id: string,
  titulo: string,
  area: string,
  horas: number,
  prazo: string,
  status: "ativo" | "concluido" | "atrasado" | "abandonado",
  skills: string[]     // ids das competências
}
```

---

## 9. Decisões e trade-offs

| Decisão | Motivo | Custo aceito |
|---|---|---|
| Canvas procedural em vez de sprites/Lottie | Permite estados contínuos (72% de vitalidade tem aparência própria) e zero peso de asset | Mais código; exige cuidado com performance |
| Estado derivado, nunca acumulado | Torna toda ação reversível de graça, inclusive travar competências | Recalcula tudo a cada render (irrelevante nesta escala) |
| Semente fixa no PRNG | A silhueta é estável entre frames; só os parâmetros mudam | A árvore é sempre a mesma forma por aluno |
| Habitat do Xodó fora do tema | Preserva o contraste da bioluminescência | O habitat não acompanha claro/escuro |
| Escala por bounding box | Impossível transbordar em qualquer viewport | Um passo extra de cálculo por frame |
| Ledger em vez de cards para projetos | Mantém o canvas como único elemento elevado | Menos "card-friendly" para quem espera dashboard genérico |
| Dois protótipos, um motor | Permite teste A/B de linguagem visual com custo marginal baixo | Duas folhas de estilo para manter |

---

## 10. Próximos passos sugeridos

1. **Teste com alunos reais** — qual metáfora gera mais retorno à plataforma,
   árvore ou bichinho? A hipótese é que a criatura cria mais vínculo e a árvore
   comunica melhor progresso acumulado.
2. **Evidências por projeto** — anexar relatório, fotos e carga horária validada
   pelo coordenador; hoje o status é declarado pelo aluno.
3. **Notificação de risco** — avisar antes do atraso acontecer, não depois. A
   mecânica já sabe o prazo.
4. **Comparativo de turma** — um "bosque" com as árvores da turma, ou uma
   creche de Xodós, sem expor ranking individual.
5. **Exportar o histórico de soft skills** para o currículo / certificado de
   extensão, que é o valor real disso tudo fora da tela.
