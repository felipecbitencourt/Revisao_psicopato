# A11y Kit · v1.0.0

Painel de acessibilidade reutilizável, **vanilla JS, sem dependências**, para colar em qualquer projeto web. Extraído e generalizado a partir do treinamento Anticorrupção da Lojas Renner.

Tudo é prefixado com `ak-` (classes e variáveis), então não colide com o CSS do projeto host. O estado é persistido em `localStorage` e reaplicado a cada carregamento e entre páginas.

---

## Início rápido

1. Copie a pasta `a11y-kit/` para o seu projeto.
2. No `<head>`:

```html
<link rel="stylesheet" href="/a11y-kit/a11y-kit.css">
```

3. Antes de `</body>`:

```html
<script src="/a11y-kit/a11y-kit.js"></script>
<script>
  A11yKit.init({ contentSelector: 'main' });
</script>
```

Pronto. Um botão flutuante aparece no canto inferior direito; clicar abre o painel; arrastar move o botão entre os 4 cantos.

> O kit não precisa de build, bundler ou framework. Funciona com `file://`, mas alguns recursos (fontes via CDN, VLibras, tradução) precisam de HTTP.

---

## Configuração

Tudo é opcional — abaixo os **valores padrão**.

```js
A11yKit.init({
  storageKey: 'a11y-kit',        // chave do localStorage
  contentSelector: 'body',       // alvo de fonte, zoom, leitor, simplificação, biônica
  textSelector: 'h1,h2,h3,h4,h5,h6,p,li,blockquote',  // elementos transformáveis (simplify/biônica)
  readSelector: 'h1,h2,h3,h4,h5,h6,p,li,blockquote',  // o que o leitor de voz lê
  position: 'br',                // canto inicial do FAB: 'br' | 'bl' | 'tr' | 'tl'
  draggable: true,               // arrastar o FAB para os 4 cantos
  fabIcon: null,                 // HTML do ícone (default: SVG embutido). Ex.: '<img src="logo.png">'
  lang: 'pt-BR',                 // idioma das vozes do leitor (prefixo)
  labels: {},                    // sobrescreve os rótulos (i18n — ver abaixo)
  theme: {},                     // sobrescreve CSS vars (ex.: { accent:'#0a7', surface:'#fff' })
  fontScales: [0.85, 1, 1.15, 1.3, 1.45, 1.6],  // passos do "Tamanho da fonte"
  fonts: { atkinson: '<url>', lexend: '<url>', dyslexicFace: '<woff url>' },
  presets: [ /* ver "Presets" */ ],
  simplifyRules: [],             // regras de simplificação (ver abaixo). Vazio = recurso inerte.
  imageDescAttr: 'data-ak-desc', // atributo com a descrição da imagem (fallback: alt não-vazio)
  onSound: null,                 // callback(nome) p/ tocar um som de feedback (opcional)
  features: { /* liga/desliga cada recurso — ver abaixo */ },
});
```

`init` retorna uma API: `{ open(), close(), set(key, val), getState(), refresh(), version }`.

---

## Recursos (`features`)

Cada um pode ser desligado com `features: { nome: false }`.

| Chave | Aba | O que faz | Classe em `<html>` |
|---|---|---|---|
| `fontSize` | Simplificado · Texto | Stepper A−/A+ (zoom no conteúdo) | — (`style.zoom`) |
| `simplify` | Simplificado · Texto | Reescreve o texto em linguagem comum¹ | — |
| `colorblind` | Simplificado · Visualização | Filtros protan/deuteran/tritan (SVG) | — (filtro) |
| `dark` | Simplificado · Visualização | Modo escuro (básico)² | `ak-dark` |
| `presets` | Simplificado · Assistência de leitura | Cards que combinam ajustes | — |
| `reader` | Áudio | Leitura da página (Web Speech API) | `ak-reading` no trecho |
| `font` | Avançado · Texto assistivo | Padrão / Lexend / Atkinson / Dislexia | `ak-font-*` |
| `bionic` | Avançado · Texto assistivo | Leitura biônica | `ak-bionic-strong` |
| `spacing` | Avançado · Texto assistivo | Entrelinha / letras / palavras | `ak-spacing` |
| `brightness` | Avançado · Cor | Brilho | — (filtro) |
| `saturation` | Avançado · Cor | Baixa / Normal / Alta | — (filtro) |
| `grayscale` | Avançado · Cor | Escala de cinza | — (filtro) |
| `links` | Avançado · Navegação | Destacar links | `ak-highlight-links` |
| `cursor` | Avançado · Navegação | Cursor grande | `ak-large-cursor` |
| `keyboard` | Avançado · Navegação | Foco reforçado + "pular p/ conteúdo" | `ak-keyboard` |
| `imageDesc` | Avançado · Imagens | Legenda + leitura das descrições | `ak-show-img-desc` |
| `vlibras` | Simplificado · Línguas | Widget VLibras (Brasil)³ | — |
| `translate` | Avançado · Tradução | Google Tradutor³ | — |

¹ Inerte até você fornecer `simplifyRules`. ² Ver "Modo escuro". ³ Desligados por padrão; carregam scripts externos.

---

## Recursos acoplados ao conteúdo

### Leitor de voz e transformações de texto
`contentSelector`, `readSelector` e `textSelector` definem **o que** é lido/transformado. O padrão (`body`) funciona, mas aponte para o container principal (`'main'`, `'#conteudo'`) para evitar ler menus/rodapés.

### Simplificação de texto
Forneça pares `[regex, substituição]`. As regras são conservadoras por natureza — **você** controla o que troca (preservando termos que não podem mudar de sentido). Capitalização inicial é preservada; use `$1` para reaproveitar um grupo.

```js
simplifyRules: [
  [/\butilizar\b/gi, 'usar'],
  [/\bsolicitar\b/gi, 'pedir'],
  [/\bmediante\b/gi, 'com'],
  [/\bvedad([oa]s?)\b/gi, 'proibid$1'],   // vedado→proibido, vedadas→proibidas
]
```

A simplificação e a leitura biônica reconstroem o texto a partir de um HTML-base guardado em `data-ak-base`, então convivem sem conflito e são 100% reversíveis.

### Descrição de imagens
Para cada `<img>` dentro do conteúdo, o kit usa `img[data-ak-desc]` (ou o `alt` não-vazio como fallback). Quando ligado, mostra uma legenda e a inclui na leitura em voz alta. Também copia a descrição para o `alt` vazio (ganho para leitores de tela nativos).

```html
<img src="grafico.png" data-ak-desc="Gráfico de barras mostrando queda de 30% em 2024.">
```

---

## Presets ("Assistência de leitura")

Combinações de um clique. Cada preset declara só as chaves que controla (`font`, `links`, `bionic`, `simplify`, `imageDesc`). O kit destaca o preset ativo e o desfaz se você mexer num controle manualmente.

```js
presets: [
  { id: 'off', title: 'Desativado', desc: '…', tags: [], set: { font:'default', links:false, bionic:false, simplify:false, imageDesc:false } },
  { id: 'tdah', title: 'Foco (TDAH)', desc: 'Leitura biônica e fonte Atkinson.', tags: ['TDAH'], set: { font:'atkinson', bionic:true, links:false, simplify:false, imageDesc:false } },
]
```

---

## Temas

Sobrescreva as variáveis CSS — via `theme` no init ou no seu CSS:

```js
A11yKit.init({ theme: { accent: '#0a6c4d', 'surface-2': '#eef6f2' } });
```

```css
:root {
  --ak-accent: #0a6c4d;
  --ak-surface: #ffffff;
  --ak-text: #14201a;
  /* ... ver a11y-kit.css para a lista completa */
}
```

### Modo escuro
O `dark` embutido é **básico** (inverte fundo/texto do `body` e tematiza o painel). Para sites com design próprio, sobrescreva as regras `html.ak-dark …` no seu CSS com a sua paleta escura.

---

## Internacionalização

Todos os textos vêm de um objeto de rótulos (pt-BR por padrão). Sobrescreva os que quiser:

```js
A11yKit.init({
  lang: 'en-US',
  labels: { title: 'Accessibility', tabSimple: 'Simple', tabAdvanced: 'Advanced',
            font: 'Font', dark: 'Dark mode', /* ... */ },
});
```

---

## Arquitetura (para estender)

Padrões usados internamente, caso você queira adaptar:

- **Estado** — um objeto plano `s` com defaults, fundido com o que está no `localStorage`. `set(key, val)` grava, chama `applyAll()` e re-renderiza os controles.
- **`applyAll()`** — fonte única de verdade dos efeitos: alterna classes em `<html>`, monta o `filter` do conteúdo (cinza/daltonismo/brilho/saturação numa string só), aplica `zoom`, vars de espaçamento e dispara as transformações de texto.
- **Helpers de UI** — `toggle`, `optgroup`, `slider`, `stepper`, `row`, `group` criam os controles e expõem `_render` para re-render externo.
- **Registro de renderers** — controles afetados por presets/abas se registram via `track()`; `refresh()` re-renderiza todos.
- **FAB arrastável** — Pointer Events com captura; distingue clique de arraste por limiar; encaixa no canto mais próximo (ímã nos 4 cantos) e persiste.

Para adicionar um controle: crie-o com os helpers, faça-o ler/gravar via `s`/`set`, e (se presets o afetam) envolva em `track(...)`.

---

## Suporte de navegadores

- Núcleo (painel, fonte, contraste, filtros, espaçamento, biônica, simplificação, FAB): navegadores modernos (Chrome/Edge/Firefox/Safari atuais).
- `zoom` (tamanho da fonte): Chrome/Edge/Safari sempre; Firefox 126+.
- Leitor de voz: depende da Web Speech API (ampla, mas a qualidade das vozes varia por SO).
- VLibras / Google Tradutor: precisam de internet e são específicos do contexto BR.

---

## Acessibilidade do próprio painel
Foco gerenciável, `aria-pressed`/`aria-expanded`/`aria-label` nos controles, fechamento por `Esc` e backdrop, respeito a `prefers-reduced-motion`. O FAB tem `touch-action: none` e a imagem interna é inerte a ponteiros para o arraste funcionar em qualquer ponto.

---

## Demo
Abra `demo.html` via um servidor local (ex.: `python -m http.server`) e explore todos os recursos com conteúdo de exemplo.
