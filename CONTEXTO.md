# Contexto do projeto — como chegamos aqui

Histórico de decisões e armadilhas do desenvolvimento do **MyTree**. Serve para
quem precisa retomar o projeto sem reconstruir o raciocínio do zero.

Complementa os outros três documentos, que descrevem o produto pronto:

| Documento | Responde |
|---|---|
| [README.md](README.md) | Como rodar, publicar e onde está cada arquivo |
| [FUNCIONAMENTO.md](FUNCIONAMENTO.md) | O que cada tela faz e qual fórmula produz cada número |
| [DESIGN.md](DESIGN.md) | Por que as decisões visuais são as que são |
| **CONTEXTO.md** (este) | **Como se chegou nelas, e o que já deu errado** |

**No ar:** https://victorbarretoandrade.github.io/HackLab_2026/

---

## 1. Como o projeto evoluiu

O pedido inicial foi um frontend gamificado de acompanhamento de extensão
universitária. O que existe hoje passou por quatro fases.

**Protótipos de arquivo único.** Primeiro uma *Árvore de Extensão* (metáfora de
crescimento acumulado), depois um *Xodó* (bichinho virtual, metáfora de
cuidado), e por fim um painel de coordenação. Os três estão em
[prototipos/](prototipos/) — HTML puro, sem build, abrem direto no navegador.

**Migração para React.** Escolhidos a árvore e a coordenação; o Xodó ficou de
fora do app, mas continua documentado como alternativa de pitch. Vite +
GitHub Actions, publicação automática.

**Correções de fundo.** Dois bugs sérios que atravessavam todas as versões
(§3), achados só depois de o app estar no ar.

**Camada de jogo e onboarding.** Coloração da copa pelas competências, jardim
com capina semanal, lojinha de enfeites, tour de primeira abertura e o layout
de celular da visão da coordenação.

### Commits

```
2e0cb97  Visao da coordenacao no celular
e71d8cf  Tour apontando para os botoes e saldo que cobre a loja inteira
44f46b9  Economia de teste, tirar enfeites e tutorial de primeira abertura
ff73b15  Jardim: capina semanal, moedas e lojinha de enfeites
3ba1f17  Corrige mix() de cores: as folhas nunca mudaram de cor
9bed3e7  Copa tingida pelas competencias e ajustes de mobile
fae67af  Redisparar publicacao apos trocar a fonte do Pages para GitHub Actions
dbef0f0  Raiz: acompanhamento gamificado de extensao universitaria
```

O projeto se chamava **Raiz** até depois do último commit da lista — daí o nome
antigo aparecer no histórico. A renomeação para **MyTree** trocou também o
prefixo das chaves de `localStorage` (`raiz:` → `mytree:`), o que **zera o
estado de quem já estava testando**: projetos, jardim, tema e tutorial voltam ao
início. Numa build de teste isso é aceitável; num produto com usuários reais
exigiria migração das chaves antigas.

---

## 2. Decisões que valem herdar

### Uma escala de horas, não duas

Os protótipos do aluno usavam XP (210 h → 1.050 XP) enquanto o painel do gestor
usava as 360 h da CNE. Duas escalas para a mesma grandeza. Na migração para
React **o XP foi eliminado**: a moeda de progressão passou a ser horas validadas
de extensão, e os seis níveis da árvore foram recalibrados sobre as 360 h.

O ganho não foi só de coerência interna. O aluno da visão gamificada virou o
**mesmo Victor Gonçalves** da tabela da coordenação, com as mesmas 126 h e os
mesmos 70% de aderência. Alternar entre as abas mostra a mesma pessoa pelos dois
lados — que é o argumento mais forte do pitch.

### Aderência e ritmo são métricas diferentes

`aderência = horas ÷ (36 × semestre)` diz **onde a pessoa está**.
`ritmo = (360 − horas) ÷ (10 − semestre)` diz **se ainda dá tempo**.

Os dados fictícios foram construídos para expor isso: Marcos tem 60% e Gustavo
61%, quase idênticos, mas Marcos precisaria de 164 h num semestre só enquanto
Gustavo resolve com 45 h/semestre. Se for mexer nos dados de
[src/data/turma.js](src/data/turma.js), **preserve esse contraste** — é ele que
justifica a existência da coluna de ritmo.

### O motor do aluno é derivado; o jardim não é

O único estado mutável da visão do aluno é o `status` de cada projeto. Não
existe `horas += 40` em lugar nenhum: `derivar()` recalcula tudo a cada render.
É por isso que "Reabrir projeto" desfaz de verdade, inclusive travando de volta
uma competência já conquistada — não foi programado como caso especial, cai fora
da arquitetura.

O jardim **não pode** funcionar assim: quantas moedas foram gastas não se deduz
do status dos projetos. Então ele é um segundo estado, acumulado e persistido,
mantido deliberadamente separado. As duas coisas nunca se misturam — a árvore
cresce por horas de extensão, os enfeites saem de presença semanal. Se for somar
moedas por concluir projeto, essa separação quebra e o "reabrir" passa a exigir
estorno.

### Canvas guarda estado em ref, nunca em useState

Todo o estado da animação vive num `useRef`. Re-render do React não pode
reiniciar o loop nem perder as partículas. As props movem apenas os **alvos**;
os valores exibidos perseguem esses alvos por interpolação — é isso que faz a
árvore *crescer* em vez de *saltar* de tamanho.

### Cor de status nunca carrega sentido sozinha

A paleta de status é fixa e o par verde↔vermelho mede **ΔE 4,1 sob
deuteranopia** — abaixo do piso. Medido, não estimado: portei o validador de
paleta para C# via `Add-Type` (a máquina não tinha Node nem Python) e calibrei
contra a paleta de referência documentada antes de confiar no resultado.

Como os hexes são fixos por definição, a obrigação recai sobre o canal
secundário: todo status aparece com **ícone de forma distinta (✓ / triângulo /
×) + a palavra escrita + o valor numérico**. Se for acrescentar um status novo,
mantenha os três canais.

### Nada pisca

Pedido explícito depois da primeira versão da copa colorida. Enfeite não
oscila, não brilha e não balança; são objetos pousados na árvore. O pólen tem
opacidade constante. O que permanece transitório é só feedback de ação: o anel
que expande ao concluir um projeto e as faíscas ao desbloquear competência.

### Botão diz a ação, não o estado

Os enfeites tinham botões rotulados "Na árvore" / "Guardado". Rótulo com o
estado atual é sempre ambíguo — não dá para saber se descreve onde a coisa está
ou o que o clique vai fazer. Passaram a dizer **"Tirar" / "Pôr"**, com o estado
migrando para a linha de descrição.

### O público de teste são coordenadores

A build atual é voltada a teste com gestores, nem todos com familiaridade
digital. Três consequências:

- **Saldo inicial de 800 moedas** contra 615 de loja inteira. Compra tudo de
  primeira, sem capinar uma vez. Os valores de um lançamento real (25 / +5 /
  teto 55) estão anotados no comentário de [src/lib/jardim.js](src/lib/jardim.js).
- **O tour destaca os elementos reais** em vez de descrever a tela num cartão
  centralizado. Recorte iluminado, resto escurecido, o botão continua no lugar
  dele. Três passos, três cliques.
- **Tabelas viram lista de cartões no celular.** Rolagem horizontal esconde
  informação de quem não descobre que precisa arrastar.

---

## 3. Bugs que custaram caro

Três, e vale conhecer os três porque nenhum deles dava erro no console.

### A árvore nunca crescia

O tronco era limitado por `min(tronco, alturaMax * 0.6)` com
`alturaMax = H − baseY − 26`, que é o espaço **abaixo** da base (~12 px), não
acima. O tronco ficava travado em ~7 px por mais horas que o aluno acumulasse.

A correção não foi ajustar a constante e sim eliminar a classe do problema: a
árvore passou a ser gerada em **espaço unitário** com bounding box acumulada, e
um único fator de escala a enquadra no canvas. Ocupa de 42% a 96% da altura útil
conforme cresce, e não transborda em resolução nenhuma.

### As folhas eram pintadas com a cor do solo

O mais insidioso. `mix()` devolve `"rgb(r,g,b)"`, mas o parser `canal()` só
sabia ler hexadecimal. O desenho da folha encadeia dois `mix`:

```
viva      = mix(leafDeep, leafLive, tom)   →  "rgb(47,107,79)"
fillStyle = mix(viva, morta, seco)         →  parseInt("rg", 16) = NaN
                                           →  "rgb(NaN,NaN,55)"
```

Cor inválida faz o canvas **descartar a atribuição e manter o `fillStyle`
anterior** — que naquele ponto era a cor do solo. Silencioso, e a copa até
parecia verde porque o solo é um verde-acinzentado. Consequência: o tingimento
por competência não aparecia **e o amarelamento por atraso nunca funcionou**,
desde o primeiro protótipo. `canal()` hoje aceita hex e `rgb()`/`rgba()`.

Lição que fica: cuidado com funções de cor que produzem um formato e consomem
outro. O canvas não reclama.

### O Pages servia o repositório cru

Primeiro deploy, página em branco. O `index.html` servido apontava para
`/src/main.jsx` — o arquivo fonte, não o bundle. A fonte do Pages estava em
"Deploy from a branch", então ele publicava a raiz do repositório, e o navegador
recebia JSX que nenhum navegador executa.

O sinal diagnóstico: `/src/main.jsx` respondia **200** e `/assets/` respondia
**404**. E existia uma execução chamada "pages build and deployment", que só
aparece em modo branch.

Corrigir a configuração **não republica sozinho** — precisa de um push ou de
"Re-run all jobs".

---

## 4. Ambiente desta máquina

Importante para quem for continuar daqui, porque muda o que é possível fazer:

- **Node não está instalado.** Nunca foi possível rodar `npm run build`
  localmente. O build é validado exclusivamente pelo workflow do GitHub, e é lá
  que qualquer erro de compilação aparece primeiro.
- **Python não está instalado** (só o atalho da Microsoft Store, que não executa).
- **Git foi instalado** via `winget install Git.Git` durante o projeto. Ele
  entra no PATH da máquina, mas terminais já abertos não enxergam — é preciso
  reabrir o terminal ou usar `C:\Program Files\Git\cmd\git.exe`.
- **Identidade do git é local ao repositório**, não global. A configuração
  global da máquina não foi tocada.
- A **API anônima do GitHub tem 60 requisições/hora**. Polling de workflow
  estoura isso rápido; a alternativa é ler o HTML de
  `github.com/<user>/<repo>/actions`, que não tem esse limite.

---

## 5. Estado atual

**No ar e funcionando**, 49 arquivos versionados, republicação automática a cada
push em `main`.

Visão do aluno: 6 projetos com 4 estados, 6 competências, árvore procedural em
canvas, jardim com capina semanal, 6 enfeites, tour de primeira abertura.

Visão da coordenação: 14 alunos fictícios, KPIs, barras de aderência com
alternância gráfico/tabela, alertas gerados dos dados, cobertura de soft skills,
curva de defasagem, evasão por projeto, filtro que reescala tudo junto.

Transversal: tema claro/escuro/sistema, layout de celular nas duas visões,
acessibilidade, persistência em `localStorage`.

**Não existe:** backend, autenticação, dados reais.

Um detalhe de higiene: `TESTE.PY` está no diretório, vazio e **fora do
versionamento** de propósito. Não é do projeto.

---

## 6. O maior risco

Não é técnico. **O status é declarado pelo próprio aluno.**

Não há anexo de relatório, validação do coordenador nem carga comprovada. Isso
não atrapalha a visão do aluno, mas **invalida a visão do gestor** — que é
justamente a parte que vende a solução para a instituição. Um coordenador
decidindo integralização em cima de horas autodeclaradas age sobre ficção, e
painel que mente com cara de precisão é pior que painel nenhum.

O conserto não é código. Os números precisam vir de onde as horas já são
validadas, e o app tem que ser uma **leitura** dessa fonte, não um lugar novo
para digitar. Arquiteturalmente está pronto: trocar os arrays de
[src/data/](src/data/) por `fetch` e as ações por `PATCH` otimista, já que toda
a camada visual é função pura do estado.

**A pergunta seguinte, que alguém vai fazer:** validação cria atraso, e atraso
mata o feedback imediato que faz a gamificação funcionar. Se a hora só conta
depois que o coordenador confirma, a árvore cresce duas semanas depois do
esforço.

A resposta a ter pronta é tratar **"pendente de validação" como estado visual
próprio**: a árvore cresce na hora, em tom fantasma, e só solidifica quando a
coordenação confirma. O aluno mantém o retorno imediato, o gestor continua vendo
só o que é real, e a diferença entre as duas coisas fica visível na tela em vez
de escondida.

---

## 7. Próximos passos

1. **Backend e fonte de verdade das horas** — resolve o risco do §6.
2. **Estado "pendente de validação"** no motor e no canvas.
3. **Notificação de risco antes do atraso**; a mecânica já conhece o prazo.
4. **Exportar o histórico de soft skills** para o certificado de extensão, que é
   o valor real disso tudo fora da tela.
5. **Testar com alunos de verdade** — a hipótese de que a árvore muda
   comportamento continua não verificada.
