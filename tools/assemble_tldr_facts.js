// Monta build/tldr_facts.json a partir de build/_gen/out/*.json (gerados pelo
// workflow) + faz uma checagem determinística de "ancoragem" contra o texto-fonte
// dos bundles em build/_gen/*.json. Tudo entra needsReview:true; fatos com número
// não-ancorado (sobretudo % de prevalência inventada) rebaixam a confiança e
// recebem nota em _review. Itens com "locked":true no JSON atual são preservados.
//
// Uso:  node tools/assemble_tldr_facts.js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const GEN = path.join(ROOT, 'build', '_gen');
const OUTDIR = path.join(GEN, 'out');
const TARGET = path.join(ROOT, 'build', 'tldr_facts.json');

function norm(s) {
  return (s || '').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}
// números "distintivos" (percentuais/decimais e idades de 2 dígitos)
function nums(s) {
  return (String(s).match(/\d+(?:[.,]\d+)?\s*%?/g) || []).map(x => x.replace(/\s+/g, ''));
}
function pctNums(s) { return nums(s).filter(x => /%/.test(x) || /[.,]/.test(x)); }

function bundleFor(key) {
  const fn = key.replace(/::/g, '__').replace(/\//g, '_') + '.json';
  const p = path.join(GEN, fn);
  try { return JSON.parse(fs.readFileSync(p, 'utf-8')); } catch (e) { return null; }
}

const existing = fs.existsSync(TARGET) ? JSON.parse(fs.readFileSync(TARGET, 'utf-8')) : {};
const locked = {};
for (const k in existing) if (existing[k] && existing[k].locked) locked[k] = existing[k];

const files = fs.readdirSync(OUTDIR).filter(f => f.endsWith('.json'));
const out = {};
let bad = [], flagged = [], nTldr = 0, nFacts = 0;

for (const f of files) {
  let o;
  try { o = JSON.parse(fs.readFileSync(path.join(OUTDIR, f), 'utf-8')); }
  catch (e) { bad.push(f + ' (JSON inválido)'); continue; }
  if (!o.key || !o.tldr) { bad.push(f + ' (faltou key/tldr)'); continue; }
  if (locked[o.key]) { out[o.key] = locked[o.key]; continue; }

  const b = bundleFor(o.key);
  const src = b ? norm([b.sec_caracteristicas, b.sec_prevalencia, b.sec_curso, b.sec_genero, b.sec_diferencial].join(' ')) : '';
  const review = [];
  const facts = o.facts || {};

  // prevalência: percentual/decimal precisa aparecer na fonte (anti-invenção)
  if (facts.prevalencia) {
    const need = pctNums(facts.prevalencia);
    const miss = need.filter(x => src.indexOf(x.replace('%', '')) < 0);
    if (need.length && miss.length) review.push('prevalencia s/ ancoragem: ' + miss.join(','));
  }
  // início: idade de 2 dígitos deve aparecer na fonte
  if (facts.inicio) {
    const ages = (facts.inicio.match(/\b\d{2}\b/g) || []);
    const miss = ages.filter(a => src.indexOf(a) < 0);
    if (ages.length && miss.length) review.push('inicio idade s/ ancoragem: ' + miss.join(','));
  }
  // diferencial: ao menos um termo significativo deve estar em sec_diferencial
  if (facts.diferencial && b) {
    const dsrc = norm(b.sec_diferencial);
    const toks = norm(facts.diferencial).split(/[^a-z0-9]+/).filter(t => t.length >= 6);
    if (toks.length && !toks.some(t => dsrc.indexOf(t) >= 0)) review.push('diferencial s/ ancoragem');
  }

  let conf = o.confidence || 'medium';
  if (review.length) { conf = 'low'; flagged.push(o.n + ' — ' + review.join('; ')); }

  out[o.key] = {
    n: o.n,
    tldr: String(o.tldr).trim(),
    facts: (facts.inicio || facts.prevalencia || facts.sexo || facts.diferencial)
      ? { inicio: facts.inicio || null, prevalencia: facts.prevalencia || null, sexo: facts.sexo || null, diferencial: facts.diferencial || null }
      : null,
    needsReview: true,
    confidence: conf,
  };
  if (review.length) out[o.key]._review = review.join('; ');
  if (out[o.key].tldr) nTldr++;
  if (out[o.key].facts) nFacts++;
}

// ordena por chave p/ diffs estáveis e edição à mão fácil
const sorted = {};
Object.keys(out).sort().forEach(k => { sorted[k] = out[k]; });
fs.writeFileSync(TARGET, JSON.stringify(sorted, null, 2) + '\n', 'utf-8');

console.log('Itens gravados:', Object.keys(sorted).length, '| com tldr:', nTldr, '| com facts:', nFacts);
console.log('Bloqueados preservados:', Object.keys(locked).length);
console.log('JSON inválido/incompleto:', bad.length); bad.slice(0, 10).forEach(x => console.log('  ! ' + x));
console.log('Sinalizados p/ revisão (baixa confiança):', flagged.length); flagged.slice(0, 25).forEach(x => console.log('  ~ ' + x));
