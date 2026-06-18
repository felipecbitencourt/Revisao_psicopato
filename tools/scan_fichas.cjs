/* Scanner determinístico de fichas — auditoria final.
   Lê content.js (window.DSM_CONTENT), inventaria problemas mecânicos e
   gera dumps por transtorno para revisão qualitativa. NÃO altera dados. */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = __dirname;

// ---- carregar content.js ----
const src = fs.readFileSync(path.join(ROOT, 'content.js'), 'utf8');
const i = src.indexOf('window.DSM_CONTENT');
const eq = src.indexOf('=', i);
let json = src.slice(eq + 1).trim();
if (json.endsWith(';')) json = json.slice(0, -1);
const DATA = JSON.parse(json);
const cats = DATA.categories || [];

const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();

// ---- helpers de texto ----
function bodyToStrings(body) {
  // body: array de string | {lead,text}
  const arr = [];
  (body || []).forEach(p => {
    if (p && typeof p === 'object') {
      if (p.lead) arr.push(String(p.lead));
      if (p.text) arr.push(String(p.text));
    } else if (p != null) arr.push(String(p));
  });
  return arr;
}
function allTextUnits(it) {
  // retorna [{where, text}] com cada unidade textual da ficha
  const u = [];
  if (it.summary) u.push({ where: 'summary', text: String(it.summary) });
  if (it.criteriaIntro) u.push({ where: 'criteriaIntro', text: String(it.criteriaIntro) });
  (it.criteria || []).forEach(c => u.push({ where: 'criteria ' + (c.letter || '?'), text: String(c.text || '') }));
  if (it.criteriaNote) u.push({ where: 'criteriaNote', text: String(it.criteriaNote) });
  (it.specifier || []).forEach((b, bi) => {
    if (b.head) u.push({ where: 'specifier[' + bi + '].head', text: String(b.head) });
    (b.items || []).forEach((o, oi) => {
      if (o.label) u.push({ where: 'specifier[' + bi + '].items[' + oi + '].label', text: String(o.label) });
      if (o.desc) u.push({ where: 'specifier[' + bi + '].items[' + oi + '].desc', text: String(o.desc) });
    });
  });
  (it.sections || []).forEach((s, si) => {
    bodyToStrings(s.body).forEach((t, ti) => u.push({ where: 'section["' + s.title + '"].body[' + ti + ']', text: t }));
    if (s.caption) u.push({ where: 'section["' + s.title + '"].caption', text: String(s.caption) });
  });
  return u;
}
function endsTruncated(t) {
  const s = String(t).trim();
  if (s.length < 40) return false;
  if (/[…]$|\.\.\.$/.test(s)) return true;                 // reticências
  // termina sem pontuação terminal e não termina com ":" (intro de lista) nem ")"
  return !/[.!?:)»”"’'\]]$/.test(s);
}
const TABLE_RE = /\b(tabela|tabelas|figura|figuras|quadro|quadros|fig\.|gráfico|ilustra(?:ç|c)|veja a imagem|ver imagem)\b/i;
const CODE_TOKEN_RE = /\b\d{2,3}(?:\.\d+)?\s*\([FZ]\d{1,3}(?:\.\d+)?\)/g; // ex.: 318.0 (F71)

// ---- varredura ----
const findings = [];      // {sev, type, cat, ci, name, di, where, detail}
const inventory = [];     // por transtorno (resumo)
const nameMap = {};       // normalized name -> [{cat,ci,di}]
const dumps = [];         // texto por transtorno p/ agentes
let totalItems = 0;

cats.forEach((cat, ci) => {
  (cat.items || []).forEach((it, di) => {
    totalItems++;
    const codes = (it.codes && it.codes.length) ? it.codes : [{ cid: it.cid || '', dsm: it.dsm || '', label: '' }];
    const primary = codes[0] || {};
    const hasCid = !!(primary.cid && String(primary.cid).trim());
    const hasDsm = !!(primary.dsm && String(primary.dsm).trim());
    const hasCodeField = !!(it.code && String(it.code).trim());

    const units = allTextUnits(it);
    const totalChars = units.reduce((a, u) => a + u.text.length, 0);
    const nsections = (it.sections || []).length;
    const ncriteria = (it.criteria || []).length;

    inventory.push({
      ci, di, cat: cat.name, name: it.n,
      cid: primary.cid || '', dsm: primary.dsm || '', code: it.code || '',
      nCodes: codes.length, nCriteria: ncriteria, nSections: nsections,
      hasSummary: !!it.summary, totalChars
    });

    const k = norm(it.n);
    (nameMap[k] = nameMap[k] || []).push({ cat: cat.name, ci, di, name: it.n });

    const F = (sev, type, where, detail) => findings.push({ sev, type, cat: cat.name, ci, name: it.n, di, where, detail });

    // 1) sem código
    if (!hasCid && !hasDsm) F('alta', 'sem-codigo', 'header', 'Sem CID-10 nem DSM-5-TR no código primário (chips do header ficam vazios).' + (hasCodeField ? ' (tem code="' + it.code + '" só p/ índice)' : ' (também sem campo code)'));
    else if (!hasCid) F('media', 'codigo-incompleto', 'header', 'Sem CID-10 (só DSM ' + primary.dsm + ').');
    else if (!hasDsm) F('media', 'codigo-incompleto', 'header', 'Sem DSM-5-TR (só CID ' + primary.cid + ').');
    if (!hasCodeField) F('baixa', 'sem-code-indice', 'index', 'Sem campo "code" — no índice/lista aparece sem etiqueta de código.');

    // 2) múltiplos códigos (variantes) — atenção a alocação correta
    if (codes.length > 1) F('info', 'multiplos-codigos', 'codes', codes.length + ' variantes de código: ' + codes.map(c => (c.label || '?') + '=' + (c.cid || '—') + '/' + (c.dsm || '—')).join('; '));

    // 3) textos muito longos
    units.forEach(u => {
      if (u.text.length > 900) F('media', 'texto-longo', u.where, 'Parágrafo com ' + u.text.length + ' caracteres — pode quebrar a hierarquia visual / dificultar leitura.');
    });
    if (totalChars > 16000) F('baixa', 'ficha-muito-longa', 'ficha', 'Ficha extensa: ' + totalChars + ' caracteres no total.');

    // 4) menções textuais a tabela/figura/quadro (possível info que virou texto solto)
    units.forEach(u => {
      if (TABLE_RE.test(u.text)) {
        const m = u.text.match(TABLE_RE);
        F('media', 'mencao-tabela-figura', u.where, 'Menciona "' + (m ? m[0] : '') + '" — verificar se a tabela/figura correspondente está presente (como imagem) ou se a informação ficou perdida no texto.');
      }
    });

    // 5) imagens das seções — existência do arquivo + caption órfã
    (it.sections || []).forEach((s, si) => {
      const imgs = s.images || [];
      imgs.forEach(rel => {
        const abs = path.join(ROOT, rel);
        if (!fs.existsSync(abs)) F('alta', 'imagem-ausente', 'section["' + s.title + '"]', 'Arquivo de imagem não existe: ' + rel);
      });
      if (s.caption && !imgs.length) F('media', 'caption-sem-imagem', 'section["' + s.title + '"]', 'Tem legenda mas nenhuma imagem: "' + String(s.caption).slice(0, 80) + '..."');
      // seção vazia
      const bstr = bodyToStrings(s.body);
      const empty = bstr.join('').trim() === '';
      if (empty && !imgs.length) F('alta', 'secao-vazia', 'section["' + s.title + '"]', 'Seção sem corpo e sem imagem — título órfão.');
      else if (empty && imgs.length) F('info', 'secao-so-imagem', 'section["' + s.title + '"]', 'Seção só com imagem (sem texto).');
    });

    // 6) truncamento (texto cortado)
    units.forEach(u => {
      if (endsTruncated(u.text)) F('media', 'possivel-truncamento', u.where, 'Texto termina sem pontuação terminal — possível corte: "…' + u.text.trim().slice(-70) + '"');
    });

    // 7) sequência de critérios A,B,C…
    if (it.criteria && it.criteria.length) {
      const letters = it.criteria.map(c => (c.letter || '').trim());
      letters.forEach((L, idx) => {
        const expected = String.fromCharCode(65 + idx);
        if (/^[A-Z]$/.test(L) && L !== expected) F('baixa', 'criterio-fora-de-ordem', 'criteria', 'Critério na posição ' + (idx + 1) + ' é "' + L + '" (esperado "' + expected + '").');
      });
    }

    // 8) specifier desc com múltiplos códigos embutidos (provável má alocação)
    (it.specifier || []).forEach((b, bi) => (b.items || []).forEach((o, oi) => {
      const tokens = String(o.desc || '').match(CODE_TOKEN_RE);
      if (tokens && tokens.length > 1) F('media', 'specifier-aglutinado', 'specifier[' + bi + '].items[' + oi + ']', tokens.length + ' códigos amontoados em um único desc: "' + String(o.desc).slice(0, 90) + '" — possível tabela achatada.');
    }));

    // ---- dump textual p/ agentes ----
    const lines = [];
    lines.push('### [' + ci + '.' + di + '] ' + it.n);
    lines.push('Categoria: ' + cat.name);
    lines.push('Códigos: ' + codes.map(c => (c.label ? c.label + ' ' : '') + 'CID=' + (c.cid || '—') + ' DSM=' + (c.dsm || '—')).join(' | ') + (it.code ? ' (code=' + it.code + ')' : ''));
    if (it.summary) lines.push('\nResumo: ' + it.summary);
    if (it.criteriaIntro) lines.push('\nIntro critérios: ' + it.criteriaIntro);
    (it.criteria || []).forEach(c => lines.push('\nCritério ' + c.letter + ': ' + c.text));
    if (it.criteriaNote) lines.push('\nNota: ' + it.criteriaNote);
    (it.specifier || []).forEach(b => { lines.push('\nEspecificador: ' + (b.head || '')); (b.items || []).forEach(o => lines.push('  - ' + (o.label || '') + (o.desc ? ': ' + o.desc : ''))); });
    (it.sections || []).forEach(s => {
      lines.push('\n--- Seção: ' + s.title + ' ---');
      bodyToStrings(s.body).forEach(t => lines.push(t));
      if (s.images && s.images.length) lines.push('[IMAGENS: ' + s.images.join(', ') + ']');
      if (s.caption) lines.push('[LEGENDA: ' + s.caption + ']');
    });
    dumps.push({ ci, di, name: it.n, cat: cat.name, slug: ('c' + String(ci).padStart(2, '0') + '_d' + String(di).padStart(2, '0')), text: lines.join('\n') });
  });
});

// duplicados (multi-categoria)
Object.keys(nameMap).forEach(k => {
  const occ = nameMap[k];
  if (occ.length > 1) {
    occ.forEach(o => findings.push({ sev: 'media', type: 'multi-categoria', cat: o.cat, ci: o.ci, name: o.name, di: o.di, where: 'duplicado', detail: 'Nome aparece em ' + occ.length + ' lugares: ' + occ.map(x => x.cat).join(' | ') }));
  }
});

// ---- saída ----
const byType = {};
findings.forEach(f => { byType[f.type] = (byType[f.type] || 0) + 1; });

fs.writeFileSync(path.join(OUT, 'findings.json'), JSON.stringify(findings, null, 2));
fs.writeFileSync(path.join(OUT, 'inventory.json'), JSON.stringify(inventory, null, 2));
// dumps em JSONL p/ agentes
fs.writeFileSync(path.join(OUT, 'dumps.jsonl'), dumps.map(d => JSON.stringify(d)).join('\n'));
// dump agregado por categoria (texto), para leitura fácil dos agentes
const byCat = {};
dumps.forEach(d => { (byCat[d.ci] = byCat[d.ci] || []).push(d); });
if (!fs.existsSync(path.join(OUT, 'cats'))) fs.mkdirSync(path.join(OUT, 'cats'));
Object.keys(byCat).forEach(ci => {
  fs.writeFileSync(path.join(OUT, 'cats', 'cat_' + String(ci).padStart(2, '0') + '.txt'), byCat[ci].map(d => d.text).join('\n\n========================================\n\n'));
});

console.log('=== AUDITORIA DETERMINÍSTICA DAS FICHAS ===');
console.log('Categorias: ' + cats.length + ' | Transtornos: ' + totalItems);
console.log('Total de achados: ' + findings.length);
console.log('\nPor tipo:');
Object.keys(byType).sort((a, b) => byType[b] - byType[a]).forEach(t => console.log('  ' + String(byType[t]).padStart(4) + '  ' + t));
console.log('\nPor severidade:');
['alta', 'media', 'baixa', 'info'].forEach(s => console.log('  ' + String(findings.filter(f => f.sev === s).length).padStart(4) + '  ' + s));
