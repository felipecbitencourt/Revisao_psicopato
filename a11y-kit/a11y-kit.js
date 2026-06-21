/* ============================================================
   A11y Kit · v1.0.0
   Painel de acessibilidade reutilizável — vanilla JS, sem dependências.
   Uso:  A11yKit.init({ ...config });   (ver README.md)
   ============================================================ */
(function (global) {
  'use strict';
  var VERSION = '1.0.0';

  /* ---------- rótulos padrão (pt-BR) ---------- */
  var L = {
    title: 'Acessibilidade', open: 'Abrir acessibilidade', close: 'Fechar painel',
    reset: 'Resetar', tabSimple: 'Simplificado', tabAdvanced: 'Avançado',
    grpReading: 'Assistência de leitura', grpText: 'Texto', grpVisual: 'Visualização',
    grpAudio: 'Áudio', grpNav: 'Navegação', grpLang: 'Línguas', grpIdioma: 'Idioma',
    grpAdvText: 'Texto assistivo', grpAdvColor: 'Cor e luminosidade', grpAdvNav: 'Navegação',
    grpAdvAudio: 'Áudio', grpAdvImg: 'Imagens', grpAdvLang: 'Tradução',
    grpAdvColorCustom: 'Cores personalizadas',
    ccBg: 'Fundo', ccText: 'Texto', ccHead: 'Títulos', ccReset: 'Restaurar cores', ccDefault: 'Padrão',
    fontSize: 'Tamanho da fonte', font: 'Fonte', bionic: 'Leitura biônica',
    spacing: 'Espaçamento do texto', lineH: 'Entrelinha', letter: 'Espaço entre letras',
    word: 'Espaço entre palavras', simplify: 'Simplificar texto',
    colorblind: 'Filtros de daltonismo', saturation: 'Saturação', grayscale: 'Escala de cinza',
    brightness: 'Brilho', dark: 'Modo escuro',
    cursor: 'Cursor grande', links: 'Destacar links', keyboard: 'Navegação por teclado',
    reader: 'Leitura de página', speed: 'Velocidade', voice: 'Voz', pitch: 'Tom da voz',
    imageDesc: 'Descrever imagens', imageDescTag: 'Descrição da imagem',
    skip: 'Pular para o conteúdo',
    fontDefault: 'Padrão', fontLexend: 'Lexend', fontAtkinson: 'Atkinson', fontDyslexic: 'Dislexia',
    satLow: 'Baixa', satNormal: 'Normal', satHigh: 'Alta',
    cbOff: 'Off', cbProtan: 'Protan', cbDeuteran: 'Deuteran', cbTritan: 'Tritan',
    presetLegend: 'Combinações que ajudam pessoas com TDAH, dislexia e baixa visão. Os controles individuais ficam na aba Avançado.',
    play: 'Ouvir a página', pause: 'Pausar', stop: 'Parar leitura',
  };

  var FONT_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 2"/></svg>';
  var DEFAULT_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="4" r="2"/><path d="M21 9c-3 1-6 1.5-9 1.5S6 10 3 9l-.5 1.8c2.3.8 4.6 1.2 6.5 1.3l-1 9.4 1.9.2.9-7h.4l.9 7 1.9-.2-1-9.4c1.9-.1 4.2-.5 6.5-1.3L21 9z"/></svg>';

  var DEFAULT_PRESETS = [
    { id: 'off', title: 'Desativado', desc: 'Leitura padrão, sem ajustes.', tags: [],
      set: { font: 'default', links: false, bionic: false, simplify: false } },
    { id: 'r1', title: 'Assistência de leitura 1', desc: 'Fonte Atkinson e links destacados.', tags: ['Dislexia', 'Baixa visão'],
      set: { font: 'atkinson', links: true, bionic: false, simplify: false } },
    { id: 'r2', title: 'Assistência de leitura 2', desc: 'Atkinson, links destacados, leitura biônica e simplificação.', tags: ['TDAH', 'Dislexia', 'Baixa visão'],
      set: { font: 'atkinson', links: true, bionic: true, simplify: true } },
  ];

  var DEFAULTS = {
    storageKey: 'a11y-kit',
    contentSelector: 'body',     // alvo de fonte/zoom/leitor/simplify/biônica
    textSelector: 'h1,h2,h3,h4,h5,h6,p,li,blockquote',
    readSelector: 'h1,h2,h3,h4,h5,h6,p,li,blockquote',
    position: 'br',              // canto inicial do FAB
    draggable: true,
    fabIcon: null,               // HTML; default = ícone embutido
    lang: 'pt-BR',
    labels: {},                  // overrides de L
    theme: {},                   // overrides de CSS vars (--ak-*)
    fontScales: [0.85, 1, 1.15, 1.3, 1.45, 1.6],
    fonts: {
      atkinson: 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap',
      lexend: 'https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap',
      dyslexicFace: 'https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/woff/OpenDyslexic-Regular.woff',
    },
    presets: DEFAULT_PRESETS,
    simplifyRules: [],           // [[regex, 'repl'], ...]
    imageDescAttr: 'data-ak-desc', // atributo com a descrição; fallback: alt não-vazio
    onSound: null,               // callback(name) p/ feedback sonoro (opcional)
    features: {
      fontSize: true, font: true, bionic: true, spacing: true,
      colorblind: true, saturation: true, grayscale: true, brightness: true, dark: true,
      cursor: true, links: true, keyboard: true,
      presets: true, reader: true, imageDesc: true, simplify: true,
      customColors: true, vlibras: false, translate: false,
    },
  };

  var DEFAULT_STATE = {
    fontScale: 1, font: 'default', bionic: false, spacing: false,
    lineH: 1.9, letter: 0.045, word: 0.1,
    colorblind: 'none', saturation: 'normal', grayscale: false, brightness: 1, dark: false,
    cursor: false, links: false, keyboard: false,
    simplify: false, imageDesc: false,
    colorBg: null, colorText: null, colorHead: null,
  };

  /* ---------- utils ---------- */
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function deepMerge(a, b) {
    var out = {}; var k;
    for (k in a) out[k] = a[k];
    for (k in b) { if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k])) out[k] = deepMerge(a[k] || {}, b[k]); else out[k] = b[k]; }
    return out;
  }

  function A11yKit() {}

  A11yKit.init = function (userCfg) {
    var cfg = deepMerge(DEFAULTS, userCfg || {});
    cfg.features = deepMerge(DEFAULTS.features, (userCfg && userCfg.features) || {});
    var labels = deepMerge(L, cfg.labels || {});
    var F = cfg.features;
    var html = document.documentElement;

    /* tema */
    for (var v in cfg.theme) html.style.setProperty(v.indexOf('--') === 0 ? v : '--ak-' + v, cfg.theme[v]);

    /* estado persistido */
    var s;
    try { s = deepMerge(DEFAULT_STATE, JSON.parse(localStorage.getItem(cfg.storageKey) || '{}')); }
    catch (e) { s = deepMerge(DEFAULT_STATE, {}); }
    function save() { try { localStorage.setItem(cfg.storageKey, JSON.stringify(s)); } catch (e) {} }
    function sound(n) { if (typeof cfg.onSound === 'function') try { cfg.onSound(n); } catch (e) {} }

    var content = function () { return document.querySelector(cfg.contentSelector) || document.body; };
    var isBody = cfg.contentSelector === 'body';
    if (isBody) html.classList.add('ak-content-body');
    else { var c = content(); if (c) c.setAttribute('data-ak-content', ''); }

    /* ---------- helpers de UI ---------- */
    var renderers = [];
    function track(ctrl) { if (ctrl && ctrl._render) renderers.push(ctrl._render); return ctrl; }
    function refresh() { renderers.forEach(function (r) { try { r(); } catch (e) {} }); }

    function row(label, control, opts) {
      opts = opts || {};
      var r = el('div', 'ak-row' + (opts.col ? ' ak-row--col' : ''));
      var lab = el('span', 'ak-rowlabel'); lab.innerHTML = label + (opts.badge ? ' <span class="ak-badge">' + opts.badge + '</span>' : '');
      r.appendChild(lab); r.appendChild(control); return r;
    }
    function toggle(get, onClick, disabled) {
      var b = el('button', 'ak-switch'); b.type = 'button'; if (disabled) b.disabled = true;
      b.innerHTML = '<span class="ak-track"><span class="ak-thumb"></span></span>';
      var render = function () { b.classList.toggle('is-on', !!get()); b.setAttribute('aria-pressed', String(!!get())); };
      if (!disabled) b.addEventListener('click', function () { onClick(); render(); });
      render(); b._render = render; return b;
    }
    function optgroup(opts, get, set) {
      var g = el('div', 'ak-optgroup');
      var paint = function () { g.querySelectorAll('.ak-opt').forEach(function (o) { o.classList.toggle('is-active', o.dataset.val === String(get())); }); };
      opts.forEach(function (o) {
        var b = el('button', 'ak-opt'); b.type = 'button'; b.dataset.val = o[0]; b.textContent = o[1];
        b.addEventListener('click', function () { set(o[0]); paint(); });
        g.appendChild(b);
      });
      paint(); g._render = paint; return g;
    }
    function slider(min, max, step, get, set, fmt) {
      var w = el('div', 'ak-slider'); var i = el('input'); i.type = 'range'; i.min = min; i.max = max; i.step = step; i.value = get();
      var o = el('span', 'ak-slider-val'); var paint = function () { o.textContent = fmt ? fmt(parseFloat(i.value)) : i.value; };
      paint(); i.addEventListener('input', function () { set(parseFloat(i.value)); paint(); });
      w.appendChild(i); w.appendChild(o); w._render = function () { i.value = get(); paint(); }; return w;
    }
    function group(pane, title) { var g = el('div', 'ak-group', '<div class="ak-group-title">' + title + '</div>'); pane.appendChild(g); return g; }
    function toHex(c) { if (/^#([0-9a-f]{3})$/i.test(c)) return '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3]; if (/^#([0-9a-f]{6})$/i.test(c)) return c; return '#000000'; }
    function swatches(key, palette) {
      var wrap = el('div', 'ak-swatches');
      var none = el('button', 'ak-swatch ak-swatch--none'); none.type = 'button'; none.title = labels.ccDefault; none.setAttribute('aria-label', labels.ccDefault);
      none.addEventListener('click', function () { set(key, null); });
      wrap.appendChild(none);
      palette.forEach(function (c) {
        var b = el('button', 'ak-swatch'); b.type = 'button'; b.dataset.c = c; b.style.background = c; b.title = c; b.setAttribute('aria-label', c);
        b.addEventListener('click', function () { set(key, c); });
        wrap.appendChild(b);
      });
      var custom = el('label', 'ak-swatch ak-swatch--custom'); custom.title = labels.ccDefault;
      var inp = el('input'); inp.type = 'color'; custom.appendChild(inp);
      inp.addEventListener('input', function () { set(key, inp.value); });
      wrap.appendChild(custom);
      var paint = function () {
        var v = s[key];
        wrap.querySelectorAll('.ak-swatch').forEach(function (x) { x.classList.toggle('is-active', !!v && !!x.dataset.c && x.dataset.c.toLowerCase() === String(v).toLowerCase()); });
        none.classList.toggle('is-active', !v);
        if (v) inp.value = toHex(v);
      };
      paint(); wrap._render = paint; return wrap;
    }

    var set = function (key, val) { s[key] = val; save(); applyAll(); refresh(); };

    /* ---------- efeitos ---------- */
    function ensureFont(name) {
      if (name === 'lexend' || name === 'atkinson') {
        var id = 'ak-font-' + name; if (document.getElementById(id)) return;
        var l = el('link'); l.id = id; l.rel = 'stylesheet'; l.href = cfg.fonts[name]; document.head.appendChild(l);
      } else if (name === 'dyslexic') {
        if (document.getElementById('ak-font-dyslexic')) return;
        var st = el('style'); st.id = 'ak-font-dyslexic';
        st.textContent = "@font-face{font-family:'OpenDyslexic';font-display:swap;src:url('" + cfg.fonts.dyslexicFace + "') format('woff');}";
        document.head.appendChild(st);
      }
    }
    var CB_DONE = false;
    function ensureColorblind() {
      if (CB_DONE) return; CB_DONE = true;
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0"><defs>' +
        '<filter id="ak-cb-protan"><feColorMatrix type="matrix" values="0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0"/></filter>' +
        '<filter id="ak-cb-deuteran"><feColorMatrix type="matrix" values="0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0"/></filter>' +
        '<filter id="ak-cb-tritan"><feColorMatrix type="matrix" values="0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0"/></filter>' +
        '</defs></svg>';
      var d = el('div'); d.innerHTML = svg; document.body.appendChild(d.firstChild);
    }
    function composeFilter() {
      var p = [];
      if (s.grayscale) p.push('grayscale(100%)');
      else if (s.colorblind && s.colorblind !== 'none') { ensureColorblind(); p.push('url(#ak-cb-' + s.colorblind + ')'); }
      if (s.brightness && Number(s.brightness) !== 1) p.push('brightness(' + s.brightness + ')');
      if (!s.grayscale) { if (s.saturation === 'high') p.push('saturate(1.6)'); else if (s.saturation === 'low') p.push('saturate(0.55)'); }
      return p.join(' ');
    }
    function ensureSkip() {
      if (document.querySelector('.ak-skip')) return;
      var a = el('a', 'ak-skip'); a.href = '#'; a.textContent = labels.skip;
      a.addEventListener('click', function (e) { e.preventDefault(); var c = content(); if (c) { c.setAttribute('tabindex', '-1'); c.focus(); c.scrollIntoView(); } });
      document.body.insertBefore(a, document.body.firstChild);
    }

    /* simplificação + biônica (reconstrói do HTML-base, sem conflito) */
    function textNodes(root) { var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), o = [], n; while ((n = w.nextNode())) if (n.nodeValue.trim()) o.push(n); return o; }
    function simplifyText(t) {
      var out = t;
      cfg.simplifyRules.forEach(function (rule) {
        out = out.replace(rule[0], function (m, g1) {
          var rep = rule[1].indexOf('$1') >= 0 ? rule[1].replace('$1', g1 || '') : rule[1];
          var c0 = m.charAt(0);
          if (c0 !== c0.toLowerCase() && c0 === c0.toUpperCase()) return rep.charAt(0).toUpperCase() + rep.slice(1);
          return rep;
        });
      });
      return out;
    }
    function bionicWord(w) { if (w.length < 4) return w; var i = Math.ceil(w.length * 0.45); return '<span class="ak-bionic-strong">' + w.slice(0, i) + '</span>' + w.slice(i); }
    function transformContent() {
      var root = content(); if (!root) return;
      root.querySelectorAll(cfg.textSelector).forEach(function (e) {
        if (e.closest('.ak-panel')) return;
        if (e.dataset.akBase === undefined) e.dataset.akBase = e.innerHTML;
        var base = e.dataset.akBase;
        if (!s.simplify && !s.bionic) { if (e.innerHTML !== base) e.innerHTML = base; return; }
        var tmp = el('div'); tmp.innerHTML = base;
        if (s.simplify && cfg.simplifyRules.length) textNodes(tmp).forEach(function (n) { n.nodeValue = simplifyText(n.nodeValue); });
        if (s.bionic) textNodes(tmp).forEach(function (n) { var sp = el('span'); sp.innerHTML = n.nodeValue.replace(/[\p{L}\p{N}]{4,}/gu, bionicWord); n.parentNode.replaceChild(sp, n); });
        e.innerHTML = tmp.innerHTML;
      });
    }

    /* descrição de imagens */
    function setupImageDesc() {
      var root = content(); if (!root) return;
      root.querySelectorAll('img').forEach(function (img) {
        if (img.closest('.ak-panel') || img.dataset.akDescReady) return;
        var d = img.getAttribute(cfg.imageDescAttr) || (img.alt && img.alt.trim());
        if (!d) return;
        img.dataset.akDescReady = '1';
        if (!img.alt) img.alt = d;
        var cap = el('p', 'ak-img-desc', '<span class="ak-img-desc-tag">' + labels.imageDescTag + '</span> ' + d);
        (img.closest('figure') || img.parentNode).appendChild(cap);
      });
    }

    function applyAll() {
      var c = content();
      html.classList.toggle('ak-large-cursor', !!s.cursor);
      html.classList.toggle('ak-highlight-links', !!s.links);
      html.classList.toggle('ak-spacing', !!s.spacing);
      html.classList.toggle('ak-keyboard', !!s.keyboard);
      html.classList.toggle('ak-dark', !!s.dark);
      if (s.keyboard) ensureSkip();
      // fonte
      ensureFont(s.font);
      html.classList.toggle('ak-font-lexend', s.font === 'lexend');
      html.classList.toggle('ak-font-atkinson', s.font === 'atkinson');
      html.classList.toggle('ak-font-dyslexic', s.font === 'dyslexic');
      // zoom + filtro no conteúdo
      if (c) { c.style.filter = composeFilter(); var sc = Number(s.fontScale) || 1; c.style.zoom = sc === 1 ? '' : String(sc); }
      // espaçamento vars
      html.style.setProperty('--ak-line-h', String(s.lineH));
      html.style.setProperty('--ak-letter', s.letter + 'em');
      html.style.setProperty('--ak-word', s.word + 'em');
      // descrição de imagens
      if (s.imageDesc) setupImageDesc();
      html.classList.toggle('ak-show-img-desc', !!s.imageDesc);
      // cores personalizadas (fundo / texto / títulos)
      html.classList.toggle('ak-cc-bg', !!s.colorBg);
      html.classList.toggle('ak-cc-text', !!s.colorText);
      html.classList.toggle('ak-cc-head', !!s.colorHead);
      if (s.colorBg) html.style.setProperty('--ak-cc-bg', s.colorBg); else html.style.removeProperty('--ak-cc-bg');
      if (s.colorText) html.style.setProperty('--ak-cc-text', s.colorText); else html.style.removeProperty('--ak-cc-text');
      if (s.colorHead) html.style.setProperty('--ak-cc-head', s.colorHead); else html.style.removeProperty('--ak-cc-head');
      // transformações de texto
      transformContent();
    }
    // mostra/oculta legendas via classe no html
    var imgDescStyle = el('style'); imgDescStyle.textContent = 'html.ak-show-img-desc .ak-img-desc{display:block}'; document.head.appendChild(imgDescStyle);

    /* ---------- presets ---------- */
    var PRESET_KEYS = ['font', 'links', 'bionic', 'simplify', 'imageDesc'];
    function applyPreset(p) { PRESET_KEYS.forEach(function (k) { if (p.set[k] !== undefined) s[k] = p.set[k]; }); save(); applyAll(); refresh(); }
    function currentPreset() {
      for (var i = 0; i < cfg.presets.length; i++) {
        var p = cfg.presets[i], ok = true;
        for (var j = 0; j < PRESET_KEYS.length; j++) { var k = PRESET_KEYS[j]; if (p.set[k] !== undefined && p.set[k] !== s[k]) { ok = false; break; } }
        // exige correspondência exata de todas as chaves que o preset declara
        if (ok && PRESET_KEYS.every(function (k) { return p.set[k] === undefined || p.set[k] === s[k]; }) && Object.keys(p.set).length) return p.id;
      }
      return null;
    }

    /* ---------- painel ---------- */
    var fab = el('button', 'ak-fab'); fab.type = 'button'; fab.setAttribute('aria-label', labels.open); fab.setAttribute('aria-expanded', 'false');
    fab.innerHTML = cfg.fabIcon || DEFAULT_ICON;
    var backdrop = el('div', 'ak-backdrop');
    var panel = el('aside', 'ak-panel'); panel.setAttribute('aria-label', labels.title);
    panel.innerHTML =
      '<div class="ak-head"><span class="ak-title">' + labels.title + '</span><div class="ak-head-actions">' +
      '<button type="button" class="ak-reset">' + labels.reset + '</button>' +
      '<button type="button" class="ak-close" aria-label="' + labels.close + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '</div></div>' +
      '<div class="ak-tabs"><button type="button" class="ak-tab is-active" data-tab="s">' + labels.tabSimple + '</button><button type="button" class="ak-tab" data-tab="a">' + labels.tabAdvanced + '</button></div>' +
      '<div class="ak-body"><div class="ak-pane is-active" data-pane="s"></div><div class="ak-pane" data-pane="a"></div></div>';
    var paneS = panel.querySelector('[data-pane="s"]'), paneA = panel.querySelector('[data-pane="a"]');

    var open = false;
    function setOpen(o) {
      open = o; panel.classList.toggle('is-open', o); backdrop.classList.toggle('is-open', o);
      fab.setAttribute('aria-expanded', String(o)); if (o) refresh();
    }
    fab._suppress = false;
    fab.addEventListener('click', function (e) { e.stopPropagation(); if (fab._suppress) { fab._suppress = false; return; } setOpen(!open); });
    backdrop.addEventListener('click', function () { setOpen(false); });
    panel.querySelector('.ak-close').addEventListener('click', function () { setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) setOpen(false); });
    panel.querySelectorAll('.ak-tab').forEach(function (t) {
      t.addEventListener('click', function () {
        panel.querySelectorAll('.ak-tab').forEach(function (x) { x.classList.toggle('is-active', x === t); });
        paneS.classList.toggle('is-active', t.dataset.tab === 's');
        paneA.classList.toggle('is-active', t.dataset.tab === 'a');
        refresh();
      });
    });
    panel.querySelector('.ak-reset').addEventListener('click', function () { try { localStorage.removeItem(cfg.storageKey); } catch (e) {} location.reload(); });

    /* arraste do FAB nos 4 cantos */
    var CORNERS = ['br', 'bl', 'tr', 'tl'], CK = cfg.storageKey + '-corner';
    function readCorner() { try { var c = localStorage.getItem(CK); return CORNERS.indexOf(c) >= 0 ? c : cfg.position; } catch (e) { return cfg.position; } }
    function applyCorner(c) { CORNERS.forEach(function (k) { fab.classList.toggle('ak-fab--' + k, k === c); }); panel.classList.toggle('ak-panel--left', c === 'bl' || c === 'tl'); }
    var corner = readCorner(); applyCorner(corner);
    if (cfg.draggable) {
      fab.addEventListener('dragstart', function (e) { e.preventDefault(); });
      var zones = null, drag = null;
      function near(cx, cy) { return (cy < innerHeight / 2 ? 't' : 'b') + (cx < innerWidth / 2 ? 'l' : 'r'); }
      function mkZones() { if (zones) return zones; zones = el('div', 'ak-dropzones'); CORNERS.forEach(function (c) { var z = el('div', 'ak-dropzone ak-dropzone--' + c); z.dataset.c = c; zones.appendChild(z); }); document.body.appendChild(zones); return zones; }
      fab.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        var r = fab.getBoundingClientRect();
        drag = { x: e.clientX, y: e.clientY, ox: e.clientX - r.left, oy: e.clientY - r.top, w: r.width, h: r.height, moved: false, id: e.pointerId };
        try { fab.setPointerCapture(e.pointerId); } catch (_) {}
      });
      fab.addEventListener('pointermove', function (e) {
        if (!drag) return;
        if (!drag.moved) { if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 6) return; drag.moved = true; fab.classList.add('ak-fab--dragging'); CORNERS.forEach(function (k) { fab.classList.remove('ak-fab--' + k); }); mkZones().classList.add('is-on'); }
        var m = 8, lf = Math.max(m, Math.min(innerWidth - drag.w - m, e.clientX - drag.ox)), tp = Math.max(m, Math.min(innerHeight - drag.h - m, e.clientY - drag.oy));
        fab.style.left = lf + 'px'; fab.style.top = tp + 'px'; fab.style.right = 'auto'; fab.style.bottom = 'auto';
        var n = near(lf + drag.w / 2, tp + drag.h / 2); if (zones) zones.querySelectorAll('.ak-dropzone').forEach(function (z) { z.classList.toggle('is-near', z.dataset.c === n); });
      });
      function end() {
        if (!drag) return;
        if (drag.moved) { var r = fab.getBoundingClientRect(); corner = near(r.left + r.width / 2, r.top + r.height / 2); try { localStorage.setItem(CK, corner); } catch (_) {} fab.style.left = fab.style.top = fab.style.right = fab.style.bottom = ''; fab.classList.remove('ak-fab--dragging'); applyCorner(corner); if (zones) zones.classList.remove('is-on'); sound('toggle'); fab._suppress = true; setTimeout(function () { fab._suppress = false; }, 0); }
        drag = null;
      }
      fab.addEventListener('pointerup', end); fab.addEventListener('pointercancel', end);
    }

    /* ---------- monta os controles conforme features ---------- */
    // SIMPLIFICADO · Assistência de leitura (presets)
    if (F.presets && cfg.presets.length) {
      var gP = group(paneS, labels.grpReading);
      var wrap = el('div', 'ak-presets'), btns = [];
      cfg.presets.forEach(function (p) {
        var b = el('button', 'ak-preset'); b.type = 'button';
        b.innerHTML = '<span class="ak-preset-title">' + p.title + '</span><span class="ak-preset-desc">' + p.desc + '</span>' +
          (p.tags && p.tags.length ? '<span class="ak-preset-tags">' + p.tags.map(function (t) { return '<span class="ak-preset-tag">' + t + '</span>'; }).join('') + '</span>' : '');
        b.addEventListener('click', function () { applyPreset(p); });
        btns.push(b); wrap.appendChild(b);
      });
      var paintP = function () { var a = currentPreset(); btns.forEach(function (b, i) { b.classList.toggle('is-active', cfg.presets[i].id === a); }); };
      paintP(); renderers.push(paintP); gP.appendChild(wrap);
      gP.appendChild(el('p', 'ak-note', labels.presetLegend));
    }

    // SIMPLIFICADO · Texto
    var gT = group(paneS, labels.grpText);
    if (F.fontSize) {
      var st = el('div', 'ak-stepper'), mi = el('button', 'ak-step', 'A−'), pl = el('button', 'ak-step ak-step--lg', 'A+'), vv = el('span', 'ak-step-val');
      mi.type = pl.type = 'button';
      var paintStep = function () { vv.textContent = Math.round((Number(s.fontScale) || 1) * 100) + '%'; };
      var move = function (d) { var i = cfg.fontScales.indexOf(Number(s.fontScale)); if (i < 0) i = 1; i = Math.max(0, Math.min(cfg.fontScales.length - 1, i + d)); set('fontScale', cfg.fontScales[i]); paintStep(); };
      mi.addEventListener('click', function () { move(-1); }); pl.addEventListener('click', function () { move(1); }); paintStep();
      st.appendChild(mi); st.appendChild(vv); st.appendChild(pl); gT.appendChild(row(labels.fontSize, st));
    }
    if (F.simplify) gT.appendChild(row(labels.simplify, track(toggle(function () { return s.simplify; }, function () { set('simplify', !s.simplify); }))));

    // SIMPLIFICADO · Visualização
    var gV = group(paneS, labels.grpVisual);
    if (F.colorblind) gV.appendChild(row(labels.colorblind, optgroup([['none', labels.cbOff], ['protan', labels.cbProtan], ['deuteran', labels.cbDeuteran], ['tritan', labels.cbTritan]], function () { return s.colorblind; }, function (v) { set('colorblind', v); }), { col: true }));
    if (F.dark) gV.appendChild(row(labels.dark, toggle(function () { return s.dark; }, function () { set('dark', !s.dark); })));

    // AVANÇADO · Texto assistivo
    var aT = group(paneA, labels.grpAdvText);
    if (F.font) aT.appendChild(row(labels.font, track(optgroup([['default', labels.fontDefault], ['lexend', labels.fontLexend], ['atkinson', labels.fontAtkinson], ['dyslexic', labels.fontDyslexic]], function () { return s.font; }, function (v) { set('font', v); })), { col: true }));
    if (F.bionic) aT.appendChild(row(labels.bionic, track(toggle(function () { return s.bionic; }, function () { set('bionic', !s.bionic); }))));
    if (F.spacing) {
      var spTg = toggle(function () { return s.spacing; }, function () { set('spacing', !s.spacing); });
      aT.appendChild(row(labels.spacing, spTg));
      var setSp = function (k, val) { s[k] = val; if (!s.spacing) { s.spacing = true; spTg._render(); } save(); applyAll(); };
      aT.appendChild(row(labels.lineH, slider(1.2, 2.6, 0.1, function () { return s.lineH; }, function (v) { setSp('lineH', v); }, function (v) { return v.toFixed(1); }), { col: true }));
      aT.appendChild(row(labels.letter, slider(0, 0.2, 0.005, function () { return s.letter; }, function (v) { setSp('letter', v); }, function (v) { return v.toFixed(3) + 'em'; }), { col: true }));
      aT.appendChild(row(labels.word, slider(0, 0.5, 0.02, function () { return s.word; }, function (v) { setSp('word', v); }, function (v) { return v.toFixed(2) + 'em'; }), { col: true }));
    }

    // AVANÇADO · Cor e luminosidade
    var aC = group(paneA, labels.grpAdvColor);
    if (F.brightness) aC.appendChild(row(labels.brightness, slider(0.5, 1.5, 0.05, function () { return s.brightness; }, function (v) { set('brightness', v); }, function (v) { return Math.round(v * 100) + '%'; }), { col: true }));
    if (F.saturation) aC.appendChild(row(labels.saturation, optgroup([['low', labels.satLow], ['normal', labels.satNormal], ['high', labels.satHigh]], function () { return s.saturation; }, function (v) { set('saturation', v); }), { col: true }));
    if (F.grayscale) aC.appendChild(row(labels.grayscale, toggle(function () { return s.grayscale; }, function () { set('grayscale', !s.grayscale); })));

    // AVANÇADO · Cores personalizadas (fundo / texto / títulos)
    if (F.customColors) {
      var aCC = group(paneA, labels.grpAdvColorCustom);
      aCC.appendChild(row(labels.ccBg, track(swatches('colorBg', ['#FFFFFF', '#FDF6E3', '#F4F7F8', '#FFFDE7', '#1A1A2E', '#000000'])), { col: true }));
      aCC.appendChild(row(labels.ccText, track(swatches('colorText', ['#1C1714', '#000000', '#FFFFFF', '#FFD400', '#0E4D64'])), { col: true }));
      aCC.appendChild(row(labels.ccHead, track(swatches('colorHead', ['#0E4D64', '#AB4807', '#000000', '#FFD400', '#FFFFFF'])), { col: true }));
      var rstC = el('button', 'ak-reset-colors'); rstC.type = 'button'; rstC.textContent = labels.ccReset;
      rstC.addEventListener('click', function () { s.colorBg = s.colorText = s.colorHead = null; save(); applyAll(); refresh(); });
      aCC.appendChild(rstC);
    }

    // AVANÇADO · Navegação
    var aN = group(paneA, labels.grpAdvNav);
    if (F.links) aN.appendChild(row(labels.links, track(toggle(function () { return s.links; }, function () { set('links', !s.links); }))));
    if (F.cursor) aN.appendChild(row(labels.cursor, toggle(function () { return s.cursor; }, function () { set('cursor', !s.cursor); })));
    if (F.keyboard) aN.appendChild(row(labels.keyboard, toggle(function () { return s.keyboard; }, function () { set('keyboard', !s.keyboard); })));

    // AVANÇADO · Imagens
    if (F.imageDesc) { var aI = group(paneA, labels.grpAdvImg); aI.appendChild(row(labels.imageDesc, track(toggle(function () { return s.imageDesc; }, function () { set('imageDesc', !s.imageDesc); })))); }

    // AUDIO · leitor de voz (TTS)
    if (F.reader) buildReader(paneS, paneA, group, row, slider, labels, s, save, content, cfg);

    // Línguas (opcionais, BR)
    if (F.vlibras) buildVLibras(group(paneS, labels.grpLang), toggle, row, labels, cfg);
    if (F.translate) buildTranslate(paneS, paneA, group, labels, cfg);

    /* monta no DOM e aplica estado salvo */
    document.body.appendChild(fab); document.body.appendChild(backdrop); document.body.appendChild(panel);
    applyAll();

    return {
      version: VERSION, open: function () { setOpen(true); }, close: function () { setOpen(false); },
      set: set, getState: function () { return JSON.parse(JSON.stringify(s)); }, refresh: refresh,
      // reaplica os efeitos ao conteúdo atual (útil em SPAs que recriam o DOM)
      reapply: applyAll,
    };
  };

  /* ---------- leitor de página (Web Speech API) ---------- */
  function buildReader(paneS, paneA, group, row, slider, L, s, save, content, cfg) {
    var synth = window.speechSynthesis; if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return;
    var voices = [], voice = null, rate = 1, pitch = 1, queue = [], qi = 0, st = 'idle', cur = null, keep = null;
    function rank(v) { var x = 0; if (/natural|online/i.test(v.name)) x += 4; if (/google/i.test(v.name)) x += 2; if (new RegExp(cfg.lang.slice(0, 2), 'i').test(v.lang)) x += 2; return x; }
    function load() { var all = synth.getVoices(); voices = all.filter(function (v) { return v.lang.toLowerCase().indexOf(cfg.lang.slice(0, 2)) === 0; }).sort(function (a, b) { return rank(b) - rank(a); }); if (!voices.length) voices = all; voice = voices[0] || null; renderVoices(); }
    synth.addEventListener('voiceschanged', load); load();
    function items() { var root = content(); if (!root) return []; return [].slice.call(root.querySelectorAll(cfg.readSelector)).filter(function (e) { return e.textContent.trim() && !e.closest('.ak-panel') && e.offsetParent !== null; }); }
    function hi(e) { if (cur) cur.classList.remove('ak-reading'); cur = e; if (e) { e.classList.add('ak-reading'); e.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }
    function speak() { if (qi >= queue.length) { stop(); return; } var it = queue[qi]; if (it.el !== cur) hi(it.el); var u = new SpeechSynthesisUtterance(it.t); if (voice) u.voice = voice; u.lang = voice ? voice.lang : cfg.lang; u.rate = rate; u.pitch = pitch; u.onend = u.onerror = function () { qi++; if (st === 'playing') speak(); }; synth.speak(u); }
    function start() { synth.cancel(); queue = []; items().forEach(function (e) { (e.textContent.replace(/\s+/g, ' ').trim().match(/[^.!?]+[.!?]*/g) || []).forEach(function (t) { if (t.trim()) queue.push({ t: t.trim(), el: e }); }); }); qi = 0; if (!queue.length) return; st = 'playing'; ui(); speak(); clearInterval(keep); keep = setInterval(function () { if (st === 'playing' && synth.speaking && !synth.paused) { synth.pause(); synth.resume(); } }, 9000); }
    function pause() { synth.pause(); st = 'paused'; ui(); }
    function resume() { synth.resume(); st = 'playing'; ui(); }
    function stop() { synth.cancel(); st = 'idle'; qi = 0; clearInterval(keep); if (cur) cur.classList.remove('ak-reading'); cur = null; ui(); }
    window.addEventListener('pagehide', function () { synth.cancel(); });
    var PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>', PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>', STOP = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';
    var bar = el('div', 'ak-reader'), bp = el('button'), bs = el('button', null, STOP), bspeed = el('button', 'ak-reader-speed'), sel = el('select', 'ak-select');
    bp.type = bs.type = bspeed.type = 'button'; bs.setAttribute('aria-label', L.stop); sel.setAttribute('aria-label', L.voice);
    function renderVoices() { if (!sel) return; sel.innerHTML = voices.map(function (v) { return '<option value="' + v.name.replace(/"/g, '') + '"' + (v === voice ? ' selected' : '') + '>' + (v.name.replace(/Microsoft|Online|\(Natural\)/gi, '').trim() || v.name) + '</option>'; }).join(''); }
    function ui() { var p = st === 'playing'; bp.innerHTML = p ? PAUSE : PLAY; bp.setAttribute('aria-label', p ? L.pause : L.play); bspeed.textContent = rate + '×'; }
    bp.addEventListener('click', function () { if (st === 'idle') start(); else if (st === 'playing') pause(); else resume(); });
    bs.addEventListener('click', stop);
    var RATES = [0.85, 1, 1.15, 1.3];
    bspeed.addEventListener('click', function () { rate = RATES[(RATES.indexOf(rate) + 1) % RATES.length]; ui(); if (st !== 'idle') { var was = st; stop(); if (was === 'playing') start(); } });
    sel.addEventListener('change', function () { voice = voices.filter(function (v) { return v.name === sel.value; })[0] || voice; if (st !== 'idle') { stop(); start(); } });
    renderVoices(); ui(); bar.appendChild(bp); bar.appendChild(bs);
    group(paneS, L.grpAudio).appendChild(row(L.reader, bar));
    var aV = group(paneA, L.grpAdvAudio);
    aV.appendChild(row(L.speed, bspeed));
    aV.appendChild(row(L.voice, sel, { col: true }));
    aV.appendChild(row(L.pitch, slider(0.5, 1.5, 0.1, function () { return pitch; }, function (v) { pitch = v; if (st !== 'idle') { var w = st; stop(); if (w === 'playing') start(); } }, function (v) { return v.toFixed(1); }), { col: true }));
  }

  /* ---------- VLibras (Brasil) ---------- */
  function buildVLibras(grp, toggle, row, L, cfg) {
    var active = false; try { active = localStorage.getItem(cfg.storageKey + '-vlibras') === 'on'; } catch (e) {}
    var inited = false;
    function inject() { if (document.querySelector('[vw]')) return; var w = el('div'); w.setAttribute('vw', ''); w.className = 'enabled'; w.innerHTML = '<div vw-access-button class="active"></div><div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>'; document.body.appendChild(w); }
    function activate() { inject(); var sc = document.getElementById('ak-vlibras'); if (sc) return done(); sc = el('script'); sc.id = 'ak-vlibras'; sc.src = 'https://vlibras.gov.br/app/vlibras-plugin.js'; sc.onload = done; document.head.appendChild(sc); function done() { try { if (window.VLibras && !inited) { new window.VLibras.Widget('https://vlibras.gov.br/app'); inited = true; } } catch (e) {} } }
    function deactivate() { var w = document.querySelector('[vw]'); if (w) w.style.display = 'none'; }
    var sw = toggle(function () { return active; }, function () { active = !active; try { localStorage.setItem(cfg.storageKey + '-vlibras', active ? 'on' : 'off'); } catch (e) {} if (active) { var w = document.querySelector('[vw]'); if (w) w.style.display = ''; activate(); } else deactivate(); });
    grp.appendChild(row('VLibras (Libras)', sw)); if (active) activate();
  }

  /* ---------- Google Tradutor ---------- */
  // Idiomas configuráveis: cfg.translateSimple (botões na aba Simplificado) e
  // cfg.translateAdvanced (seletor na aba Avançado). 'pt' é o idioma de origem
  // (volta ao original). Cada item é [código Google, rótulo].
  function buildTranslate(paneS, paneA, group, L, cfg) {
    var KEY = cfg.storageKey + '-lang';
    function cur() { try { return localStorage.getItem(KEY) || 'pt'; } catch (e) { return 'pt'; } }
    function ck(l) { if (l && l !== 'pt') document.cookie = 'googtrans=/pt/' + l + ';path=/'; else document.cookie = 'googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT'; }
    function loadW() { if (window.__akGT) return; window.__akGT = true; var h = el('div'); h.id = 'google_translate_element'; h.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden'; document.body.appendChild(h); window.googleTranslateElementInit = function () { try { new google.translate.TranslateElement({ pageLanguage: 'pt', autoDisplay: false }, 'google_translate_element'); } catch (e) {} }; var sc = el('script'); sc.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'; sc.async = true; document.body.appendChild(sc); }
    function apply(l) { if (l && l !== 'pt') { try { localStorage.setItem(KEY, l); } catch (e) {} ck(l); } else { try { localStorage.removeItem(KEY); } catch (e) {} ck('pt'); } location.reload(); }

    var SIMPLE = cfg.translateSimple   || [['pt', 'PT'], ['en', 'EN'], ['es', 'ES']];
    var ADV    = cfg.translateAdvanced || [['pt', 'Português'], ['fr', 'Français'], ['it', 'Italiano'], ['ht', 'Kreyòl ayisyen'], ['de', 'Deutsch']];

    // Simplificado — um botão por idioma (segmentado)
    if (paneS) {
      var gS = group(paneS, L.grpIdioma || 'Idioma');
      var seg = el('div', 'ak-optgroup');
      SIMPLE.forEach(function (o) {
        var b = el('button', 'ak-opt' + (cur() === o[0] ? ' is-active' : '')); b.type = 'button';
        b.dataset.val = o[0]; b.textContent = o[1];
        b.addEventListener('click', function () { apply(o[0]); });
        seg.appendChild(b);
      });
      gS.appendChild(row.call(null, 'Idioma do conteúdo', seg, { col: true }));
    }

    // Avançado — seletor com mais idiomas
    var gA = group(paneA, L.grpAdvLang);
    var sel = el('select', 'ak-select');
    ADV.forEach(function (o) { var op = el('option'); op.value = o[0]; op.textContent = o[1]; if (cur() === o[0]) op.selected = true; sel.appendChild(op); });
    sel.addEventListener('change', function () { apply(sel.value); });
    gA.appendChild(row.call(null, 'Traduzir a página', sel, { col: true }));

    if (cur() !== 'pt') { ck(cur()); loadW(); }
  }
  // row usado por buildTranslate sem closure — fallback simples
  function row(label, control, opts) { opts = opts || {}; var r = el('div', 'ak-row' + (opts.col ? ' ak-row--col' : '')); var lab = el('span', 'ak-rowlabel'); lab.textContent = label; r.appendChild(lab); r.appendChild(control); return r; }

  global.A11yKit = A11yKit;
})(window);
