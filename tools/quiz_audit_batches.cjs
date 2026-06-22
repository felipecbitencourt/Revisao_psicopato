/* Gera lotes por categoria (tools/qa_batches/cat_<ci>.txt) + names.txt
   a partir de tools/quiz_audit.json, para a auditoria semântica do workflow. */
'use strict';
const fs = require('fs');
const path = require('path');
global.window = {};
require(path.join(__dirname, '..', 'content.js'));
const CATS = global.window.DSM_CONTENT.categories;
const Q = JSON.parse(fs.readFileSync(path.join(__dirname, 'quiz_audit.json'), 'utf8'));

const dir = path.join(__dirname, 'qa_batches');
fs.mkdirSync(dir, { recursive: true });

// referência: todos os nomes de transtorno (espaço de respostas)
const names = [];
CATS.forEach(c => (c.items||[]).forEach(d => names.push(d.n)));
fs.writeFileSync(path.join(dir, 'names.txt'), names.join('\n'));

// agrupa questões por categoria (ci)
const byCat = {};
Q.forEach(q => { (byCat[q.ci] = byCat[q.ci] || []).push(q); });

const index = [];
Object.keys(byCat).map(Number).sort((a,b)=>a-b).forEach(ci => {
  const list = byCat[ci];
  const cat = CATS[ci] ? CATS[ci].name : ('cat'+ci);
  let txt = 'CATEGORIA: '+cat+'  (ci='+ci+')\n';
  txt += 'Total de questões neste lote: '+list.length+'\n';
  txt += 'Formato: cada questão tem o ENUNCIADO (com o nome do transtorno mascarado por ______) e a RESPOSTA correta.\n\n';
  list.forEach((q, i) => {
    const tag = q.type==='criterio' ? ('criterio '+(q.letter?('· Critério '+q.letter):'')) : q.type;
    txt += '['+(i+1)+'] ('+tag+')  RESPOSTA: '+q.name+'\n';
    txt += '    sinais: difDistratores='+q.sig.difCount+' familiaTamanho='+q.sig.familySize+(q.sig.dupStemWith.length?(' dupCom='+q.sig.dupStemWith.join('/')):'')+'\n';
    txt += '    ENUNCIADO: '+String(q.stem).replace(/\s+/g,' ').trim()+'\n\n';
  });
  const fn = 'cat_'+String(ci).padStart(2,'0')+'.txt';
  fs.writeFileSync(path.join(dir, fn), txt);
  index.push({ ci, cat, file: 'tools/qa_batches/'+fn, count: list.length });
});

fs.writeFileSync(path.join(dir, 'index.json'), JSON.stringify(index, null, 1));
console.log('Lotes gerados:', index.length, 'categorias →', dir);
index.forEach(b => console.log('  '+b.file+'  ('+b.count+' questões)  '+b.cat));
