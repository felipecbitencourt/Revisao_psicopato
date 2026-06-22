/* ============================================================
   tools/quiz_audit.cjs — varredura das questões do quiz
   Replica FIELMENTE a geração de questões do app.js (mascaramento,
   critérios distintivos, distratores) e emite TODAS as questões
   possíveis + sinais para auditoria (ambíguas / impossíveis / opções
   ruins). Saída: tools/quiz_audit.json + resumo no stdout.

   Uso: node tools/quiz_audit.cjs
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
global.window = {};
require(path.join(__dirname, '..', 'content.js'));
const CATS = global.window.DSM_CONTENT.categories;

/* ---- helpers copiados verbatim do app.js ---- */
const QUIZ_BLANK = '______';
const QZ_STOP = {transtorno:1,transtornos:1,de:1,da:1,do:1,dos:1,das:1,e:1,ou:1,com:1,sem:1,na:1,no:1,a:1,o:1,por:1,outro:1,outra:1,outros:1,outras:1,nao:1,um:1,uma:1,que:1,em:1,ao:1,tipo:1,devido:1,relacionado:1,relacionados:1,especificado:1,especificada:1,induzido:1,induzida:1,i:1,ii:1,maior:1,geral:1,grave:1,leve:1};
function qzNorm(s){ return (s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''); }
function qzStems(name){
  const toks = qzNorm(name).split(/[^a-z0-9]+/).filter(t => t.length>=4 && !QZ_STOP[t]);
  const seen={}, out=[];
  toks.forEach(t => { const st=t.slice(0, Math.min(t.length,6)); if(!seen[st]){ seen[st]=1; out.push(st); } });
  return out;
}
function maskName(text, name){
  const stems = qzStems(name); if(!stems.length || !text) return text;
  let out = text.replace(/[0-9A-Za-zÀ-ÿ]+(?:-[0-9A-Za-zÀ-ÿ]+)*/g, function(w){
    const nw = qzNorm(w);
    for(let i=0;i<stems.length;i++){ if(nw.indexOf(stems[i])===0) return QUIZ_BLANK; }
    return w;
  });
  return out.replace(/______(?:[\s/–-]+______)+/g, QUIZ_BLANK);
}
function isResidual(n){ const s=qzNorm(n); return /nao especificad|especificad[oa]\b|^outro |^outra /.test(s); }
function quizBadSubject(name){
  if(isResidual(name)) return true;
  const s = qzNorm(name);
  return /\bdevido a\b/.test(s) || /induzid[oa] por (substancia|medicamento)/.test(s) || /(outra substancia|substancia desconhecida)/.test(s);
}
const EXCLUSION_CRIT = [
  /nao (e|sao) mais bem explicad/,
  /nao ocorre exclusivamente durante/,
  /efeitos fisiologicos (diretos )?de (uma|alguma)? ?substancia/,
  /nao (e|se deve|sao|esta) ?atribuiv\w*.*(substancia|condicao medica|medicamento|neurolog)/,
  /nao (e|sao) atribuiv\w* a (outra|alguma|uma) condicao/,
  /nao (e|sao) atribuiv\w* a (deficiencia|condicoes congenitas|um deficit|outro prejuizo)/,
  /nao (e|sao) consequencia (dos|de) efeitos/
];
const IMPAIRMENT_CRIT = [
  /sofrimento clinicamente significativo/,
  /prejuizo (clinicamente significativo|no funcionamento|nas? (relacoes|areas)|em (outras )?areas? importantes)/
];
const TEMPLATE_CRIT = [ /^um padrao (problematico )?de uso de/ ];
function critPlain(t){ return qzNorm(t).replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim(); }
function ambiguousCrit(text){
  const n = critPlain(text);
  if(TEMPLATE_CRIT.some(re => re.test(n))) return true;
  if(EXCLUSION_CRIT.some(re => re.test(n))) return true;
  return text.length < 300 && IMPAIRMENT_CRIT.some(re => re.test(n));
}
function critBag(text, name){
  const seen={}, out=[];
  critPlain(maskName(text, name)).split(' ').forEach(t => { if(t.length>=5 && !seen[t]){ seen[t]=1; out.push(t); } });
  return out.sort().join(' ');
}
let CRIT_BAG_IDX = null;
function critBagIdx(){
  if(CRIT_BAG_IDX) return CRIT_BAG_IDX;
  const idx={};
  CATS.forEach(c => (c.items||[]).forEach(d => (d.criteria||[]).forEach(cr => {
    if(!cr || (cr.text||'').trim().length < 25) return;
    const b = critBag(cr.text, d.n); if(!b) return;
    (idx[b] = idx[b] || {})[d.n] = 1;
  })));
  CRIT_BAG_IDX = idx; return idx;
}
function distinctiveCrits(d){
  if(!Array.isArray(d.criteria)) return [];
  const idx = critBagIdx();
  return d.criteria.filter(cr => {
    const t = (cr.text||'').trim();
    if(t.length < 25 || ambiguousCrit(t)) return false;
    const b = critBag(cr.text, d.n);
    if(b && idx[b] && Object.keys(idx[b]).length >= 2) return false;
    return true;
  });
}
function allNames(){ const o=[]; CATS.forEach(c => (c.items||[]).forEach(d => o.push(d.n))); return o; }
function difDistractors(card){
  const dif = card.facts && card.facts.diferencial; if(!dif) return [];
  const pool = allNames(), poolN = pool.map(qzNorm), frontN = qzNorm(card.front);
  const out=[], seen={};
  dif.split(/[;,]|\s+e\s+/).forEach(part => {
    const np = qzNorm(part).trim(); if(np.length < 4) return;
    let match=null;
    for(let i=0;i<pool.length;i++){
      if(poolN[i]===frontN || isResidual(pool[i])) continue;
      if(np.indexOf(poolN[i])>=0 || poolN[i].indexOf(np)>=0){ match=pool[i]; break; }
    }
    if(!match){
      const pt = np.split(/[^a-z0-9]+/).filter(t=>t.length>=5);
      for(let j=0;j<pool.length && pt.length;j++){
        if(poolN[j]===frontN || isResidual(pool[j])) continue;
        const nt = poolN[j].split(/[^a-z0-9]+/).filter(t=>t.length>=5);
        if(pt.filter(t=>nt.indexOf(t)>=0).length>=2){ match=pool[j]; break; }
      }
    }
    if(match && !seen[match] && match!==card.front){ seen[match]=1; out.push(match); }
  });
  return out.slice(0,3);
}

/* ---- "famílias" de nome (clusters quase-idênticos → opções confusas) ---- */
const names = allNames();
const tokenDF = {};
names.forEach(n => { const seen={}; qzNorm(n).split(/[^a-z0-9]+/).forEach(t => { if(t.length>=3 && !QZ_STOP[t] && !seen[t]){ seen[t]=1; tokenDF[t]=(tokenDF[t]||0)+1; } }); });
function familyKey(n){
  const toks = qzNorm(n).split(/[^a-z0-9]+/).filter(t => t.length>=3 && !QZ_STOP[t] && tokenDF[t]>=2);
  return Array.from(new Set(toks)).sort().join(' ');
}
const familyCount = {};
names.forEach(n => { const k=familyKey(n); familyCount[k]=(familyCount[k]||0)+1; });

/* ---- gera todas as questões dos transtornos quizáveis ---- */
const questions = [];
function blanks(s){ return (s.match(/______/g)||[]).length; }
CATS.forEach((c, ci) => (c.items||[]).forEach((d, di) => {
  if(quizBadSubject(d.n)) return;
  const sum = (d.summary||'').trim();
  const tldr = (d.tldr||'').trim();
  const facts = d.facts || null;
  const fam = { familyKey: familyKey(d.n), familySize: familyCount[familyKey(d.n)] };
  const dif = difDistractors({ front:d.n, facts });

  // resumo
  if(sum && !/não disponível/i.test(sum)){
    const src = tldr || sum;
    const stem = maskName(src, d.n);
    questions.push({ type:'resumo', ci, di, name:d.n, cat:c.name, stem,
      sig:{ stemLen:stem.length, blanks:blanks(stem), difCount:dif.length, familyKey:fam.familyKey, familySize:fam.familySize } });
  }
  // criterio
  distinctiveCrits(d).forEach(cr => {
    const stem = maskName((cr.text||'').trim(), d.n);
    questions.push({ type:'criterio', ci, di, name:d.n, cat:c.name, letter:cr.letter||'', stem,
      sig:{ stemLen:stem.length, blanks:blanks(stem), difCount:dif.length, familyKey:fam.familyKey, familySize:fam.familySize } });
  });
  // fatos
  if(facts && ['inicio','prevalencia','sexo'].filter(k => facts[k]).length >= 2){
    const rows = [['Início', facts.inicio],['Prevalência', facts.prevalencia],['Sexo', facts.sexo]]
      .filter(r => r[1]).map(r => r[0]+': '+maskName(String(r[1]), d.n));
    const stem = rows.join(' | ');
    questions.push({ type:'fatos', ci, di, name:d.n, cat:c.name, stem,
      sig:{ stemLen:stem.length, blanks:blanks(stem), difCount:dif.length, familyKey:fam.familyKey, familySize:fam.familySize } });
  }
}));

/* ---- sinais globais: stems normalizados duplicados (ambiguidade) ---- */
const byNormStem = {};
questions.forEach(q => {
  const key = q.type+'§'+critPlain(q.stem);
  (byNormStem[key] = byNormStem[key] || []).push(q.name);
});
questions.forEach(q => {
  const key = q.type+'§'+critPlain(q.stem);
  const others = Array.from(new Set(byNormStem[key])).filter(n => n!==q.name);
  q.sig.dupStemWith = others;            // mesmo enunciado normalizado em outro transtorno
});

/* ---- saída ---- */
const outPath = path.join(__dirname, 'quiz_audit.json');
fs.writeFileSync(outPath, JSON.stringify(questions, null, 1));

const byType = {}; questions.forEach(q => byType[q.type]=(byType[q.type]||0)+1);
const subjects = new Set(questions.map(q => q.name));
const dupStem = questions.filter(q => q.sig.dupStemWith.length);
const difZero = questions.filter(q => q.sig.difCount===0);
const shortStem = questions.filter(q => q.sig.stemLen < 60);
const bigFamily = questions.filter(q => q.sig.familySize >= 3);
const families = Object.keys(familyCount).filter(k => k && familyCount[k]>=3).map(k => ({ k, n:familyCount[k] })).sort((a,b)=>b.n-a.n);

console.log('Questões geradas:', questions.length, '| por tipo:', JSON.stringify(byType));
console.log('Transtornos-enunciado distintos:', subjects.size);
console.log('');
console.log('SINAIS DE RISCO:');
console.log('  enunciado normalizado IDÊNTICO ao de outro transtorno (ambíguo):', dupStem.length);
console.log('  sem diferenciais reais (distratores caem no aleatório):', difZero.length);
console.log('  enunciado muito curto (<60 chars, pouca info):', shortStem.length);
console.log('  enunciado de transtorno em família grande (≥3 nomes quase iguais):', bigFamily.length);
console.log('');
console.log('FAMÍLIAS DE NOME (≥3 — risco de opções confusas):');
families.slice(0,25).forEach(f => console.log('  ['+f.n+'] '+f.k));
console.log('');
console.log('EXEMPLOS de enunciado ambíguo (dupStemWith):');
dupStem.slice(0,12).forEach(q => console.log('  ('+q.type+') '+q.name+'  ↔  '+q.sig.dupStemWith.join(' / ')+'\n     "'+q.stem.slice(0,120).replace(/\n/g,' ')+'"'));
console.log('');
console.log('Saída completa →', outPath);
