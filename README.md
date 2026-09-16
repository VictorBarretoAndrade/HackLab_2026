# Raiz — Extensão Universitária Gamificada

Acompanhamento de projetos de extensão com desenvolvimento de soft skills, em
duas visões que consomem o mesmo modelo de dados:

- **Visão do aluno** — uma árvore desenhada em canvas que cresce com as horas
  validadas, murcha com atrasos e tem as folhas tingidas pelas cores das competências
  desbloqueadas.
- **Visão da coordenação** — painel de aderência curricular da turma, com
  alertas acionáveis e evasão por projeto.

React + Vite, sem backend. Publicado automaticamente no GitHub Pages.

> Os dados são fictícios e servem à demonstração. Victor Gonçalves, o aluno da
> visão gamificada, é a mesma pessoa que aparece na tabela da coordenação, com
> as mesmas 126 h — as duas telas nunca se contradizem.

---

## Publicar no GitHub Pages

O repositório já traz o workflow pronto. São três passos, **uma vez só**:

1. Suba o código para a branch `main`.

   ```bash
   git init
   git add .
   git commit -m "Raiz: visao do aluno e da coordenacao"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
   git push -u origin main
   ```

2. No GitHub, vá em **Settings → Pages** e, em *Build and deployment*, escolha
   **Source: GitHub Actions**. (Não escolha "Deploy from a branch".)

3. Abra a aba **Actions** e acompanhe o workflow *Publicar no GitHub Pages*. Ao
   terminar, o link aparece em **Settings → Pages**, no formato
   `https://SEU-USUARIO.github.io/SEU-REPO/`.

A partir daí, todo push em `main` republica sozinho.

**Você não precisa de Node instalado.** A compilação acontece no runner do
GitHub. O caminho base (`/SEU-REPO/`) é resolvido automaticamente pelo workflow
a partir do nome do repositório — inclusive o caso de site de usuário
(`usuario.github.io`), que fica na raiz. Não há nada para editar no
`vite.config.js`.

---

## Rodar localmente (opcional)

Precisa de Node 18 ou superior.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
npm run preview  # serve o dist/ para conferir o build
```

---

## Estrutura

```
index.html                    casca, fontes e aplicação do tema salvo
vite.config.js                base path vindo de VITE_BASE
.github/workflows/deploy.yml  build + publicação no Pages

src/
  main.jsx                    ponto de entrada
  App.jsx                     barra superior, abas e tema

  data/
    skills.js                 as 6 competências e suas cores
    aluno.js                  o aluno logado e seus 6 projetos
    turma.js                  os 14 alunos e os 7 projetos da coordenação

  lib/
    curriculo.js              a regra CNE que ancora TUDO (360 h, níveis, faixas)
    motorAluno.js             derivar() — funções puras sobre os status
    motorGestor.js            aderência, ritmo, coberturas, alertas
    cor.js                    PRNG com semente e interpolação de cor do canvas

  hooks/
    useTema.js                claro / escuro / sistema, com persistência
    useMedida.js              ResizeObserver para os gráficos SVG

  components/
    ui/                       Chip, Toasts, Tooltip, ícones
    aluno/                    ArvoreCanvas, ListaProjetos, PainelSkills, Registro
    gestor/                   Kpis, BarrasAderencia, Alertas, CoberturaSkills,
                              GraficoDefasagem, TabelaProjetos

  styles/
    tokens.css                paleta em três estados (claro / sistema / escuro)
    base.css                  casca e componentes compartilhados
    aluno.css                 árvore, trilha, projetos, competências
    gestor.css                KPIs, barras, alertas, gráficos

prototipos/                   protótipos originais, um arquivo HTML cada
  arvore-extensao.html        sem build: abrem direto no navegador
  xodo-extensao.html
  coordenacao-extensao.html
```

A pasta `prototipos/` guarda as versões de arquivo único que vieram antes do app
React, incluindo o **Xodó** — a metáfora alternativa de bichinho virtual, que não
entrou no app mas está documentada em [FUNCIONAMENTO.md](FUNCIONAMENTO.md) e serve
de material de pitch. Elas usam a escala antiga de XP; a fonte de verdade é o app
em `src/`.

---

## A regra que ancora o produto

**Resolução CNE/CES nº 7/2018**: no mínimo 10% da carga horária do curso em
atividades de extensão. Engenharia de Computação tem 3.600 h, logo **360 h de
extensão** em 10 semestres → **36 h por semestre**.

Tudo sai daí:

| Grandeza | Fórmula |
|---|---|
| Aderência do aluno | `horas ÷ (36 × semestre) × 100` |
| Ritmo necessário | `(360 − horas) ÷ (10 − semestre)` |
| Inviável | ritmo acima de 60 h/semestre, ou sem semestre restante |
| Porte da árvore | nível a cada faixa de horas até as 360 h |
| Crescimento visual | `(horas ÷ 360) × (0,55 + 0,45 × vitalidade)` |
| Vitalidade | `88 − 16×atrasados − 28×abandonados + 4×concluídos` |

A **aderência** diz onde a pessoa está. O **ritmo** é o que o gestor usa para
agir: na turma de exemplo, Marcos (60%) e Gustavo (61%) têm aderência quase
igual, mas Marcos está no 9º semestre e precisaria de 164 h em um único
semestre, enquanto Gustavo resolve com 45 h/semestre. É o ritmo que separa os
dois.

---

## Decisões que valem conhecer antes de mexer

**O único estado mutável do app do aluno é o `status` de cada projeto.** Não
existe `horas += 40` em lugar nenhum: tudo é recalculado por `derivar()` a cada
render. Por isso "Reabrir projeto" desfaz de verdade, inclusive travando de
volta uma competência já conquistada.

**O canvas guarda a animação num `ref`, nunca em `useState`.** Re-renders do
React não podem reiniciar o loop nem perder as partículas. As props só movem os
*alvos*; os valores exibidos perseguem esses alvos por interpolação — é isso que
faz a árvore crescer em vez de saltar de tamanho.

**A árvore é gerada em espaço unitário e escalada por bounding box.** Nunca
transborda o canvas, em qualquer resolução, e o crescimento aparece em dois
eixos: mais ramificação e mais tamanho.

**Cor de status nunca carrega sentido sozinha.** O par verde↔vermelho da paleta
mede ΔE 4,1 sob deuteranopia. Todo status vem com ícone de forma distinta
(✓ / triângulo / ×), a palavra escrita e o valor numérico. Se for adicionar um
status, mantenha os três canais.

**Roteamento por hash** (`#/aluno`, `#/gestor`). O Pages não reescreve rotas
para o `index.html`, então History API daria 404 ao recarregar.

Documentação completa em [DESIGN.md](DESIGN.md) (decisões visuais) e
[FUNCIONAMENTO.md](FUNCIONAMENTO.md) (comportamento e fórmulas).

---

## Acessibilidade

- Canvas com `aria-hidden` e resumo textual paralelo em `aria-live`
- Foco visível em todo controle, com paridade entre teclado e mouse nos tooltips
- `prefers-reduced-motion` desliga vento, partículas e interpolações
- Nenhum valor acessível só por tooltip — há rótulo direto ou vista de tabela
- Tema claro / escuro / sistema, com os três estados de token corretos

---

## Próximos passos

1. Backend: trocar os arrays de `src/data/` por `fetch` e as ações por `PATCH`
   otimista. A camada visual já é função pura do estado.
2. Validação do coordenador: anexo de relatório e carga horária comprovada — hoje
   o status é declarado pelo aluno.
3. Notificação de risco antes do atraso acontecer; a mecânica já conhece o prazo.
4. Exportar o histórico de soft skills para o certificado de extensão.
