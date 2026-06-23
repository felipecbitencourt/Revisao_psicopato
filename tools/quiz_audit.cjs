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
  /melhor explicad/,
  /nao ocorre exclusivamente durante/,
  /efeitos fisiologicos (diretos )?de (uma|alguma)? ?substancia/,
  /nao (e|se deve|sao|esta) ?atribuiv\w*.*(substancia|condicao medica|medicamento|neurolog)/,
  /nao (e|sao) atribuiv\w* a (outra|alguma|uma) condicao/,
  /nao (e|sao) atribuiv\w* a (deficiencia|condicoes congenitas|um deficit|outro prejuizo)/,
  /nao (e|sao) consequencia (dos|de) efeitos/,
  /nao (houve|ocorreu|ocorreram|preencheu|preencheram|foram preenchidos os criterios para).*(episodi[oa]s? (maniac|hipomaniac|depressiv|mist)|mania|hipomania|esquizoafetiv)/,
  /(jamais|nunca) (houve|ocorreu|preencheu|foram preenchidos).*(criterio|episodio|mania|hipomania)/,
  /(transtorno esquizoafetivo|transtorno (depressivo|bipolar)).*(foi|foram|nao) (descartad|excluid|afastad)/,
  /nao (preenche|preencheu|satisfaz|sao preenchidos os criterios).*(transtorno do espectro autista|esquizofrenia)/,
  /nao (explicam|sao melhor explicad).*(os )?(episodios|sintomas|quadros|perturbacoes)/,
  /criterio [a-h]\b.{0,90}criterio [a-h]\b/,
  /^(em |para )?criancas de (6|seis) anos ou menos/,
  /(lesao ou doenca|sinais ou sintomas).{0,30}(em|de) outr[oa]\b/,
  /apresenta (um |o )?outro \(?vitima/
];
const IMPAIRMENT_CRIT = [
  /sofrimento clinicamente significativ/,
  /prejuizos? (clinicamente significativ|no funcionamento|nas? (relacoes|areas)|em (outras )?areas? importantes|acentuad|marcant|substancial|importante|significativ)/,
  /(interfere|interferem|limita|limitam|restringe|restringem|prejudica|prejudicam|reduz|reduzem|comprometem?) (a |o |na |no |com a |com o )?(comunicacao|participacao|interacao|desempenho|rendimento|realizacao|funcionamento)/,
  /funcionament[eo] (social|academic|ocupacional|profissional|escolar)/,
  /individualmente ou em (qualquer )?combinacao/
];
const BOILERPLATE_CRIT = [
  /(pelo menos|no minimo|ao menos) (tres|3) (noites|vezes) (por|na) semana/,
  /(presente|ocorre|persiste|dura|esta presente|presentes).*(pelo menos|no minimo|por|durante|ha) (tres|3) meses/,
  /oportunidades? (adequad|suficient|apropriad)/,
  /(desenvolvimento|surgimento) de (uma )?sindrome (reversivel|especifica|problematica)/,
  /(cessacao|interrupcao|reducao) (abrupta )?(de |do )?(uso (pesado|prolongado|intenso))/,
  /uso (diario|regular|pesado) (e )?prolongado/,
  /hiperatividade (autonomica|do sistema nervoso autonomo)/,
  /(inicio|os sintomas|comeca|surge).{0,40}(periodo|fase|inicio) (de |do )?desenvolvimento/,
  /(provoca\w*|induz\w*|desencadei\w*|gera\w*|resulta em) (quase sempre |invariavelmente |imediatamente )?(medo|ansiedade|temor)/,
  /(quase sempre|invariavelmente|de imediato) (provoca|induz|gera|desencadei|resulta|causa)/,
  /(medo|ansiedade|temor).{0,25}(desproporci|fora de proporcao|excessiv\w* em relacao|maior que o perigo)/,
  /criterios para (um )?(transtorno|episodio) depressivo maior/,
  /(75 a 100|aproximadamente 75|em (quase )?todas as (ocasioes|situacoes|atividades)|quase todas ou todas as)/
];
const TEMPLATE_CRIT = [ /^um padrao (problematico )?de uso de/ ];
function critPlain(t){ return qzNorm(t).replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim(); }
function ambiguousCrit(text){
  const n = critPlain(text);
  if(TEMPLATE_CRIT.some(re => re.test(n))) return true;
  if(EXCLUSION_CRIT.some(re => re.test(n))) return true;
  return text.length < 300 && (IMPAIRMENT_CRIT.some(re => re.test(n)) || BOILERPLATE_CRIT.some(re => re.test(n)));
}
function critBag(text, name){
  const seen={}, out=[];
  critPlain(maskName(text, name)).split(' ').forEach(t => { if(t.length>=5 && !seen[t]){ seen[t]=1; out.push(t); } });
  return out.sort().join(' ');
}
let FAM_STEMS = null;
function famStems(){
  if(FAM_STEMS) return FAM_STEMS;
  const df={};
  CATS.forEach(c => (c.items||[]).forEach(d => { const seen={}; qzStems(d.n).forEach(s => { if(!seen[s]){ seen[s]=1; df[s]=(df[s]||0)+1; } }); }));
  FAM_STEMS = Object.keys(df).filter(s => df[s]>=2 && df[s]<=8);
  return FAM_STEMS;
}
function dedupTokens(text, name){
  let masked = maskName(text, name);
  const fam = famStems();
  masked = masked.replace(/[0-9A-Za-zÀ-ÿ]+(?:-[0-9A-Za-zÀ-ÿ]+)*/g, function(w){
    const nw = qzNorm(w);
    for(let i=0;i<fam.length;i++){ if(nw.indexOf(fam[i])===0) return '______'; }
    return w;
  });
  const seen={}, out=[];
  critPlain(masked).split(' ').forEach(t => { if(t.length>=5 && !seen[t]){ seen[t]=1; out.push(t); } });
  return out;
}
let CRIT_SIGS = null;
function critSigs(){
  if(CRIT_SIGS) return CRIT_SIGS;
  const sigs=[];
  CATS.forEach(c => (c.items||[]).forEach(d => (d.criteria||[]).forEach(cr => {
    const t=(cr.text||'').trim(); if(t.length < 25) return;
    const toks = dedupTokens(cr.text, d.n);
    if(toks.length) sigs.push({ name:d.n, set:toks });
  })));
  CRIT_SIGS = sigs; return sigs;
}
function sharedCrit(text, name){
  const toks = dedupTokens(text, name);
  if(toks.length < 4) return true;
  const setA={}; toks.forEach(t => setA[t]=1);
  const sigs = critSigs();
  for(let i=0;i<sigs.length;i++){
    const s=sigs[i]; if(s.name===name) continue;
    let inter=0; for(let j=0;j<s.set.length;j++){ if(setA[s.set[j]]) inter++; }
    const uni = toks.length + s.set.length - inter;
    if(uni>0 && inter/uni >= 0.70) return true;
  }
  return false;
}
function distinctiveCrits(d){
  if(!Array.isArray(d.criteria)) return [];
  return d.criteria.filter(cr => {
    const t = (cr.text||'').trim();
    if(t.length < 25 || ambiguousCrit(t)) return false;
    const ownBag = critBag(cr.text, d.n);
    if(!ownBag || ownBag.split(' ').length < 4) return false;
    if(sharedCrit(cr.text, d.n)) return false;
    return true;
  });
}
function factText(d){ const f=d.facts||{}; return [f.inicio,f.prevalencia,f.sexo].filter(Boolean).join(' '); }
let FACT_SIGS = null;
function factSigs(){
  if(FACT_SIGS) return FACT_SIGS;
  const sigs=[];
  CATS.forEach(c => (c.items||[]).forEach(d => {
    if(quizBadSubject(d.n)) return;
    const f=d.facts; if(!f) return;
    if(['inicio','prevalencia','sexo'].filter(k => f[k]).length < 2) return;
    const toks = dedupTokens(factText(d), d.n);
    if(toks.length) sigs.push({ name:d.n, set:toks });
  }));
  FACT_SIGS = sigs; return sigs;
}
function sharedFacts(d){
  const toks = dedupTokens(factText(d), d.n);
  if(toks.length < 3) return true;
  const setA={}; toks.forEach(t => setA[t]=1);
  const sigs = factSigs();
  for(let i=0;i<sigs.length;i++){
    const s=sigs[i]; if(s.name===d.n) continue;
    let inter=0; for(let j=0;j<s.set.length;j++){ if(setA[s.set[j]]) inter++; }
    const uni = toks.length + s.set.length - inter;
    if(uni>0 && inter/uni >= 0.70) return true;
  }
  return false;
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
  if(facts && ['inicio','prevalencia','sexo'].filter(k => facts[k]).length >= 2 && !sharedFacts(d)){
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
