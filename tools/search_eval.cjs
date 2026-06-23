/* ============================================================
   tools/search_eval.cjs — avaliação da busca avançada
   Roda o motor (search-engine.js) sobre um conjunto curado de
   descrições de caso (linguagem natural) com o transtorno esperado,
   e reporta top-1 / top-3 / MRR + a lista de erros.

   `expect` é um TRECHO normalizado do nome do transtorno (casamento por
   "contém"), tolerante a variações de nome. Uso: node tools/search_eval.cjs
   ============================================================ */
'use strict';
const path = require('path');
global.window = {};
require(path.join(__dirname, '..', 'content.js'));
require(path.join(__dirname, '..', 'search-engine.js'));
const S = global.window.SemanticSearch;
const CATS = global.window.DSM_CONTENT.categories;

function norm(s){ return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''); }

// casos: descrições leigas/clínicas (NÃO copiam o texto da ficha) -> trecho do nome esperado
const EVAL = [
  ['Mulher de 30 anos, há mais de um mês sem vontade de nada, chora à toa, sente-se culpada e sem valor, dorme mal e pensou que seria melhor não estar viva.', 'depressivo maior'],
  ['Vive preocupado com tudo (trabalho, família, dinheiro), não consegue desligar, tenso, cansado, irritado e dormindo mal há vários meses.', 'ansiedade generalizada'],
  ['Do nada o coração dispara, falta o ar, sua frio e sente que vai morrer; depois fica com medo de ter outra crise.', 'panico'],
  ['Passa horas lavando as mãos com medo de contaminação; sabe que é exagero mas não consegue parar; confere a porta várias vezes.', 'obsessivo'],
  ['Depois de um acidente grave tem pesadelos e flashbacks, evita dirigir, sobressalta-se com barulhos e vive em alerta.', 'estresse pos-traumatico'],
  ['Menino de 5 anos não faz contato visual, não brinca com outras crianças, enfileira brinquedos, repete falas e se irrita com mudança de rotina.', 'espectro autista'],
  ['Criança não para quieta, esquece tarefas, perde material, não termina o que começa, distrai-se com tudo e interrompe os outros.', 'deficit de atencao'],
  ['Rapaz de 23 anos, há mais de um ano ouve vozes que comentam suas ações, acha que é perseguido, fala desconexo e se isolou.', 'esquizofrenia'],
  ['Passou uma semana quase sem dormir, eufórico, gastando demais, falando sem parar e achando que tinha poderes especiais.', 'bipolar tipo i'],
  ['Adolescente restringe muito a comida, está bem abaixo do peso, com medo intenso de engordar e se vê gorda mesmo magra.', 'anorexia'],
  ['Episódios de comer enorme quantidade e depois vomitar para compensar; peso normal; sente que perde o controle.', 'bulimia'],
  ['Pavor de aranhas — entra em pânico só de ver uma foto e evita qualquer lugar onde possa haver uma.', 'fobia especifica'],
  ['Morre de medo de falar em público ou ser observado; evita festas e apresentações achando que vão julgá-lo.', 'ansiedade social'],
  ['Evita sair sozinho, ônibus, shopping e filas com medo de passar mal e não conseguir escapar.', 'agorafobia'],
  ['Há meses custa a pegar no sono e acorda de madrugada; cansado de dia; tem tempo para dormir mas não dorme.', 'insonia'],
  ['Acorda apavorado com sonhos vívidos e ameaçadores, lembra dos detalhes, várias vezes por semana.', 'pesadelo'],
  ['Criança chora demais e recusa ir à escola com medo de que algo aconteça à mãe; não dorme sozinha.', 'ansiedade de separacao'],
  ['Bebe cada vez mais, já tentou parar e não consegue, tem tremores quando fica sem e largou compromissos.', 'uso de alcool'],
  ['Há mais de dois anos sente-se para baixo na maioria dos dias, sem ser uma crise — virou o jeito dela.', 'depressivo persistente'],
  ['Na semana antes da menstruação fica muito irritada, triste e inchada, e melhora quando menstrua.', 'pre-menstrual'],
  ['Arranca os próprios cabelos repetidamente, tem falhas no couro cabeludo e tenta parar sem sucesso.', 'tricotilomania'],
  ['Fica cutucando e beliscando a pele até ferir-se, e tenta parar sem conseguir.', 'escoriacao'],
  ['Não consegue jogar nada fora; a casa está tomada de objetos a ponto de não dar para usar os cômodos.', 'acumulacao'],
  ['Obcecado por um suposto defeito no nariz que ninguém nota; passa horas no espelho.', 'dismorfico'],
  ['Dorme de repente durante o dia, tem ataques de sono incontroláveis e perde a força muscular quando ri.', 'narcolepsia'],
  ['Ronca muito, para de respirar enquanto dorme, acorda cansado e com sono o dia inteiro.', 'obstrutivas do sono'],
  ['Relações intensas e instáveis, medo de abandono, impulsividade, vazio crônico e se corta quando briga.', 'borderline'],
  ['Desde jovem desrespeita regras e direitos dos outros, mente, não sente remorso e tem comportamento criminoso.', 'antissocial'],
  ['Adolescente agride pessoas e animais, destrói coisas, mente, furta e foge de casa.', 'conduta'],
  ['Criança teimosa que discute com adultos, desafia regras, fica com raiva e culpa os outros pelos erros.', 'oposicao desafiante'],
  ['Diz ter diferentes "pessoas" dentro de si que assumem o controle, com lapsos de memória de coisas que fez.', 'dissociativo de identidade'],
  ['Não consegue lembrar de um período importante da própria vida, além do esquecimento comum, após um trauma.', 'amnesia dissociativa'],
  ['Sente-se fora do próprio corpo, como num sonho, observando a si mesmo de fora.', 'despersonalizacao'],
  ['Preocupa-se demais com vários sintomas físicos, vai a muitos médicos e gasta muito tempo com a saúde.', 'sintomas somaticos'],
  ['Tem certeza de que tem uma doença grave apesar de exames normais e vive checando o corpo.', 'ansiedade de doenca'],
  ['Após forte estresse, ficou com fraqueza e perda de movimento sem causa neurológica que explique.', 'conversivo'],
  ['Idoso ficou confuso de repente, oscila ao longo do dia, desatento e desorientado após internação.', 'delirium'],
  ['Idosa com perda progressiva de memória recente ao longo dos anos, perde-se em lugares conhecidos.', 'alzheimer'],
  ['Criança de 7 anos faz xixi na cama repetidamente, à noite.', 'enurese'],
  ['Come terra, giz e cabelo — coisas que não são alimento.', 'pica'],
  ['Não consegue parar de apostar, mente sobre isso, perdeu dinheiro e relações importantes.', 'jogo'],
  ['Tem tiques motores e vocais (pisca, balança a cabeça, solta sons) há mais de um ano, desde a infância.', 'tourette'],
  ['Dorme demais à noite e ainda sente muito sono de dia, cochilando sem querer.', 'hipersonolencia'],
  ['Sente forte incongruência entre o gênero que sente ser e o sexo designado, com desconforto persistente.', 'disforia de genero'],
  ['Criança não fala em situações sociais (na escola) apesar de falar normalmente em casa.', 'mutismo seletivo']
];

// índice de nomes para validar os "expect" e casar resultados
const NAMES = [];
CATS.forEach(c => (c.items||[]).forEach(d => NAMES.push(d.n)));
function matches(name, expect){ return norm(name).indexOf(norm(expect)) >= 0; }

// valida que cada expect existe no acervo
const badExpect = EVAL.filter(e => !NAMES.some(n => matches(n, e[1])));
if(badExpect.length){
  console.log('⚠️  expects sem correspondência no acervo (revisar):');
  badExpect.forEach(e => console.log('   "'+e[1]+'"  <- '+e[0].slice(0,50)+'…'));
  console.log('');
}

let top1=0, top3=0, rrSum=0;
const misses=[];
EVAL.forEach(function(e){
  const res = S.analyze(e[0], 8) || [];
  let rank = 0;
  for(let i=0;i<res.length;i++){ if(matches(res[i].name, e[1])){ rank = i+1; break; } }
  if(rank===1) top1++;
  if(rank>=1 && rank<=3) top3++;
  if(rank>=1) rrSum += 1/rank;
  if(rank!==1){
    misses.push({ q:e[0], expect:e[1], rank:rank, got:res.slice(0,3).map(r=>r.name+' ('+r.score100+'%)') });
  }
});

const N = EVAL.length;
console.log('=== Avaliação da busca avançada ===');
console.log('Casos:', N);
console.log('Top-1 :', top1, '('+(100*top1/N).toFixed(1)+'%)');
console.log('Top-3 :', top3, '('+(100*top3/N).toFixed(1)+'%)');
console.log('MRR   :', (rrSum/N).toFixed(3));
console.log('');
console.log('=== Erros (não ficou em #1) ===');
misses.forEach(function(m){
  console.log((m.rank? ('#'+m.rank) : 'FORA')+'  esperado: '+m.expect);
  console.log('   caso: '+m.q.slice(0,90)+'…');
  console.log('   top3: '+m.got.join('  |  '));
});
