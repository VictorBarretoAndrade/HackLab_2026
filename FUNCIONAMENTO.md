# Funcionamento dos protótipos

Descrição operacional completa dos três artefatos do projeto: o que cada tela mostra,
o que cada controle faz, qual fórmula produz cada número e como o desenho reage ao
estado. Complementa o [DESIGN.md](DESIGN.md), que trata das decisões visuais.

| # | Artefato | Ponto de vista | Arquivo | Link |
|---|---|---|---|---|
| 1 | **Árvore de Extensão** | Aluno | `prototipos/arvore-extensao.html` | https://claude.ai/artifact/JfLUhj5s6sgYRq17ub6ZFm |
| 2 | **Xodó de Extensão** | Aluno | `prototipos/xodo-extensao.html` | https://claude.ai/artifact/5t9kvFk49D1rXY1Kybgp3Q |
| 3 | **Coordenação de Extensão** | Gestor | `prototipos/coordenacao-extensao.html` | https://claude.ai/artifact/MKau1T5fHp5GpSJJavGhG3 |

Os artefatos 1 e 2 são **duas peles sobre o mesmo motor**: mesmos projetos, mesmas
fórmulas, mesmos limiares. Só mudam a metáfora e a encenação. O artefato 3 é a
visão agregada da coordenação sobre a mesma realidade.

Todos são arquivo único, sem build, sem dependências além das fontes do Google.
Abrem direto no navegador.

---

# Parte I — O motor compartilhado (artefatos 1 e 2)

## 1. O único estado mutável

```js
projeto.status ∈ { "ativo", "concluido", "atrasado", "abandonado" }
```

Nada mais é armazenado. Não existe `xp += 100` em lugar algum do código. Toda
métrica é recalculada do zero pela função `derivar()` a cada render.

**Consequência operacional:** toda ação é reversível de graça. "Reabrir projeto"
devolve o XP, rebaixa o nível, e **trava de volta** uma soft skill já conquistada —
com a luz/fruto apagando no canvas e a linha `Fruto caiu` / `Luz apagou` no registro.
Isso não foi programado como um caso especial; cai fora da arquitetura.

## 2. Os dados de entrada

### 2.1 Projetos (6 projetos, 210 h no total)

| id | Projeto | Área | Horas | Prazo | Status inicial | Competências |
|---|---|---|---|---|---|---|
| p1 | Mutirão Digital na Comunidade do Cabula | Inclusão digital | 40 | 12 abr | concluído | Comunicação, Empatia |
| p2 | Robótica Educacional na E.M. Rio Vermelho | Educação básica | 60 | 30 mai | ativo | Liderança, Equipe, Problemas |
| p3 | Consultoria Jr. para MEIs do Subúrbio | Empreendedorismo | 30 | 18 mai | ativo | Comunicação, Problemas, Tempo |
| p4 | Horta Urbana Agroecológica do Bairro da Paz | Sustentabilidade | 24 | 05 abr | concluído | Equipe, Empatia |
| p5 | Feira de Ciências Itinerante SENAI | Divulgação científica | 36 | 22 abr | atrasado | Liderança, Comunicação |
| p6 | Plantão de Suporte Técnico Solidário | Tecnologia social | 20 | 14 jun | ativo | Problemas, Tempo |

### 2.2 Soft skills (6 competências)

Cada uma exige **2 projetos concluídos** que a tenham como tag. Cor fixa nos dois
artefatos — a mesma cor aparece na tag do projeto, no ícone do card e no
fruto/luz do canvas.

| Competência | Cor | Projetos que a exercitam |
|---|---|---|
| Comunicação | `#5BC8F5` | p1, p3, p5 |
| Liderança | `#F3C16B` | p2, p5 |
| Trabalho em equipe | `#8CC96A` | p2, p4 |
| Resolução de problemas | `#C78BF0` | p2, p3, p6 |
| Empatia | `#FF8F9E` | p1, p4 |
| Gestão do tempo | `#4ED6BA` | p3, p6 |

## 3. As fórmulas

```js
XP_POR_HORA = 5
TOTAL_HORAS = 210          // soma das horas dos 6 projetos
XP_MAX      = 1050         // TOTAL_HORAS × XP_POR_HORA

xp          = Σ(horas dos projetos concluídos) × 5
vitalidade  = clamp(88 − 16×atrasados − 28×abandonados + 4×concluídos, 8, 100)
```

Os pesos foram escolhidos para que **abandonar custe quase o dobro de atrasar**, e
para que concluir compense sem anular o dano: um aluno com 3 abandonos não volta
ao verde só entregando o resto.

### 3.1 Níveis (limiares idênticos nos dois artefatos)

| Nível | Árvore | Xodó | XP mínimo | Horas concluídas equivalentes |
|---|---|---|---|---|
| 1 | Semente | Ovo | 0 | 0 h |
| 2 | Broto | Filhote | 120 | 24 h |
| 3 | Muda | Curioso | 280 | 56 h |
| 4 | Árvore jovem | Crescido | 450 | 90 h |
| 5 | Copa firme | Parceiro | 700 | 140 h |
| 6 | Árvore frondosa | Lendário | 950 | 190 h |

### 3.2 Métricas exclusivas do Xodó

```js
energia = round(100 × (total − atrasados − abandonados) / total)
vinculo = round(100 × competências_desbloqueadas / 6)
humor   = (ânimo × 0.62 + energia × 0.38) / 100      // 0..1, alimenta o canvas
```

### 3.3 Diferença real entre os dois artefatos

O valor que cada canvas consome para dimensionar a criatura **não é o mesmo**:

```js
// Árvore — o XP dá o porte, a vitalidade ENCOLHE a copa
crescimento = (xp / XP_MAX) × (0.55 + 0.45 × vitalidade/100)

// Xodó — o tamanho depende só do XP; o humor muda a expressão, não o porte
tamanho = min(1, xp / XP_MAX)
```

A árvore murcha *e* encolhe; o Xodó fica triste sem diminuir. Foi deliberado: uma
árvore doente de fato perde volume de copa, enquanto um bichinho triste continua
do mesmo tamanho — encolher leria como "ele está morrendo", que é forte demais.

## 4. Estado inicial (o que aparece ao abrir)

| Grandeza | Valor | De onde vem |
|---|---|---|
| Concluídos / Ativos / Atrasados / Abandonados | 2 / 3 / 1 / 0 | p1 e p4 concluídos, p5 atrasado |
| Horas | 64 h de 210 h | 40 + 24 |
| XP | 320 de 1050 | 64 × 5 |
| Nível | Muda / Curioso (3 de 6) | 320 ≥ 280 |
| Próximo nível | faltam 130 XP | 450 − 320 |
| Vitalidade / Ânimo | 80% | 88 − 16×1 + 4×2 |
| Energia (só Xodó) | 83% | (6 − 1 − 0) / 6 |
| Vínculo (só Xodó) | 17% | 1 de 6 competências |
| Humor (só Xodó) | 0,81 → "Animado" | 80×0,62 + 83×0,38 |
| Competências | Empatia desbloqueada; Comunicação 1/2 | p1 e p4 exercitam Empatia |

A página **nunca abre vazia**. Já há um atraso presente para deixar claro que a
regressão existe, e a primeira conquista (Comunicação) está a um clique.

## 5. Ações disponíveis e o que cada uma provoca

As ações oferecidas dependem do status atual do projeto:

| Status atual | Botões oferecidos |
|---|---|
| Em andamento | **Marcar como concluído** · Reportar atraso · Abandonar |
| Atrasado | **Entregar mesmo assim** · Voltar ao ritmo · Abandonar |
| Concluído | Reabrir projeto |
| Abandonado | Retomar projeto |

### 5.1 Tabela de reação

| Ação | Efeito nos dados | Árvore | Xodó |
|---|---|---|---|
| **Concluir** | +horas×5 XP, +4 vitalidade | Anel de pulso expandindo na base, 18 faíscas subindo, copa cresce e ramifica | Pulo real (`hopV = −6.4`), 16 partículas douradas |
| **Reportar atraso** | −16 vitalidade | Folhas caem de fora para dentro, vento aumenta | Antenas caem, olhos semicerram, 9 partículas cinzas |
| **Abandonar** | −28 vitalidade | Queda acelerada de folhas, cor vira ocre/cinza | Tremor amortecido no corpo, 14 partículas cinzas |
| **Retomar / Voltar ao ritmo** | vitalidade restaurada | Copa reverdece | Pulo leve (`hopV = −3.4`) |
| **Reabrir concluído** | −horas×5 XP, −4 vitalidade | Árvore encolhe, pode cair de nível | Xodó encolhe, pode voltar a ser Ovo |
| **Desbloquear competência** | derivado | Novo fruto luminoso na copa + 10 faíscas na cor da skill | Nova luz entra em órbita com pop |
| **Travar competência** | derivado | Fruto apaga | Luz apaga |

Toda ação também escreve uma linha no registro/diário com horário e verbo colorido,
e dispara um aviso flutuante que some em 3,2 s.

### 5.2 Controles globais

| Controle | Artefato | O que faz |
|---|---|---|
| **Reiniciar simulação** / **Recomeçar o semestre** | ambos | Restaura os status iniciais, limpa registro e partículas |
| **Fazer carinho** | Xodó | Pulo + faíscas. Equivalente de teclado ao clique na criatura |
| Clique no canvas | Xodó | Mesmo efeito de "Fazer carinho" |

---

# Parte II — Como o desenho funciona

Nenhum dos dois artefatos usa sprites, imagens ou bibliotecas. Tudo é desenhado
por código a cada frame via `requestAnimationFrame`.

## 6. Interpolação de estado

A interface muda instantaneamente; o canvas não:

```js
A.g += (alvo.g − A.g) × 0.055    // árvore: crescimento
A.v += (alvo.v − A.v) × 0.055    // árvore: vitalidade
A.m += (alvo.m − A.m) × 0.060    // xodó: humor
A.s += (alvo.s − A.s) × 0.060    // xodó: tamanho
```

É isso que faz a árvore **crescer** em vez de **saltar** de tamanho. Com
`prefers-reduced-motion: reduce` o fator vira `1`, e a transição passa a ser
instantânea.

## 7. A árvore

### 7.1 Geração

Ramificação recursiva com PRNG de semente fixa (`mulberry32`, semente `20260916`).
Como o gerador é consumido na mesma ordem a cada frame, a silhueta é estável — só
os parâmetros mudam.

| Parâmetro | Regra |
|---|---|
| Profundidade | `round(3 + crescimento × 5)` → 3 a 8 níveis |
| Tronco nominal | 100 unidades (espaço unitário) |
| Comprimento do filho | `pai × (0.70 + rnd × 0.10)` |
| Ângulo de abertura | `0.40 + rnd × 0.26` rad, com jitter de ±0,15 |
| Nº de filhos | 2; 45% de chance de 3 nos dois níveis mais próximos do tronco |
| Espessura | `pai × 0.68` |
| Folhas por ponta | `2 + floor(rnd × 2)`, raio `5.5 + rnd × 4` |

### 7.2 Enquadramento por bounding box

Durante a recursão o gerador acumula `minX`, `maxX` e `minY`. No desenho:

```js
alturaAlvo = alturaDisponível × (0.42 + 0.54 × crescimento)
k = min( alturaAlvo / −minY ,  larguraDisponível / (maxX − minX) )
```

A árvore ocupa **42% da altura útil como semente e 96% como árvore frondosa**, e
nunca transborda o canvas em qualquer resolução. O crescimento aparece em dois
eixos ao mesmo tempo: mais ramificação (profundidade) e mais escala.

> **Nota histórica.** A primeira versão limitava o tronco por
> `min(tronco, alturaMax × 0.6)` com `alturaMax = H − baseY − 26` — que é o espaço
> *abaixo* da base (~12 px), não acima. O tronco ficava travado em ~7 px e a árvore
> nunca crescia. A correção substituiu o clamp pelo enquadramento por bounding box
> descrito acima, que elimina a classe inteira do problema.

### 7.3 Folhas

Coletadas nas pontas e **ordenadas por distância do centro da copa**. Quando a
vitalidade cai, somem de fora para dentro — como uma árvore seca de verdade.

```js
folhasVisíveis = total × (0.10 + 0.90 × vitalidade^1.25)
```

Cada folha removida vira uma partícula que cai girando, com deriva senoidal.

### 7.4 Demais elementos

| Elemento | Comportamento |
|---|---|
| **Cor** | Interpolação contínua, sem estados discretos. Casca `#4C3A2B → #6F6A62`; folha verde-seiva → ocre → cinza. 72% de vitalidade tem cor própria |
| **Raízes** | 5 curvas cujo comprimento cresce com o XP (metáfora da extensão fincando raiz) |
| **Halo** | Brilho radial atrás da copa, desaparece abaixo de 22% de vitalidade |
| **Pólen** | Partículas flutuantes, só acima de 45% de vitalidade |
| **Frutos** | Um por competência desbloqueada, ancorado numa folha entre 35% e 93% do índice ordenado, com bobbing senoidal |
| **Vento** | Amplitude do balanço **aumenta** conforme a árvore seca: `0.6 + (1−vitalidade) × 1.5` |
| **Pulso** | Anel elíptico expandindo da base ao concluir, decai 0,015 por frame |

## 8. O Xodó

### 8.1 Corpo

Elipsoide com *squash and stretch* — achata ao pousar, estica no ar. É o truque
clássico de animação que faz uma forma simples parecer viva.

```js
raio    = (30 + 30 × tamanho) × min(1, largura/380)
respira = sin(t × 0.0024) × 0.035 × (0.45 + humor)
esticar = hopY / 26
sx = 1 + respira × 0.7 − esticar × 0.35
sy = 1 − respira × 0.7 + esticar × 0.35
```

### 8.2 Expressão

| Traço | Regra |
|---|---|
| Antenas | Caem por `(1 − humor) × 1.15` rad; no fundo do poço ficam quase deitadas |
| Olhos | Piscam a cada `2200 + rnd×3200` ms, por 130 ms |
| Abertura | `piscada × (0.45 + humor × 0.55)` — triste fica semicerrado permanentemente |
| Pupilas | Novo alvo a cada `1400 + rnd×2200` ms, interpolado a 7% por frame |
| Boca | Curva quadrática, controle em `(humor − 0.5) × raio × 0.30` — sorriso vira bico |
| Bochechas | Só acima de humor 0,62, com alpha proporcional |

### 8.3 Física

| Evento | Impulso |
|---|---|
| Concluir projeto | `hopV = −6.4` |
| Fazer carinho / clique | `hopV = −4.6` |
| Retomar projeto | `hopV = −3.4` |
| Abandonar | `tremor = 7`, amortecido por `×0.90` por frame |

Gravidade `0.42` por frame, pouso em `hopY = 0`.

### 8.4 Luzes das competências

Órbita elíptica achatada em torno do corpo:

```js
x = cx + cos(θ) × raio × 1.85
y = cy + sin(θ) × raio × 0.52 − raio × 0.15
θ = t × 0.00055 + i × (2π / n)
```

Desenhadas em **duas passadas separadas pelo sinal do seno**, de modo que passam
atrás do corpo em metade da órbita. A escala de cada luz acompanha a profundidade
(`0.78 + sin(θ) × 0.22`), o que reforça a sensação de 3D.

### 8.5 Estágio Ovo

Abaixo de `tamanho < 0.115` (≈120 XP) o canvas desenha uma casca em Bézier com uma
rachadura cujo comprimento cresce conforme se aproxima de chocar. É um **estado de
regressão**, não o estado inicial: só aparece se o aluno reabrir projetos até
perder XP.

## 9. Leitura de cores pelo canvas

Nenhuma cor é fixa no JavaScript. O canvas lê os tokens CSS via
`getComputedStyle().getPropertyValue()` e guarda em cache, invalidado por três
gatilhos:

- `ResizeObserver` no contêiner do canvas
- `matchMedia("(prefers-color-scheme: dark)")` → evento `change`
- `MutationObserver` no atributo `data-theme` do `<html>`

Assim o desenho acompanha o tema do usuário sem duplicar a paleta.

---

# Parte III — Painel da coordenação

## 10. A regra que ancora tudo

**Resolução CNE/CES nº 7/2018**: no mínimo 10% da carga horária total do curso em
atividades de extensão.

```js
Curso de Engenharia de Computação = 3.600 h
HORAS_TOTAIS   = 360        // 10% de 3.600
SEMESTRES      = 10
POR_SEMESTRE   = 36         // 360 / 10
TETO_VIAVEL    = 60         // h/semestre que a coordenação considera exequível
```

## 11. As métricas por aluno

```js
meta       = 36 × semestre
aderência  = horas / meta × 100
faltam     = max(0, 360 − horas)
restam     = 10 − semestre
ritmo      = restam > 0 ? faltam / restam : faltam
banda      = aderência ≥ 90 ? "bom" : aderência ≥ 70 ? "atenção" : "crítico"
inviável   = faltam > 0 && (restam === 0 || ritmo > 60)
```

**`aderência`** responde à pergunta "quanto ele já cumpriu em relação ao semestre
em que está". **`ritmo`** é a métrica que o gestor usa para agir: quantas horas por
semestre faltam para integralizar. Acima de 60 h/semestre, a situação é
matematicamente insustentável.

## 12. Os 14 alunos fictícios

| Aluno | Sem. | Horas | Meta | Aderência | Ritmo nec. | Situação |
|---|---:|---:|---:|---:|---:|---|
| Ana Beatriz Rocha | 9º | 351 | 324 | 108% | 9 h | Em dia |
| Caio Menezes Lima | 8º | 296 | 288 | 103% | 32 h | Em dia |
| Larissa Ferreira Gomes | 3º | 104 | 108 | 96% | 37 h | Em dia |
| Débora Nascimento Alves | 7º | 240 | 252 | 95% | 40 h | Em dia |
| Isabela Moraes Cunha | 8º | 268 | 288 | 93% | 46 h | Em dia |
| Juliana Costa Barros | 4º | 132 | 144 | 92% | 38 h | Em dia |
| Nathália Souza Prado | 5º | 164 | 180 | 91% | 39 h | Em dia |
| Camila Duarte Freitas | 6º | 172 | 216 | 80% | 47 h | Atenção |
| Rafael Andrade Pinto | 6º | 158 | 216 | 73% | 51 h | Atenção |
| Victor Gonçalves | 5º | 126 | 180 | 70% | 47 h | Atenção |
| Gustavo Teixeira Lopes | 4º | 88 | 144 | 61% | 45 h | Crítico |
| Marcos Vinícius Sales | 9º | 196 | 324 | 60% | **164 h** | Crítico · inviável |
| Thiago Barbosa Reis | 7º | 138 | 252 | 55% | **74 h** | Crítico · inviável |
| Pedro Henrique Amaral | 2º | 18 | 72 | 25% | 43 h | Crítico |

Agregados: **2.451 h cumpridas de 2.988 h esperadas = 82%**. Sete em dia, três em
atenção, quatro críticos, **dois sem tempo hábil de integralizar**.

O contraste entre Marcos (60%, inviável) e Gustavo (61%, recuperável) é o ponto do
painel: aderência parecida, urgências completamente diferentes. É o `ritmo` que
separa os dois.

## 13. Os seis blocos da tela

### 13.1 Filtro de recorte

Controle segmentado no topo: **Todos os 14 · Em dia · Atenção · Crítico**.
Reescala simultaneamente os KPIs, o gráfico de aderência, a cobertura de soft
skills, a curva de defasagem e os alertas. A tabela de projetos **não** é afetada
(escopo diferente: vínculos de projeto, não alunos) e isso está declarado no
subtítulo do cartão.

Filtrar por "Crítico" revela que esse grupo tem **0% de Liderança**.

### 13.2 KPIs

| Tile | Fórmula |
|---|---|
| **Hero: aderência da turma** | `Σ horas / Σ meta × 100` do recorte |
| Sem tempo hábil | contagem de `inviável` |
| Em estado crítico | contagem de `banda === "crítico"` |
| Competência mais escassa | menor cobertura entre as 6 |

### 13.3 Aderência de cada aluno

Barras horizontais ordenadas por aderência decrescente. Escala 0–120%, com a
**linha de meta em 100%** caindo a 83,33% da pista. Barra ≤ 18 px, extremidade
arredondada em 4 px, quadrada na linha de base.

Hover/foco mostra: horas cumpridas, esperado no semestre, faltam para as 360 h,
ritmo necessário.

Alternável para **tabela** pelo controle Gráfico/Tabela — nenhum valor fica
acessível só por tooltip.

### 13.4 Alertas

Gerados a partir dos dados, não escritos à mão. Com o filtro em "Todos", saem sete:

| Severidade | Regra que dispara |
|---|---|
| Crítico | cada aluno `inviável`, ordenado por ritmo decrescente |
| Atenção | os 2 piores críticos **ainda recuperáveis** |
| Atenção | competência com cobertura < 50% |
| Atenção | projeto com evasão ≥ 35% |
| Bom | aluno com aderência ≥ 100% (elegível para mentoria) |

Cada alerta traz ação recomendada, não só diagnóstico.

### 13.5 Cobertura de soft skills

Percentual de alunos do recorte que já desenvolveram cada competência, série única,
com rótulo direto em cada barra. Na turma completa:

| Competência | Cobertura |
|---|---|
| Comunicação | 86% (12 de 14) |
| Trabalho em equipe | 79% (11 de 14) |
| Empatia | 64% (9 de 14) |
| Gestão do tempo | 50% (7 de 14) |
| Resolução de problemas | 36% (5 de 14) |
| **Liderança** | **29% (4 de 14)** |

### 13.6 Onde a defasagem começa

Gráfico de linha em SVG: média de horas acumuladas por semestre cursado, contra a
exigência acumulada (`36 × semestre`). Marcadores de 8 px com anel de 2 px na cor
da superfície; rótulos diretos apenas nas pontas; alvos de hover de 44 px de
largura, bem maiores que os marcadores.

| Sem. | Média da turma | Exigido | Defasagem |
|---:|---:|---:|---:|
| 2º | 18 h | 72 h | −54 h |
| 3º | 104 h | 108 h | −4 h |
| 4º | 110 h | 144 h | −34 h |
| 5º | 145 h | 180 h | −35 h |
| 6º | 165 h | 216 h | −51 h |
| 7º | 189 h | 252 h | −63 h |
| 8º | 282 h | 288 h | −6 h |
| 9º | 274 h | 324 h | −50 h |

A defasagem não é monotônica: as turmas de 3º e 8º estão praticamente no alvo, e o
pior ponto é o 7º semestre. O gráfico recalcula tudo a partir do recorte ativo.

### 13.7 Evasão por projeto

Tabela com mini-barra na coluna de evasão, ordenada pela pior. 137 vínculos de
alunos em 7 projetos.

| Projeto | Inscritos | Concluíram | Atrasados | Abandonos | Evasão |
|---|---:|---:|---:|---:|---:|
| Feira de Ciências Itinerante SENAI | 30 | 16 | 7 | 7 | **47%** |
| Robótica Educacional na E.M. Rio Vermelho | 18 | 11 | 3 | 4 | 39% |
| Mutirão Digital na Comunidade do Cabula | 24 | 19 | 2 | 3 | 21% |
| Consultoria Jr. para MEIs do Subúrbio | 15 | 12 | 2 | 1 | 20% |
| Letramento Digital para Idosos — Pituba | 16 | 13 | 2 | 1 | 19% |
| Plantão de Suporte Técnico Solidário | 12 | 10 | 1 | 1 | 17% |
| Horta Urbana Agroecológica do Bairro da Paz | 22 | 20 | 1 | 1 | 9% |

`evasão = (atrasados + abandonos) / inscritos`. A leitura de gestão: quando um
projeto perde quase metade dos inscritos, **o problema é o projeto, não os alunos**.

## 14. Codificação de cor no painel

As cores de dados vieram da paleta validada do método de visualização, medidas com
o validador antes do uso (calibrado contra a paleta de referência documentada).

| Papel | Claro | Escuro | Resultado medido |
|---|---|---|---|
| Série única (barras, linha) | `#1baf7a` | `#199e70` | passa; 2,74:1 no claro → exige rótulo visível |
| Bom | `#0ca30c` | `#0ca30c` | fixa |
| Atenção | `#fab219` | `#fab219` | fixa; 1,78:1 no claro |
| Crítico | `#d03b3b` | `#d03b3b` | fixa |

**O par verde↔vermelho mede ΔE 4,1 sob deuteranopia** — abaixo do piso. Os hexes
não foram trocados (a paleta de status é fixa por definição do método); a
obrigação que isso cria é que **a cor nunca carregue sentido sozinha**. Cada aluno
aparece com três canais redundantes:

1. Faixa colorida na barra
2. Chip com **ícone de forma distinta** (✓ / triângulo / ×) **e a palavra** ("Em dia", "Atenção", "Crítico")
3. Valor numérico em rótulo direto

Quem não distingue verde de vermelho lê a mesma informação por outros dois caminhos.

---

# Parte IV — Comportamento comum

## 15. Temas

Os três artefatos seguem o padrão de três estados:

```css
:root                               { /* paleta clara COMPLETA */ }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"])   { /* redefine só os tokens */ }
}
:root[data-theme="dark"]            { /* redefine de novo */ }
```

Todo token é declarado no `:root` puro **antes** de ser redefinido. Uma cor que só
existisse dentro de um bloco `@media` ou `[data-theme]` não se aplicaria no modo
"sistema", que não carimba atributo nenhum.

## 16. Acessibilidade

| Recurso | Implementação |
|---|---|
| Canvas | `aria-hidden="true"`, com resumo textual paralelo em `role="status" aria-live="polite"` |
| Avisos | contêiner com `aria-live="polite" aria-atomic="false"` |
| Foco | `:focus-visible` com contorno de 2 px na cor de acento, offset 2 px |
| Paridade de teclado | "Fazer carinho" equivale ao clique na criatura; barras e pontos do gráfico são focáveis com `tabindex` e `aria-label` |
| Movimento | `prefers-reduced-motion: reduce` zera vento, partículas, pulo, tremor, piscada e pólen; transições caem para 0,01 ms |
| Valores | nenhum valor é acessível só por tooltip — há rótulo direto ou vista de tabela |
| Escape de HTML | todo texto vindo de dados passa por `esc()` antes de entrar via `innerHTML` |

## 17. Responsividade

| Artefato | Quebra | Comportamento |
|---|---|---|
| Árvore | 980 px / 760 px | Colunas empilham; trilha lateral passa para baixo do canvas |
| Xodó | 1040 px | Cápsula deixa de ser fixa e vai para o topo |
| Coordenação | 1080 px / 620 px | KPIs vão para 2 e depois 1 coluna; colunas de nome das barras encolhem de 186 px para 116 px |

Gutter lateral mínimo de 16 px em qualquer largura. Tabelas largas rolam
horizontalmente no próprio contêiner, nunca no corpo da página.

## 18. Persistência

Os artefatos registram `window.claude.hot.snapshot()` para preservar o estado dos
projetos e o registro entre republicações. Não há backend: recarregar a página do
zero devolve o estado inicial.

## 19. Limites conhecidos

1. ~~**Duas escalas de horas não reconciliadas.**~~ **Resolvido no app React.**
   Os protótipos HTML descritos acima usam um pool de 210 h e 1.050 XP, enquanto
   o painel do gestor usa as 360 h da CNE — duas escalas para a mesma grandeza.
   O app React (ver [README.md](README.md)) eliminou o XP: a moeda de progressão
   passou a ser **horas validadas de extensão**, com os seis níveis da árvore
   recalibrados sobre as 360 h regulamentares. Lá, o aluno da visão gamificada é
   o mesmo Victor da tabela da coordenação, com as mesmas 126 h.
2. **Status é declarado pelo aluno.** Não há validação do coordenador, anexo de
   relatório nem carga horária comprovada.
3. **Sem backend.** Nenhum dos três persiste entre sessões.
4. **A curva de defasagem é um corte transversal**, não uma coorte acompanhada ao
   longo do tempo. Ela compara turmas diferentes num mesmo instante.
5. **`vinculo` do Xodó cresce em degraus de 17%** (1/6), porque só há seis
   competências. Com poucos projetos, a barra fica visivelmente granulada.

## 20. Como integrar a um backend

Substituir o array de dados por um `fetch` e o handler de ação por um `PATCH`
otimista. Nada mais precisa mudar: toda a camada visual já é função pura do estado.

```js
// Contrato por projeto (artefatos 1 e 2)
{
  id: string,
  titulo: string,
  area: string,
  horas: number,
  prazo: string,
  status: "ativo" | "concluido" | "atrasado" | "abandonado",
  skills: string[]              // ids das competências
}

// Contrato por aluno (artefato 3)
{
  nome: string,
  mat: string,
  sem: number,                  // 1..10
  horas: number,                // horas de extensão já validadas
  skills: string[]              // ids das competências desenvolvidas
}
```

As funções `derivar()` (aluno) e `derivarAluno()` (gestor) são puras e podem ser
extraídas para um módulo compartilhado ou reimplementadas no servidor sem alteração
de comportamento.
