/* ============================================================
   search-engine.js — Busca avançada (Psico · Pato)
   Motor LÉXICO PONDERADO + sinônimos clínicos. 100% no navegador,
   sem dependências e offline. Recebe texto livre (ex.: descrição de
   caso) e devolve transtornos rankeados por um score de correspondência.

   Como funciona (resumo):
   - cada ficha é quebrada em TRECHOS (nome, critérios, resumo, seções…),
     cada um com um PESO (ver FIELD_WEIGHTS / SECTION_WEIGHTS abaixo);
   - o texto é normalizado (sem acento), tokenizado e LEMATIZADO de forma
     leve; um DICIONÁRIO clínico (SYNONYMS) mapeia termos leigos e variantes
     para um "conceito" comum (ex.: triste/deprimido/desânimo → #deprimido),
     dando o efeito "semântico";
   - o score usa BM25F (frequência saturada × raridade do termo × peso do
     trecho), normalizado para 0–100 relativo ao melhor resultado.

   Tudo aqui é AJUSTÁVEL: edite FIELD_WEIGHTS, SECTION_WEIGHTS e SYNONYMS.
   Exposto em window.SemanticSearch (analyze, FIELD_WEIGHTS, ...).
   ============================================================ */
(function () {
  'use strict';

  /* ---- PESOS POR TRECHO DA FICHA (ajuste à vontade) ---- */
  var FIELD_WEIGHTS = {
    name:      9.0,   // nome do transtorno (+ sinônimos do nome)
    code:      7.0,   // CID/DSM
    category:  2.5,   // nome da categoria
    criteria:  6.0,   // critérios diagnósticos — os sintomas que mais discriminam
    specifier: 2.2,   // especificadores
    summary:   3.2,   // resumo
    section:   1.0    // seções narrativas (× multiplicador por título, abaixo)
  };

  // multiplicador por TÍTULO de seção (trecho normalizado contido no título).
  // seções mais "sintomáticas" pesam mais; epidemiológicas pesam menos.
  var SECTION_WEIGHTS = [
    { m: 1.9, k: ['caracteristicas diagnosticas'] },
    { m: 1.5, k: ['caracteristicas associadas', 'sintomas dependentes'] },
    { m: 1.3, k: ['desenvolvimento e curso'] },
    { m: 1.2, k: ['diagnostico diferencial', 'comorbidade'] },
    { m: 0.7, k: ['prevalencia', 'marcadores', 'consequencias funcionais', 'fatores de risco',
                  'questoes diagnosticas', 'risco de suicidio', 'cultura', 'genero'] }
  ];

  /* ---- DICIONÁRIO CLÍNICO (sinônimos → conceito) ----
     c = id do conceito | l = rótulo exibido na "evidência" | t = termos
     (leigos e clínicos; podem ter mais de uma palavra). */
  var SYNONYMS = [
    { c:'deprimido', l:'humor deprimido', t:['triste','tristeza','deprimido','depressivo','depressao','desanimo','desanimado','abatido','melancolia','melancolico','infeliz','choroso','chorando','vazio','sem esperanca','desesperancado','desesperanca'] },
    { c:'anedonia', l:'perda de prazer/interesse', t:['anedonia','sem prazer','perda de interesse','perda de prazer','desinteresse','nao sente prazer','apatia','apatico','sem vontade'] },
    { c:'suicidio', l:'ideação suicida', t:['suicidio','suicida','ideacao suicida','tirar a propria vida','se matar','pensamentos de morte','vontade de morrer','automutilacao','se cortar','autolesao'] },
    { c:'insonia', l:'insônia/sono', t:['insonia','nao dorme','dificuldade para dormir','sem sono','acorda de madrugada','hipersonia','dorme demais','pesadelo'] },
    { c:'fadiga', l:'fadiga/energia', t:['fadiga','cansaco','cansado','sem energia','exausto','letargia','perda de energia'] },
    { c:'culpa', l:'culpa/inutilidade', t:['culpa','inutilidade','sentimento de inutilidade','autocritica','sem valor','autorrecriminacao'] },
    { c:'concentracao', l:'concentração', t:['concentracao','dificuldade de concentracao','desatento','distraido','esquecimento','indecisao','dificuldade de pensar'] },
    { c:'mania', l:'mania/euforia', t:['mania','maniaco','euforia','euforico','humor elevado','expansivo','grandiosidade','grandioso','gastos excessivos','impulsivo','acelerado','energia aumentada','fala acelerada','pensamento acelerado','menos sono'] },
    { c:'ansiedade', l:'ansiedade', t:['ansiedade','ansioso','preocupacao','preocupado','nervoso','tenso','tensao','apreensivo','medo','receio','angustia','angustiado','inquietacao'] },
    { c:'panico', l:'pânico', t:['panico','ataque de panico','palpitacao','coracao acelerado','falta de ar','sufocamento','morte iminente','tontura','formigamento','sudorese','despersonalizacao subita'] },
    { c:'fobia', l:'fobia/evitação', t:['fobia','medo especifico','evita','evitacao','evitando','esquiva','aversao'] },
    { c:'social', l:'ansiedade social', t:['vergonha','timido','timidez','medo de julgamento','medo de falar em publico','constrangimento','ser avaliado','exposicao social'] },
    { c:'obsessao', l:'obsessões/compulsões', t:['obsessao','obsessivo','compulsao','compulsivo','ritual','verificar repetidamente','lavar as maos','contaminacao','pensamentos intrusivos','simetria','colecionar','acumulo'] },
    { c:'trauma', l:'trauma/estresse', t:['trauma','traumatico','flashback','revivencia','hipervigilancia','sobressalto','evento traumatico','abuso','violencia','acidente','reexperimentacao','memorias intrusivas'] },
    { c:'dissociacao', l:'dissociação', t:['dissociacao','despersonalizacao','desrealizacao','fora do corpo','irreal','amnesia','lacunas de memoria','multiplas identidades'] },
    { c:'psicose', l:'psicose/alucinação/delírio', t:['psicose','psicotico','alucinacao','ouve vozes','ve coisas','delirio','delirante','paranoia','paranoico','perseguicao','desorganizado','discurso desorganizado','pensamento desorganizado'] },
    { c:'negativos', l:'sintomas negativos', t:['embotamento','afeto plano','isolamento','retraimento','avolicao','alogia','apatia social'] },
    { c:'autismo', l:'autismo / comunicação social', t:['autismo','autista','espectro autista','dificuldade social','contato visual','interacao social','interesses restritos','comportamento repetitivo','estereotipias','rotinas rigidas','sensorial'] },
    { c:'tdah', l:'desatenção/hiperatividade', t:['tdah','desatencao','hiperatividade','impulsividade','inquieto','nao para quieto','distrai facil','interrompe','esquece tarefas','agitacao motora'] },
    { c:'tique', l:'tiques', t:['tique','tiques','movimentos involuntarios','vocalizacoes','piscar repetido'] },
    { c:'alimentar', l:'alimentação/peso', t:['anorexia','bulimia','compulsao alimentar','restricao alimentar','medo de engordar','imagem corporal','purgacao','vomito autoinduzido','jejum','peso baixo','distorcao da imagem'] },
    { c:'substancia', l:'uso de substância', t:['alcool','bebida','embriaguez','droga','cocaina','maconha','cannabis','abstinencia','fissura','tolerancia','uso de substancia','dependencia quimica','opioide','nicotina','tabaco'] },
    { c:'sono', l:'sono-vigília', t:['narcolepsia','apneia','sonambulismo','sonolencia','ritmo circadiano','pernas inquietas'] },
    { c:'sexual', l:'função sexual', t:['disfuncao sexual','desejo sexual','erecao','ejaculacao','orgasmo','dor sexual'] },
    { c:'genero', l:'gênero', t:['disforia de genero','identidade de genero','incongruencia de genero'] },
    { c:'somatico', l:'sintomas somáticos', t:['sintomas fisicos','dor sem causa','preocupacao com doenca','hipocondria','queixas corporais','sintomas neurologicos','conversao'] },
    { c:'personalidade', l:'personalidade', t:['instabilidade emocional','medo de abandono','relacoes instaveis','vazio cronico','desconfianca','manipulacao','perfeccionismo','rigidez','dependencia emocional'] },
    { c:'neurocognitivo', l:'cognição/demência', t:['demencia','declinio cognitivo','perda de memoria','confusao','delirium','alzheimer','desorientacao'] },
    { c:'eliminacao', l:'eliminação', t:['enurese','encoprese','xixi na cama','incontinencia'] },
    { c:'conduta', l:'conduta/oposição', t:['agressividade','desafiador','quebra de regras','mentira','furto','crueldade','explosao de raiva','provocador','opositor'] },
    { c:'irritavel', l:'irritabilidade', t:['irritabilidade','irritavel','raiva','explosivo','temperamento'] },
    { c:'crianca', l:'infância/desenvolvimento', t:['crianca','infancia','infantil','adolescente','desde pequeno','na escola'] }
  ];

  /* ---- normalização / lematização leve (pt-BR) ---- */
  var STOP = {};
  ('a o e de da do das dos que em um uma uns umas para por com sem no na nos nas ao aos as os se sua seu suas seus ou mais menos muito muita muitos muitas pouco pouca como quando onde qual quais ser estar ter foi era e sao esta estao isso este esta esses essas pelo pela ja nao sim entao tambem cada todo toda todos todas seu há ha anos ano dia dias semana semanas mes meses paciente relata apresenta apresentou queixa queixas historia caso sobre apos antes durante desde ate sendo tem vem vai').split(' ').forEach(function (w) { STOP[w] = 1; });

  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function stem(w) {
    if (w.length <= 3) return w;
    if (/mente$/.test(w) && w.length > 6) w = w.slice(0, -5);
    if (/oes$/.test(w)) w = w.slice(0, -3) + 'ao';
    else if (/aes$/.test(w)) w = w.slice(0, -3) + 'ao';
    else if (/ais$/.test(w)) w = w.slice(0, -3) + 'al';
    else if (/eis$/.test(w)) w = w.slice(0, -3) + 'el';
    else if (/ois$/.test(w)) w = w.slice(0, -3) + 'ol';
    else if (/s$/.test(w) && w.length > 3) w = w.slice(0, -1);
    if (/(zinho|zinha|inho|inha)$/.test(w) && w.length > 6) w = w.replace(/(zinho|zinha|inho|inha)$/, '');
    return w;
  }

  // índice de sinônimos
  var TERM2CONC = {}, PHRASES = [], CONC_LABEL = {};
  SYNONYMS.forEach(function (g) {
    CONC_LABEL[g.c] = g.l || g.c;
    g.t.forEach(function (term) {
      var tn = norm(term).replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
      if (!tn) return;
      if (tn.indexOf(' ') >= 0) { PHRASES.push({ p: ' ' + tn + ' ', c: g.c }); }
      else { var st = stem(tn); (TERM2CONC[st] = TERM2CONC[st] || []).push(g.c); }
    });
  });

  // "bag of terms" de um texto: tokens lematizados + conceitos (#id).
  // retorna {bag:{term:freq}, disp:{stem:palavraOriginal}}
  function bagOf(text, wantDisp) {
    var n = ' ' + norm(text).replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
    var bag = {}, disp = wantDisp ? {} : null;
    n.trim().split(' ').forEach(function (w) {
      if (!w || w.length < 2 || STOP[w]) return;
      var s = stem(w);
      bag[s] = (bag[s] || 0) + 1;
      if (disp && !disp[s]) disp[s] = w;
      var cs = TERM2CONC[s];
      if (cs) cs.forEach(function (c) { var k = '#' + c; bag[k] = (bag[k] || 0) + 1; });
    });
    for (var i = 0; i < PHRASES.length; i++) {
      if (n.indexOf(PHRASES[i].p) >= 0) { var k = '#' + PHRASES[i].c; bag[k] = (bag[k] || 0) + 1; }
    }
    return { bag: bag, disp: disp };
  }

  function sectionWeight(title) {
    var t = norm(title || '');
    for (var i = 0; i < SECTION_WEIGHTS.length; i++) {
      var g = SECTION_WEIGHTS[i];
      for (var j = 0; j < g.k.length; j++) { if (t.indexOf(g.k[j]) >= 0) return g.m; }
    }
    return 1;
  }

  function makeSnippet(d) {
    var s = d.summary || '';
    if (!s && d.criteria && d.criteria[0]) {
      s = String(d.criteria[0].text || '').split('\n')[0];
      s = s.replace(/^\s*[A-Z]\.\s*/, '');
    }
    s = String(s).replace(/\s+/g, ' ').trim();
    if (s.length > 180) { s = s.slice(0, 178); s = s.slice(0, s.lastIndexOf(' ')) + '…'; }
    return s;
  }

  // monta os trechos ponderados de uma ficha
  function fieldsOf(d, catName) {
    var F = [];
    function add(type, w, text) { if (text && String(text).trim()) F.push({ type: type, w: w, text: String(text) }); }
    add('name', FIELD_WEIGHTS.name, d.n);
    add('code', FIELD_WEIGHTS.code, [d.code, d.cid, d.dsm].filter(Boolean).join(' '));
    add('category', FIELD_WEIGHTS.category, catName);
    var crit = [d.criteriaIntro || ''];
    (d.criteria || []).forEach(function (c) { crit.push(c.text || ''); });
    (Array.isArray(d.criteriaNote) ? d.criteriaNote : []).forEach(function (nn) { crit.push((nn && nn.text) || ''); });
    add('criteria', FIELD_WEIGHTS.criteria, crit.join(' '));
    var sp = [];
    (Array.isArray(d.specifier) ? d.specifier : []).forEach(function (b) {
      sp.push(b.head || '');
      (b.items || []).forEach(function (it) { sp.push((it.label || '') + ' ' + (it.desc || '')); });
    });
    add('specifier', FIELD_WEIGHTS.specifier, sp.join(' '));
    add('summary', FIELD_WEIGHTS.summary, d.summary);
    (d.sections || []).forEach(function (s) {
      var body = (s.body || []).map(function (b) { return typeof b === 'string' ? b : (Array.isArray(b) ? b.join(' ') : ''); }).join(' ');
      add('section', FIELD_WEIGHTS.section * sectionWeight(s.title), (s.title || '') + ' ' + body);
    });
    return F;
  }

  // rótulos amigáveis de trecho (para a "evidência")
  var FIELD_LABEL = { name: 'nome', code: 'código', category: 'categoria', criteria: 'critérios', specifier: 'especificadores', summary: 'resumo', section: 'seções' };

  var INDEX = null;
  function build() {
    if (INDEX) return INDEX;
    var cats = (typeof window !== 'undefined' && window.DSM_CONTENT && window.DSM_CONTENT.categories) || [];
    var docs = [], df = {}, N = 0, totalLen = 0;
    cats.forEach(function (c, ci) {
      (c.items || []).forEach(function (d, di) {
        var fbs = fieldsOf(d, c.name).map(function (f) { return { w: f.w, type: f.type, bag: bagOf(f.text).bag }; });
        var dl = 0, seen = {};
        fbs.forEach(function (fb) { var s = 0; for (var t in fb.bag) { s += fb.bag[t]; seen[t] = 1; } dl += fb.w * s; });
        for (var t in seen) { df[t] = (df[t] || 0) + 1; }
        docs.push({ ci: ci, di: di, name: d.n, color: c.color, cat: c.name, code: (d.code || d.cid || d.dsm || ''), fields: fbs, dl: dl, snippet: makeSnippet(d) });
        totalLen += dl; N++;
      });
    });
    INDEX = { docs: docs, df: df, N: N, avgdl: (N ? totalLen / N : 1) };
    return INDEX;
  }

  // ordena os trechos da evidência pela importância (peso) do trecho
  var FIELD_ORDER = ['criteria', 'name', 'summary', 'specifier', 'section', 'category', 'code'];

  function analyze(query, limit) {
    limit = limit || 12;
    var idx = build();
    var q = bagOf(query, true);
    var qterms = Object.keys(q.bag);
    if (!qterms.length) return [];
    var k1 = 1.5, b = 0.6;
    var idf = {};
    qterms.forEach(function (t) { var d = idx.df[t] || 0; idf[t] = Math.log(1 + (idx.N - d + 0.5) / (d + 0.5)); });
    function disp(t) { return t.charAt(0) === '#' ? (CONC_LABEL[t.slice(1)] || t.slice(1)) : (q.disp[t] || t); }

    var res = [];
    idx.docs.forEach(function (doc) {
      var score = 0, ev = {};   // ev[type] = {conc:{id:1}, lit:{stem:word}}
      var nlen = (1 - b) + b * (doc.dl / idx.avgdl);
      qterms.forEach(function (t) {
        if (idf[t] <= 0) return;
        var ftd = 0, bestW = 0, bestType = null;
        for (var i = 0; i < doc.fields.length; i++) {
          var f = doc.fields[i], tf = f.bag[t];
          if (tf) { ftd += f.w * tf; if (f.w > bestW) { bestW = f.w; bestType = f.type; } }
        }
        if (ftd > 0) {
          score += idf[t] * ftd * (k1 + 1) / (ftd + k1 * nlen);
          if (bestType) {
            var e = ev[bestType] || (ev[bestType] = { conc: {}, lit: {} });
            if (t.charAt(0) === '#') e.conc[t.slice(1)] = 1; else e.lit[t] = q.disp[t] || t;
          }
        }
      });
      if (score > 0) res.push({ doc: doc, score: score, ev: ev });
    });
    if (!res.length) return [];
    res.sort(function (a, b) { return b.score - a.score; });
    res = res.slice(0, limit);
    var top = res[0].score || 1;
    return res.map(function (r) {
      var evidence = [], shown = {};   // dedupe entre trechos
      FIELD_ORDER.forEach(function (type) {
        var e = r.ev[type]; if (!e) return;
        var labels = Object.keys(e.conc).map(function (id) { return CONC_LABEL[id] || id; });
        var labelsN = labels.map(norm);
        // literais não cobertos por um conceito já mostrado (ex.: "humor" dentro de "humor deprimido")
        var lits = Object.keys(e.lit).map(function (s) { return e.lit[s]; }).filter(function (w) {
          var wn = norm(w); return !labelsN.some(function (L) { return L.indexOf(wn) >= 0; });
        });
        var terms = labels.concat(lits).filter(function (x) {
          var xn = norm(x); if (shown[xn]) return false; shown[xn] = 1; return true;
        });
        if (terms.length) evidence.push({ field: type, label: FIELD_LABEL[type] || type, terms: terms });
      });
      return {
        ci: r.doc.ci, di: r.doc.di, name: r.doc.name, code: r.doc.code, color: r.doc.color, cat: r.doc.cat,
        score: r.score, score100: Math.max(5, Math.round(r.score / top * 100)),
        evidence: evidence, snippet: r.doc.snippet
      };
    });
  }

  window.SemanticSearch = {
    analyze: analyze,
    rebuild: function () { INDEX = null; return build(); },
    FIELD_WEIGHTS: FIELD_WEIGHTS,
    SECTION_WEIGHTS: SECTION_WEIGHTS,
    SYNONYMS: SYNONYMS
  };
})();
