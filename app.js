/* ============================================================
   Plataforma Psico · Pato (guia de estudos do DSM-5-TR)
   JS vanilla, sem dependências, sem build — abra o index.html.
   Sem dependências, sem build — abra o index.html no navegador.

   Conteúdo é ilustrativo/placeholder (igual ao protótipo): a
   estrutura está pronta para plugar os dados reais do DSM-5-TR.
   ============================================================ */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     Dados (transcritos 1:1 do protótipo)
     --------------------------------------------------------- */
  var CATS = [
    { name:'Transtornos do neurodesenvolvimento', color:'#6C5CE7', prog:.7, items:[
      {n:'Deficiência intelectual', code:'F70'},{n:'Transtorno do espectro autista', code:'F84.0'},{n:'Transtorno de déficit de atenção/hiperatividade', code:'F90.0'},{n:'Transtorno específico da aprendizagem', code:'F81'},{n:'Transtorno de Tourette', code:'F95.2'}]},
    { name:'Espectro da esquizofrenia e psicóticos', color:'#00A6C7', prog:.4, items:[
      {n:'Esquizofrenia', code:'F20'},{n:'Transtorno esquizoafetivo', code:'F25'},{n:'Transtorno delirante', code:'F22'},{n:'Transtorno psicótico breve', code:'F23'}]},
    { name:'Transtorno bipolar e relacionados', color:'#F4A261', prog:.55, items:[
      {n:'Transtorno bipolar tipo I', code:'F31.1'},{n:'Transtorno bipolar tipo II', code:'F31.81'},{n:'Transtorno ciclotímico', code:'F34.0'}]},
    { name:'Transtornos depressivos', color:'#4361EE', prog:.6, items:[
      {n:'Transtorno depressivo maior', code:'F32'},{n:'Transtorno depressivo persistente', code:'F34.1'},{n:'Transtorno disfórico pré-menstrual', code:'N94.3'},{n:'Desregulação disruptiva do humor', code:'F34.81'}]},
    { name:'Transtornos de ansiedade', color:'#2A9D8F', prog:.85, items:[
      {n:'Transtorno de ansiedade generalizada', code:'F41.1'},{n:'Transtorno de pânico', code:'F41.0'},{n:'Agorafobia', code:'F40.00'},{n:'Fobia específica', code:'F40.2'},{n:'Transtorno de ansiedade social', code:'F40.10'}]},
    { name:'TOC e transtornos relacionados', color:'#E76F51', prog:.3, items:[
      {n:'Transtorno obsessivo-compulsivo', code:'F42'},{n:'Transtorno dismórfico corporal', code:'F45.22'},{n:'Transtorno de acumulação', code:'F42'},{n:'Tricotilomania', code:'F63.3'}]},
    { name:'Trauma e estressores', color:'#9B5DE5', prog:.5, items:[
      {n:'Transtorno de estresse pós-traumático', code:'F43.10'},{n:'Transtorno de estresse agudo', code:'F43.0'},{n:'Transtorno de adaptação', code:'F43.2'},{n:'Transtorno de apego reativo', code:'F94.1'}]},
    { name:'Transtornos dissociativos', color:'#00BBF9', prog:.2, items:[
      {n:'Transtorno dissociativo de identidade', code:'F44.81'},{n:'Amnésia dissociativa', code:'F44.0'},{n:'Despersonalização/desrealização', code:'F48.1'}]},
    { name:'Sintomas somáticos e relacionados', color:'#F15BB5', prog:.35, items:[
      {n:'Transtorno de sintomas somáticos', code:'F45.1'},{n:'Transtorno de ansiedade de doença', code:'F45.21'},{n:'Transtorno conversivo', code:'F44.4'},{n:'Transtorno factício', code:'F68.10'}]},
    { name:'Transtornos alimentares', color:'#06D6A0', prog:.65, items:[
      {n:'Anorexia nervosa', code:'F50.0'},{n:'Bulimia nervosa', code:'F50.2'},{n:'Transtorno de compulsão alimentar', code:'F50.81'},{n:'Pica', code:'F50.8'}]},
    { name:'Transtornos da eliminação', color:'#118AB2', prog:.1, items:[
      {n:'Enurese', code:'F98.0'},{n:'Encoprese', code:'F98.1'}]},
    { name:'Transtornos do sono-vigília', color:'#3A86FF', prog:.25, items:[
      {n:'Transtorno de insônia', code:'F51.01'},{n:'Transtorno de hipersonolência', code:'F51.11'},{n:'Narcolepsia', code:'G47.4'},{n:'Transtorno do pesadelo', code:'F51.5'}]},
    { name:'Disfunções sexuais', color:'#EF476F', prog:.15, items:[
      {n:'Ejaculação precoce', code:'F52.4'},{n:'Desejo sexual hipoativo', code:'F52.0'},{n:'Transtorno do orgasmo feminino', code:'F52.31'}]},
    { name:'Disforia de gênero', color:'#8338EC', prog:.4, items:[
      {n:'Disforia de gênero em adultos', code:'F64.0'},{n:'Disforia de gênero em crianças', code:'F64.2'}]},
    { name:'Disruptivos, controle de impulsos e conduta', color:'#FB5607', prog:.45, items:[
      {n:'Transtorno de oposição desafiante', code:'F91.3'},{n:'Transtorno explosivo intermitente', code:'F63.81'},{n:'Transtorno da conduta', code:'F91'},{n:'Cleptomania', code:'F63.2'}]},
    { name:'Substâncias e transtornos aditivos', color:'#D6336C', prog:.5, items:[
      {n:'Transtorno por uso de álcool', code:'F10'},{n:'Transtorno por uso de opioides', code:'F11'},{n:'Transtorno por uso de cannabis', code:'F12'},{n:'Transtorno do jogo', code:'F63.0'}]},
    { name:'Transtornos neurocognitivos', color:'#588157', prog:.3, items:[
      {n:'Delirium', code:'F05'},{n:'Transtorno neurocognitivo maior', code:'F02'},{n:'Transtorno neurocognitivo leve', code:'G31.84'}]},
    { name:'Transtornos da personalidade', color:'#BC6C25', prog:.6, items:[
      {n:'Personalidade borderline', code:'F60.3'},{n:'Personalidade antissocial', code:'F60.2'},{n:'Personalidade narcisista', code:'F60.81'},{n:'Personalidade evitativa', code:'F60.6'}]},
    { name:'Transtornos parafílicos', color:'#7209B7', prog:.05, items:[
      {n:'Transtorno voyeurista', code:'F65.3'},{n:'Transtorno exibicionista', code:'F65.2'},{n:'Transtorno frotteurista', code:'F65.81'}]},
    { name:'Outros transtornos mentais', color:'#5C6B73', prog:.0, items:[
      {n:'Outro transtorno mental especificado', code:'F99'},{n:'Transtorno mental não especificado', code:'F99'}]},
  ];

  var FLASHCARDS = [
    {front:'Transtorno de Ansiedade Generalizada', back:'Ansiedade e preocupação excessivas, na maioria dos dias, por ≥ 6 meses, difíceis de controlar.'},
    {front:'Transtorno de Pânico', back:'Ataques de pânico recorrentes e inesperados, seguidos de preocupação persistente com novos ataques.'},
    {front:'Anorexia Nervosa', back:'Restrição da ingesta, medo intenso de ganhar peso e distorção da imagem corporal.'},
    {front:'Transtorno Bipolar tipo I', back:'Pelo menos um episódio maníaco, que pode ser precedido ou seguido por episódios hipomaníacos ou depressivos.'},
    {front:'TEPT', back:'Exposição a evento traumático seguida de reexperiência, evitação, alterações cognitivas e hiperexcitação.'},
  ];

  var QUIZ = [
    {q:'Qual o tempo mínimo de duração para o diagnóstico de Transtorno de Ansiedade Generalizada?', opts:['1 mês','3 meses','6 meses','12 meses'], correct:2},
    {q:'O Transtorno Bipolar tipo I exige a presença de qual episódio?', opts:['Hipomaníaco','Maníaco','Depressivo maior','Misto'], correct:1},
    {q:'A distorção da imagem corporal é critério central de qual transtorno?', opts:['Bulimia nervosa','Anorexia nervosa','Transtorno de compulsão alimentar','Pica'], correct:1},
  ];

  var ML = [
    {n:'Esquizofrenia', cat:1},
    {n:'Anorexia nervosa', cat:9},
    {n:'TEPT', cat:6},
    {n:'Transtorno de pânico', cat:4},
    {n:'Personalidade borderline', cat:17},
  ];
  var MR = [4,9,1,17,6]; // índices de categoria, embaralhados

  // Banco de casos (vinhetas ILUSTRATIVAS para estudo — requerem validação clínica).
  // A resposta correta usa o nome de um transtorno do conteúdo (p/ o botão "Ver ficha").
  var CASOS = [
    {
      id:'panico',
      patient:{name:'Marina', age:27, sex:'Feminino', ref:'Encaminhada pela atenção primária', initials:'M'},
      chips:['Ataques súbitos de medo', 'Palpitações e falta de ar', '≈ 4 meses', 'Evita sair sozinha'],
      vinheta:'Marina relata episódios súbitos e recorrentes de medo intenso, com palpitações, sudorese, falta de ar e sensação de morte iminente, que atingem o pico em poucos minutos. Desde então, vive preocupada com a possibilidade de novos episódios e passou a evitar sair de casa sozinha. Nega uso de substâncias e condição médica que justifique o quadro.',
      pergunta:'Qual a hipótese diagnóstica mais provável?',
      opts:['Transtorno Depressivo Maior','Transtorno de Ansiedade Generalizada','Transtorno de Pânico','Transtorno Bipolar Tipo II'],
      correct:2,
      explicacao:'Ataques de pânico recorrentes e inesperados, seguidos de preocupação persistente com novos ataques e mudança de comportamento (esquiva), apontam para Transtorno de Pânico (DSM-5-TR).'
    },
    {
      id:'depressao',
      patient:{name:'Rafael', age:34, sex:'Masculino', ref:'Procurou o serviço por conta própria', initials:'R'},
      chips:['Humor deprimido', 'Anedonia ≈ 2 meses', 'Insônia e fadiga', 'Culpa e baixa concentração'],
      vinheta:'Há cerca de dois meses, Rafael refere tristeza na maior parte do dia, quase todos os dias, com perda acentuada de interesse e prazer em atividades que antes apreciava. Relata insônia, fadiga, dificuldade de concentração, sentimentos de inutilidade e culpa excessiva, além de redução de apetite e peso. Nega episódios de humor elevado, uso de substâncias ou condição médica relevante.',
      pergunta:'Qual a hipótese diagnóstica mais provável?',
      opts:['Transtorno de Ansiedade Generalizada','Transtorno Depressivo Maior','Transtorno Bipolar Tipo I','Transtorno Depressivo Persistente (Distimia)'],
      correct:1,
      explicacao:'Humor deprimido e/ou anedonia por ≥ 2 semanas, somados a sintomas neurovegetativos e cognitivos (sono, apetite/peso, fadiga, culpa, concentração), sem história de episódio maníaco/hipomaníaco, apontam para Transtorno Depressivo Maior (DSM-5-TR).'
    },
    {
      id:'toc',
      patient:{name:'Beatriz', age:22, sex:'Feminino', ref:'Trazida pela família', initials:'B'},
      chips:['Pensamentos de contaminação', 'Rituais de lavagem', '> 3 h/dia', 'Reconhece o excesso'],
      vinheta:'Beatriz descreve pensamentos intrusivos e recorrentes de contaminação que lhe causam grande ansiedade. Para aliviá-los, lava as mãos de forma repetitiva e segue rituais rígidos de limpeza, chegando a gastar mais de três horas por dia. Reconhece que os comportamentos são excessivos, mas sente-se incapaz de resistir. O quadro prejudica seus estudos e relações.',
      pergunta:'Qual a hipótese diagnóstica mais provável?',
      opts:['Transtorno de Ansiedade Generalizada','Transtorno de Pânico','Transtorno Obsessivo-Compulsivo','Fobia Específica'],
      correct:2,
      explicacao:'Obsessões (pensamentos intrusivos de contaminação) e compulsões (rituais de lavagem) que consomem tempo significativo (> 1 h/dia) e geram sofrimento/prejuízo caracterizam o Transtorno Obsessivo-Compulsivo (DSM-5-TR).'
    },
    {
      id:'tept',
      patient:{name:'Carlos', age:41, sex:'Masculino', ref:'Encaminhado após acidente', initials:'C'},
      chips:['Acidente grave há 5 meses', 'Revivências e pesadelos', 'Evitação', 'Hipervigilância'],
      vinheta:'Cinco meses após sofrer um acidente automobilístico grave, Carlos apresenta revivências intrusivas do evento, pesadelos recorrentes e intenso sofrimento ao ser exposto a estímulos que o lembram. Evita ativamente dirigir e falar sobre o ocorrido, relata embotamento afetivo, hipervigilância e sobressaltos exagerados. Os sintomas persistem e comprometem seu trabalho.',
      pergunta:'Qual a hipótese diagnóstica mais provável?',
      opts:['Transtorno de Estresse Agudo','Transtorno de Estresse Pós-Traumático','Transtorno de Pânico','Transtorno de Ajustamento'],
      correct:1,
      explicacao:'Exposição a evento traumático seguida de sintomas intrusivos, evitação, alterações de cognição/humor e hiperexcitabilidade por mais de um mês caracteriza o Transtorno de Estresse Pós-Traumático (no Estresse Agudo, a duração é de 3 dias a 1 mês).'
    },
    {
      id:'social',
      patient:{name:'Júlia', age:19, sex:'Feminino', ref:'Procurou o serviço por conta própria', initials:'J'},
      chips:['Medo de ser avaliada', 'Evita falar em público', 'Rubor e tremor', 'Desde a adolescência'],
      vinheta:'Desde a adolescência, Júlia sente medo intenso e persistente de situações sociais em que possa ser avaliada — apresentar trabalhos, falar com desconhecidos ou comer em público. Teme agir de forma humilhante, apresenta rubor, tremor e taquicardia, e evita essas situações ou as suporta com grande sofrimento. O medo é desproporcional e prejudica a vida acadêmica.',
      pergunta:'Qual a hipótese diagnóstica mais provável?',
      opts:['Transtorno de Pânico','Transtorno de Ansiedade Social (Fobia Social)','Transtorno de Ansiedade Generalizada','Transtorno da Personalidade Esquiva'],
      correct:1,
      explicacao:'Medo/ansiedade acentuados e persistentes de situações sociais com possível escrutínio, com esquiva e sofrimento desproporcionais, caracteriza o Transtorno de Ansiedade Social (Fobia Social) (DSM-5-TR).'
    },
    {
      id:'anorexia',
      patient:{name:'Helena', age:17, sex:'Feminino', ref:'Trazida pelos pais', initials:'H'},
      chips:['Restrição alimentar', 'Baixo peso significativo', 'Medo de engordar', 'Distorção da imagem'],
      vinheta:'Helena, trazida pelos pais, apresenta restrição alimentar acentuada e perda de peso significativa, mantendo peso corporal muito abaixo do esperado para idade e estatura. Demonstra medo intenso de ganhar peso mesmo estando abaixo do peso, percebe-se acima do peso (distorção da imagem corporal) e minimiza a gravidade do quadro.',
      pergunta:'Qual a hipótese diagnóstica mais provável?',
      opts:['Bulimia Nervosa','Anorexia Nervosa','Transtorno de Compulsão Alimentar','Transtorno Dismórfico Corporal'],
      correct:1,
      explicacao:'Restrição da ingesta levando a baixo peso significativo, medo intenso de engordar e perturbação na percepção do peso/forma corporal caracterizam a Anorexia Nervosa (DSM-5-TR), distinta da Bulimia (peso geralmente normal, com compensação) e da Compulsão Alimentar (sem compensação).'
    },
    {
      id:'bipolar1',
      patient:{name:'Diego', age:29, sex:'Masculino', ref:'Levado pela família', initials:'D'},
      chips:['Humor eufórico ≈ 1 semana', 'Pouco sono sem cansaço', 'Grandiosidade e gastos', 'Fala acelerada'],
      vinheta:'Há cerca de uma semana, Diego apresenta humor anormalmente eufórico e expansivo, com aumento de energia, redução acentuada da necessidade de sono (sente-se descansado com 2 a 3 horas), autoestima inflada, fala acelerada, fuga de ideias e envolvimento em gastos excessivos e negócios arriscados. O quadro prejudicou seu trabalho e exigiu intervenção. Há relato de episódio depressivo no passado.',
      pergunta:'Qual a hipótese diagnóstica mais provável?',
      opts:['Transtorno Bipolar Tipo II','Transtorno Bipolar Tipo I','Transtorno Ciclotímico','Transtorno Depressivo Maior'],
      correct:1,
      explicacao:'Episódio maníaco (humor elevado + aumento de energia por ≥ 1 semana, com grandiosidade, redução do sono, fuga de ideias e comportamento de risco, causando prejuízo acentuado) define o Transtorno Bipolar Tipo I (DSM-5-TR). No Tipo II ocorre hipomania, sem episódio maníaco pleno.'
    },
    {
      id:'tag',
      patient:{name:'Sônia', age:45, sex:'Feminino', ref:'Procurou o serviço por conta própria', initials:'S'},
      chips:['Preocupação excessiva', '> 6 meses', 'Tensão e insônia', 'Difícil de controlar'],
      vinheta:'Há mais de seis meses, Sônia relata preocupação excessiva e difícil de controlar com diversos aspectos do cotidiano — trabalho, saúde da família, finanças. Acompanha-se de inquietação, fadiga, dificuldade de concentração, irritabilidade, tensão muscular e perturbação do sono. Não há ataques de pânico definidos nem foco em um único objeto ou situação.',
      pergunta:'Qual a hipótese diagnóstica mais provável?',
      opts:['Transtorno de Pânico','Transtorno de Ansiedade Generalizada','Transtorno Obsessivo-Compulsivo','Transtorno de Ansiedade Social (Fobia Social)'],
      correct:1,
      explicacao:'Ansiedade e preocupação excessivas, difíceis de controlar, na maior parte dos dias por ≥ 6 meses, com inquietação, fadiga, tensão muscular e alterações do sono, caracterizam o Transtorno de Ansiedade Generalizada (DSM-5-TR).'
    }
  ];
  function currentCaso(){ return CASOS[(state.casoIndex||0) % CASOS.length]; }


  /* ---------------------------------------------------------
     Conteúdo real (content.js), com fallback aos placeholders
     acima. content.js define window.DSM_CONTENT = {categories,
     flashcards} a partir dos markdowns do DSM-5-TR.
     --------------------------------------------------------- */
  var DATA = (typeof window !== 'undefined' && window.DSM_CONTENT) ? window.DSM_CONTENT : null;
  if (DATA && DATA.categories && DATA.categories.length) CATS = DATA.categories;
  if (DATA && DATA.flashcards && DATA.flashcards.length) FLASHCARDS = DATA.flashcards;

  /* ---------------------------------------------------------
     Camada de dados (db.js / Supabase). Fallback inerte quando
     não configurado: DB.ready=false -> app em modo demonstração.
     --------------------------------------------------------- */
  var DB = (typeof window !== 'undefined' && window.DB) ? window.DB : {
    ready:false,
    onAuth:function(){},
    currentUser:function(){ return Promise.resolve(null); },
    login:function(){ return Promise.resolve({error:{message:''}}); },
    register:function(){ return Promise.resolve({error:{message:''}}); },
    logout:function(){ return Promise.resolve(); },
    getProfile:function(){ return Promise.resolve(null); },
    guest:false,
    setGuest:function(){}
  };

  /* ---------------------------------------------------------
     Ícones SVG (strings)
     --------------------------------------------------------- */
  var ICON = {
    home:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>',
    book:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v14H4z"/><path d="M4 9h16M9 5v14"/></svg>',
    check:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11 3 3 8-8"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    flame:'<svg width="17" height="17" viewBox="0 0 24 24" fill="#FF7A45" stroke="#FF7A45" stroke-width="1.5" style="animation:pulse 2.2s ease-in-out infinite;transform-origin:center;"><path d="M12 2c1 3-1.5 4-1.5 6.5A3.5 3.5 0 0 0 14 12c.5-1 .3-2 .3-2 1.6 1.2 2.7 3 2.7 5.2A5 5 0 0 1 12 20a5 5 0 0 1-5-5c0-3.5 3-5 5-7Z"/></svg>',
    search:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>',
    sun:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.4M12 19.6V22M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2 12h2.4M19.6 12H22M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7"/></svg>',
    moon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
    bell:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
    soundOn:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
    soundOff:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>',
    arrowR:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    back:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>',
    chevR:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C2D0D4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
    chevLsm:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    chevRsm:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',
    chevDown:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    chevLbig:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    redo:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
    redoSm:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
    knowCheck:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    cards:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8590C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>',
    user:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0E4D64" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    info:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0E8A86" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:1px;"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>',
    book2:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0E8A86" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>',
    pencil:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF7A45" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    flameOrange:'<svg width="18" height="18" viewBox="0 0 24 24" fill="#FF7A45" stroke="#FF7A45" stroke-width="1.5" style="animation:pulse 2.2s ease-in-out infinite;transform-origin:center;"><path d="M12 2c1 3-1.5 4-1.5 6.5A3.5 3.5 0 0 0 14 12c.5-1 .3-2 .3-2 1.6 1.2 2.7 3 2.7 5.2A5 5 0 0 1 12 20a5 5 0 0 1-5-5c0-3.5 3-5 5-7Z"/></svg>',
    statBook:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E8A86" stroke-width="2"><path d="M4 5h16v14H4z"/><path d="M4 9h16"/></svg>',
    statCheck:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4361EE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11 3 3 8-8"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    statShield:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06915A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 6v6c0 5 3.4 8 8 10 4.6-2 8-5 8-10V6Z"/><path d="m9 12 2 2 4-4"/></svg>',
    list:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
    trophy:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
    bookOpen:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    message:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    about:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    eye:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    eyeOff:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.9 4.24A9.1 9.1 0 0 1 12 5c6.5 0 10 7 10 7a13 13 0 0 1-1.7 2.7"/><path d="M6.6 6.6A13 13 0 0 0 2 12s3.5 7 10 7a9 9 0 0 0 5.4-1.7"/><path d="M3 3l18 18"/></svg>',
    x:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    sidebar:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/></svg>',
    google:'<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>',
    more:'<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/></svg>',
    logout:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>',
    a11y:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="7.3" r="1.25" fill="currentColor" stroke="none"/><path d="M7 10.2c1.6.8 3.2 1.1 5 1.1s3.4-.3 5-1.1"/><path d="M12 11.3V15l-2 4M12 15l2 4"/></svg>',
    download:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>'
  };

  // ícones dos modos de exercício
  var EX_ICON = {
    flashcards:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF7A45" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>',
    quiz:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4361EE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L20 6"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    ligar:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06915A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
    caso:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8338EC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/></svg>'
  };

  // ícones por TIPO de seção narrativa (títulos do SECTION_MAP). stroke=currentColor herda o tema.
  var SI = function(p){ return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'; };
  var SECTION_ICON = {
    'Subtipos': SI('<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>'),
    'Especificadores': SI('<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>'),
    'Características diagnósticas': SI('<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6M9 16h6"/>'),
    'Características associadas': SI('<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>'),
    'Procedimentos para registro': SI('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/>'),
    'Marcadores diagnósticos': SI('<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>'),
    'Prevalência': SI('<line x1="6" y1="20" x2="6" y2="14"/><line x1="12" y1="20" x2="12" y2="9"/><line x1="18" y1="20" x2="18" y2="4"/>'),
    'Desenvolvimento e curso': SI('<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>'),
    'Fatores de risco e prognóstico': SI('<path d="M12 2 4 6v6c0 5 3.4 8 8 10 4.6-2 8-5 8-10V6Z"/><path d="m9 12 2 2 4-4"/>'),
    'Questões diagnósticas relativas à cultura': SI('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'),
    'Questões diagnósticas relativas ao gênero': SI('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
    'Risco de suicídio': SI('<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'),
    'Consequências funcionais': SI('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>'),
    'Diagnóstico diferencial': SI('<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><path d="M11 18H8a2 2 0 0 1-2-2V9"/>'),
    'Comorbidade': SI('<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>'),
    'Relação com outras classificações': SI('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>')
  };
  function sectionIcon(title){ return SECTION_ICON[title] || ICON.book; }

  var EX_MODES = [
    {key:'flashcards', title:'Flashcards', desc:'Memorize critérios e definições virando os cartões.', chipText:'20 decks', screen:'flashMode', color:'#FF7A45', bg:'#FFEDE3'},
    {key:'quiz', title:'Questionário', desc:'Múltipla escolha com correção imediata.', chipText:'por categoria', screen:'quizMode', color:'#4361EE', bg:'#E8ECFB'},
    {key:'ligar', title:'Classificar transtornos', desc:'Arraste cada transtorno para a categoria certa.', chipText:'5 fases', screen:'ligar', action:'goClassify', color:'#06915A', bg:'#E6F6EE'},
    {key:'caso', title:'Estudo de caso', desc:'Leia a vinheta clínica e escolha o diagnóstico.', chipText:'12 casos', screen:'caso', color:'#8338EC', bg:'#F3E8FB'},
  ];

  /* ---------------------------------------------------------
     Avisos / central de notificações (sino do topo)
     --------------------------------------------------------- */
  var NOTICES = [
    {
      id:'welcome-1',
      icon:'🦆',
      title:'Bem-vindo ao Psico·Pato!',
      body:'Você acabou de abrir o <b>mural de avisos</b> — é aqui no sino 🔔 do topo que aparecem novidades, '
         + 'dicas de estudo e atualizações da plataforma. Comece revisando uma ficha, treine nos exercícios e '
         + 'acompanhe seu progresso e ranking. Bons estudos!',
      when:'Agora há pouco'
    }
  ];
  function notifReadSet(){ try { return JSON.parse(localStorage.getItem('psp-notif-read')) || []; } catch(e){ return []; } }
  function notifUnreadIds(){ var r=notifReadSet(); return NOTICES.filter(function(n){ return r.indexOf(n.id)<0; }).map(function(n){ return n.id; }); }
  function notifUnreadCount(){ return notifUnreadIds().length; }
  function notifMarkAllRead(){ try { localStorage.setItem('psp-notif-read', JSON.stringify(NOTICES.map(function(n){ return n.id; }))); } catch(e){} }

  /* ---------------------------------------------------------
     Estado
     --------------------------------------------------------- */
  var state = {
    screen:'home', activeCat:4, activeDisorder:0, fichaOpen:{},
    deckCat:4, deckAll:null, fcIndex:0, fcFlipped:false,
    quizCat:4, quizKind:'nome', quizSet:null, quizScore:0, quizDone:false,
    quizIndex:0, quizSelected:null, quizAnswered:false,
    classifyPhase:0, classifyBoard:null, classifyPlaced:{}, classifyLocked:{}, classifySel:null,
    classifyChecked:false, classifyPhaseComplete:false, classifyScore:0, classifyTotal:0, classifyDone:false,
    matchLeftSel:null, matches:{},
    casoSelected:null, casoAnswered:false, casoIndex:0, casoScore:0, casoStreak:0,
    lastViewed:null,
    notifOpen:false, notifNew:[], moreOpen:false,
    sideCollapsed:(function(){ try { return localStorage.getItem('psp-side-collapsed')==='1'; } catch(e){ return false; } })(),
    reduced:(function(){ try { return localStorage.getItem('psp-reduced')==='1'; } catch(e){ return false; } })(),
    dark:false,
    auth:{user:null, profile:null, checking:false, error:'', info:'', busy:false, guest:false, loadingMsg:'', form:{}, recovery:false},
    progress:{}, mastered:{}, stats:null, pendingScroll:null,
    rankPeriod:'week', leaderboard:null, rankLoading:false, rankError:false,
    feedback:{tipo:'erro', transtornoId:'', transtornoNome:'', draft:'', sending:false, sent:false, error:''},
    profileDraft:{}, profileMsg:null, profileSaving:false, profileUploading:false,
  };

  // avatares predefinidos (emoji + fundo). Guardado no perfil como "preset:N".
  var PRESET_AVATARS = [
    {e:'🦆', bg:'linear-gradient(135deg,#5BC0BE,#0E4D64)'},
    {e:'🧠', bg:'linear-gradient(135deg,#8338EC,#5B6CF0)'},
    {e:'🦊', bg:'linear-gradient(135deg,#FF8C42,#E8590C)'},
    {e:'🦉', bg:'linear-gradient(135deg,#10B981,#047857)'},
    {e:'🐱', bg:'linear-gradient(135deg,#F59E0B,#D97706)'},
    {e:'🐶', bg:'linear-gradient(135deg,#60A5FA,#2563EB)'},
    {e:'🐢', bg:'linear-gradient(135deg,#34D399,#059669)'},
    {e:'🦋', bg:'linear-gradient(135deg,#A78BFA,#7C3AED)'},
    {e:'🌟', bg:'linear-gradient(135deg,#FBBF24,#F59E0B)'},
    {e:'🌸', bg:'linear-gradient(135deg,#F472B6,#DB2777)'},
    {e:'📚', bg:'linear-gradient(135deg,#38BDF8,#0EA5E9)'},
    {e:'🩺', bg:'linear-gradient(135deg,#2DD4BF,#0D9488)'}
  ];

  var REV_SCREENS = ['categorias','indice','categoria','ficha'];
  var EX_SCREENS  = ['exercicios','flashMode','decks','flashcards','quizMode','quizDecks','quiz','ligar','caso'];

  /* registro de ações (delegação de cliques) */
  var actions = {
    goHome:        function(){ go('home'); },
    goCategorias:  function(){ go('categorias'); },
    goExercicios:  function(){ go('exercicios'); },
    goFlashMode:   function(){ go('flashMode'); },
    goDecks:       function(){ go('decks'); },
    openDeck:      function(ci){ state.deckCat=ci; setState({screen:'flashcards', fcIndex:0, fcFlipped:false}); scrollTop(); },
    flashRandom:   function(){ state.deckAll=shuffle(allCards()); state.deckCat=-1; setState({screen:'flashcards', fcIndex:0, fcFlipped:false}); scrollTop(); },
    goQuizMode:    function(){ go('quizMode'); },
    goQuizDecks:   function(){ go('quizDecks'); },
    quizNomeDecks: function(){ state.quizKind='nome';     go('quizDecks'); },
    quizCritDecks: function(){ state.quizKind='criterio'; go('quizDecks'); },
    openQuizDeck:  function(ci){ state.quizCat=ci; startQuiz(buildQuizSet(state.quizKind, ci)); },
    quizNomeRandom:function(){ state.quizKind='nome';     state.quizCat=-1; startQuiz(buildQuizSet('nome', -1)); },
    quizCritRandom:function(){ state.quizKind='criterio'; state.quizCat=-1; startQuiz(buildQuizSet('criterio', -1)); },
    quizFatosDecks: function(){ state.quizKind='fatos';   go('quizDecks'); },
    quizFatosRandom:function(){ state.quizKind='fatos';    state.quizCat=-1; startQuiz(buildQuizSet('fatos', -1)); },
    quizRandom:    function(){ state.quizKind='nome';     state.quizCat=-1; startQuiz(buildQuizSet('nome', -1)); },
    quizRestart:   function(){ startQuiz(buildQuizSet(state.quizKind, state.quizCat)); },
    goIndice:      function(){ go('indice'); },
    goRanking:     function(){ go('ranking'); loadLeaderboard(); },
    setRankPeriod: function(p){ if(state.rankPeriod===p) return; state.rankPeriod=p; setState({}); loadLeaderboard(); },
    sideMetricNext: function(){ sideMetricIdx = (sideMetricIdx + 1) % sideMetrics().length; paintSideMetric(); resetSideMetricTimer(); },
    sideMetricGo:   function(i){ sideMetricIdx = ((Number(i)||0)) % sideMetrics().length; paintSideMetric(); resetSideMetricTimer(); },
    goDsm:         function(){ go('dsm'); },
    goFeedback:    function(){ var f=state.feedback; f.sent=false; f.error=''; f.transtornoId=''; f.transtornoNome=''; go('feedback'); },
    setFeedbackTipo:function(t){ state.feedback.draft=rawVal('fb-msg'); state.feedback.tipo=t; state.feedback.error=''; render(); },
    clearFeedbackFicha:function(){ state.feedback.draft=rawVal('fb-msg'); state.feedback.transtornoId=''; state.feedback.transtornoNome=''; render(); },
    reportFicha:   function(){ var d=currentDisorder(); var f=state.feedback; f.tipo='erro'; f.transtornoId=d?disorderId(state.activeCat,d):''; f.transtornoNome=d?d.n:''; f.sent=false; f.error=''; f.draft=''; setState({screen:'feedback'}); scrollTop(); },
    // reportar erro a partir de um exercício: marca o transtorno daquele item
    // (questão/cartão) e abre o feedback já vinculado a essa ficha.
    reportExercise:function(arg){ var p=String(arg).split(':'); var ci=+p[0], di=+p[1]; var c=CATS[ci]; var d=c?c.items[di]:null; var f=state.feedback; f.tipo='erro'; f.transtornoId=d?disorderId(ci,d):''; f.transtornoNome=d?d.n:''; f.sent=false; f.error=''; f.draft=''; setState({screen:'feedback'}); scrollTop(); },
    submitFeedback:function(){
      var f=state.feedback; var msg=rawVal('fb-msg').trim(); f.draft=msg;
      if(!msg){ f.error='Escreva sua mensagem antes de enviar.'; render(); return; }
      if(!DB.ready){ f.error='Disponível só com o Supabase configurado.'; render(); return; }
      f.sending=true; f.error=''; render();
      DB.sendFeedback({
        tipo:f.tipo, transtorno_id:f.transtornoId||null, mensagem:msg,
        contexto:{ ficha:f.transtornoNome||null, guest:!!state.auth.guest }
      }).then(function(res){
        f.sending=false;
        if(res && res.error){ f.error='Não foi possível enviar. Tente de novo.'; render(); return; }
        f.sent=true; f.draft=''; f.transtornoId=''; f.transtornoNome=''; render();
      }).catch(function(){ f.sending=false; f.error='Erro de conexão. Tente de novo.'; render(); });
    },
    goSobre:       function(){ go('sobre'); },
    openRef:       function(arg){ var p=String(arg).split(':'); var ci=+p[0], di=+p[1]; setState({screen:'ficha', activeCat:ci, activeDisorder:di, fichaOpen:initOpen(ci,di)}); recordRevised(); scrollTop(); },
    goFlashcards:  function(){ state.deckCat=state.activeCat; setState({screen:'flashcards', fcIndex:0, fcFlipped:false}); scrollTop(); },
    toggleTheme:   function(){ toggleTheme(); },
    setReduced:    function(v){ var r=(v===1||v==='1'); if(r!==state.reduced){ state.reduced=r; try{ localStorage.setItem('psp-reduced', r?'1':'0'); }catch(e){} render(); } },
    openA11y:      function(){ if(window.A11Y && window.A11Y.open) window.A11Y.open(); },
    installPwa:    function(){ var p=window.__pwaPrompt; if(!p) return; state.moreOpen=false; p.prompt(); if(p.userChoice){ p.userChoice.then(function(){ window.__pwaPrompt=null; render(); }); } else { render(); } },
    toggleSound:   function(){ Sound.toggle(); render(); },
    openCat:       function(i){ setState({screen:'categoria', activeCat:i}); scrollTop(); },
    openDisorder:  function(i){ setState({screen:'ficha', activeDisorder:i, fichaOpen:initOpen(state.activeCat, i)}); recordRevised(); scrollTop(); },
    backToCategoria:function(){ setState({screen:'categoria'}); scrollTop(); },
    prevDisorder:  function(){ var c=CATS[state.activeCat]; var i=adjIndex(c, state.activeDisorder, -1); if(i<0) return; setState({activeDisorder:i, fichaOpen:initOpen(state.activeCat, i)}); recordRevised(); scrollTop(); },
    nextDisorder:  function(){ var c=CATS[state.activeCat]; var i=adjIndex(c, state.activeDisorder, +1); if(i<0) return; setState({activeDisorder:i, fichaOpen:initOpen(state.activeCat, i)}); recordRevised(); scrollTop(); },
    toggleSec:     function(i){ var o=Object.assign({}, state.fichaOpen); o[i]=!o[i]; setState({fichaOpen:o}); },
    // flashcards
    flip:    function(){ setState({fcFlipped:!state.fcFlipped}); },
    fcPrev:  function(){ var n=currentDeck().length; if(!n) return; setState({fcIndex:(state.fcIndex-1+n)%n, fcFlipped:false}); },
    fcAgain: function(){ var d=currentDeck(); if(!d.length) return; logExercise('flashcard', false); setState({fcIndex:(state.fcIndex+1)%d.length, fcFlipped:false}); },
    fcKnow:  function(){ var d=currentDeck(); if(!d.length) return; var card=d[state.fcIndex]; logExercise('flashcard', true, card&&card.front); setState({fcIndex:(state.fcIndex+1)%d.length, fcFlipped:false}); },
    // quiz
    quizSelect: function(i){ if(state.quizAnswered || !state.quizSet) return; var q=state.quizSet[state.quizIndex]; var ok=(i===q.correct); if(ok) state.quizScore++; setState({quizSelected:i, quizAnswered:true}); logExercise('quiz', ok, q.opts[q.correct]); },
    quizNext:   function(){ if(!state.quizSet) return; if(state.quizIndex<state.quizSet.length-1) setState({quizIndex:state.quizIndex+1, quizSelected:null, quizAnswered:false}); else { state.quizDone=true; setState({}); } },
    // classificar (arrastar/tocar transtorno -> categoria)
    goClassify:     function(){ state.classifyScore=0; state.classifyTotal=0; state.classifyDone=false; startPhase(0); },
    classifyPick:   function(id){ if(classifyJustDropped) return; id=Number(id); if(state.classifyLocked[id]) return; state.classifySel = (state.classifySel===id ? null : id); setState({}); },
    classifyDrop:   function(binIdx){ if(classifyJustDropped) return; if(state.classifySel==null) return; classifyPlaceImpl(state.classifySel, binIdx); },
    classifyToPool: function(){ if(classifyJustDropped) return; if(state.classifySel==null) return; classifyPlaceImpl(state.classifySel, 'pool'); },
    classifyCheck:  function(){
      var b=state.classifyBoard; if(!b) return;
      var first=!state.classifyChecked, correctNow=0;
      for(var id=0; id<b.pool.length; id++){
        if(state.classifyLocked[id]) continue;
        var bi=state.classifyPlaced[id]; if(bi==null) continue;
        if(b.bins[bi].ci===b.pool[id].ci){ state.classifyLocked[id]=true; correctNow++; }
        else { delete state.classifyPlaced[id]; }
      }
      if(first){ state.classifyScore += correctNow; }
      state.classifyChecked=true;
      if(Object.keys(state.classifyLocked).length===b.pool.length && !state.classifyPhaseComplete){
        state.classifyPhaseComplete=true;
        logExercise('ligar', true, 'fase'+state.classifyPhase);   // domina a fase (1x), som de acerto
      }
      setState({});
    },
    classifyNext:   function(){ if(state.classifyPhase>=CLASSIFY_PHASES.length-1){ state.classifyDone=true; setState({}); } else { startPhase(state.classifyPhase+1); } },
    classifyRestart:function(){ state.classifyScore=0; state.classifyTotal=0; state.classifyDone=false; startPhase(0); },
    // caso
    casoSelect: function(i){ if(state.casoAnswered) return; var ca=currentCaso(); var ok=(i===ca.correct); state.casoScore+= ok?10:0; state.casoStreak= ok?state.casoStreak+1:0; setState({casoSelected:i, casoAnswered:true}); logExercise('caso', ok, ca.id || (ca.patient&&ca.patient.name) || 'caso'); },
    casoNext:   function(){ setState({casoIndex:state.casoIndex+1, casoSelected:null, casoAnswered:false}); scrollTop(); },
  };

  /* ações de autenticação (registradas à parte) */
  actions.togglePass = function(id){
    var inp=document.getElementById(id), btn=document.getElementById(id+'-eye');
    if(!inp) return;
    var show = inp.type==='password';
    inp.type = show ? 'text' : 'password';
    if(btn){ btn.innerHTML = show ? ICON.eyeOff : ICON.eye; btn.title = show?'Ocultar senha':'Mostrar senha'; }
    inp.focus();
  };
  function closeNotifPanel(){ if(state.notifOpen){ notifMarkAllRead(); state.notifOpen=false; state.notifNew=[]; } }
  actions.toggleNotif = function(){
    if(state.notifOpen){ closeNotifPanel(); render(); return; }
    state.notifNew = notifUnreadIds();   // snapshot p/ marcar como "novo" no painel
    state.notifOpen = true; render();
  };
  actions.closeNotif = function(){ closeNotifPanel(); render(); };
  actions.toggleSidebar = function(){
    var v = !state.sideCollapsed;
    try { localStorage.setItem('psp-side-collapsed', v?'1':'0'); } catch(e){}
    setState({sideCollapsed:v});
  };
  // voltar: delega ao histórico do navegador (dispara popstate -> navPop)
  actions.goBack = function(){ if(navStack.length){ window.history.back(); } };
  actions.toggleMore = function(){ state.moreOpen = !state.moreOpen; render(); };
  actions.closeMore  = function(){ if(state.moreOpen){ state.moreOpen=false; render(); } };
  actions.loginGoogle = function(){
    if(!DB.ready || !DB.loginGoogle){ state.auth.error='Login com Google indisponível no momento.'; render(); return; }
    state.auth.error=''; state.auth.info='';
    state.auth.busy=true; state.auth.loadingMsg='Conectando ao Google…'; render();
    DB.loginGoogle().then(function(res){
      // sucesso: o navegador é redirecionado ao Google; a volta dispara onAuth.
      if(res && res.error){ state.auth.busy=false; state.auth.error=traduzErro(res.error); render(); }
    }).catch(function(){ state.auth.busy=false; state.auth.error='Não foi possível iniciar o login com Google.'; render(); });
  };
  actions.goWelcome  = function(){ state.auth.error=''; state.auth.info=''; setState({screen:'welcome'}); };
  actions.goLogin    = function(){ state.auth.error=''; state.auth.info=''; setState({screen:'login'}); };
  actions.goForgot   = function(){ state.auth.error=''; state.auth.info=''; setState({screen:'forgot'}); };
  actions.submitForgot = function(){
    var email=val('forgot-email'); state.auth.form['forgot-email']=email;
    state.auth.error=''; state.auth.info='';
    if(!email){ state.auth.error='Informe o e-mail da sua conta.'; render(); return; }
    if(!DB.ready || !DB.resetPassword){ state.auth.error='Recuperação indisponível no momento.'; render(); return; }
    state.auth.busy=true; render();
    DB.resetPassword(email).then(function(res){
      state.auth.busy=false;
      if(res && res.error){ state.auth.error=traduzErro(res.error); render(); return; }
      // mensagem neutra (não revela se o e-mail existe)
      state.auth.info='Se houver uma conta com esse e-mail, enviamos um link para redefinir a senha. Confira sua caixa de entrada e o spam.';
      render();
    }).catch(function(){ state.auth.busy=false; state.auth.error='Não foi possível enviar o e-mail. Tente novamente.'; render(); });
  };
  actions.submitNewPassword = function(){
    var p1=rawVal('rp-pass'), p2=rawVal('rp-pass2');
    state.auth.error=''; state.auth.info='';
    if(!p1 || p1.length<6){ state.auth.error='A senha precisa de ao menos 6 caracteres.'; render(); return; }
    if(p1!==p2){ state.auth.error='As senhas não conferem.'; render(); return; }
    state.auth.busy=true; state.auth.loadingMsg='Salvando nova senha…'; render();
    DB.updatePassword(p1).then(function(res){
      if(res && res.error){ state.auth.busy=false; state.auth.error=traduzErro(res.error); render(); return; }
      // sucesso: encerra a recuperação e entra no app
      state.auth.recovery=false; state.auth.busy=false; state.auth.error=''; state.auth.info='';
      try{ window.history.replaceState(null,'',window.location.pathname+window.location.search); }catch(e){}
      applySession(state.auth.user);
    }).catch(function(){ state.auth.busy=false; state.auth.error='Não foi possível salvar a senha. Tente novamente.'; render(); });
  };
  /* ---- perfil (apelido + avatar) ---- */
  actions.goPerfil = function(){
    var p = state.auth.profile || {};
    state.profileDraft = { apelido:p.apelido||'', nome:p.nome||'', curso:p.curso||'', semestre:p.semestre||'', instituicao:p.instituicao||'', avatar:p.avatar||'' };
    state.profileMsg=null; state.profileSaving=false; state.profileUploading=false;
    setState({screen:'perfil'}); scrollTop();
  };
  actions.pickPreset = function(i){ state.profileDraft.avatar='preset:'+i; state.profileMsg=null; render(); };
  actions.useGooglePhoto = function(){ var g=googlePhoto(); if(g){ state.profileDraft.avatar=g; state.profileMsg=null; render(); } };
  actions.removeAvatar = function(){ state.profileDraft.avatar=''; render(); };
  actions.triggerAvatarUpload = function(){ var el=document.getElementById('avatar-file'); if(el) el.click(); };
  actions.avatarFileChosen = function(file){
    if(!file) return;
    if(!/^image\//.test(file.type||'')){ state.profileMsg={type:'err',text:'Selecione um arquivo de imagem.'}; render(); return; }
    if(file.size > 3*1024*1024){ state.profileMsg={type:'err',text:'Imagem muito grande (máx. 3 MB).'}; render(); return; }
    if(!DB.uploadAvatar){ state.profileMsg={type:'err',text:'Upload indisponível (faça login).'}; render(); return; }
    state.profileUploading=true; state.profileMsg=null; render();
    DB.uploadAvatar(file).then(function(res){
      state.profileUploading=false;
      if(res && res.url){ state.profileDraft.avatar=res.url; state.profileMsg={type:'ok',text:'Foto enviada. Clique em “Salvar alterações” para confirmar.'}; }
      else { state.profileMsg={type:'err',text:'Falha no upload. Verifique se o bucket “avatars” foi criado no Supabase.'}; }
      render();
    }).catch(function(){ state.profileUploading=false; state.profileMsg={type:'err',text:'Falha no upload da imagem.'}; render(); });
  };
  actions.saveProfile = function(){
    var d = state.profileDraft || {};
    d.apelido=rawVal('pf-apelido').trim(); d.nome=rawVal('pf-nome').trim();
    d.curso=rawVal('pf-curso').trim(); d.semestre=rawVal('pf-sem').trim(); d.instituicao=rawVal('pf-inst').trim();
    if(!DB.updateProfile){ state.profileMsg={type:'err',text:'Salvar indisponível (faça login).'}; render(); return; }
    state.profileSaving=true; state.profileMsg=null; render();
    DB.updateProfile({apelido:d.apelido, nome:d.nome, curso:d.curso, semestre:d.semestre, instituicao:d.instituicao, avatar:d.avatar}).then(function(res){
      state.profileSaving=false;
      if(res && res.error){ state.profileMsg={type:'err',text:'Não foi possível salvar. Tente novamente.'}; render(); return; }
      state.auth.profile = Object.assign({}, state.auth.profile, (res&&res.data) || {apelido:d.apelido,nome:d.nome,curso:d.curso,semestre:d.semestre,instituicao:d.instituicao,avatar:d.avatar});
      state.profileMsg={type:'ok',text:'Perfil atualizado!'};
      render();
    }).catch(function(){ state.profileSaving=false; state.profileMsg={type:'err',text:'Erro ao salvar o perfil.'}; render(); });
  };
  actions.goRegister = function(){ state.auth.error=''; state.auth.info=''; setState({screen:'register'}); };
  actions.logout     = function(){ if(DB.ready) DB.logout(); };
  actions.submitLogin = function(){
    var email=val('auth-email'), pass=rawVal('auth-pass');
    state.auth.form['auth-email']=email; state.auth.form['auth-pass']=pass;   // preserva se der erro
    state.auth.error=''; state.auth.info='';
    if(!email||!pass){ state.auth.error='Preencha e-mail e senha.'; render(); return; }
    state.auth.busy=true; state.auth.loadingMsg='Entrando…'; render();
    DB.login(email,pass).then(function(res){
      if(res && res.error){ state.auth.busy=false; state.auth.error=traduzErro(res.error); render(); return; }
      /* sucesso: mantém o loader; onAuth -> applySession carrega o app e encerra o busy */
    }).catch(function(){ state.auth.busy=false; state.auth.error='Erro de conexão. Tente de novo.'; render(); });
  };
  actions.submitRegister = function(){
    var nome=val('reg-nome'), curso=val('reg-curso'), sem=val('reg-sem'), inst=val('reg-inst');
    var email=val('reg-email'), pass=rawVal('reg-pass');
    var f=state.auth.form;
    f['reg-nome']=nome; f['reg-curso']=curso; f['reg-sem']=sem; f['reg-inst']=inst; f['reg-email']=email; f['reg-pass']=pass;
    state.auth.error=''; state.auth.info='';
    if(!nome||!email||!pass){ state.auth.error='Preencha nome, e-mail e senha.'; render(); return; }
    if(pass.length<6){ state.auth.error='A senha precisa de ao menos 6 caracteres.'; render(); return; }
    state.auth.busy=true; state.auth.loadingMsg='Criando sua conta…'; render();
    DB.register(email,pass,{nome:nome,curso:curso,semestre:sem,instituicao:inst}).then(function(res){
      if(res && res.error){ state.auth.busy=false; state.auth.error=traduzErro(res.error); render(); return; }
      if(res && res.data && res.data.session){ /* já logado: mantém o loader; onAuth -> applySession */ }
      else { state.auth.busy=false; state.auth.info='Conta criada! Confirme pelo link no seu e-mail e depois entre.'; setState({screen:'login'}); }
    }).catch(function(){ state.auth.busy=false; state.auth.error='Erro de conexão. Tente de novo.'; render(); });
  };
  actions.enterGuest = function(){
    DB.setGuest(true); state.auth.guest=true;
    state.auth.error=''; state.auth.info='';
    setState({screen:'home'}); scrollTop();
    loadUserData().then(render);
  };
  actions.guestToRegister = function(){
    DB.setGuest(false); state.auth.guest=false;
    state.auth.error=''; state.auth.info='';
    setState({screen:'register'}); scrollTop();
  };

  /* ações da ficha (seções + códigos + revisão) */
  actions.expandAll = function(){
    var secs=(currentDisorder()||{}).sections||[]; var o={};
    secs.forEach(function(_,i){ o[i]=true; }); setState({fichaOpen:o});
  };
  actions.collapseAll = function(){ setState({fichaOpen:{}}); };
  actions.jumpToSection = function(i){
    var o=Object.assign({}, state.fichaOpen); o[i]=true;
    state.pendingScroll=secId(i); setState({fichaOpen:o});
  };
  actions.copyCode = function(arg){ copyToClipboard(String(arg)); };
  actions.toggleRevised = function(){
    if(!tracking()) return;
    var d=currentDisorder(); if(!d) return;
    var id=disorderId(state.activeCat, d);
    if(state.progress[id]){
      delete state.progress[id];
      if(DB.unmarkRevised) DB.unmarkRevised(id).then(refreshStats).catch(function(){});
      render();
    } else { recordRevised(); }
  };

  function go(screen){ setState({screen:screen}); scrollTop(); }
  function scrollTop(){ try{ window.scrollTo(0,0); }catch(e){} }

  /* ---------------------------------------------------------
     Progresso e métricas (lê/grava via DB — Supabase ou,
     no modo visitante, localStorage). Quando o banco não está
     configurado (DB.ready=false), usa os valores ilustrativos.
     --------------------------------------------------------- */
  function tracking(){ return DB.ready; }   // true p/ logado OU visitante
  function currentDisorder(){ var c=CATS[state.activeCat]; return c ? (c.items[state.activeDisorder] || c.items[0]) : null; }
  function secId(i){ return 'fsec-'+i; }
  function initOpen(catIdx, disIdx){
    return {};   // fichas iniciam com todas as seções colapsadas
  }

  /* ---------------------------------------------------------
     Efeitos sonoros (sintetizados via Web Audio — sem arquivos).
     Tons curtos e suaves; mudo persistido em localStorage.
     --------------------------------------------------------- */
  var Sound = (function(){
    var ctx = null, enabled = true;
    try { enabled = localStorage.getItem('dsm-sound') !== 'off'; } catch(e){}
    function ac(){
      if(ctx) return ctx;
      try { var AC = window.AudioContext || window.webkitAudioContext; ctx = AC ? new AC() : null; }
      catch(e){ ctx = null; }
      return ctx;
    }
    function tone(c, freq, start, dur, type, gain){
      var t0 = c.currentTime + start;
      var osc = c.createOscillator(), g = c.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(gain || 0.12, t0 + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g); g.connect(c.destination);
      osc.start(t0); osc.stop(t0 + dur + 0.03);
    }
    function play(notes){
      if(!enabled) return;
      var c = ac(); if(!c) return;
      if(c.state === 'suspended'){ try{ c.resume(); }catch(e){} }
      notes.forEach(function(n){ tone(c, n.f, n.t||0, n.d||0.15, n.type, n.g); });
    }
    return {
      isOn:    function(){ return enabled; },
      toggle:  function(){ enabled = !enabled; try{ localStorage.setItem('dsm-sound', enabled?'on':'off'); }catch(e){} if(enabled) this.xp(); return enabled; },
      // "+XP" / revisão: blip curtinho ascendente
      xp:      function(){ play([{f:880,t:0,d:.12,type:'triangle',g:.09},{f:1318.5,t:.07,d:.16,type:'triangle',g:.09}]); },
      revise:  function(){ play([{f:587.3,t:0,d:.10,type:'sine',g:.10},{f:880,t:.06,d:.16,type:'sine',g:.10}]); },
      // acerto: terça maior ascendente; erro: queda grave suave
      correct: function(){ play([{f:659.3,t:0,d:.12,type:'sine',g:.12},{f:987.8,t:.09,d:.20,type:'sine',g:.12}]); },
      wrong:   function(){ play([{f:233.1,t:0,d:.16,type:'sine',g:.10},{f:185,t:.11,d:.24,type:'sine',g:.10}]); },
      // level up: arpejo C–E–G–C
      levelUp: function(){ play([{f:523.3,t:0,d:.14,type:'triangle',g:.11},{f:659.3,t:.10,d:.14,type:'triangle',g:.11},{f:784,t:.20,d:.14,type:'triangle',g:.11},{f:1046.5,t:.30,d:.34,type:'triangle',g:.12}]); }
    };
  })();

  function showToast(msg){
    try{
      var t=document.createElement('div');
      t.textContent=msg;
      t.style.cssText='position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:var(--ink);color:var(--bg);font:700 13px \'Hanken Grotesk\';padding:10px 16px;border-radius:10px;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,.25);animation:fadeUp .2s ease both;';
      document.body.appendChild(t);
      setTimeout(function(){ try{ document.body.removeChild(t); }catch(e){} }, 1300);
    }catch(e){}
  }
  function copyToClipboard(text){
    function done(){ showToast('Código copiado'); }
    function fallback(){
      try{
        var ta=document.createElement('textarea'); ta.value=text;
        ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta);
        ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
        done();
      }catch(e){}
    }
    try{
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(done).catch(fallback);
      } else fallback();
    }catch(e){ fallback(); }
  }
  function disorderId(catIndex, d){ return catIndex + '::' + (d.n || ''); }
  // localiza {ci,di} de um transtorno pelo nome (usado p/ "ver ficha" nos exercícios)
  function findRef(name){
    if(!name) return null;
    var noParen = function(s){ return String(s).trim().toLowerCase().replace(/\s*\([^)]*\)/g,'').trim(); };
    var key = String(name).trim().toLowerCase(), keyNP = noParen(name);
    for(var ci=0; ci<CATS.length; ci++){
      var items = CATS[ci].items || [];
      for(var di=0; di<items.length; di++){
        var nm = String(items[di].n||'').trim().toLowerCase();
        if(nm === key || noParen(nm) === keyNP) return {ci:ci, di:di};  // tolera parêntese (ex.: "(Fobia Social)" na TR)
      }
    }
    return null;
  }
  // botão "ver ficha completa" para abrir a ficha no meio de uma atividade
  // (o histórico/#voltar preserva o estado do exercício ao retornar).
  function fichaPeekBtn(ci, di, label){
    if(ci==null || di==null) return '';
    return '<button data-action="openRef" data-arg="'+ci+':'+di+'" class="ficha-peek" data-hover="border-color:var(--teal-text);color:var(--teal-text);">'+ICON.book+'<span>'+esc(label||'Ver ficha completa')+'</span></button>';
  }
  // "Reportar erro" de um exercício -> feedback já vinculado àquela ficha
  function reportErroBtn(ci, di){
    if(ci==null || di==null) return '';
    return '<button data-action="reportExercise" data-arg="'+ci+':'+di+'" class="ficha-peek" data-hover="border-color:#C2410C;color:#C2410C;">'+ICON.message+'<span>Reportar erro</span></button>';
  }
  function isRevised(catIndex, d){ return !!state.progress[disorderId(catIndex, d)]; }
  function totalDisorders(){ return CATS.reduce(function(s,c){ return s + (c.items ? c.items.length : 0); }, 0); }
  function totalRevised(){ return Object.keys(state.progress).length; }
  function catRevisedCount(catIndex){
    var c = CATS[catIndex]; if(!c || !c.items) return 0;
    var n = 0; c.items.forEach(function(d){ if(isRevised(catIndex, d)) n++; }); return n;
  }
  // nº de atividades (itens dominados) de um tipo, por categoria — 1 passada sobre state.mastered
  function activityCountsByCat(tipo){
    var arr = CATS.map(function(){ return 0; });
    if(!tracking()) return arr;
    var pre = tipo + ':';
    Object.keys(state.mastered || {}).forEach(function(k){
      if(k.indexOf(pre) !== 0) return;
      var r = findRef(k.slice(pre.length));
      if(r) arr[r.ci]++;
    });
    return arr;
  }
  function catProgress(catIndex){
    var c = CATS[catIndex]; if(!c) return 0;
    if(tracking()){ var t = c.items.length || 1; return catRevisedCount(catIndex) / t; }
    return c.prog || 0;
  }
  function greetName(){
    if(!tracking()) return 'Ana';
    if(state.auth.guest) return '';
    var p = state.auth.profile || {};
    var nome = p.apelido || p.nome || '';   // apelido tem prioridade
    return nome.split(/\s+/)[0] || '';
  }
  // nome de exibição (apelido > nome). Fallback demo p/ modo não logado.
  function displayName(){
    if(!tracking()) return 'Ana Souza';
    var p = state.auth.profile || {};
    return p.apelido || p.nome || '';
  }
  // foto vinda do provedor social (Google), se houver.
  function googlePhoto(){
    var m = (state.auth.user && state.auth.user.user_metadata) || {};
    return m.avatar_url || m.picture || '';
  }
  function initialsOf(name){
    return (name||'').split(/\s+/).filter(Boolean).slice(0,2).map(function(w){return w.charAt(0).toUpperCase();}).join('') || '·';
  }
  // monta o HTML de um avatar circular a partir de um valor de avatar
  // ("http..." = imagem | "preset:N" = predefinido | vazio = Google/iniciais).
  function avatarHtml(av, name, size, fallbackPhoto){
    av = av || '';
    var box = 'width:'+size+'px;height:'+size+'px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;overflow:hidden;';
    if(/^https?:/.test(av)){
      return '<div style="'+box+'background:var(--surface-2);"><img src="'+esc(av)+'" alt="" style="width:100%;height:100%;object-fit:cover;display:block;"></div>';
    }
    var m = /^preset:(\d+)$/.exec(av);
    if(m){
      var pa = PRESET_AVATARS[+m[1]] || PRESET_AVATARS[0];
      return '<div style="'+box+'background:'+pa.bg+';font-size:'+Math.round(size*0.52)+'px;line-height:1;">'+pa.e+'</div>';
    }
    if(fallbackPhoto){
      return '<div style="'+box+'background:var(--surface-2);"><img src="'+esc(fallbackPhoto)+'" alt="" style="width:100%;height:100%;object-fit:cover;display:block;"></div>';
    }
    return '<div style="'+box+'background:linear-gradient(135deg,#5BC0BE,#0E4D64);color:#fff;font:700 '+Math.round(size*0.4)+'px \'Hanken Grotesk\';">'+esc(initialsOf(name))+'</div>';
  }
  // avatar do usuário atual (perfil salvo); cai na foto do Google e depois nas iniciais.
  function userAvatar(size){
    var p = state.auth.profile || {};
    return avatarHtml(p.avatar, displayName(), size, googlePhoto());
  }
  function todayLabel(){
    try{
      var s = new Date().toLocaleDateString('pt-BR', {weekday:'long', day:'numeric', month:'long'});
      return s.charAt(0).toUpperCase() + s.slice(1);
    }catch(e){ return ''; }
  }
  function setLastViewed(){
    var cat = CATS[state.activeCat]; if(!cat || !cat.items[state.activeDisorder]) return;
    state.lastViewed = { cat: state.activeCat, dis: state.activeDisorder };
    try{ localStorage.setItem('dsm-last-viewed', state.activeCat+':'+state.activeDisorder); }catch(e){}
  }
  function recordRevised(){
    setLastViewed();                          // "continue de onde parou"
    if(!tracking()) return;
    var cat = CATS[state.activeCat]; if(!cat) return;
    var d = cat.items[state.activeDisorder]; if(!d) return;
    var id = disorderId(state.activeCat, d);
    if(state.progress[id]) return;          // já revisado
    state.progress[id] = true;
    Sound.revise();
    render();                               // reflete já na sidebar/listas
    DB.markRevised(id).then(refreshStats).catch(function(){});
  }
  // XP por DOMÍNIO: cada item (modo+transtorno) pontua só na 1ª vez que é acertado.
  // Repetir vira prática (só som, sem XP); errar não pontua. Isso impede o farm de XP.
  function masteryKey(tipo, item){ return tipo + ':' + (item || '?'); }
  function logExercise(tipo, acerto, item){
    // som de feedback (também em modo demo); flashcard "Não sei" fica sem som
    if(tipo==='flashcard'){ if(acerto) Sound.correct(); }
    else { acerto ? Sound.correct() : Sound.wrong(); }
    if(!tracking()) return;
    if(!acerto) return;                       // erro não dá XP
    var key = masteryKey(tipo, item);
    if(state.mastered[key]) return;           // já dominado -> repetir não dá XP
    state.mastered[key] = true;
    DB.logEvent(tipo, acerto, key).then(refreshStats).catch(function(){});
  }
  function refreshStats(){
    if(!tracking()) return Promise.resolve();
    var prevXP = userXP();                 // XP antes da ação (state.stats atual)
    var prevLevel = levelForXP(prevXP);
    return DB.getStats().then(function(s){
      state.stats = s;
      setMasteredFrom(s.mastered);
      var newXP = userXP();
      var delta = newXP - prevXP;           // ganho real (ficha/exercício/acerto/dia ativo)
      render();
      if(delta > 0) showXpGain(delta);
      if(levelForXP(newXP) > prevLevel) Sound.levelUp();   // subiu de nível
    }).catch(function(){});
  }
  // "+X XP" flutuante perto do contador de XP da topbar
  function showXpGain(amount){
    try{
      var el = document.createElement('div');
      el.className = 'xp-pop';
      el.textContent = '+'+amount+' XP';
      var pill = document.getElementById('xp-pill');
      if(pill){
        var r = pill.getBoundingClientRect();
        el.style.left = (r.left + r.width/2) + 'px';
        el.style.top  = (r.bottom + 7) + 'px';
        pill.classList.add('xp-bump');
        setTimeout(function(){ try{ pill.classList.remove('xp-bump'); }catch(e){} }, 600);
      } else {
        el.style.right = '40px'; el.style.top = '66px';
      }
      document.body.appendChild(el);
      setTimeout(function(){ try{ document.body.removeChild(el); }catch(e){} }, 1500);
    }catch(e){}
  }
  function loadUserData(){
    if(!tracking()){ return Promise.resolve(); }
    return Promise.all([DB.getProgress(), DB.getStats()]).then(function(res){
      var prog = {}; (res[0] || []).forEach(function(row){ prog[row.transtorno_id] = true; });
      state.progress = prog;
      state.stats = res[1] || {revisados:0, exercicios:0, taxa:0, streak:0};
      state.mastered = {}; setMasteredFrom(state.stats.mastered);
      if(canRank() && !state.leaderboard) loadLeaderboard();   // popula o card de Ranking da sidebar
    }).catch(function(){ state.progress = {}; state.mastered = {}; state.stats = {revisados:0, exercicios:0, taxa:0, streak:0}; });
  }
  function setMasteredFrom(arr){ var m=state.mastered||{}; (arr||[]).forEach(function(k){ m[k]=true; }); state.mastered=m; }
  // nº de transtornos distintos dominados (ignora o prefixo do modo) e % de domínio do conteúdo
  function masteredDisorders(){ var o={}; Object.keys(state.mastered||{}).forEach(function(k){ var i=k.indexOf(':'); var n=i>=0?k.slice(i+1):k; if(n&&n!=='?') o[n]=1; }); return Object.keys(o).length; }
  function dominioPct(){ var tot=allCards().length; if(!tot) return 0; return Math.min(100, Math.round(masteredDisorders()/tot*100)); }

  /* ---------------------------------------------------------
     XP, NÍVEIS e MEDALHAS (gamificação)
     XP é derivado das stats (mesmos pesos do gamification.sql).
     Curva de nível progressiva: para chegar ao nível N são
     necessários 100·(N-1)² de XP acumulado.
     --------------------------------------------------------- */
  // stats normalizadas p/ cálculo de XP (preenche acertos/ativos no modo demo)
  function statsForXP(){
    var st = tracking() ? (state.stats || {}) : {revisados:38, exercicios:154, taxa:87, streak:12};
    var acertos = (st.acertos != null) ? st.acertos : Math.round((st.exercicios||0)*(st.taxa||0)/100);
    var ativos  = (st.ativos  != null) ? st.ativos  : (st.streak||0);
    return {
      revisados:st.revisados||0, exercicios:st.exercicios||0,
      acertos:acertos, ativos:ativos, streak:st.streak||0, taxa:st.taxa||0
    };
  }
  function userXP(){ return DB.xpFromCounts ? DB.xpFromCounts(statsForXP()) : 0; }
  function levelForXP(xp){ return Math.floor(Math.sqrt((xp||0)/100)) + 1; }
  function xpForLevel(L){ return 100 * (L-1) * (L-1); }
  function levelInfo(xp){
    xp = xp || 0;
    var L = levelForXP(xp);
    var base = xpForLevel(L), next = xpForLevel(L+1), span = next - base, into = xp - base;
    return { level:L, xp:xp, base:base, next:next, span:span, into:into,
             toNext: Math.max(0, next - xp), pct: span ? Math.min(100, Math.round(into/span*100)) : 0 };
  }
  // título por faixa de nível (só decorativo)
  function levelTitle(L){
    if(L >= 20) return 'Mestre do DSM';
    if(L >= 12) return 'Especialista';
    if(L >= 8)  return 'Clínico';
    if(L >= 5)  return 'Residente';
    if(L >= 3)  return 'Estagiário';
    return 'Calouro';
  }

  // Catálogo de medalhas. `stat` é a métrica e `goal` o limiar p/ desbloquear.
  var MEDALS = [
    {id:'ficha-1',   emoji:'📖', title:'Primeiros passos',  desc:'Revise sua primeira ficha', stat:'revisados',  goal:1,   bg:'#E3F3F2'},
    {id:'ficha-10',  emoji:'📚', title:'Estudante dedicado',desc:'Revise 10 fichas',          stat:'revisados',  goal:10,  bg:'#E3F3F2'},
    {id:'ficha-50',  emoji:'🎓', title:'Erudito',           desc:'Revise 50 fichas',          stat:'revisados',  goal:50,  bg:'#E6F6EE'},
    {id:'ex-10',     emoji:'✏️', title:'Aquecendo',         desc:'Faça 10 exercícios',        stat:'exercicios', goal:10,  bg:'#FFEDE3'},
    {id:'ex-100',    emoji:'🧠', title:'Mente afiada',      desc:'Faça 100 exercícios',       stat:'exercicios', goal:100, bg:'#F3E8FB'},
    {id:'acerto-50', emoji:'🎯', title:'Pontaria',          desc:'Acerte 50 exercícios',      stat:'acertos',    goal:50,  bg:'#E6F6EE'},
    {id:'streak-3',  emoji:'🌱', title:'Criando hábito',    desc:'3 dias de streak',          stat:'streak',     goal:3,   bg:'#E6F6EE'},
    {id:'streak-7',  emoji:'🔥', title:'Em chamas',         desc:'7 dias de streak',          stat:'streak',     goal:7,   bg:'#FFEDE3'},
    {id:'streak-30', emoji:'⚡', title:'Imparável',         desc:'30 dias de streak',         stat:'streak',     goal:30,  bg:'#E8ECFB'},
    {id:'ativo-30',  emoji:'📅', title:'Presença',          desc:'30 dias ativos',            stat:'ativos',     goal:30,  bg:'#E8ECFB'},
  ];
  function computeMedals(){
    var st = statsForXP();
    var all = MEDALS.map(function(m){
      var cur = st[m.stat] || 0;
      var pct = Math.min(100, Math.round(cur / m.goal * 100));
      return Object.assign({}, m, { cur:cur, done: cur >= m.goal, pct:pct });
    });
    var earned = all.filter(function(m){ return m.done; });
    var locked = all.filter(function(m){ return !m.done; })
                    .sort(function(a,b){ return b.pct - a.pct; });
    return { all:all, earned:earned, locked:locked };
  }

  /* ---------------------------------------------------------
     Ranking (leaderboard) — carrega via RPC do Supabase
     --------------------------------------------------------- */
  function canRank(){ return DB.ready && state.auth.user && !state.auth.guest; }
  function loadLeaderboard(){
    if(!canRank()){ return; }
    var period = state.rankPeriod;
    state.rankLoading = true; state.rankError = false; render();
    DB.getLeaderboard(period).then(function(rows){
      if(state.rankPeriod !== period) return;   // troca de aba durante o fetch
      state.rankLoading = false;
      if(rows === null){ state.rankError = true; state.leaderboard = null; }
      else { state.leaderboard = rows; }
      render();
    }).catch(function(){
      if(state.rankPeriod !== period) return;
      state.rankLoading = false; state.rankError = true; render();
    });
  }

  /* ---------------------------------------------------------
     Tema
     --------------------------------------------------------- */
  function applyTheme(dark){ try{ document.documentElement.setAttribute('data-theme', dark?'dark':'light'); }catch(e){} }
  function toggleTheme(){
    var d=!state.dark; state.dark=d; applyTheme(d);
    try{ localStorage.setItem('dsm-theme', d?'dark':'light'); }catch(e){}
    render();
  }

  /* ---------------------------------------------------------
     setState + render + histórico de navegação (voltar)
     --------------------------------------------------------- */
  // chaves que definem "em que página/contexto estou" (p/ restaurar no voltar)
  var NAV_KEYS = ['screen','activeCat','activeDisorder','deckCat','quizCat'];
  var AUTH_SCREENS = ['welcome','login','register','forgot'];
  var navStack = [];          // pilha de snapshots das telas anteriores
  var navRestoring = false;   // true durante a restauração (evita re-empilhar)
  function navSnapshot(){ var s={}; for(var i=0;i<NAV_KEYS.length;i++){ s[NAV_KEYS[i]]=state[NAV_KEYS[i]]; } return s; }
  // restaura a tela anterior — acionado pelo back do navegador (popstate) e pelo botão da UI
  function navPop(){
    if(!navStack.length) return false;
    var snap = navStack.pop();
    navRestoring = true;
    state.notifOpen = false;
    Object.assign(state, snap);
    render();
    navRestoring = false;
    scrollTop();
    return true;
  }

  function setState(patch){
    if(patch && patch.screen && patch.screen !== state.screen){
      state.moreOpen = false;   // fecha o menu "Mais" (mobile) ao navegar
      var toAuth   = AUTH_SCREENS.indexOf(patch.screen) >= 0;
      var fromAuth = AUTH_SCREENS.indexOf(state.screen) >= 0;
      if(toAuth){ navStack = []; }                    // entrar no login/cadastro zera o histórico
      else if(!navRestoring && !fromAuth){            // navegação "para frente" entre telas do app
        navStack.push(navSnapshot());
        if(navStack.length > 60) navStack.shift();
        try { window.history.pushState({psp:1}, ''); } catch(e){}
      }
    }
    Object.assign(state, patch);
    render();
  }

  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  // preserva quebras de linha (critérios com sub-itens) como <br>
  function escMl(s){ return esc(s).replace(/\n/g,'<br>'); }
  // separa um rótulo de especificador em {código, nome}: ex.:
  // "315.00 (F81.0) Com prejuízo na leitura" -> {code:"315.00 (F81.0)", name:"Com prejuízo na leitura"}
  function splitSpecLabel(label){
    var s = String(label||'').trim();
    var m = s.match(/^((?:\d{3}(?:\.\d+)?\s*)?\([A-Z]\d[\w.]*\)|[A-Z]\d{2}(?:\.[A-Za-z0-9]+)?)\s+(.+)$/);
    if(m){ return {code:m[1].replace(/\s+/g,' ').trim(), name:m[2].trim()}; }
    return {code:'', name:s};
  }
  // pequeno helper de letra A, B, C...
  function letter(i){ return String.fromCharCode(65+i); }

  /* =========================================================
     SIDEBAR
     ========================================================= */
  /* =========================================================
     DICIONÁRIO de termos que o tradutor automático erra.
     O termo é marcado com class="notranslate" (o Google não traduz)
     e nós aplicamos a tradução correta conforme o idioma ativo.
     Para adicionar: inclua a chave em TR_DICT com pt/en/es/fr/it/ht/de.
     ========================================================= */
  // ⚠️ revisar as colunas ht (Crioulo Haitiano) com um falante.
  var TR_DICT = {
    sobre:      {pt:'Sobre',       en:'About',         es:'Acerca de',     fr:'À propos',     it:'Informazioni', ht:'Konsènan',     de:'Über'},
    mais:       {pt:'Mais',        en:'More',          es:'Más',           fr:'Plus',         it:'Altro',        ht:'Plis',         de:'Mehr'},
    visaoGeral: {pt:'Visão geral', en:'Overview',      es:'Resumen',       fr:'Aperçu',       it:'Panoramica',   ht:'Apèsi',        de:'Übersicht'},
    cid10:      {pt:'CID-10',      en:'ICD-10',        es:'CIE-10',        fr:'CIM-10',       it:'ICD-10',       ht:'CIM-10',       de:'ICD-10'},
    som:        {pt:'Som',         en:'Sound',         es:'Sonido',        fr:'Son',          it:'Audio',        ht:'Son',          de:'Ton'},
    avisos:     {pt:'Avisos',      en:'Notifications', es:'Notificaciones',fr:'Notifications',it:'Notifiche',    ht:'Notifikasyon', de:'Mitteilungen'},
  };
  function activeLang(){
    try{ var m = document.cookie.match(/googtrans=\/[a-z]+\/([a-z-]+)/); if(m && m[1]) return m[1]; }catch(e){}
    try{ return localStorage.getItem('psp-a11y-lang') || 'pt'; }catch(e){}
    return 'pt';
  }
  function noTr(key, txt){ return '<span class="notranslate" data-tr="'+key+'">'+esc(txt)+'</span>'; }   // termo com tradução fixa nossa
  function keepTr(txt){ return '<span class="notranslate">'+esc(txt)+'</span>'; }                         // nome próprio (não traduz)
  function trLabel(item){
    if(item.tr) return noTr(item.tr, item.label);
    if(item.keep) return keepTr(item.label);
    return esc(item.label);
  }
  function applyTrDict(){
    var lang = activeLang();
    var els = document.querySelectorAll('[data-tr]');
    for(var i=0;i<els.length;i++){
      var d = TR_DICT[els[i].getAttribute('data-tr')];
      if(d) els[i].textContent = d[lang] || d.pt;
    }
  }

  function navBtn(item){
    var lab = trLabel(item);
    if(item.active){
      return '<button data-action="'+item.action+'" title="'+esc(item.label)+'" style="display:flex;align-items:center;gap:12px;width:100%;padding:11px 14px;border:none;border-radius:12px;cursor:pointer;font:700 15px \'Hanken Grotesk\';text-align:left;background:var(--accent-bg);color:var(--teal-text);box-shadow:inset 3px 0 0 var(--teal-text);">'+item.icon+'<span>'+lab+'</span></button>';
    }
    return '<button data-action="'+item.action+'" title="'+esc(item.label)+'" data-hover="background:#EEF4F5;color:var(--teal-text);" data-active="transform:scale(.98);" style="display:flex;align-items:center;gap:12px;width:100%;padding:11px 14px;border:none;border-radius:12px;cursor:pointer;font:600 15px \'Hanken Grotesk\';text-align:left;background:transparent;color:#41595F;transition:background .18s ease,color .18s ease;">'+item.icon+'<span>'+lab+'</span></button>';
  }

  function navItems(){
    var s=state;
    return [
      {label:'Início',    icon:ICON.home, action:'goHome',       active:s.screen==='home', primary:true},
      {label:'Revisão',   icon:ICON.book, action:'goCategorias', active:REV_SCREENS.indexOf(s.screen)>=0, primary:true},
      {label:'Exercícios',icon:ICON.check,action:'goExercicios', active:EX_SCREENS.indexOf(s.screen)>=0, primary:true},
      {label:'Ranking',   icon:ICON.trophy,  action:'goRanking',  active:s.screen==='ranking'},
      {label:'DSM-5-TR',  icon:ICON.bookOpen,action:'goDsm',      active:s.screen==='dsm', keep:true},
      {label:'Feedback',  icon:ICON.message, action:'goFeedback', active:s.screen==='feedback'},
      {label:'Sobre',     icon:ICON.about,   action:'goSobre',    active:s.screen==='sobre', tr:'sobre'},
    ];
  }

  // --- carrossel de métricas na sidebar (troca a cada 15s) ---
  var sideMetricIdx = 0;
  function sideMetrics(){
    var t = tracking();
    var st = (t && state.stats) ? state.stats : null;
    var total = t ? totalDisorders() : 90;
    var rev = t ? totalRevised() : 38;
    var pct = total ? Math.round(rev/total*100) : 0;
    var bt = (st && st.byType) || {};
    var exe = st ? st.exercicios : 154;
    var fc  = t ? (bt.flashcard||0) : 50;
    var cs  = t ? (bt.caso||0) : 8;
    var dom = t ? dominioPct() : 87;
    var streak = st ? st.streak : 12;
    var nCasos = CASOS.length;
    var lv = levelInfo(userXP());
    function clampPct(x){ return Math.max(0, Math.min(100, Math.round(x))); }
    return [
      {label:'Progresso geral', value:pct+'%', bar:pct, sub:rev+' de '+total+' transtornos revisados'},
      {label:'Flashcards',      value:String(fc),  bar: total?clampPct(fc/total*100):0,  sub:fc+' de '+total+' cartões dominados'},
      {label:'Exercícios',      value:String(exe), bar: total?clampPct(exe/total*100):0, sub:'exercícios dominados'},
      {label:'Estudos de caso', value:cs+'/'+nCasos, bar: nCasos?clampPct(cs/nCasos*100):0, sub:'casos resolvidos'},
      sideRankMetric(),
      {label:'Visão geral', tr:'visaoGeral', value:lv.xp+' XP', bar:lv.pct, sub:'nível '+lv.level+' · '+streak+' dia'+(streak===1?'':'s')+' de streak · '+dom+'% dominado'}
    ];
  }
  // posição real do usuário no ranking (a partir do leaderboard carregado)
  function sideRankMetric(){
    if(!canRank()){
      if(!tracking()) return {label:'Ranking', value:'#12', bar:95, sub:'de 240 estudantes'};   // demo (deslogado)
      return {label:'Ranking', value:'#—', sub:'crie uma conta para competir'};                  // visitante
    }
    var rows = state.leaderboard, meId = state.auth.user ? state.auth.user.id : null;
    if(!rows || !rows.length) return {label:'Ranking', value:'#—', sub:'some XP para entrar no ranking'};
    var pos = 0;
    for(var i=0;i<rows.length;i++){ if(rows[i].user_id===meId){ pos=i+1; break; } }
    if(!pos) return {label:'Ranking', value:'#—', sub:'de '+rows.length+' estudantes'};
    var bar = rows.length>1 ? Math.round((rows.length - pos + 1)/rows.length*100) : 100;
    return {label:'Ranking', value:'#'+pos, bar:bar, sub:'de '+rows.length+' estudantes'};
  }
  function sideMetricCard(){
    var M = sideMetrics(), n = M.length, i = sideMetricIdx % n, m = M[i];
    var dots = '';
    for(var d=0; d<n; d++){ dots += '<span class="sm-dot'+(d===i?' on':'')+'" data-action="sideMetricGo" data-arg="'+d+'" title="'+esc(M[d].label)+'"></span>'; }
    return '<div data-action="sideMetricNext" title="Próxima métrica" style="cursor:pointer;">'+
      '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;">'+
        '<span style="font-size:12px;font-weight:700;color:var(--muted-2);">'+(m.tr?noTr(m.tr,m.label):esc(m.label))+'</span>'+
        '<span style="font:800 16px \'Bricolage Grotesque\';color:var(--teal-text);">'+esc(m.value)+'</span>'+
      '</div>'+
      (m.bar!=null
        ? '<div style="height:8px;background:var(--track);border-radius:99px;overflow:hidden;"><div style="width:'+m.bar+'%;height:100%;background:linear-gradient(90deg,#0E4D64,#3F95A3,#5BC0BE,#3F95A3,#0E4D64);background-size:200% 100%;border-radius:99px;animation:slide 4s linear infinite;"></div></div>'
        : '<div style="height:8px;"></div>')+
      '<div style="font-size:11.5px;color:var(--muted);margin-top:9px;font-weight:600;line-height:1.35;min-height:30px;">'+esc(m.sub)+'</div>'+
      '</div>'+
      '<div class="sm-dots">'+dots+'</div>';
  }
  function paintSideMetric(){
    var el = document.querySelector('.side-metric');
    if(el){
      el.innerHTML = sideMetricCard();
      el.style.animation='none'; void el.offsetWidth; el.style.animation='fadeIn .45s ease';
    }
  }
  function tickSideMetric(){ sideMetricIdx = (sideMetricIdx + 1) % sideMetrics().length; paintSideMetric(); }
  var sideMetricTimer = null;
  function resetSideMetricTimer(){ if(sideMetricTimer) clearInterval(sideMetricTimer); sideMetricTimer = setInterval(tickSideMetric, 15000); }

  function sidebar(){
    var its = navItems();
    var navPrim = its.filter(function(i){ return i.primary; }).map(navBtn).join('');
    var navSec  = its.filter(function(i){ return !i.primary; }).map(navBtn).join('');
    var nav = navPrim + '<div style="height:1px;background:var(--border);margin:9px 8px;"></div>' + navSec;
    var ovTotal = tracking() ? totalDisorders() : 90;
    var ovRev   = tracking() ? totalRevised()   : 38;
    var ovPct   = ovTotal ? Math.round(ovRev/ovTotal*100) : 0;
    var lv      = levelInfo(userXP());
    var levelCard = '<div class="side-level" style="margin-top:auto;background:linear-gradient(135deg,#0E4D64,#15677F);border-radius:16px;padding:14px 15px;color:#fff;">'+
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:11px;">'+
        '<div style="width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.15);display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;">'+
          '<span style="font-size:7.5px;font-weight:800;letter-spacing:.4px;opacity:.85;">NÍVEL</span>'+
          '<span style="font:800 15px \'Bricolage Grotesque\';line-height:1;">'+lv.level+'</span>'+
        '</div>'+
        '<div style="line-height:1.25;min-width:0;">'+
          '<div style="font:800 13px \'Bricolage Grotesque\';white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+esc(levelTitle(lv.level))+'</div>'+
          '<div style="font-size:11px;color:#B7D7DD;font-weight:700;">'+lv.xp+' XP</div>'+
        '</div>'+
      '</div>'+
      '<div style="height:7px;background:rgba(255,255,255,.18);border-radius:99px;overflow:hidden;">'+
        '<div style="width:'+lv.pct+'%;height:100%;background:#5BC0BE;border-radius:99px;transition:width .5s ease;"></div>'+
      '</div>'+
      '<div style="font-size:10.5px;color:#B7D7DD;margin-top:6px;font-weight:600;">faltam '+lv.toNext+' XP p/ nível '+(lv.level+1)+'</div>'+
    '</div>';
    return ''+
    '<aside class="sidebar'+(state.sideCollapsed?' collapsed':'')+'">'+
      '<div class="side-logo" data-action="goHome" role="button" tabindex="0" title="Ir para o início" aria-label="Ir para o início" data-hover="opacity:.82;" style="display:flex;align-items:center;gap:11px;padding:4px 6px 22px;cursor:pointer;transition:opacity .15s ease;">'+
        '<img src="logo-128.png" alt="Psico·Pato" width="38" height="38" style="width:38px;height:38px;border-radius:11px;object-fit:cover;display:block;background:#fff;border:1px solid var(--border);flex-shrink:0;">'+
        '<div class="side-logo-text">'+
          '<div style="font:800 17px \'Bricolage Grotesque\';color:var(--teal-text);letter-spacing:-.3px;"><span class="notranslate">Psico<span style="color:#5BC0BE;">·</span>Pato</span></div>'+
          '<div style="font-size:11px;color:var(--muted);font-weight:600;letter-spacing:.3px;">guia de estudos</div>'+
        '</div>'+
      '</div>'+
      '<nav class="side-nav" style="display:flex;flex-direction:column;gap:4px;">'+nav+'</nav>'+
      levelCard+
      '<div class="side-metric" style="margin-top:12px;background:var(--bg);border-radius:16px;padding:16px;">'+ sideMetricCard() +'</div>'+
      profileBlock()+
    '</aside>';
  }

  /* =========================================================
     BUSCA GLOBAL (header)
     Procura transtornos (por nome ou código), categorias e
     navega para a ficha/categoria. O índice é montado uma vez
     a partir de CATS. O dropdown é manipulado direto no DOM
     (sem re-render) para não perder o foco enquanto digita.
     ========================================================= */
  function searchNormalize(s){
    return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
  }
  var SEARCH_INDEX = null;
  // texto completo da ficha (resumo + critérios + seções) p/ a busca pegar
  // termos que não estão no nome (ex.: "autismo" → "Transtorno do Espectro Autista")
  function fichaText(d){
    var p = [d.summary||'', d.criteriaIntro||'', d.specifier||'', d.criteriaNote||''];
    (d.criteria||[]).forEach(function(c){ p.push(c.text||''); });
    (d.sections||[]).forEach(function(s){
      p.push(s.title||'');
      (s.body||[]).forEach(function(b){ p.push(typeof b==='string' ? b : (Array.isArray(b) ? b.join(' ') : '')); });
    });
    return p.join(' ');
  }
  function searchIndex(){
    if(SEARCH_INDEX) return SEARCH_INDEX;
    var idx = [];
    CATS.forEach(function(c, ci){
      idx.push({type:'cat', ci:ci, di:-1, label:c.name, code:'', color:c.color,
                labelNorm:searchNormalize(c.name), norm:searchNormalize(c.name), body:''});
      (c.items||[]).forEach(function(d, di){
        var code = d.code || d.cid || d.dsm || '';
        idx.push({type:'dis', ci:ci, di:di, label:d.n, code:code, cat:c.name, color:c.color,
                  labelNorm:searchNormalize(d.n),
                  norm:searchNormalize(d.n + ' ' + code + ' ' + c.name),   // forte: nome/código/categoria
                  body:searchNormalize(fichaText(d))});                    // fraco: texto completo
      });
    });
    SEARCH_INDEX = idx;
    return idx;
  }
  function countOcc(hay, needle){ var i=0, c=0; while(c<30 && (i=hay.indexOf(needle, i)) >= 0){ c++; i += needle.length; } return c; }
  function searchQuery(q){
    var nq = searchNormalize(q).trim();
    if(!nq) return [];
    var terms = nq.split(/\s+/);
    var useBody = nq.length >= 3;   // full-text só p/ 3+ caracteres (evita ruído de 1-2 letras)
    var out = [];
    searchIndex().forEach(function(e){
      var strongAll = terms.every(function(t){ return e.norm.indexOf(t) >= 0; });
      var combinedAll = strongAll || (useBody && e.body && terms.every(function(t){ return e.norm.indexOf(t) >= 0 || e.body.indexOf(t) >= 0; }));
      if(!combinedAll) return;
      var nameStart = e.labelNorm.indexOf(terms[0]) === 0 ? 1 : 0;
      var occ = 0;
      if(!strongAll && e.body){ terms.forEach(function(t){ occ += countOcc(e.body, t); }); }
      out.push({e:e, strong:strongAll?1:0, nameStart:nameStart, occ:occ});
    });
    out.sort(function(a, b){
      if(a.strong !== b.strong) return b.strong - a.strong;          // nome/código/categoria primeiro
      if(a.nameStart !== b.nameStart) return b.nameStart - a.nameStart;
      if(a.e.type !== b.e.type) return a.e.type === 'dis' ? -1 : 1;
      if(!a.strong && a.occ !== b.occ) return b.occ - a.occ;         // só-texto: mais menções primeiro
      return a.e.label.localeCompare(b.e.label);
    });
    return out.slice(0, 12).map(function(o){ return o.e; });
  }
  function searchResultsHtml(q){
    if(!q.trim()) return '';
    var res = searchQuery(q);
    if(!res.length){
      return '<div class="search-empty">Nada encontrado para “'+esc(q.trim())+'”.</div>';
    }
    return res.map(function(e){
      if(e.type === 'cat'){
        return '<button class="search-item" data-action="openCat" data-arg="'+e.ci+'">'+
          '<span class="search-dot" style="background:'+e.color+';"></span>'+
          '<span class="search-name">'+esc(e.label)+'</span>'+
          '<span class="search-tag">categoria</span>'+
        '</button>';
      }
      return '<button class="search-item" data-action="openRef" data-arg="'+e.ci+':'+e.di+'">'+
        '<span class="search-dot" style="background:'+e.color+';"></span>'+
        '<span class="search-name">'+esc(e.label)+'</span>'+
        (e.code ? '<span class="search-code">'+esc(e.code)+'</span>' : '')+
      '</button>';
    }).join('');
  }
  // (re)liga os eventos do campo de busca após cada render
  // arrasto (pointer-events) dos chips no modo Classificar; toque/clique
  // continua via delegação (classifyPick/Drop). Arrastar sem mover = toque.
  function bindClassify(scope){
    if(state.screen!=='ligar') return;
    var chips = scope.querySelectorAll('[data-chip]');
    if(!chips.length) return;
    var dragId=null, sx=0, sy=0, moved=false, clone=null;
    function binAt(p){ var el=document.elementFromPoint(p.x,p.y); return (el && el.closest) ? el.closest('[data-bin]') : null; }
    function clearHi(){ Array.prototype.forEach.call(scope.querySelectorAll('.over'), function(b){ b.classList.remove('over'); }); }
    function onMove(e){
      if(dragId===null) return;
      var p={x:e.clientX, y:e.clientY};
      if(!moved && (Math.abs(p.x-sx)+Math.abs(p.y-sy) > 8)){
        moved=true;
        var src = scope.querySelector('[data-chip="'+dragId+'"]');
        if(src){
          clone = src.cloneNode(true); clone.className='cl-chip cl-drag';
          clone.style.cssText='position:fixed;left:0;top:0;z-index:9999;pointer-events:none;margin:0;';
          document.body.appendChild(clone); src.style.opacity='0.35';
        }
      }
      if(moved && clone){
        e.preventDefault();
        clone.style.transform='translate('+(p.x-clone.offsetWidth/2)+'px,'+(p.y-22)+'px) rotate(-3deg)';
        clearHi(); var b=binAt(p); if(b) b.classList.add('over');
      }
    }
    function onUp(e){
      if(dragId===null) return;
      var id=dragId; dragId=null;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      if(moved){
        var b=binAt({x:e.clientX, y:e.clientY});
        if(clone){ try{ document.body.removeChild(clone); }catch(_){} clone=null; }
        clearHi();
        classifyJustDropped = true; setTimeout(function(){ classifyJustDropped=false; }, 350);
        var t = b ? b.getAttribute('data-bin') : null;
        classifyPlaceImpl(id, (t==null||t==='pool') ? 'pool' : t);
      }
    }
    Array.prototype.forEach.call(chips, function(el){
      el.addEventListener('pointerdown', function(e){
        if(e.button && e.button!==0) return;
        dragId = el.getAttribute('data-chip'); sx=e.clientX; sy=e.clientY; moved=false;
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
      });
    });
  }

  function bindSearchEl(input, box){
    if(!input || !box) return;
    function update(){
      var html = searchResultsHtml(input.value);
      box.innerHTML = html;
      box.style.display = html ? 'block' : 'none';
    }
    input.addEventListener('input', update);
    input.addEventListener('focus', update);
    input.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){ input.value=''; box.innerHTML=''; box.style.display='none'; input.blur(); }
    });
  }
  function bindSearch(scope){
    bindSearchEl(scope.querySelector('#global-search'), scope.querySelector('#search-results'));      // topbar (desktop)
    bindSearchEl(scope.querySelector('#ms-search'),     scope.querySelector('#ms-search-results'));    // folha "Mais" (mobile)
  }

  /* =========================================================
     TOPBAR
     ========================================================= */
  // botão "instalar app" (PWA) — só aparece quando o navegador permite instalar
  function pwaInstallBtn(variant){
    if(!window.__pwaPrompt) return '';
    if(variant==='welcome'){
      return '<button data-action="installPwa" data-hover="border-color:#5BC0BE;color:var(--teal-text);" data-active="transform:scale(.98);" style="width:100%;display:flex;align-items:center;justify-content:center;gap:9px;background:transparent;border:1px dashed var(--border);border-radius:12px;padding:11px;font:700 13.5px \'Hanken Grotesk\';color:var(--muted-2);cursor:pointer;transition:all .15s ease;margin-top:14px;">'+ICON.download+'<span>Instalar como app</span></button>';
    }
    return '<button data-action="installPwa" title="Instalar app" aria-label="Instalar app" class="pwa-pill" data-hover="border-color:#5BC0BE;color:var(--teal-text);" data-active="transform:scale(.94);" style="display:inline-flex;align-items:center;gap:7px;height:40px;padding:0 13px;border-radius:12px;background:var(--surface);border:1px solid var(--border);cursor:pointer;color:var(--muted-2);font:700 13px \'Hanken Grotesk\';transition:all .18s ease;">'+ICON.download+'<span class="pwa-lbl">Instalar</span></button>';
  }
  function topbar(){
    var themeIcon = state.dark ? ICON.sun : ICON.moon;
    var streak = tracking() ? ((state.stats && state.stats.streak) || 0) : 12;
    var lv = levelInfo(userXP());
    var levelPill = '<button id="xp-pill" data-action="goRanking" title="Ver ranking" data-hover="border-color:#5BC0BE;" style="display:flex;align-items:center;gap:7px;background:var(--surface);border:1px solid var(--border);border-radius:99px;padding:6px 13px 6px 7px;cursor:pointer;transition:border-color .18s ease;">'+
        '<span style="width:24px;height:24px;border-radius:7px;background:linear-gradient(135deg,#5BC0BE,#0E4D64);color:#fff;display:flex;align-items:center;justify-content:center;font:800 12px \'Bricolage Grotesque\';flex-shrink:0;">'+lv.level+'</span>'+
        '<span class="xp-amount" style="font:800 13px \'Bricolage Grotesque\';color:var(--teal-text);">'+lv.xp+'</span>'+
        '<span class="xp-label" style="font-size:12px;font-weight:600;color:var(--muted);">XP</span>'+
      '</button>';
    var streakChip = (tracking() && streak===0) ? '' :
      '<div style="display:flex;align-items:center;gap:7px;background:var(--surface);border:1px solid #FFD9C2;border-radius:99px;padding:7px 14px 7px 11px;">'+
        ICON.flame+
        '<span style="font:800 14px \'Bricolage Grotesque\';color:#E8590C;">'+streak+'</span>'+
        '<span class="streak-lbl" style="font-size:12.5px;font-weight:600;color:#C2410C;">dias</span>'+
      '</div>';
    return ''+
    '<header class="topbar">'+
      '<button data-action="toggleSidebar" class="side-toggle-btn" title="'+(state.sideCollapsed?'Expandir menu':'Recolher menu')+'" aria-label="'+(state.sideCollapsed?'Expandir menu':'Recolher menu')+'" data-hover="border-color:#5BC0BE;color:var(--teal-text);" data-active="transform:scale(.92);" style="flex-shrink:0;width:40px;height:40px;border-radius:12px;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--muted-2);transition:transform .18s ease,border-color .18s ease,color .18s ease;">'+ICON.sidebar+'</button>'+
      (navStack.length ? '<button data-action="goBack" class="topbar-back" title="Voltar" aria-label="Voltar" data-hover="border-color:#5BC0BE;color:var(--teal-text);" data-active="transform:scale(.92);" style="flex-shrink:0;width:40px;height:40px;border-radius:12px;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--muted-2);transition:transform .18s ease,border-color .18s ease,color .18s ease;">'+ICON.chevLbig+'</button>' : '')+
      '<div class="topbar-search" style="position:relative;flex:1;display:flex;align-items:center;gap:10px;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:9px 14px;max-width:420px;">'+
        ICON.search+
        '<input id="global-search" type="text" autocomplete="off" spellcheck="false" placeholder="Buscar transtorno, categoria ou código…" style="flex:1;min-width:0;border:none;background:transparent;outline:none;font:500 14px \'Hanken Grotesk\';color:var(--ink);">'+
        '<kbd class="search-hint" aria-hidden="true">/</kbd>'+
        '<div id="search-results" class="search-results" role="listbox" style="display:none;"></div>'+
      '</div>'+
      levelPill+
      streakChip+
      '<button data-action="toggleSound" title="'+(Sound.isOn()?'Som ligado':'Som desligado')+'" data-hover="border-color:#5BC0BE;color:var(--teal-text);" data-active="transform:scale(.9);" style="width:40px;height:40px;border-radius:12px;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:'+(Sound.isOn()?'var(--teal-text)':'var(--muted)')+';transition:transform .18s ease,border-color .18s ease,color .18s ease;">'+(Sound.isOn()?ICON.soundOn:ICON.soundOff)+'</button>'+
      pwaInstallBtn()+
      '<button data-action="openA11y" title="Acessibilidade" aria-label="Abrir painel de acessibilidade" data-hover="border-color:#5BC0BE;" data-active="transform:scale(.9);" style="width:40px;height:40px;border-radius:12px;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform .18s ease,border-color .18s ease;overflow:hidden;"><img src="a11y-kit/acessibilidade_icone.png?v=1" alt="" width="24" height="24" style="width:24px;height:24px;object-fit:contain;pointer-events:none;display:block;"></button>'+
      '<button data-action="toggleTheme" title="Alternar tema" data-hover="border-color:#5BC0BE;color:var(--teal-text);" data-active="transform:scale(.9) rotate(-15deg);" style="width:40px;height:40px;border-radius:12px;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--muted-2);transition:transform .18s ease,border-color .18s ease,color .18s ease;">'+themeIcon+'</button>'+
      notifBell()+
    '</header>';
  }

  /* sino de avisos + painel dropdown */
  function notifBell(){
    var unread = notifUnreadCount();
    var badge = unread>0 ? '<span class="notif-badge">'+(unread>9?'9+':unread)+'</span>' : '';
    var btn = '<button data-action="toggleNotif" title="Avisos" aria-label="Avisos'+(unread?(' ('+unread+' novo'+(unread>1?'s':'')+')'):'')+'"'+
      ' class="topbar-bell'+(unread?' has-unread':'')+(state.notifOpen?' is-open':'')+'"'+
      ' data-hover="border-color:#5BC0BE;color:var(--teal-text);"'+
      ' style="position:relative;width:40px;height:40px;border-radius:12px;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--muted-2);transition:background .18s ease,border-color .18s ease,color .18s ease;">'+
      ICON.bell+badge+'</button>';
    return '<div class="notif-wrap" style="position:relative;">'+ btn + (state.notifOpen ? notifPanel() : '') + '</div>';
  }

  function notifPanel(){
    var isNew = {};
    (state.notifNew||[]).forEach(function(id){ isNew[id]=true; });
    var list = NOTICES.length ? NOTICES.map(function(n){
      var nw = !!isNew[n.id];
      return '<li class="notif-item'+(nw?' is-new':'')+'">'+
        '<div class="notif-ico">'+n.icon+'</div>'+
        '<div class="notif-main">'+
          '<div class="notif-title">'+esc(n.title)+(nw?'<span class="notif-tag">novo</span>':'')+'</div>'+
          '<div class="notif-body">'+n.body+'</div>'+
          '<div class="notif-when">'+esc(n.when)+'</div>'+
        '</div></li>';
    }).join('') : '<li class="notif-empty">Nenhum aviso por aqui ainda.</li>';
    return '<div class="notif-panel" id="notif-panel" role="dialog" aria-label="Avisos">'+
      '<div class="notif-head"><span class="notif-h-title">'+ICON.bell+' Avisos</span>'+
        '<button class="notif-close" data-action="closeNotif" title="Fechar" aria-label="Fechar">'+ICON.x+'</button></div>'+
      '<ul class="notif-list">'+list+'</ul>'+
    '</div>';
  }

  /* =========================================================
     BARRA DE NAVEGAÇÃO INFERIOR (mobile)
     ========================================================= */
  function bottomNav(){
    var prim = navItems().filter(function(i){ return i.primary; }).map(function(item){
      var col = item.active ? 'var(--teal-text)' : 'var(--muted)';
      var bgw = item.active ? 'background:var(--accent-bg);' : '';
      return '<button data-action="'+item.action+'" style="color:'+col+';'+bgw+'">'+item.icon+'<span>'+item.label+'</span></button>';
    }).join('');
    // botão "Mais" → abre o menu com itens secundários + conta (itens que viviam na sidebar)
    var secActive = navItems().some(function(i){ return !i.primary && i.active; });
    var moreCol = (state.moreOpen||secActive) ? 'var(--teal-text)' : 'var(--muted)';
    var moreBg  = (state.moreOpen||secActive) ? 'background:var(--accent-bg);' : '';
    var more = '<button data-action="toggleMore" style="color:'+moreCol+';'+moreBg+'">'+ICON.more+'<span>'+noTr('mais','Mais')+'</span></button>';
    return '<nav class="bottom-nav">'+ prim + more +'</nav>';
  }

  // menu "Mais" (mobile): bottom sheet com itens secundários + perfil/conta
  function mobileMenuSheet(){
    if(!state.moreOpen) return '';
    var sec = navItems().filter(function(i){ return !i.primary; }).map(function(it){
      return '<button data-action="'+it.action+'" class="ms-item'+(it.active?' on':'')+'">'+it.icon+'<span>'+trLabel(it)+'</span></button>';
    }).join('');
    // instalar como app (PWA) — só quando o navegador permite instalar
    var install = window.__pwaPrompt
      ? '<div class="ms-sep"></div><button data-action="installPwa" class="ms-item ms-install">'+ICON.download+'<span>Instalar app na tela inicial</span></button>'
      : '';
    var account = '';
    if(DB.ready && state.auth.user && !state.auth.guest){
      account = '<div class="ms-sep"></div>'+
        '<button data-action="goPerfil" class="ms-item">'+ICON.user+'<span>Meu perfil</span></button>'+
        '<button data-action="logout" class="ms-item ms-danger">'+ICON.logout+'<span>Sair da conta</span></button>';
    } else if(DB.ready && state.auth.guest){
      account = '<div class="ms-sep"></div>'+
        '<button data-action="guestToRegister" class="ms-item">'+ICON.user+'<span>Criar conta</span></button>';
    }
    return '<div class="ms-backdrop" data-action="closeMore"></div>'+
      '<div class="ms-sheet" role="dialog" aria-label="Mais opções">'+
        '<div class="ms-handle"></div>'+
        '<div class="ms-title">'+noTr('mais','Mais')+'</div>'+
        '<div class="ms-search-field">'+ICON.search+
          '<input id="ms-search" type="text" autocomplete="off" spellcheck="false" placeholder="Buscar transtorno, termo ou código…">'+
        '</div>'+
        '<div id="ms-search-results" class="search-results ms-search-results" role="listbox" style="display:none;"></div>'+
        '<div class="ms-list">'+sec+install+account+'</div>'+
      '</div>';
  }

  /* =========================================================
     TELA: HOME
     ========================================================= */
  function statCard(iconWrapExtra, bg, icon, value, label){
    return '<div data-hover="transform:translateY(-3px);box-shadow:0 12px 26px rgba(16,42,51,.08);border-color:var(--accent-bd);" style="background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:18px 18px 16px;transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease;">'+
      '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">'+
        '<div style="width:36px;height:36px;border-radius:10px;background:'+bg+';display:flex;align-items:center;justify-content:center;flex-shrink:0;'+iconWrapExtra+'">'+icon+'</div>'+
        '<div style="font:800 26px \'Bricolage Grotesque\';color:var(--ink);line-height:1;">'+value+'</div>'+
      '</div>'+
      '<div style="font-size:13px;font-weight:600;color:var(--muted);">'+label+'</div>'+
    '</div>';
  }

  // cartão de medalha (conquistada → colorida; bloqueada → esmaecida c/ progresso)
  function medalCard(m){
    if(m.done){
      return '<div data-hover="transform:translateY(-3px);box-shadow:0 12px 24px rgba(16,42,51,.08);border-color:#9DD9D2;" style="background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:18px;transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease;cursor:default;">'+
        '<div style="width:42px;height:42px;border-radius:12px;background:'+m.bg+';display:flex;align-items:center;justify-content:center;font-size:21px;">'+m.emoji+'</div>'+
        '<div style="font-weight:700;font-size:14px;margin-top:10px;color:var(--ink);">'+esc(m.title)+'</div>'+
        '<div style="font-size:12px;color:var(--muted);font-weight:500;">'+esc(m.desc)+'</div>'+
      '</div>';
    }
    return '<div title="'+esc(m.desc)+'" style="background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:18px;cursor:default;">'+
      '<div style="width:42px;height:42px;border-radius:12px;background:var(--surface-2);display:flex;align-items:center;justify-content:center;font-size:21px;filter:grayscale(1);opacity:.55;">'+m.emoji+'</div>'+
      '<div style="font-weight:700;font-size:14px;margin-top:10px;color:var(--muted-2);">'+esc(m.title)+'</div>'+
      '<div style="font-size:12px;color:var(--muted);font-weight:500;margin-top:1px;">'+esc(m.desc)+'</div>'+
      '<div style="height:6px;background:var(--track);border-radius:99px;overflow:hidden;margin-top:9px;"><div style="width:'+m.pct+'%;height:100%;background:#9DD9D2;border-radius:99px;"></div></div>'+
      '<div style="font-size:11px;color:var(--muted);font-weight:600;margin-top:6px;">'+m.cur+' / '+m.goal+'</div>'+
    '</div>';
  }

  // faixa de nível + barra de XP (home)
  function levelHeroCard(lv){
    return '<div style="background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:18px 20px;margin-bottom:18px;display:flex;align-items:center;gap:18px;flex-wrap:wrap;">'+
      '<div style="width:58px;height:58px;border-radius:16px;background:linear-gradient(135deg,#5BC0BE,#0E4D64);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 8px 18px rgba(14,77,100,.25);">'+
        '<span style="font-size:9px;font-weight:800;letter-spacing:.6px;opacity:.85;">NÍVEL</span>'+
        '<span style="font:800 23px \'Bricolage Grotesque\';line-height:1;">'+lv.level+'</span>'+
      '</div>'+
      '<div style="flex:1;min-width:210px;">'+
        '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin-bottom:7px;">'+
          '<span style="font:800 15px \'Bricolage Grotesque\';color:var(--ink);">'+esc(levelTitle(lv.level))+'</span>'+
          '<span style="font-size:12.5px;font-weight:800;color:var(--teal-text);">'+lv.xp+' XP</span>'+
        '</div>'+
        '<div style="height:9px;background:var(--track);border-radius:99px;overflow:hidden;">'+
          '<div style="width:'+lv.pct+'%;height:100%;background:linear-gradient(90deg,#0E4D64,#5BC0BE);border-radius:99px;transition:width .5s ease;"></div>'+
        '</div>'+
        '<div style="font-size:11.5px;color:var(--muted);font-weight:600;margin-top:7px;">Faltam <b style="color:var(--muted-2);">'+lv.toNext+' XP</b> para o nível '+(lv.level+1)+'</div>'+
      '</div>'+
    '</div>';
  }

  function continueCard(){
    var btnStyle = "background:#5BC0BE;color:#06343F;border:none;border-radius:12px;padding:12px 20px;font-weight:700;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:background .18s ease,transform .18s ease,box-shadow .18s ease;";
    var hov = 'background:#7BD0CE;transform:translateY(-2px);box-shadow:0 8px 18px rgba(91,192,190,.4);';
    var lv = state.lastViewed, cat = lv && CATS[lv.cat], d = cat && cat.items[lv.dis];
    if(d){
      return '<span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#9DD9D2;">Continue de onde parou</span>'+
        '<h2 style="font:700 22px \'Bricolage Grotesque\';margin:8px 0 4px;">'+esc(cat.name)+'</h2>'+
        '<p style="margin:0 0 18px;color:#B7D7DD;font-size:14px;">Você estava em '+esc(d.n)+'.</p>'+
        '<button data-action="openRef" data-arg="'+lv.cat+':'+lv.dis+'" data-hover="'+hov+'" data-active="transform:translateY(0) scale(.97);" style="'+btnStyle+'">Retomar revisão '+ICON.arrowR+'</button>';
    }
    return '<span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#9DD9D2;">Comece sua revisão</span>'+
      '<h2 style="font:700 22px \'Bricolage Grotesque\';margin:8px 0 4px;">As 20 categorias do DSM-5-TR</h2>'+
      '<p style="margin:0 0 18px;color:#B7D7DD;font-size:14px;">Escolha um capítulo e abra sua primeira ficha-resumo.</p>'+
      '<button data-action="goCategorias" data-hover="'+hov+'" data-active="transform:translateY(0) scale(.97);" style="'+btnStyle+'">Explorar categorias '+ICON.arrowR+'</button>';
  }
  function screenHome(){
    var st = tracking() ? (state.stats || {streak:0, revisados:0, exercicios:0, taxa:0})
                        : {streak:12, revisados:38, exercicios:154, taxa:87};
    var gname = greetName();
    var greeting = gname ? ('Bom te ver de novo, '+esc(gname)+'.') : 'Bom te ver de novo!';
    var dataHoje = tracking() ? todayLabel() : 'Quarta-feira, 10 de junho';
    var md = computeMedals();
    var conq = md.earned.concat(md.locked).slice(0, 8).map(medalCard).join('');
    var lv = levelInfo(userXP());

    return ''+
    '<section style="max-width:1080px;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      '<div style="font-size:14px;font-weight:600;color:var(--muted);margin-bottom:2px;">'+esc(dataHoje)+'</div>'+
      '<h1 style="font:800 30px \'Bricolage Grotesque\';letter-spacing:-.6px;margin:0 0 18px;color:var(--ink);">'+greeting+'</h1>'+

      levelHeroCard(lv)+

      '<div class="stat-grid">'+
        statCard('animation:ringPulse 2.6s ease-out infinite;', '#FFEDE3', ICON.flameOrange, String(st.streak), 'dias de streak')+
        statCard('', '#E3F3F2', ICON.statBook, String(st.revisados), 'transtornos revisados')+
        statCard('', '#E8ECFB', ICON.statCheck, String(st.exercicios), 'exercícios dominados')+
        statCard('', '#E6F6EE', ICON.statShield, (tracking()?dominioPct():st.taxa)+'%', 'do conteúdo dominado')+
      '</div>'+

      '<div class="home-mid">'+
        '<div style="background:linear-gradient(125deg,#0E4D64,#15677F);border-radius:20px;padding:26px;color:#fff;position:relative;overflow:hidden;">'+
          '<div style="position:absolute;right:-30px;top:-30px;width:160px;height:160px;border-radius:50%;background:rgba(91,192,190,.18);animation:floatY 7s ease-in-out infinite;"></div>'+
          '<div style="position:absolute;right:60px;bottom:-46px;width:110px;height:110px;border-radius:50%;background:rgba(157,217,210,.12);animation:floatY 9s ease-in-out infinite reverse;"></div>'+
          '<div style="position:relative;">'+
            continueCard()+
          '</div>'+
        '</div>'+
        '<div style="display:flex;flex-direction:column;gap:16px;">'+
          '<button data-action="goCategorias" data-hover="border-color:#5BC0BE;transform:translateY(-3px);box-shadow:0 12px 26px rgba(14,77,100,.10);" data-active="transform:translateY(-1px) scale(.99);" style="flex:1;text-align:left;background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:20px;cursor:pointer;display:flex;gap:14px;align-items:center;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease;">'+
            '<div style="width:46px;height:46px;border-radius:13px;background:#E3F3F2;display:flex;align-items:center;justify-content:center;flex-shrink:0;">'+ICON.book2+'</div>'+
            '<div><div style="font:700 16px \'Bricolage Grotesque\';color:var(--ink);">Revisão</div><div style="font-size:13px;color:var(--muted);font-weight:500;">20 categorias · fichas-resumo</div></div>'+
          '</button>'+
          '<button data-action="goExercicios" data-hover="border-color:#5BC0BE;transform:translateY(-3px);box-shadow:0 12px 26px rgba(14,77,100,.10);" data-active="transform:translateY(-1px) scale(.99);" style="flex:1;text-align:left;background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:20px;cursor:pointer;display:flex;gap:14px;align-items:center;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease;">'+
            '<div style="width:46px;height:46px;border-radius:13px;background:#FFEDE3;display:flex;align-items:center;justify-content:center;flex-shrink:0;">'+ICON.pencil+'</div>'+
            '<div><div style="font:700 16px \'Bricolage Grotesque\';color:var(--ink);">Exercícios</div><div style="font-size:13px;color:var(--muted);font-weight:500;">4 modos · flashcards e quiz</div></div>'+
          '</button>'+
        '</div>'+
      '</div>'+

      '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px;">'+
        '<h3 style="font:700 18px \'Bricolage Grotesque\';margin:0;">Conquistas</h3>'+
        '<span style="font-size:12.5px;font-weight:700;color:var(--muted);">'+md.earned.length+' de '+md.all.length+' medalhas</span>'+
      '</div>'+
      '<div class="conq-grid">'+conq+'</div>'+
    '</section>';
  }

  /* =========================================================
     TELA: CATEGORIAS (grade) + alternância de visualização
     ========================================================= */
  function revViewToggle(active){
    function tab(label, screen){
      return '<button data-action="goScreen" data-arg="'+screen+'" class="rev-tab'+(active===screen?' on':'')+'">'+label+'</button>';
    }
    return '<div class="rev-toggle">'+tab('Categorias','categorias')+tab('Índice','indice')+'</div>';
  }
  // ----- modo Completo x Reduzido (esconde categorias residuais) -----
  // residual = "Outro … Especificado", "… Não Especificado/a", "Outra …".
  function isResidual(n){
    var s = (n||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
    return /nao especificad|especificad[oa]\b|^outro |^outra /.test(s);
  }
  function hiddenReduced(d){ return state.reduced && d && isResidual(d.n); }
  function visibleItems(cat){ return (cat.items||[]).filter(function(d){ return !hiddenReduced(d); }); }
  // próximo/anterior índice VISÍVEL na categoria (pula residuais no reduzido)
  function adjIndex(cat, di, dir){
    var i = di + dir;
    while(i>=0 && i<cat.items.length){ if(!hiddenReduced(cat.items[i])) return i; i += dir; }
    return -1;
  }
  function reducedToggle(){
    function tab(label, on, v){ return '<button data-action="setReduced" data-arg="'+v+'" class="rev-tab'+(on?' on':'')+'">'+label+'</button>'; }
    return '<div class="rev-toggle" title="Reduzido esconde as categorias residuais (Outro… / Não Especificado)">'+
      tab('Completo', !state.reduced, '0')+tab('Reduzido', state.reduced, '1')+'</div>';
  }

  function screenCategorias(){
    var nVisCats = 0;
    var cards = CATS.map(function(c,i){
      var visN = visibleItems(c).length;
      if(state.reduced && visN===0) return '';          // categoria toda residual: oculta
      nVisCats++;
      var pct = Math.round(catProgress(i)*100);
      var cardStyle = "display:flex;flex-direction:column;align-items:flex-start;background:var(--surface);border:1px solid var(--border);border-top:3px solid "+c.color+";border-radius:18px;padding:18px;cursor:pointer;text-align:left;transition:transform .2s ease,box-shadow .2s ease;animation:popIn .45s cubic-bezier(.2,.7,.3,1) both;animation-delay:"+(i*0.035).toFixed(3)+"s;";
      var tileStyle = "width:40px;height:40px;border-radius:11px;background:"+c.color+"1A;color:"+c.color+";font:800 17px 'Bricolage Grotesque';display:flex;align-items:center;justify-content:center;";
      var countChip = "font-size:11.5px;font-weight:700;color:var(--muted);background:var(--surface-2);border-radius:7px;padding:4px 9px;";
      var barStyle  = "width:"+pct+"%;height:100%;background:"+c.color+";border-radius:99px;";
      return '<button data-action="openCat" data-arg="'+i+'" data-hover="transform:translateY(-3px);box-shadow:0 12px 26px rgba(16,42,51,.10);" style="'+cardStyle+'">'+
        '<div style="display:flex;align-items:center;justify-content:space-between;width:100%;">'+
          '<div style="'+tileStyle+'">'+(i+1)+'</div>'+
          '<span style="'+countChip+'">'+visN+'</span>'+
        '</div>'+
        '<div style="font:700 15.5px \'Bricolage Grotesque\';line-height:1.25;margin-top:14px;color:var(--ink);text-wrap:balance;">'+esc(c.name)+'</div>'+
        '<div style="display:flex;align-items:center;gap:8px;width:100%;margin-top:14px;">'+
          '<div style="flex:1;height:6px;background:var(--track);border-radius:99px;overflow:hidden;"><div style="'+barStyle+'"></div></div>'+
          '<span style="font-size:11px;font-weight:700;color:var(--muted);">'+pct+'%</span>'+
        '</div>'+
      '</button>';
    }).join('');

    return ''+
    '<section style="animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      '<div style="font-size:13px;font-weight:600;color:var(--muted);margin-bottom:8px;">Revisão</div>'+
      '<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;">'+revViewToggle('categorias')+reducedToggle()+'</div>'+
      '<h1 style="font:800 28px \'Bricolage Grotesque\';letter-spacing:-.5px;margin:18px 0 6px;">'+(state.reduced?('Categorias do DSM-5-TR'):'As 20 categorias do DSM-5-TR')+'</h1>'+
      '<p style="margin:0 0 24px;color:var(--muted-2);font-size:15px;max-width:620px;">Escolha um capítulo para ver os transtornos e suas fichas-resumo.'+(state.reduced?' <b>Modo reduzido:</b> categorias residuais ocultas.':'')+'</p>'+
      '<div class="cats-grid">'+cards+'</div>'+
    '</section>';
  }

  /* =========================================================
     TELA: CATEGORIA (lista de transtornos)
     ========================================================= */
  function screenCategoria(){
    var cat = CATS[state.activeCat];
    var revisedCount = tracking() ? catRevisedCount(state.activeCat) : Math.round(cat.items.length*cat.prog);
    // subgrupos da Classificação do DSM (item.sg / item.sgl)
    var sgCount = {};
    cat.items.forEach(function(d){ if(d.sg){ sgCount[d.sg] = (sgCount[d.sg]||0)+1; } });
    var lastSg = null;
    var items = cat.items.map(function(d,i){
      if(hiddenReduced(d)) return '';                    // residual oculto no reduzido
      var sg = d.sg || '';
      var header = '';
      if(sg !== lastSg){
        lastSg = sg;
        // pula cabeçalho redundante (subgrupo de 1 item com o mesmo nome)
        if(sg && !(sgCount[sg]===1 && sg===d.n)){
          header = '<div class="cat-subgroup'+(d.sgl===2?' lvl2':'')+'">'+esc(sg)+'</div>';
        }
      }
      var statusLabel = (tracking() ? isRevised(state.activeCat, d) : (i < revisedCount)) ? 'Revisado' : 'Não iniciado';
      var dot = "width:11px;height:11px;border-radius:50%;flex-shrink:0;background:"+cat.color+";";
      var btn = '<button data-action="openDisorder" data-arg="'+i+'" class="cat-disorder'+(d.sgl===2?' lvl2':'')+'" data-hover="border-color:#5BC0BE;box-shadow:0 8px 20px rgba(16,42,51,.07);transform:translateX(4px);" data-active="transform:translateX(2px) scale(.995);" style="display:flex;align-items:center;gap:16px;background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:16px 18px;cursor:pointer;text-align:left;width:100%;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease;">'+
        '<div style="'+dot+'"></div>'+
        '<div style="flex:1;min-width:0;">'+
          '<div style="font-weight:700;font-size:15.5px;color:var(--ink);">'+esc(d.n)+'</div>'+
          '<div style="font-size:12.5px;color:var(--muted);font-weight:600;margin-top:2px;">'+statusLabel+'</div>'+
        '</div>'+
        '<span style="font:700 12px \'Hanken Grotesk\';color:var(--muted-2);background:var(--surface-2);border-radius:7px;padding:5px 10px;letter-spacing:.3px;">'+esc(d.code)+'</span>'+
        ICON.chevR+
      '</button>';
      return header + btn;
    }).join('');

    var headerTile = '<div style="width:54px;height:54px;border-radius:15px;background:'+cat.color+'1A;color:'+cat.color+';font:800 22px \'Bricolage Grotesque\';display:flex;align-items:center;justify-content:center;flex-shrink:0;">'+(state.activeCat+1)+'</div>';

    return ''+
    '<section style="--cat:'+cat.color+';max-width:920px;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      '<button data-action="goCategorias" data-hover="color:var(--teal-text);" style="background:none;border:none;color:var(--muted);font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;padding:0;margin-bottom:18px;">'+ICON.back+'Todas as categorias</button>'+
      '<div style="display:flex;align-items:flex-start;gap:18px;margin-bottom:26px;">'+
        headerTile+
        '<div>'+
          '<h1 style="font:800 27px \'Bricolage Grotesque\';letter-spacing:-.5px;margin:0 0 6px;text-wrap:balance;">'+esc(cat.name)+'</h1>'+
          '<p style="margin:0;color:var(--muted-2);font-size:14.5px;">'+visibleItems(cat).length+' transtornos nesta categoria · conteúdo ilustrativo</p>'+
        '</div>'+
      '</div>'+
      '<div style="display:flex;flex-direction:column;gap:10px;">'+items+'</div>'+
    '</section>';
  }

  /* =========================================================
     TELA: FICHA
     ========================================================= */
  // siglas para transtornos com acrônimo consagrado (usadas em espaços curtos,
  // como o botão "Próximo"); o resto trunca com reticências via CSS.
  var SIGLAS = {
    'transtorno de déficit de atenção/hiperatividade':'TDAH',
    'transtorno de estresse pós-traumático':'TEPT',
    'transtorno de estresse pós-traumático em crianças de 6 anos ou menos':'TEPT (crianças)',
    'transtorno obsessivo-compulsivo':'TOC',
    'transtorno do espectro autista':'TEA',
    'transtorno de ansiedade generalizada':'TAG',
    'transtorno de ansiedade social (fobia social)':'TAS (fobia social)',
    'transtorno de ansiedade de separação':'TAS',
    'transtorno depressivo maior':'TDM',
    'transtorno disfórico pré-menstrual':'TDPM',
    'deficiência intelectual (transtorno do desenvolvimento intelectual)':'Deficiência Intelectual'
  };
  function shortName(n){ return SIGLAS[String(n).toLowerCase()] || n; }

  // --- sub-listas numeradas/alfabéticas dentro de critérios e seções ---
  var SUBLIST_RE = /^\s*(\d{1,2}|[a-z])[.)]\s+(.+)$/;
  function isSubItem(s){
    var m = SUBLIST_RE.exec(String(s));
    if(!m) return null;
    // ignora abreviações no início (ex.: "p. ex.", "i. e.")
    if(/^[a-z]$/.test(m[1]) && /^(ex|e)\./i.test(m[2])) return null;
    return { m:m[1], t:m[2] };
  }
  function sublistHtml(buf){
    return '<ol class="crit-sublist">'+buf.map(function(it){
      return '<li><span class="csl-num">'+esc(it.m)+'</span><span class="csl-tx">'+esc(it.t)+'</span></li>';
    }).join('')+'</ol>';
  }
  // tabela do DSM reconstruída como HTML estilizado (no lugar da imagem).
  // célula = string OU lista de parágrafos; 1ª coluna = cabeçalho da linha.
  function renderSecTable(t){
    if(!t || !t.cols) return '';
    var mx = !!t.matrix;
    function cellHtml(cell){
      if(Array.isArray(cell)) return cell.map(function(p){ return '<p>'+esc(p)+'</p>'; }).join('');
      var s = (cell==null?'':String(cell));
      if(!s) return '';                        // célula vazia (matriz)
      return mx ? esc(s) : '<p>'+esc(s)+'</p>'; // matriz: token curto sem <p>
    }
    var head = '<thead><tr>'+t.cols.map(function(c,i){
      return '<th'+(i===0?' class="st-corner"':'')+'>'+esc(c)+'</th>';
    }).join('')+'</tr></thead>';
    var rows = (t.rows||[]).map(function(r){
      return '<tr>'+r.map(function(cell,ci){
        return ci===0
          ? '<th class="st-rowhead">'+esc(cell)+'</th>'
          : '<td'+(mx?' class="st-mx"':'')+'>'+cellHtml(cell)+'</td>';
      }).join('')+'</tr>';
    }).join('');
    return '<div class="sec-table-wrap"><table class="sec-table'+(mx?' sec-table-mx':'')+'">'+head+'<tbody>'+rows+'</tbody></table></div>';
  }
  // Reconstrói os critérios que o PDF quebrou/achatou, de forma LINHA-A-LINHA
  // (preserva quebras reais de parágrafo, ao contrário de achatar tudo):
  //  · Fase 1 — separa marcadores embutidos no meio da linha ("…cadeira. b.
  //    Frequentemente…"), com varredura sequencial: número avança, "1." pode
  //    reiniciar uma sublista (obsessões/compulsões; categorias do TEPT/TEA) e
  //    o marcador exige inicial maiúscula/dígito à frente (ignora "p. ex.").
  //  · Fase 2 — junta linhas de continuação (quebra tipográfica: começam em
  //    minúscula/"(") ao item/parágrafo anterior; cabeçalhos e novas frases
  //    (iniciam por maiúscula) permanecem em parágrafo próprio.
  //  · Fase 3 — destaca a cauda de especificador/codificação colada a um item.
  var REFLOW_MARK = /(^|[\s.;:)–—”"'])((?:\d{1,2})|[a-z])([.)])\s+(?=[A-ZÀ-Ú0-9“"])/g;
  var CRIT_BOUNDARY = /([.)”"])\s+(?=(?:Especificar\b|Determinar\b|Código baseado|Nota (?:de|para) codificação))/g;
  function splitTrailing(seg){
    return seg.replace(CRIT_BOUNDARY, '$1\n').split('\n').map(function(s){ return s.trim(); }).filter(Boolean);
  }
  function reflowCrit(lines){
    var numNext=1, letNext='a';
    function take(tok){                       // valida marcador na ordem esperada
      if(/^\d+$/.test(tok)){
        var n = parseInt(tok,10);
        if(n===numNext){ numNext++; letNext='a'; return true; }
        if(n===1 && numNext>1){ numNext=2; letNext='a'; return true; }   // reinício de sublista
        return false;
      }
      if(tok===letNext){ letNext=String.fromCharCode(letNext.charCodeAt(0)+1); return true; }
      return false;
    }
    // fase 1: divide cada linha nos marcadores válidos; marca itens vs. texto
    var split=[];
    lines.forEach(function(ln){
      var s = String(ln).trim(); if(!s) return;
      REFLOW_MARK.lastIndex = 0;
      var cuts=[], m;
      while((m = REFLOW_MARK.exec(s))){ var pos=m.index+m[1].length; if(take(m[2])) cuts.push(pos); }
      if(!cuts.length){ split.push({t:'text', s:s}); return; }
      if(cuts[0]>0) split.push({t:'text', s:s.slice(0,cuts[0]).trim()});
      for(var k=0;k<cuts.length;k++){
        var end=(k+1<cuts.length)?cuts[k+1]:s.length;
        split.push({t:'item', s:s.slice(cuts[k],end).trim()});
      }
    });
    // fase 2: funde continuações (minúscula/"(") ao segmento anterior
    var merged=[];
    split.forEach(function(o){
      if(!o.s) return;
      var isCont = o.t==='text' && /^[a-zà-ÿ(]/.test(o.s);
      if(merged.length && isCont) merged[merged.length-1].s = (merged[merged.length-1].s+' '+o.s).replace(/\s+/g,' ').trim();
      else merged.push(o);
    });
    // fase 3: separa cauda de especificador/codificação colada a um item
    var out=[];
    merged.forEach(function(o){ splitTrailing(o.s).forEach(function(p){ out.push(p); }); });
    return out.length ? out : lines;
  }
  // renderiza um array de linhas (prosa + listas) — usado nos critérios
  function renderRich(lines){
    lines = reflowCrit(lines);
    var out='', buf=[];
    function flush(){ if(buf.length){ out += sublistHtml(buf); buf=[]; } }
    lines.forEach(function(ln){
      var s = String(ln);
      var it = isSubItem(s);
      // item numerado terminando com ":" introduz uma sub-lista (ex.: TDAH
      // "1. Desatenção: ...:") -> vira sub-cabeçalho, e os a-i formam a lista
      if(it && /^\d+$/.test(it.m) && /:\s*$/.test(it.t)){
        flush();
        out += '<p class="rich-p rich-grp">'+esc(s)+'</p>';
        return;
      }
      if(it){ buf.push(it); }
      else { flush(); if(s.trim()) out += '<p class="rich-p">'+esc(s)+'</p>'; }
    });
    flush();
    return out;
  }

  function screenFicha(){
    var cat = CATS[state.activeCat];
    var disorder = cat.items[state.activeDisorder] || cat.items[0];
    var codes = (disorder.codes && disorder.codes.length) ? disorder.codes
              : [{cid:disorder.cid||'', dsm:disorder.dsm||'', label:''}];
    var primary = codes[0];
    var copyIco = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

    // ---- critérios (timeline) ----
    var critList = (disorder.criteria && disorder.criteria.length) ? disorder.criteria : null;
    function critItemHtml(cr){
      return '<div class="crit-item">'+
        '<span class="crit-badge">'+esc(cr.letter)+'</span>'+
        '<div class="crit-card" data-hover="box-shadow:0 6px 18px rgba(16,42,51,.08);transform:translateX(2px);">'+renderRich(cr.text.split('\n'))+'</div>'+
      '</div>';
    }
    var criteria;
    if(critList && critList.some(function(cr){ return cr.group; })){
      // critérios agrupados (ex.: bipolar — Episódio Maníaco/Hipomaníaco/...)
      var groups = [];
      critList.forEach(function(cr){
        var g = cr.group || '';
        if(!groups.length || groups[groups.length-1].g !== g) groups.push({g:g, items:[]});
        groups[groups.length-1].items.push(cr);
      });
      criteria = groups.map(function(grp){
        var tl = '<div class="crit-timeline">'+ grp.items.map(critItemHtml).join('') +'</div>';
        return grp.g ? '<div class="crit-group">'+esc(grp.g)+'</div>'+tl : tl;
      }).join('');
    } else if(critList){
      criteria = '<div class="crit-timeline">'+ critList.map(critItemHtml).join('') +'</div>';
    } else {
      criteria = '<div class="crit-empty">'+ICON.book+'<div>Esta é uma categoria residual ou de referência cruzada — não traz um conjunto próprio de critérios A–E no DSM-5-TR. Veja o resumo acima e as seções abaixo.</div></div>';
    }

    // texto introdutório dos critérios. Quando há critérios próprios, é um
    // intro curto/discreto acima da timeline. Quando NÃO há (categoria residual
    // ou referência cruzada), o próprio texto explica a categoria — então vira
    // um bloco legível e dispensa o box "sem critérios" (que soaria contraditório).
    var critIntro = '';
    if(disorder.criteriaIntro){
      if(critList){
        critIntro = '<p style="margin:0 0 14px;font-size:14px;line-height:1.55;color:var(--muted-2);">'+esc(disorder.criteriaIntro)+'</p>';
      } else {
        critIntro = '<div class="crit-ref">'+escMl(disorder.criteriaIntro)+'</div>';
        criteria = '';   // o bloco de referência já comunica a ausência de critérios
      }
    }

    // bloco(s) de especificador / subtipos — estruturado em blocos com opções
    var spec = disorder.specifier || [];
    var specBlock = spec.length
      ? '<div class="spec-wrap">'+ spec.map(function(blk){
          var opts = (blk.items||[]).map(function(o){
            var desc = o.desc || '';
            if(!o.label && /:\s*$/.test(desc)){            // linha-cabeçalho ("Código baseado em…:")
              return '<li class="spec-subhead">'+esc(desc)+'</li>';
            }
            var sp = splitSpecLabel(o.label || '');
            var name = sp.name ? '<b class="spec-opt-label">'+esc(sp.name)+'</b>' : '';
            var dtxt = desc ? (name ? ' ' : '')+esc(desc) : '';
            return '<li>'+(sp.code ? '<span class="spec-code">'+esc(sp.code)+'</span>' : '')+'<span>'+name+dtxt+'</span></li>';
          }).join('');
          var head = blk.head ? '<div class="spec-head">'+esc(blk.head)+'</div>' : '';
          return '<div class="spec-block">'+head+'<ul class="spec-list">'+opts+'</ul></div>';
        }).join('') +'</div>' : '';

    // nota dos critérios (terminologia/esclarecimentos — fora do critério)
    var noteBlock = disorder.criteriaNote
      ? '<div class="crit-note"><span class="crit-note-lbl">Nota</span><p>'+escMl(disorder.criteriaNote)+'</p></div>' : '';

    // ---- acordeões de seções narrativas (com ícone por tipo + id estável) ----
    var sections = disorder.sections || [];
    var accordions = sections.map(function(sec, i){
      var open = !!state.fichaOpen[i];
      var head = '<button data-action="toggleSec" data-arg="'+i+'" class="sec-acc-head'+(open?' open':'')+'" data-hover="background:var(--surface-2);">'+
        '<span class="sec-icon">'+sectionIcon(sec.title)+'</span>'+
        '<span class="sec-title">'+esc(sec.title)+'</span>'+
        '<span class="sec-chev'+(open?' open':'')+'">'+ICON.chevDown+'</span>'+
      '</button>';
      var body = '';
      if(open){
        var paras = '', lbuf = [];
        function flushL(){ if(lbuf.length){ paras += sublistHtml(lbuf); lbuf = []; } }
        sec.body.forEach(function(p){
          if(p && typeof p === 'object'){
            flushL();
            if(!p.text) paras += '<div class="sub-head">'+esc(p.lead)+'</div>';
            else paras += '<p class="has-lead"><strong class="sub-lead">'+esc(p.lead)+'</strong> '+esc(p.text)+'</p>';
            return;
          }
          var it = isSubItem(p);
          if(it){ lbuf.push(it); }
          else { flushL(); var s=String(p); if(s.trim()) paras += '<p>'+esc(s)+'</p>'; }
        });
        flushL();
        var imgs = (sec.images||[]).map(function(src){
          return '<img class="sec-img" src="'+esc(src)+'" alt="'+esc(sec.title)+' — DSM-5-TR" loading="lazy">';
        }).join('');
        var tbl = sec.table ? renderSecTable(sec.table) : '';
        var cap = sec.caption ? '<div class="sec-caption">'+esc(sec.caption)+'</div>' : '';
        body = '<div class="sec-acc-body">'+paras+tbl+imgs+cap+'</div>';
      }
      return '<div id="'+secId(i)+'"'+(open?' class="sec-open"':'')+'>'+head+body+'</div>';
    }).join('');
    var secControls = sections.length>1
      ? '<div class="sec-controls"><button data-action="expandAll" class="sec-ctl-btn" data-hover="border-color:var(--cat);color:var(--cat);">Expandir tudo</button><button data-action="collapseAll" class="sec-ctl-btn" data-hover="border-color:var(--cat);color:var(--cat);">Recolher tudo</button></div>'
      : '';
    var accordionsBlock = sections.length
      ? '<h3 class="ficha-h3 mt"><span class="bar"></span>Mais sobre o transtorno</h3>'+ secControls +
        '<div style="display:flex;flex-direction:column;gap:10px;">'+accordions+'</div>' : '';

    var summaryText = disorder.summary || 'Resumo não disponível para este quadro.';
    // "Resumo rápido": linha autoral (tldr) em vez do parágrafo clínico que
    // duplicava o Critério A; cai no summary quando ainda não há tldr curado.
    var hasTldr = !!(disorder.tldr && disorder.tldr.trim());
    var leadText = hasTldr ? disorder.tldr : summaryText;
    var leadLabel = hasTldr ? 'Em poucas palavras' : 'Resumo rápido';
    var ff = disorder.facts || {};
    var factChips = [['Início', ff.inicio], ['Prevalência', ff.prevalencia], ['Sexo', ff.sexo], ['Diferencial', ff.diferencial]]
      .filter(function(d){ return d[1] && String(d[1]).trim(); })
      .map(function(d){ return '<span class="fact-chip"><b>'+esc(d[0])+'</b>'+esc(d[1])+'</span>'; }).join('');
    var factsHtml = factChips ? '<div class="ficha-facts">'+factChips+'</div>' : '';

    // ---- chips de código primário (header — visíveis em qualquer tela) ----
    var chips = '<div class="ficha-code-chips">'+
      (primary.cid ? '<span class="code-chip"><span class="lbl">'+noTr('cid10','CID-10')+'</span><b>'+esc(primary.cid)+'</b></span>' : '')+
      (primary.dsm ? '<span class="code-chip"><span class="lbl">DSM-5-TR</span><b>'+esc(primary.dsm)+'</b></span>' : '')+
    '</div>';

    // ---- rail: índice de seções (quick-jump) ----
    var indexCard = sections.length
      ? '<div class="rail-card rail-index"><div class="rail-label">Nesta ficha</div><div class="ficha-index">'+
        sections.map(function(sec,i){
          return '<button class="ficha-index-item" data-action="jumpToSection" data-arg="'+i+'" data-hover="background:var(--surface-2);color:var(--ink);">'+sectionIcon(sec.title)+'<span>'+esc(sec.title)+'</span></button>';
        }).join('')+
      '</div></div>' : '';

    // ---- rail: card de códigos (mini-tabela + copiar) ----
    function copyBtn(label){
      return '<button class="code-copy" data-action="copyCode" data-arg="'+esc(label)+'" data-hover="border-color:var(--cat);color:var(--cat);" title="Copiar código">'+copyIco+'</button>';
    }
    function codeRow(lbl, val, copyLabel){
      if(!val) return '';   // TR usa só ICD-10-CM; não mostra linha sem código (ex.: DSM-5-TR vazio)
      return '<div class="codes-row"><span class="ct-label">'+lbl+'</span><span class="ct-val"><span class="ct-code">'+esc(val)+'</span>'+copyBtn(copyLabel)+'</span></div>';
    }
    var codesInner;
    var hasCode = codes.some(function(c){ return (c.cid||c.dsm); });
    if(!hasCode){
      // induzidos por substância/medicamento: código depende da substância;
      // os "Induzidos por Outra Substância/Sedativos" são referência cruzada.
      var codeNote = /induzid[oa] por subst[âa]ncia\/medicamento/i.test(disorder.n)
        ? 'O código depende da substância/medicamento e do contexto (intoxicação ou abstinência).'
        : 'Quadro de referência cruzada — descrito nos capítulos correspondentes, sem código próprio.';
      codesInner = '<div class="rail-label">Código</div><p style="margin:7px 0 0;font-size:12.5px;line-height:1.5;color:var(--muted-2);">'+codeNote+'</p>';
    } else if(codes.length>1){
      codesInner = '<div class="rail-label">Códigos por '+(codes.length>2?'tipo':'variante')+'</div>'+
        codes.map(function(c){
          return (c.label?'<div class="codes-var-label">'+esc(c.label)+'</div>':'')+
            '<div class="codes-table">'+codeRow(noTr('cid10','CID-10'),c.cid, 'CID '+c.cid)+codeRow('DSM-5-TR', c.dsm, 'DSM '+c.dsm)+'</div>';
        }).join('');
    } else {
      var c0 = codes[0];
      codesInner = '<div class="rail-label">Códigos</div><div class="codes-table">'+codeRow(noTr('cid10','CID-10'),c0.cid, 'CID '+c0.cid)+codeRow('DSM-5-TR', c0.dsm, 'DSM '+c0.dsm)+'</div>';
    }
    var codesCard = '<div class="rail-card">'+codesInner+'</div>';

    // ---- rail: selo de revisão (integra o progresso) ----
    var revisedCard = '';
    if(tracking()){
      revisedCard = isRevised(state.activeCat, disorder)
        ? '<div class="revised-badge"><span class="rb-icon">'+ICON.knowCheck+'</span><span class="rb-text">Revisado</span><button data-action="toggleRevised" class="rb-toggle">desmarcar</button></div>'
        : '<button data-action="toggleRevised" class="revise-cta" data-hover="border-color:var(--cat);color:var(--cat);">'+ICON.knowCheck+'Marcar como revisado</button>';
    }
    var reportBtn = tracking()
      ? '<button data-action="reportFicha" class="report-cta" data-hover="border-color:var(--cat);color:var(--cat);">'+ICON.message+'Reportar erro nesta ficha</button>'
      : '';

    // ---- navegação anterior/próximo (próximo nomeado) ----
    var pIdx = adjIndex(cat, state.activeDisorder, -1), nIdx = adjIndex(cat, state.activeDisorder, +1);
    var prevItem = pIdx>=0 ? cat.items[pIdx] : null;
    var nextItem = nIdx>=0 ? cat.items[nIdx] : null;
    var nav = '<div class="ficha-nav">'+
      (prevItem ? '<button data-action="prevDisorder" class="nav-prev" data-hover="border-color:var(--cat);color:var(--cat);" data-active="transform:scale(.96);">'+ICON.chevLsm+'Anterior</button>' : '<span></span>')+
      (nextItem ? '<button data-action="nextDisorder" class="nav-next" data-hover="filter:brightness(.92);transform:translateX(2px);" data-active="transform:scale(.97);" title="'+esc(nextItem.n)+'"><span class="nn-col"><span class="nn-lbl">Próximo</span><span class="nn-name">'+esc(shortName(nextItem.n))+'</span></span>'+ICON.chevRsm+'</button>' : '')+
    '</div>';

    return ''+
    '<section class="ficha-screen" style="--cat:'+cat.color+';--cat-soft:'+cat.color+'1A;max-width:980px;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      '<button data-action="backToCategoria" data-hover="color:var(--cat);" style="background:none;border:none;color:var(--muted);font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;padding:0;margin-bottom:18px;">'+ICON.back+esc(cat.name)+'</button>'+

      '<div class="ficha-grid">'+
        '<div>'+
          '<span class="ficha-tag">'+esc(cat.name)+'</span>'+
          '<h1 class="ficha-title">'+esc(disorder.n)+'</h1>'+
          chips+

          '<div class="ficha-summary"><span class="fs-icon">'+ICON.info+'</span><div><div class="fs-label">'+leadLabel+'</div><p>'+esc(leadText)+'</p>'+factsHtml+'</div></div>'+

          '<h3 class="ficha-h3"><span class="bar"></span>Critérios diagnósticos</h3>'+
          critIntro+
          criteria+
          noteBlock+
          specBlock+

          accordionsBlock+

          nav+
        '</div>'+

        '<aside class="ficha-rail" style="display:flex;flex-direction:column;gap:16px;position:sticky;top:90px;">'+
          indexCard+
          codesCard+
          '<button data-action="goFlashcards" class="fc-card" data-hover="background:var(--warm-hover);">'+
            ICON.cards+
            '<div><div class="fc-t1">Revisar com flashcards</div><div class="fc-t2">memorize os critérios</div></div>'+
          '</button>'+
          revisedCard+
          reportBtn+
        '</aside>'+
      '</div>'+
    '</section>';
  }

  /* =========================================================
     TELA: EXERCÍCIOS (hub)
     ========================================================= */
  /* ---------------------------------------------------------
     Decks de flashcards (um por categoria, gerados das fichas)
     --------------------------------------------------------- */
  var DECK_ICON = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>';
  function deckCards(ci){
    var c = CATS[ci]; if(!c) return [];
    return (c.items||[]).map(function(d, di){
      if(hiddenReduced(d)) return null;                 // modo reduzido: sem residuais
      var sum = (d.summary||'').trim();
      if(!sum || /não disponível/i.test(sum)) return null;
      return { front:d.n, back:sum, tldr:(d.tldr||'').trim(), facts:d.facts||null,
        code:(d.code||d.cid||d.dsm||''), cat:c.name, color:c.color, ci:ci, di:di };
    }).filter(Boolean);
  }
  function allCards(){ var out=[]; CATS.forEach(function(_,ci){ out=out.concat(deckCards(ci)); }); return out; }
  // todos os nomes de transtorno (p/ casar diagnósticos diferenciais -> distratores)
  var ALL_NAMES = null;
  function allNames(){ if(!ALL_NAMES){ ALL_NAMES=[]; CATS.forEach(function(c){ (c.items||[]).forEach(function(d){ ALL_NAMES.push(d.n); }); }); } return ALL_NAMES; }
  function shuffle(arr){
    var a=arr.slice();
    for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; }
    return a;
  }
  function currentDeck(){ return state.deckCat===-1 ? (state.deckAll||[]) : deckCards(state.deckCat); }

  /* ---------------------------------------------------------
     Mascaramento do nome do transtorno no enunciado.
     Evita que o resumo/critério entregue a resposta: troca o
     nome e suas flexões (por prefixo) por uma lacuna "______".
     --------------------------------------------------------- */
  var QUIZ_BLANK = '______';
  var QZ_STOP = {transtorno:1,transtornos:1,de:1,da:1,do:1,dos:1,das:1,e:1,ou:1,com:1,sem:1,na:1,no:1,a:1,o:1,por:1,outro:1,outra:1,outros:1,outras:1,nao:1,um:1,uma:1,que:1,em:1,ao:1,tipo:1,devido:1,relacionado:1,relacionados:1,especificado:1,especificada:1,induzido:1,induzida:1,i:1,ii:1,maior:1,geral:1,grave:1,leve:1};
  function qzNorm(s){ return (s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''); }
  function qzStems(name){
    var toks = qzNorm(name).split(/[^a-z0-9]+/).filter(function(t){ return t.length>=4 && !QZ_STOP[t]; });
    var seen={}, out=[];
    toks.forEach(function(t){ var st=t.slice(0, Math.min(t.length,6)); if(!seen[st]){ seen[st]=1; out.push(st); } });
    return out;
  }
  function maskName(text, name){
    var stems = qzStems(name); if(!stems.length || !text) return text;
    var out = text.replace(/[0-9A-Za-zÀ-ÿ]+(?:-[0-9A-Za-zÀ-ÿ]+)*/g, function(w){
      var nw = qzNorm(w);
      for(var i=0;i<stems.length;i++){ if(nw.indexOf(stems[i])===0) return QUIZ_BLANK; }
      return w;
    });
    return out.replace(/______(?:[\s/–-]+______)+/g, QUIZ_BLANK); // colapsa lacunas adjacentes
  }

  /* questionário "pelo resumo": tldr (mascarado) -> nome */
  var QUIZ_LEN = 10;
  // distratores a partir dos diagnósticos diferenciais REAIS (facts.diferencial):
  // casa cada termo do diferencial com um nome de transtorno do acervo, forçando
  // o aluno a distinguir quadros parecidos. Cai em aleatório quando faltar.
  // categorias residuais são distratores ruins — usa o predicado global isResidual.
  function isResidualName(n){ return isResidual(n); }
  function difDistractors(card){
    var dif = card.facts && card.facts.diferencial; if(!dif) return [];
    var pool = allNames();
    var poolN = pool.map(qzNorm);
    var frontN = qzNorm(card.front);
    var out = [], seen = {};
    dif.split(/[;,]|\s+e\s+/).forEach(function(part){
      var np = qzNorm(part).trim(); if(np.length < 4) return;
      var match = null;
      for(var i=0;i<pool.length;i++){
        if(poolN[i]===frontN || isResidualName(pool[i])) continue;
        if(np.indexOf(poolN[i])>=0 || poolN[i].indexOf(np)>=0){ match = pool[i]; break; }
      }
      if(!match){                                  // fallback: sobreposição de tokens
        var pt = np.split(/[^a-z0-9]+/).filter(function(t){ return t.length>=5; });
        for(var j=0;j<pool.length && pt.length;j++){
          if(poolN[j]===frontN || isResidualName(pool[j])) continue;
          var nt = poolN[j].split(/[^a-z0-9]+/).filter(function(t){ return t.length>=5; });
          if(pt.filter(function(t){ return nt.indexOf(t)>=0; }).length>=2){ match = pool[j]; break; }
        }
      }
      if(match && !seen[match] && match!==card.front){ seen[match]=1; out.push(match); }
    });
    return out.slice(0,3);
  }
  function pickDistractors(card, names, pool){
    var distr = difDistractors(card);                       // 1º: diferenciais reais
    function fill(src){ shuffle(src).forEach(function(n){ if(distr.length<3 && n!==card.front && distr.indexOf(n)<0) distr.push(n); }); }
    fill(names);                                            // 2º: nomes do mesmo conjunto
    fill(pool);                                             // 3º: qualquer transtorno
    return distr.slice(0,3);
  }
  function buildQuiz(items){
    var pool = allCards().map(function(x){ return x.front; });
    var names = items.map(function(x){ return x.front; });
    return shuffle(items).slice(0, QUIZ_LEN).map(function(card){
      var opts = shuffle([card.front].concat(pickDistractors(card, names, pool)));
      return { q: maskName(card.tldr || card.back, card.front), opts: opts, correct: opts.indexOf(card.front), cat: card.cat, color: card.color, ci: card.ci, di: card.di };
    });
  }

  /* ---------------------------------------------------------
     Critérios DISTINTIVOS para o questionário "por critério".
     Evita questões ambíguas (com >1 diagnóstico possível):
      · genéricos do DSM (sofrimento/prejuízo, exclusão por substância/condição
        médica, "não é mais bem explicado…", "não ocorre exclusivamente…");
      · critério-modelo de uso de substância (idêntico entre substâncias);
      · critérios cujo texto (com o nome mascarado) se repete em ≥2 transtornos.
     --------------------------------------------------------- */
  // critérios de EXCLUSÃO (nunca são o aspecto característico) — barrados em
  // qualquer tamanho, mesmo quando longos por listarem exemplos/notas.
  var EXCLUSION_CRIT = [
    /nao (e|sao) mais bem explicad/,
    /nao ocorre exclusivamente durante/,
    /efeitos fisiologicos (diretos )?de (uma|alguma)? ?substancia/,
    /nao (e|se deve|sao|esta) ?atribuiv\w*.*(substancia|condicao medica|medicamento|neurolog)/,
    /nao (e|sao) atribuiv\w* a (outra|alguma|uma) condicao/,
    /nao (e|sao) atribuiv\w* a (deficiencia|condicoes congenitas|um deficit|outro prejuizo)/,
    /nao (e|sao) consequencia (dos|de) efeitos/
  ];
  // critério de PREJUÍZO/sofrimento — só é genérico quando é a frase isolada
  // (curto); em critério politético longo ele faz parte do enunciado característico.
  var IMPAIRMENT_CRIT = [
    /sofrimento clinicamente significativo/,
    /prejuizo (clinicamente significativo|no funcionamento|nas? (relacoes|areas)|em (outras )?areas? importantes)/
  ];
  var TEMPLATE_CRIT = [ /^um padrao (problematico )?de uso de/ ];  // uso de substância: ambíguo entre substâncias
  function critPlain(t){ return qzNorm(t).replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim(); }
  function ambiguousCrit(text){
    var n = critPlain(text);
    if(TEMPLATE_CRIT.some(function(re){ return re.test(n); })) return true;
    if(EXCLUSION_CRIT.some(function(re){ return re.test(n); })) return true;
    return text.length < 300 && IMPAIRMENT_CRIT.some(function(re){ return re.test(n); });
  }
  // "saco" de tokens significativos do critério com o nome do transtorno mascarado
  function critBag(text, name){
    var seen={}, out=[];
    critPlain(maskName(text, name)).split(' ').forEach(function(t){ if(t.length>=5 && !seen[t]){ seen[t]=1; out.push(t); } });
    return out.sort().join(' ');
  }
  var CRIT_BAG_IDX = null;
  function critBagIdx(){
    if(CRIT_BAG_IDX) return CRIT_BAG_IDX;
    var idx={};
    CATS.forEach(function(c){ (c.items||[]).forEach(function(d){ (d.criteria||[]).forEach(function(cr){
      if(!cr || (cr.text||'').trim().length < 25) return;
      var b = critBag(cr.text, d.n); if(!b) return;
      (idx[b] = idx[b] || {})[d.n] = 1;
    }); }); });
    CRIT_BAG_IDX = idx; return idx;
  }
  function distinctiveCrits(d){
    if(!Array.isArray(d.criteria)) return [];
    var idx = critBagIdx();
    return d.criteria.filter(function(cr){
      var t = (cr.text||'').trim();
      if(t.length < 25 || ambiguousCrit(t)) return false;
      var b = critBag(cr.text, d.n);
      if(b && idx[b] && Object.keys(idx[b]).length >= 2) return false;   // compartilhado entre transtornos
      return true;
    });
  }

  /* questionário "por critério diagnóstico": um critério A–E -> nome. Só usa
     transtornos com critérios DISTINTIVOS (que apontam para um único diagnóstico). */
  function critCards(ci){
    var cats = ci===-1 ? CATS.map(function(c,i){ return {c:c,i:i}; }) : [{c:CATS[ci],i:ci}];
    var out=[];
    cats.forEach(function(o){ if(!o.c) return; (o.c.items||[]).forEach(function(d,di){
      if(hiddenReduced(d)) return;
      var crit = distinctiveCrits(d);
      if(!crit.length) return;
      out.push({ front:d.n, crit:crit, facts:d.facts||null, cat:o.c.name, color:o.c.color, ci:o.i, di:di });
    }); });
    return out;
  }
  function buildCritQuiz(ci){
    var items = critCards(ci);
    if(!items.length) return [];
    var names = items.map(function(x){ return x.front; });
    var pool = (ci===-1 ? items : critCards(-1)).map(function(x){ return x.front; });
    return shuffle(items).slice(0, QUIZ_LEN).map(function(card){
      var opts = shuffle([card.front].concat(pickDistractors(card, names, pool)));
      var ch = card.crit[Math.floor(Math.random()*card.crit.length)];
      return { q: maskName((ch.text||'').trim(), card.front), qlabel:'Critério '+(ch.letter||''),
        prompt:'De qual transtorno é este critério diagnóstico?',
        opts: opts, correct: opts.indexOf(card.front), cat: card.cat, color: card.color, ci: card.ci, di: card.di };
    });
  }

  /* questionário "por fatos / epidemiologia": início + prevalência + sexo ->
     nome. Distratores = diferenciais reais do próprio transtorno (quadros
     parecidos). Só usa fichas com pelo menos 2 desses fatos. */
  function factCards(ci){
    var cats = ci===-1 ? CATS.map(function(c,i){ return {c:c,i:i}; }) : [{c:CATS[ci],i:ci}];
    var out=[];
    cats.forEach(function(o){ if(!o.c) return; (o.c.items||[]).forEach(function(d,di){
      if(hiddenReduced(d)) return;
      var f = d.facts; if(!f) return;
      if(['inicio','prevalencia','sexo'].filter(function(k){ return f[k]; }).length < 2) return;
      out.push({ front:d.n, facts:f, cat:o.c.name, color:o.c.color, ci:o.i, di:di });
    }); });
    return out;
  }
  function buildFactQuiz(ci){
    var items = factCards(ci);
    if(!items.length) return [];
    var names = items.map(function(x){ return x.front; });
    var pool = allCards().map(function(x){ return x.front; });
    return shuffle(items).slice(0, QUIZ_LEN).map(function(card){
      var opts = shuffle([card.front].concat(pickDistractors(card, names, pool)));
      var f = card.facts;
      var rows = [['Início', f.inicio], ['Prevalência', f.prevalencia], ['Predomínio por sexo', f.sexo]]
        .filter(function(r){ return r[1]; })
        .map(function(r){ return { label:r[0], value:maskName(String(r[1]), card.front) }; });
      return { factsList:rows, prompt:'Qual transtorno tem este perfil epidemiológico?',
        opts: opts, correct: opts.indexOf(card.front), cat: card.cat, color: card.color, ci: card.ci, di: card.di };
    });
  }

  // dispatcher: monta o set conforme o tipo escolhido (com fallback)
  function buildQuizSet(kind, ci){
    if(kind==='criterio'){ var s=buildCritQuiz(ci); if(s.length) return s; }
    if(kind==='fatos'){ var fz=buildFactQuiz(ci); if(fz.length) return fz; }
    return buildQuiz(ci===-1 ? allCards() : deckCards(ci));
  }

  // grade dos 20 decks (reutilizada por flashcards e quiz); unit = 'cartões' | 'questões'
  // bloco de stats compartilhado (atividades feitas + fichas revisadas)
  function deckStatsHtml(d, aColor){
    if(!tracking()) return '';
    return '<div class="deck-stats">'+
      '<div class="deck-feitas" style="color:'+aColor+';"><b>'+d.feitas+'</b> '+(d.feitas===1?'atividade feita':'atividades feitas')+'</div>'+
      '<div class="deck-prog"><span style="width:'+d.pct+'%;background:'+d.c.color+';"></span></div>'+
      '<div class="deck-prog-lbl">'+d.rev+' / '+d.total+' fichas revisadas</div>'+
    '</div>';
  }
  function deckNum(c, ci){ return '<span class="deck-num" style="color:'+c.color+';background:'+c.color+'14;">'+(ci+1<10?'0':'')+(ci+1)+'</span>'; }
  // FLASHCARDS — cara de "pilha de cartões" (laranja)
  function flashDeckCard(d){
    var c=d.c, ci=d.ci, A='#FF7A45';
    return '<div class="deck-stack">'+
      '<button data-action="'+d.action+'" data-arg="'+ci+'" class="deck-card deck-flash" data-hover="border-color:'+A+';transform:translateY(-4px);box-shadow:0 14px 30px rgba(16,42,51,.10);" data-active="transform:translateY(-1px) scale(.99);">'+
        '<div class="deck-top">'+
          '<span class="deck-icon" style="background:#FFEDE3;">'+EX_ICON.flashcards+'</span>'+ deckNum(c,ci)+
        '</div>'+
        '<div class="deck-name">'+esc(c.name)+'</div>'+
        '<div class="deck-count-row"><b style="color:'+A+';">'+d.n+'</b> cartões · '+d.total+' transtornos</div>'+
        deckStatsHtml(d, A)+
      '</button>'+
    '</div>';
  }
  // QUIZ — cara de "questão de múltipla escolha" (azul)
  function quizDeckCard(d){
    var c=d.c, ci=d.ci, A='#4361EE';
    var opts = '<div class="quiz-opts"><span></span><span></span><span></span></div>';
    return '<button data-action="'+d.action+'" data-arg="'+ci+'" class="deck-card deck-quiz" style="border-top:3px solid '+A+';" data-hover="border-color:'+A+';transform:translateY(-4px);box-shadow:0 14px 30px rgba(16,42,51,.10);" data-active="transform:translateY(-1px) scale(.99);">'+
      '<div class="deck-top">'+
        '<span class="deck-icon quiz-q" style="background:#E8ECFB;color:'+A+';">?</span>'+ deckNum(c,ci)+
      '</div>'+
      '<div class="deck-name">'+esc(c.name)+'</div>'+
      '<div class="deck-count-row"><b style="color:'+A+';">'+d.n+'</b> questões · '+d.total+' transtornos</div>'+
      opts+
      deckStatsHtml(d, A)+
    '</button>';
  }
  function deckGrid(action, unit, mode){
    mode = mode || {};
    var feitas = activityCountsByCat(mode.tipo);
    return CATS.map(function(c, ci){
      var count = deckCards(ci).length, total = state.reduced ? visibleItems(c).length : c.items.length;
      if(state.reduced && total===0) return '';        // categoria residual: sem deck
      var rev = Math.min(total, tracking() ? catRevisedCount(ci) : Math.round(total*(c.prog||0)));
      var n = unit==='questões' ? Math.min(QUIZ_LEN, count) : count;
      var d = { c:c, ci:ci, action:action, n:n, total:total, rev:rev,
                pct: total ? Math.round(rev/total*100) : 0, feitas: feitas[ci] };
      return mode.variant==='quiz' ? quizDeckCard(d) : flashDeckCard(d);
    }).join('');
  }

  function startQuiz(set){
    state.quizSet = set; state.quizScore = 0; state.quizDone = false;
    setState({screen:'quiz', quizIndex:0, quizSelected:null, quizAnswered:false});
    scrollTop();
  }

  /* ---------------------------------------------------------
     CLASSIFICAR: arrastar transtornos para a categoria (5 fases)
     --------------------------------------------------------- */
  // clusters de categorias confundíveis (índices ci) p/ as fases difíceis
  var CONFUSABLE = [
    [4,5,6,7,8],   // ansiedade · TOC · trauma · dissociativos · somáticos
    [2,3],         // bipolar · depressivos
    [15,16],       // substâncias · neurocognitivos
    [14,17],       // disruptivos · personalidade
  ];
  var CLASSIFY_PHASES = [
    {bins:3, chips:6, hard:false},
    {bins:3, chips:7, hard:false},
    {bins:4, chips:8, hard:false},
    {bins:4, chips:8, hard:true},
    {bins:5, chips:9, hard:true},
  ];
  function pickCats(k, hard){
    var pool;
    if(hard){
      pool = CONFUSABLE[Math.floor(Math.random()*CONFUSABLE.length)].slice();
      while(pool.length < k){ var r=Math.floor(Math.random()*CATS.length); if(pool.indexOf(r)<0) pool.push(r); }
      return shuffle(pool).slice(0,k);
    }
    return shuffle(CATS.map(function(_,i){return i;})).slice(0,k);
  }
  function buildPhase(pi){
    var cfg = CLASSIFY_PHASES[pi] || CLASSIFY_PHASES[CLASSIFY_PHASES.length-1];
    var cats = pickCats(cfg.bins, cfg.hard).filter(function(ci){ return deckCards(ci).length>0; });
    var bins = cats.map(function(ci){ return { ci:ci, name:CATS[ci].name, color:CATS[ci].color }; });
    var perCat = {};
    cats.forEach(function(ci){ perCat[ci] = shuffle(deckCards(ci)); });
    var chips = [];
    cats.forEach(function(ci){ if(perCat[ci].length){ chips.push({ name:perCat[ci].shift().front, ci:ci, color:CATS[ci].color }); } });
    var guard=0;
    while(chips.length < cfg.chips && guard++<200){
      var ci = cats[Math.floor(Math.random()*cats.length)];
      if(perCat[ci].length){ chips.push({ name:perCat[ci].shift().front, ci:ci, color:CATS[ci].color }); }
    }
    return { bins:bins, pool: shuffle(chips) };
  }
  function startPhase(pi){
    var board = buildPhase(pi);
    state.classifyPhase = pi; state.classifyBoard = board;
    state.classifyPlaced = {}; state.classifyLocked = {}; state.classifySel = null;
    state.classifyChecked = false; state.classifyPhaseComplete = false;
    state.classifyTotal += board.pool.length;
    setState({screen:'ligar'}); scrollTop();
  }
  function classifyPlaceImpl(id, target){
    id = Number(id);
    if(state.classifyLocked[id]) return;
    if(target==='pool' || target==null){ delete state.classifyPlaced[id]; }
    else { state.classifyPlaced[id] = Number(target); }
    state.classifySel = null;
    setState({});
  }
  var classifyJustDropped = false;   // suprime o "click" logo após um arrasto

  function exModeCard(m){
    var iconWrap = "width:52px;height:52px;border-radius:14px;background:"+m.bg+";display:flex;align-items:center;justify-content:center;";
    var chip = "font-size:11.5px;font-weight:700;color:"+m.color+";background:"+m.bg+";border-radius:8px;padding:5px 11px;white-space:nowrap;";
    var act = m.action ? ('data-action="'+m.action+'"') : ('data-action="goScreen" data-arg="'+m.screen+'"');
    return '<button '+act+' data-hover="border-color:#5BC0BE;transform:translateY(-3px);box-shadow:0 12px 28px rgba(16,42,51,.09);" data-active="transform:translateY(-1px) scale(.99);" style="text-align:left;background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:24px;cursor:pointer;display:flex;flex-direction:column;gap:0;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease;">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;width:100%;margin-bottom:16px;">'+
        '<div style="'+iconWrap+'">'+EX_ICON[m.key]+'</div>'+
        '<span style="'+chip+'">'+m.chipText+'</span>'+
      '</div>'+
      '<div style="font:700 18px \'Bricolage Grotesque\';color:var(--ink);">'+esc(m.title)+'</div>'+
      '<p style="margin:6px 0 0;font-size:13.5px;color:var(--muted);font-weight:500;line-height:1.45;">'+esc(m.desc)+'</p>'+
    '</button>';
  }

  // hub: os 4 modos de atividade
  function screenExercicios(){
    var cards = EX_MODES.map(exModeCard).join('');
    return ''+
    '<section style="max-width:1000px;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      '<div style="font-size:13px;font-weight:600;color:var(--muted);margin-bottom:8px;">Exercícios</div>'+
      reducedToggle()+
      '<h1 style="font:800 28px \'Bricolage Grotesque\';letter-spacing:-.5px;margin:18px 0 6px;">Coloque seu conhecimento à prova</h1>'+
      '<p style="margin:0 0 26px;color:var(--muted-2);font-size:15px;max-width:620px;">Quatro modos de praticar o conteúdo do DSM-5-TR.'+(state.reduced?' <b>Modo reduzido:</b> sem categorias residuais.':'')+'</p>'+
      '<div class="ex-grid">'+cards+'</div>'+
    '</section>';
  }

  // seletor: flashcards por categoria ou geral (aleatório)
  function modeOption(action, ico, icoColor, icoBg, title, desc){
    return '<button data-action="'+action+'" data-hover="border-color:#5BC0BE;transform:translateY(-3px);box-shadow:0 12px 28px rgba(16,42,51,.09);" data-active="transform:translateY(-1px) scale(.99);" style="text-align:left;background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:24px;cursor:pointer;display:flex;flex-direction:column;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease;">'+
      '<div style="width:52px;height:52px;border-radius:14px;background:'+icoBg+';color:'+icoColor+';display:flex;align-items:center;justify-content:center;margin-bottom:16px;">'+ico+'</div>'+
      '<div style="font:700 18px \'Bricolage Grotesque\';color:var(--ink);">'+esc(title)+'</div>'+
      '<p style="margin:6px 0 0;font-size:13.5px;color:var(--muted);font-weight:500;line-height:1.45;">'+esc(desc)+'</p>'+
    '</button>';
  }
  function screenFlashMode(){
    var icoCat = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>';
    var icoRnd = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="m15 15 6 6"/><path d="M4 4l5 5"/></svg>';
    return ''+
    '<section style="max-width:760px;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      backBtn('goExercicios','Exercícios')+
      '<h1 style="font:800 28px \'Bricolage Grotesque\';letter-spacing:-.5px;margin:0 0 6px;">Flashcards</h1>'+
      '<p style="margin:0 0 26px;color:var(--muted-2);font-size:15px;max-width:560px;">Como você quer revisar?</p>'+
      '<div class="ex-grid">'+
        modeOption('goDecks',   icoCat, '#FF7A45', '#FFEDE3', 'Por categoria', 'Escolha um dos 20 decks — um capítulo do DSM-5-TR por vez.')+
        modeOption('flashRandom', icoRnd, '#0E6A66', '#F0F8F7', 'Geral (aleatório)', 'Todos os '+allCards().length+' cartões embaralhados, de todas as categorias.')+
      '</div>'+
    '</section>';
  }

  // grade dos 20 decks (flashcards)
  function screenDecks(){
    return ''+
    '<section style="max-width:1080px;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      backBtn('goFlashMode','Flashcards')+
      '<h1 style="font:800 26px \'Bricolage Grotesque\';letter-spacing:-.5px;margin:0 0 6px;">Decks por categoria</h1>'+
      '<p style="margin:0 0 24px;color:var(--muted-2);font-size:14.5px;max-width:600px;">20 capítulos do DSM-5-TR — escolha um deck para revisar com flashcards.</p>'+
      '<div class="deck-grid">'+deckGrid('openDeck','cartões',{variant:'flash',tipo:'flashcard'})+'</div>'+
    '</section>';
  }

  // seletor de modo do questionário (por categoria / geral)
  function screenQuizMode(){
    var icoCat = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>';
    var icoRnd = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="m15 15 6 6"/><path d="M4 4l5 5"/></svg>';
    return ''+
    '<section style="max-width:760px;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      backBtn('goExercicios','Exercícios')+
      '<h1 style="font:800 28px \'Bricolage Grotesque\';letter-spacing:-.5px;margin:0 0 6px;">Questionário</h1>'+
      '<p style="margin:0 0 22px;color:var(--muted-2);font-size:15px;max-width:560px;">Escolha o tipo de questão e como praticar.</p>'+
      '<div style="font-size:12px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;color:var(--muted);margin:4px 0 10px;">Pelo resumo clínico</div>'+
      '<div class="ex-grid">'+
        modeOption('quizNomeDecks', icoCat, '#4361EE', '#E8ECFB', 'Por categoria', 'Leia o resumo (com o nome oculto) e identifique o transtorno — um capítulo por vez.')+
        modeOption('quizNomeRandom', icoRnd, '#0E6A66', '#F0F8F7', 'Geral (aleatório)', QUIZ_LEN+' resumos sorteados de todas as categorias.')+
      '</div>'+
      '<div style="font-size:12px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;color:var(--muted);margin:26px 0 10px;">Por critério diagnóstico</div>'+
      '<div class="ex-grid">'+
        modeOption('quizCritDecks', icoCat, '#7C3AED', '#F1E9FB', 'Por categoria', 'Receba um critério A–E e diga de qual transtorno é — um capítulo por vez.')+
        modeOption('quizCritRandom', icoRnd, '#0E6A66', '#F0F8F7', 'Geral (aleatório)', QUIZ_LEN+' critérios sorteados de todas as categorias.')+
      '</div>'+
      '<div style="font-size:12px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;color:var(--muted);margin:26px 0 10px;">Por fatos / epidemiologia</div>'+
      '<div class="ex-grid">'+
        modeOption('quizFatosDecks', icoCat, '#C2410C', '#FBE7DE', 'Por categoria', 'Veja o perfil (início, prevalência, sexo) e identifique o transtorno — as opções são quadros parecidos.')+
        modeOption('quizFatosRandom', icoRnd, '#0E6A66', '#F0F8F7', 'Geral (aleatório)', QUIZ_LEN+' perfis sorteados de todas as categorias.')+
      '</div>'+
    '</section>';
  }
  // grade dos 20 decks (questionário)
  function screenQuizDecks(){
    return ''+
    '<section style="max-width:1080px;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      backBtn('goQuizMode','Questionário')+
      '<h1 style="font:800 26px \'Bricolage Grotesque\';letter-spacing:-.5px;margin:0 0 6px;">Questionário · '+(state.quizKind==='criterio'?'por critério':state.quizKind==='fatos'?'por fatos':'pelo resumo')+'</h1>'+
      '<p style="margin:0 0 24px;color:var(--muted-2);font-size:14.5px;max-width:600px;">Escolha um capítulo do DSM-5-TR para responder.</p>'+
      '<div class="deck-grid">'+deckGrid('openQuizDeck','questões',{variant:'quiz',tipo:'quiz'})+'</div>'+
    '</section>';
  }

  function backBtn(action, label){
    return '<button data-action="'+action+'" data-hover="color:var(--teal-text);" style="background:none;border:none;color:var(--muted);font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;padding:0;margin-bottom:20px;">'+ICON.back+(label||'Voltar')+'</button>';
  }
  function backToEx(label){ return backBtn('goExercicios', label||'Exercícios'); }

  /* =========================================================
     TELA: FLASHCARDS
     ========================================================= */
  function screenFlashcards(){
    var deck = currentDeck();
    var geral = state.deckCat === -1;
    if(!deck.length){
      return '<section style="max-width:640px;margin:0 auto;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+backBtn('goDecks','Decks')+
        '<p style="color:var(--muted);font-size:14.5px;">Este deck ainda não tem cartões.</p></section>';
    }
    if(state.fcIndex >= deck.length) state.fcIndex = 0;
    var fc = deck[state.fcIndex];
    var ccolor = fc.color || '#0E4D64';     // cor da categoria deste cartão
    var clabel = geral ? (fc.cat || 'Aleatório') : (fc.cat || '');
    var pct = Math.round((state.fcIndex+1)/deck.length*100);
    var bar = '<div style="width:'+pct+'%;height:100%;background:linear-gradient(90deg,#FF7A45,#FFA06B);border-radius:99px;transition:width .5s cubic-bezier(.2,.7,.3,1);"></div>';

    var face;
    if(state.fcFlipped){
      face = '<div style="position:absolute;inset:0;background:var(--accent-bg);border:1.5px solid #9DD9D2;border-radius:24px;"></div>'+
        '<span style="position:absolute;top:18px;left:20px;font-size:10.5px;font-weight:800;letter-spacing:.8px;color:#5BC0BE;z-index:1;">RESPOSTA</span>'+
        '<div style="position:relative;z-index:1;font:600 19px \'Bricolage Grotesque\';text-align:center;line-height:1.5;color:var(--teal-text);text-wrap:balance;animation:popIn .32s cubic-bezier(.2,.7,.3,1) both;">'+esc(fc.back)+'</div>';
    } else {
      face = '<div style="position:absolute;inset:0;background:var(--surface);border:1.5px solid var(--border);border-radius:24px;"></div>'+
        '<span style="position:absolute;top:18px;left:20px;font-size:10.5px;font-weight:800;letter-spacing:.8px;color:var(--muted);z-index:1;">TERMO</span>'+
        '<div style="position:relative;z-index:1;font:700 24px \'Bricolage Grotesque\';text-align:center;line-height:1.3;color:var(--ink);text-wrap:balance;animation:popIn .32s cubic-bezier(.2,.7,.3,1) both;">'+esc(fc.front)+
          (fc.code ? '<div style="margin-top:14px;"><span style="font:800 12px \'Bricolage Grotesque\';color:'+ccolor+';background:'+ccolor+'14;border:1px solid '+ccolor+'33;border-radius:8px;padding:4px 10px;display:inline-block;">'+esc(fc.code)+'</span></div>' : '')+
        '</div>';
    }

    return ''+
    '<section style="max-width:640px;margin:0 auto;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      backBtn(geral?'goFlashMode':'goDecks', geral?'Flashcards':'Decks')+
      '<div style="display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin-bottom:14px;">'+
        '<div><div style="font-size:12.5px;font-weight:700;color:'+ccolor+';margin-bottom:2px;transition:color .3s ease;">'+esc(clabel)+(geral?' · aleatório':'')+'</div><h1 style="font:800 22px \'Bricolage Grotesque\';margin:0;">Flashcards</h1></div>'+
        '<span style="font-weight:700;font-size:14px;color:var(--muted);white-space:nowrap;">'+(state.fcIndex+1)+' / '+deck.length+'</span>'+
      '</div>'+
      '<div style="height:6px;background:var(--track);border-radius:99px;overflow:hidden;margin-bottom:24px;">'+bar+'</div>'+

      '<div data-action="flip" data-hover="box-shadow:0 18px 44px rgba(16,42,51,.13);transform:translateY(-2px);" data-active="transform:scale(.985);" style="position:relative;min-height:280px;display:flex;align-items:center;justify-content:center;padding:48px 36px;cursor:pointer;border-radius:24px;box-shadow:0 10px 30px rgba(16,42,51,.06);transition:box-shadow .25s ease,transform .15s ease;">'+
        face+
        '<span style="position:absolute;bottom:18px;font-size:12px;font-weight:600;color:var(--muted);z-index:1;">clique para virar</span>'+
      '</div>'+

      '<div style="display:flex;gap:12px;margin-top:24px;">'+
        '<button data-action="fcPrev" data-hover="border-color:#5BC0BE;color:var(--teal-text);" data-active="transform:scale(.93);" style="width:52px;height:52px;border-radius:14px;background:var(--surface);border:1px solid var(--border);color:var(--muted-2);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .18s ease;">'+ICON.chevLbig+'</button>'+
        '<button data-action="fcAgain" data-hover="background:#FFEDE3;transform:translateY(-2px);" data-active="transform:scale(.97);" style="flex:1;border-radius:14px;background:#FFF4EE;border:1px solid #FFD9C2;color:#C2410C;font-weight:700;font-size:14.5px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .18s ease;padding:14px;">'+ICON.redo+'Revisar de novo</button>'+
        '<button data-action="fcKnow" data-hover="background:#13647F;transform:translateY(-2px);box-shadow:0 8px 18px rgba(14,77,100,.3);" data-active="transform:scale(.97);" style="flex:1;border-radius:14px;background:#0E4D64;border:none;color:#fff;font-weight:700;font-size:14.5px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .18s ease;padding:14px;">'+ICON.knowCheck+'Eu sabia</button>'+
      '</div>'+
      '<div style="display:flex;gap:10px;justify-content:center;align-items:center;flex-wrap:wrap;margin-top:16px;">'+ fichaPeekBtn(fc.ci, fc.di, 'Ver ficha completa') + reportErroBtn(fc.ci, fc.di) +'</div>'+
    '</section>';
  }

  /* =========================================================
     Helper: opções de múltipla escolha (quiz e caso)
     ========================================================= */
  function mcOption(opt, idx, answered, selectedIdx, correctIdx, action){
    var sel = selectedIdx===idx;
    var isCorrect = idx===correctIdx;
    var style = "display:flex;align-items:center;gap:13px;width:100%;padding:14px 16px;border-radius:14px;cursor:pointer;background:var(--surface);border:1.5px solid var(--border);transition:all .15s;";
    var letterStyle = "width:28px;height:28px;border-radius:8px;background:var(--surface-2);color:var(--muted-2);font:800 13px 'Bricolage Grotesque';display:flex;align-items:center;justify-content:center;flex-shrink:0;";
    var iconHtml = '';
    var hover = ' data-hover="transform:translateX(4px);"';
    if(answered){
      hover = '';
      if(isCorrect){
        style = "display:flex;align-items:center;gap:13px;width:100%;padding:14px 16px;border-radius:14px;cursor:default;background:#E6F6EE;border:1.5px solid #06D6A0;animation:popIn .4s cubic-bezier(.34,1.56,.64,1) both;";
        letterStyle = "width:28px;height:28px;border-radius:8px;background:#06915A;color:#fff;font:800 13px 'Bricolage Grotesque';display:flex;align-items:center;justify-content:center;flex-shrink:0;";
        iconHtml = '<span style="color:#06915A;font-weight:800;font-size:17px;">✓</span>';
      } else if(sel){
        style = "display:flex;align-items:center;gap:13px;width:100%;padding:14px 16px;border-radius:14px;cursor:default;background:#FDECEC;border:1.5px solid #E5484D;";
        letterStyle = "width:28px;height:28px;border-radius:8px;background:#E5484D;color:#fff;font:800 13px 'Bricolage Grotesque';display:flex;align-items:center;justify-content:center;flex-shrink:0;";
        iconHtml = '<span style="color:#E5484D;font-weight:800;font-size:16px;">✕</span>';
      } else {
        style += "opacity:.6;";
      }
    }
    return '<button data-action="'+action+'" data-arg="'+idx+'"'+hover+' style="'+style+'">'+
      '<span style="'+letterStyle+'">'+letter(idx)+'</span>'+
      '<span style="flex:1;text-align:left;font-size:14.5px;font-weight:600;line-height:1.4;">'+esc(opt)+'</span>'+
      iconHtml+
    '</button>';
  }

  /* =========================================================
     TELA: QUESTIONÁRIO
     ========================================================= */
  function screenQuiz(){
    var set = state.quizSet;
    var geral = state.quizCat === -1;
    var backAction = geral ? 'goQuizMode' : 'goQuizDecks';
    if(!set || !set.length){
      return '<section style="max-width:680px;margin:0 auto;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
        backBtn(backAction,'Questionário')+'<p style="color:var(--muted);font-size:14.5px;">Nenhum questionário ativo — escolha um modo.</p></section>';
    }

    // ---- resultado ----
    if(state.quizDone){
      var sc = state.quizScore, tot = set.length, p = tot?Math.round(sc/tot*100):0;
      var msg = p>=80 ? 'Excelente!' : (p>=50 ? 'Bom trabalho!' : 'Continue praticando');
      return ''+
      '<section style="max-width:560px;margin:0 auto;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
        backBtn(backAction,'Questionário')+
        '<div style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:36px 30px;text-align:center;">'+
          '<div style="width:88px;height:88px;border-radius:50%;background:var(--accent-bg);border:1px solid var(--accent-bd);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;"><span style="font:800 27px \'Bricolage Grotesque\';color:var(--teal-text);">'+p+'%</span></div>'+
          '<h2 style="font:800 22px \'Bricolage Grotesque\';margin:0 0 6px;color:var(--ink);">'+msg+'</h2>'+
          '<p style="margin:0 0 22px;font-size:15px;color:var(--muted-2);">Você acertou <b style="color:var(--ink);">'+sc+'</b> de <b style="color:var(--ink);">'+tot+'</b> questões.</p>'+
          '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">'+
            '<button data-action="quizRestart" data-hover="background:#13647F;transform:translateY(-2px);" style="background:#0E4D64;border:none;border-radius:12px;padding:12px 22px;font:700 14px \'Hanken Grotesk\';color:#fff;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all .18s ease;">'+ICON.redo+'Refazer</button>'+
            '<button data-action="'+backAction+'" data-hover="border-color:#5BC0BE;color:var(--teal-text);" style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:12px 22px;font:700 14px \'Hanken Grotesk\';color:var(--muted-2);cursor:pointer;transition:all .18s ease;">Voltar</button>'+
          '</div>'+
        '</div>'+
      '</section>';
    }

    var qz = set[state.quizIndex];
    var ccolor = qz.color || '#0E4D64';
    var clabel = geral ? (qz.cat||'Aleatório') : (qz.cat||'');
    var pct = Math.round((state.quizIndex+1)/set.length*100);
    var bar = '<div style="width:'+pct+'%;height:100%;background:linear-gradient(90deg,#0E4D64,#5BC0BE);border-radius:99px;transition:width .5s cubic-bezier(.2,.7,.3,1);"></div>';
    var opts = qz.opts.map(function(o,i){ return mcOption(o, i, state.quizAnswered, state.quizSelected, qz.correct, 'quizSelect'); }).join('');

    var feedback = '', nextBtn = '';
    if(state.quizAnswered){
      var correct = state.quizSelected===qz.correct;
      feedback = '<div style="margin-top:18px;padding:14px 16px;border-radius:13px;background:'+(correct?'#E6F6EE':'#FDECEC')+';color:'+(correct?'#06694A':'#B4282C')+';animation:fadeUp .3s ease both;">'+
        '<div style="font-weight:700;font-size:14px;">'+(correct?'Correto!':'Resposta: '+esc(qz.opts[qz.correct]))+'</div>'+
      '</div>';
      var nextLabel = state.quizIndex<set.length-1 ? 'Próxima questão' : 'Ver resultado';
      nextBtn = '<button data-action="quizNext" data-hover="background:#13647F;" style="display:inline-flex;align-items:center;gap:8px;background:#0E4D64;border:none;border-radius:12px;padding:12px 20px;font-weight:700;font-size:14px;color:#fff;cursor:pointer;animation:fadeUp .3s ease both;">'+nextLabel+ICON.arrowR+'</button>';
    }

    return ''+
    '<section style="max-width:680px;margin:0 auto;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      backBtn(backAction,'Questionário')+
      '<div style="display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin-bottom:14px;">'+
        '<div><div style="font-size:12.5px;font-weight:700;color:'+ccolor+';margin-bottom:2px;transition:color .3s ease;">'+esc(clabel)+(geral?' · aleatório':'')+'</div><h1 style="font:800 22px \'Bricolage Grotesque\';margin:0;">Questionário</h1></div>'+
        '<span style="font-weight:700;font-size:14px;color:var(--muted);white-space:nowrap;">'+(state.quizIndex+1)+' / '+set.length+'</span>'+
      '</div>'+
      '<div style="height:6px;background:var(--track);border-radius:99px;overflow:hidden;margin-bottom:24px;">'+bar+'</div>'+
      '<div style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:28px;">'+
        '<div style="font-size:12px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;color:var(--muted);margin-bottom:10px;">'+esc(qz.prompt||'Qual transtorno corresponde a esta descrição?')+'</div>'+
        (qz.qlabel ? '<span style="display:inline-block;font:800 11px \'Bricolage Grotesque\';letter-spacing:.4px;color:'+ccolor+';background:'+ccolor+'14;border:1px solid '+ccolor+'33;border-radius:7px;padding:3px 9px;margin-bottom:12px;">'+esc(qz.qlabel)+'</span>' : '')+
        (qz.factsList
          ? '<div class="quiz-facts">'+qz.factsList.map(function(r){ return '<div class="qf-row"><span class="qf-lbl">'+esc(r.label)+'</span><span class="qf-val">'+esc(r.value)+'</span></div>'; }).join('')+'</div>'
          : '<div style="font:600 18px \'Bricolage Grotesque\';line-height:1.45;margin-bottom:22px;text-wrap:pretty;color:var(--body);">'+esc(qz.q)+'</div>')+
        '<div style="display:flex;flex-direction:column;gap:11px;">'+opts+'</div>'+
        feedback+
      '</div>'+
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-top:20px;">'+
        '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">'+(state.quizAnswered?(fichaPeekBtn(qz.ci,qz.di,'Ver ficha')+reportErroBtn(qz.ci,qz.di)):'')+'</div>'+
        nextBtn+
      '</div>'+
    '</section>';
  }

  /* =========================================================
     TELA: LIGAR transtorno → categoria
     ========================================================= */
  function screenLigar(){   // "Classificar" — arrastar/tocar transtorno -> categoria
    var board = state.classifyBoard;
    if(!board){ return '<section style="max-width:880px;margin:0 auto;">'+backToEx()+'</section>'; }
    var pool = board.pool, bins = board.bins;
    var phase = state.classifyPhase, nP = CLASSIFY_PHASES.length;

    // ---- resultado final ----
    if(state.classifyDone){
      var p = state.classifyTotal ? Math.round(state.classifyScore/state.classifyTotal*100) : 0;
      var msg = p>=80?'Excelente!':(p>=50?'Bom trabalho!':'Continue praticando');
      return ''+
      '<section style="max-width:560px;margin:0 auto;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
        backToEx()+
        '<div style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:36px 30px;text-align:center;">'+
          '<div style="width:88px;height:88px;border-radius:50%;background:var(--accent-bg);border:1px solid var(--accent-bd);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;"><span style="font:800 27px \'Bricolage Grotesque\';color:var(--teal-text);">'+p+'%</span></div>'+
          '<h2 style="font:800 22px \'Bricolage Grotesque\';margin:0 0 6px;color:var(--ink);">'+msg+'</h2>'+
          '<p style="margin:0 0 22px;font-size:15px;color:var(--muted-2);">Você acertou de primeira <b style="color:var(--ink);">'+state.classifyScore+'</b> de <b style="color:var(--ink);">'+state.classifyTotal+'</b> em '+nP+' fases.</p>'+
          '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">'+
            '<button data-action="classifyRestart" data-hover="background:#13647F;transform:translateY(-2px);" style="background:#0E4D64;border:none;border-radius:12px;padding:12px 22px;font:700 14px \'Hanken Grotesk\';color:#fff;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all .18s ease;">'+ICON.redo+'Jogar de novo</button>'+
            '<button data-action="goExercicios" data-hover="border-color:#5BC0BE;color:var(--teal-text);" style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:12px 22px;font:700 14px \'Hanken Grotesk\';color:var(--muted-2);cursor:pointer;transition:all .18s ease;">Voltar</button>'+
          '</div>'+
        '</div>'+
      '</section>';
    }

    function chipHtml(id){
      var chip = pool[id], locked = !!state.classifyLocked[id], sel = state.classifySel===id;
      var attrs = locked ? '' : (' data-chip="'+id+'" data-action="classifyPick" data-arg="'+id+'"');
      return '<button class="cl-chip'+(sel?' sel':'')+(locked?' locked':'')+'"'+attrs+'><span class="cl-name">'+esc(chip.name)+'</span>'+(locked?'<span class="cl-check">'+ICON.knowCheck+'</span>':'')+'</button>';
    }
    var placedCount = Object.keys(state.classifyPlaced).length;
    var poolFull = placedCount === pool.length;
    var poolChips = pool.map(function(_,id){ return state.classifyPlaced[id]==null ? chipHtml(id) : ''; }).join('');
    var hasSel = state.classifySel!=null;

    var binsHtml = bins.map(function(bin, bi){
      var inside = pool.map(function(_,id){ return state.classifyPlaced[id]===bi ? chipHtml(id) : ''; }).join('');
      return '<div class="cl-bin'+(hasSel?' target':'')+'" data-bin="'+bi+'" data-action="classifyDrop" data-arg="'+bi+'">'+
        '<div class="cl-bin-h" style="background:'+bin.color+'14;color:'+bin.color+';border-bottom:1px solid '+bin.color+'22;">'+esc(bin.name)+'</div>'+
        '<div class="cl-bin-b">'+inside+'</div>'+
      '</div>';
    }).join('');

    var footer;
    if(state.classifyPhaseComplete){
      var last = phase>=nP-1;
      footer = '<button data-action="classifyNext" data-hover="background:#13647F;transform:translateY(-2px);" style="background:#0E4D64;border:none;border-radius:12px;padding:12px 22px;font:700 14px \'Hanken Grotesk\';color:#fff;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all .18s ease;">'+(last?'Ver resultado':'Próxima fase')+ICON.arrowR+'</button>';
    } else {
      footer = '<button data-action="classifyCheck"'+(poolFull?'':' disabled')+' style="background:'+(poolFull?'#0E4D64':'var(--surface-2)')+';border:'+(poolFull?'none':'1px solid var(--border)')+';border-radius:12px;padding:12px 22px;font:700 14px \'Hanken Grotesk\';color:'+(poolFull?'#fff':'var(--muted)')+';cursor:'+(poolFull?'pointer':'default')+';transition:all .18s ease;">Conferir</button>';
    }
    var statusTxt = state.classifyPhaseComplete ? 'Fase concluída!'
      : (hasSel ? 'Toque numa categoria para colocar'
      : (poolFull ? 'Confira suas classificações' : placedCount+' de '+pool.length+' classificados'));

    return ''+
    '<section style="max-width:880px;margin:0 auto;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      backToEx()+
      '<div style="display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin-bottom:12px;">'+
        '<div><div style="font-size:12.5px;font-weight:700;color:#06915A;margin-bottom:2px;">Fase '+(phase+1)+' de '+nP+'</div><h1 style="font:800 22px \'Bricolage Grotesque\';margin:0;">Classificar</h1></div>'+
        '<span style="font-weight:700;font-size:13.5px;color:var(--muted);white-space:nowrap;">'+statusTxt+'</span>'+
      '</div>'+
      '<div style="height:6px;background:var(--track);border-radius:99px;overflow:hidden;margin-bottom:18px;"><div style="width:'+(state.classifyPhaseComplete?100:(pool.length?Math.round(placedCount/pool.length*100):0))+'%;height:100%;background:linear-gradient(90deg,#06915A,#5BC0BE);border-radius:99px;transition:width .4s ease;"></div></div>'+

      '<div class="cl-pool'+(hasSel?' target':'')+'" data-bin="pool" data-action="classifyToPool">'+
        (poolChips.replace(/\s/g,'') ? poolChips : '<span class="cl-pool-empty">tudo no lugar — toque em Conferir</span>')+
      '</div>'+

      '<div class="cl-bins">'+binsHtml+'</div>'+

      '<div style="display:flex;justify-content:flex-end;margin-top:22px;">'+footer+'</div>'+
    '</section>';
  }

  /* =========================================================
     TELA: ESTUDO DE CASO
     ========================================================= */
  function screenCaso(){
    var CASO = currentCaso();
    var p = CASO.patient, total = CASOS.length;
    var num = (state.casoIndex % total) + 1;
    var pct = Math.round(num/total*100);
    var answered = state.casoAnswered;
    var correct = answered && state.casoSelected===CASO.correct;
    var opts = CASO.opts.map(function(o,i){ return mcOption(o, i, answered, state.casoSelected, CASO.correct, 'casoSelect'); }).join('');
    var chips = (CASO.chips||[]).map(function(ch){ return '<span class="caso-chip">'+esc(ch)+'</span>'; }).join('');

    var feedback = '';
    if(answered){
      var banner = correct
        ? '<div class="caso-result ok"><div class="cr-emoji">🎯</div><div><div class="cr-title">Diagnóstico correto!</div><div class="cr-sub">+10 pontos'+(state.casoStreak>1?' · sequência de '+state.casoStreak+' 🔥':'')+'</div></div></div>'
        : '<div class="caso-result no"><div class="cr-emoji">🧠</div><div><div class="cr-title">Não foi dessa vez</div><div class="cr-sub">A resposta correta era <b>'+esc(CASO.opts[CASO.correct])+'</b></div></div></div>';
      feedback = banner+
        '<div class="caso-explica"><div class="ce-lbl">Por quê?</div><p>'+esc(CASO.explicacao)+'</p></div>'+
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-top:18px;">'+
          (function(){ var r=findRef(CASO.opts[CASO.correct]); return '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">'+(r?(fichaPeekBtn(r.ci,r.di,'Ver ficha')+reportErroBtn(r.ci,r.di)):'')+'</div>'; })()+
          '<button data-action="casoNext" class="caso-next" data-hover="filter:brightness(.93);transform:translateX(2px);">Próximo caso '+ICON.arrowR+'</button></div>';
    }

    return ''+
    '<section style="max-width:760px;margin:0 auto;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      backToEx()+
      '<div class="caso-status">'+
        '<div class="cs-left"><span class="cs-tag">Estudo de caso</span><span class="cs-num">Caso '+num+' de '+total+'</span></div>'+
        '<div class="cs-stats"><span class="cs-stat">🎯 '+state.casoScore+'</span><span class="cs-stat">🔥 '+state.casoStreak+'</span></div>'+
        '<div class="cs-bar"><div style="width:'+pct+'%;"></div></div>'+
      '</div>'+
      '<div class="caso-dossier">'+
        '<div class="cd-head">'+
          '<div class="cd-avatar">'+esc(p.initials)+'</div>'+
          '<div style="min-width:0;"><div class="cd-name">'+esc(p.name)+', '+p.age+' anos · '+esc(p.sex)+'</div><div class="cd-ref">'+esc(p.ref)+'</div></div>'+
          '<span class="cd-badge">Vinheta clínica</span>'+
        '</div>'+
        (chips ? '<div class="caso-chips">'+chips+'</div>' : '')+
        '<p class="cd-vinheta">'+esc(CASO.vinheta)+'</p>'+
      '</div>'+
      '<div class="caso-pergunta">'+esc(CASO.pergunta)+'</div>'+
      '<div style="display:flex;flex-direction:column;gap:11px;">'+opts+'</div>'+
      feedback+
    '</section>';
  }

  /* =========================================================
     AUTENTICAÇÃO (Supabase) — telas, helpers e sessão
     ========================================================= */
  function val(id){ var el=document.getElementById(id); return el?el.value.trim():''; }
  function rawVal(id){ var el=document.getElementById(id); return el?el.value:''; }

  function traduzErro(err){
    var m=(err&&err.message)||'';
    if(/invalid login credentials/i.test(m)) return 'E-mail ou senha incorretos.';
    if(/already registered|already been registered|already exists/i.test(m)) return 'Este e-mail já possui conta.';
    if(/invalid.*email|email.*invalid/i.test(m)) return 'E-mail inválido.';
    if(/password/i.test(m)) return 'A senha precisa de ao menos 6 caracteres.';
    if(/rate limit|too many/i.test(m)) return 'Muitas tentativas. Aguarde um instante.';
    return m || 'Não foi possível concluir. Tente de novo.';
  }

  function applySession(user, event){
    // fluxo de recuperação de senha: usuário voltou pelo link do e-mail.
    if(event==='PASSWORD_RECOVERY') state.auth.recovery=true;
    if(state.auth.recovery && user){
      state.auth.user=user; state.auth.checking=false;
      state.auth.busy=false; state.auth.loadingMsg='';
      DB.setGuest(false); state.auth.guest=false;
      render();
      return;
    }
    if(!user){
      state.auth.user=null; state.auth.profile=null; state.auth.checking=false;
      state.auth.busy=false; state.auth.loadingMsg='';
      setState({screen:'welcome'});
      return;
    }
    state.auth.user=user; state.auth.checking=false;
    DB.setGuest(false); state.auth.guest=false;
    function done(){
      state.auth.busy=false; state.auth.loadingMsg=''; state.auth.form={};
      if(state.screen==='login'||state.screen==='register') state.screen='home';
      render();
    }
    DB.getProfile().then(function(p){
      state.auth.profile = enrichProfile(p||{}, user);
      return loadUserData();
    }).then(done).catch(function(){
      state.auth.profile = enrichProfile(state.auth.profile||{}, user);
      done();
    });
  }
  // completa nome/avatar a partir dos metadados do provedor (ex.: Google),
  // quando o perfil do banco ainda não os tem (login social não passa pelo form).
  function enrichProfile(p, user){
    var meta = (user && user.user_metadata) || {};
    if(!p.nome) p.nome = meta.full_name || meta.name || '';
    if(!p.avatar_url) p.avatar_url = meta.avatar_url || meta.picture || '';
    return p;
  }

  function authLogo(){
    return '<button data-action="goWelcome" title="Voltar ao início" data-hover="opacity:.75;" style="display:flex;align-items:center;gap:11px;justify-content:center;margin:0 auto 20px;background:none;border:none;cursor:pointer;transition:opacity .15s ease;">'+
      '<img src="logo-128.png" alt="Psico·Pato" width="42" height="42" style="width:42px;height:42px;border-radius:12px;object-fit:cover;display:block;background:#fff;border:1px solid var(--border);">'+
      '<div style="font:800 20px \'Bricolage Grotesque\';color:var(--teal-text);letter-spacing:-.3px;"><span class="notranslate">Psico<span style="color:#5BC0BE;">·</span>Pato</span></div>'+
    '</button>';
  }
  function authFeedback(){
    var a=state.auth;
    if(a.error) return '<div style="margin-bottom:16px;padding:11px 14px;border-radius:12px;background:#FDECEC;color:#B4282C;font-size:13px;font-weight:600;animation:fadeUp .25s ease both;">'+esc(a.error)+'</div>';
    if(a.info)  return '<div style="margin-bottom:16px;padding:11px 14px;border-radius:12px;background:#E6F6EE;color:#06694A;font-size:13px;font-weight:600;animation:fadeUp .25s ease both;">'+esc(a.info)+'</div>';
    return '';
  }
  function authInput(id,type,placeholder,label){
    var isPass = type==='password';
    var preset = (state.auth.form && state.auth.form[id]) || '';
    var inp = '<input id="'+id+'" class="auth-input" type="'+type+'" placeholder="'+esc(placeholder)+'" value="'+esc(preset)+'" style="width:100%;padding:12px '+(isPass?'44px':'14px')+' 12px 14px;border:1px solid var(--border);border-radius:12px;background:var(--surface);color:var(--ink);font:500 14.5px \'Hanken Grotesk\';outline:none;" />';
    if(isPass){
      inp = '<div style="position:relative;">'+inp+
        '<button type="button" id="'+id+'-eye" data-action="togglePass" data-arg="'+id+'" title="Mostrar senha" style="position:absolute;right:6px;top:50%;transform:translateY(-50%);width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:none;border:none;cursor:pointer;color:var(--muted);">'+ICON.eye+'</button>'+
      '</div>';
    }
    return '<label style="display:block;margin-bottom:14px;">'+
      '<span style="display:block;font-size:12.5px;font-weight:700;color:var(--muted-2);margin-bottom:6px;">'+esc(label)+'</span>'+
      inp+
    '</label>';
  }
  function authSubmit(action,label,busy){
    return '<button data-action="'+action+'" '+(busy?'':'data-hover="background:#13647F;" data-active="transform:scale(.98);" ')+'style="width:100%;margin-top:6px;background:'+(busy?'#3A6B7C':'#0E4D64')+';border:none;border-radius:12px;padding:13px;font:700 14.5px \'Hanken Grotesk\';color:#fff;cursor:'+(busy?'default':'pointer')+';transition:all .18s ease;">'+esc(label)+'</button>';
  }
  function authDivider(){
    return '<div style="display:flex;align-items:center;gap:10px;margin:18px 0 14px;"><div style="flex:1;height:1px;background:var(--border);"></div><span style="font-size:11px;color:var(--muted);font-weight:700;letter-spacing:.5px;">OU</span><div style="flex:1;height:1px;background:var(--border);"></div></div>';
  }
  function authGoogleBtn(){
    return '<button data-action="loginGoogle" data-hover="background:var(--surface-2);border-color:#5BC0BE;" data-active="transform:scale(.98);" style="width:100%;display:flex;align-items:center;justify-content:center;gap:10px;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:12px;font:700 14px \'Hanken Grotesk\';color:var(--ink);cursor:pointer;transition:all .18s ease;margin-bottom:12px;">'+ICON.google+'<span>Continuar com Google</span></button>';
  }

  function screenLogin(){
    var a=state.auth;
    return ''+
    '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;">'+
      '<section style="width:100%;max-width:400px;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
        authLogo()+
        '<div style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:28px;box-shadow:0 10px 30px rgba(16,42,51,.06);">'+
          '<h1 style="font:800 22px \'Bricolage Grotesque\';margin:0 0 4px;color:var(--ink);">Entrar</h1>'+
          '<p style="margin:0 0 20px;font-size:13.5px;color:var(--muted);">Acesse seu progresso de estudos.</p>'+
          authFeedback()+
          authInput('auth-email','email','voce@email.com','E-mail')+
          authInput('auth-pass','password','••••••••','Senha')+
          '<div style="text-align:right;margin:-6px 0 14px;"><button data-action="goForgot" style="background:none;border:none;color:var(--teal-text);font-weight:700;font-size:12.5px;cursor:pointer;padding:0;">Esqueci minha senha</button></div>'+
          authSubmit('submitLogin', a.busy?'Entrando…':'Entrar', a.busy)+
          '<p style="margin:16px 0 0;font-size:13px;color:var(--muted);text-align:center;">Não tem conta? '+
            '<button data-action="goRegister" style="background:none;border:none;color:var(--teal-text);font-weight:700;font-size:13px;cursor:pointer;padding:0;">Criar conta</button></p>'+
          authDivider()+
          authGoogleBtn()+
          '<button data-action="enterGuest" data-hover="background:var(--surface-2);border-color:#5BC0BE;color:var(--teal-text);" data-active="transform:scale(.98);" style="width:100%;background:transparent;border:1px solid var(--border);border-radius:12px;padding:12px;font:700 14px \'Hanken Grotesk\';color:var(--muted-2);cursor:pointer;transition:all .18s ease;">Continuar sem conta</button>'+
          '<p style="margin:10px 0 0;font-size:11.5px;color:var(--muted);text-align:center;line-height:1.45;">No modo visitante, seu histórico fica salvo só neste navegador.</p>'+
        '</div>'+
      '</section>'+
    '</div>';
  }

  function screenRegister(){
    var a=state.auth;
    return ''+
    '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;">'+
      '<section style="width:100%;max-width:420px;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
        authLogo()+
        '<div style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:28px;box-shadow:0 10px 30px rgba(16,42,51,.06);">'+
          '<h1 style="font:800 22px \'Bricolage Grotesque\';margin:0 0 4px;color:var(--ink);">Criar conta</h1>'+
          '<p style="margin:0 0 20px;font-size:13.5px;color:var(--muted);">Comece a acompanhar sua revisão do DSM-5-TR.</p>'+
          authFeedback()+
          authInput('reg-nome','text','Seu nome','Nome')+
          authInput('reg-inst','text','Ex.: Universidade Federal…','Instituição / Universidade (opcional)')+
          '<div style="display:flex;gap:12px;">'+
            '<div style="flex:1;">'+authInput('reg-curso','text','Psicologia','Curso (opcional)')+'</div>'+
            '<div style="flex:1;">'+authInput('reg-sem','text','6º sem','Semestre (opcional)')+'</div>'+
          '</div>'+
          authInput('reg-email','email','voce@email.com','E-mail')+
          authInput('reg-pass','password','mínimo 6 caracteres','Senha')+
          authSubmit('submitRegister', a.busy?'Criando…':'Criar conta', a.busy)+
          authDivider()+
          authGoogleBtn()+
          '<p style="margin:16px 0 0;font-size:13px;color:var(--muted);text-align:center;">Já tem conta? '+
            '<button data-action="goLogin" style="background:none;border:none;color:var(--teal-text);font-weight:700;font-size:13px;cursor:pointer;padding:0;">Entrar</button></p>'+
        '</div>'+
      '</section>'+
    '</div>';
  }

  function screenForgot(){
    var a=state.auth;
    return ''+
    '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;">'+
      '<section style="width:100%;max-width:400px;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
        authLogo()+
        '<div style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:28px;box-shadow:0 10px 30px rgba(16,42,51,.06);">'+
          '<h1 style="font:800 22px \'Bricolage Grotesque\';margin:0 0 4px;color:var(--ink);">Recuperar senha</h1>'+
          '<p style="margin:0 0 20px;font-size:13.5px;color:var(--muted);">Informe o e-mail da sua conta e enviaremos um link para criar uma nova senha.</p>'+
          authFeedback()+
          authInput('forgot-email','email','voce@email.com','E-mail')+
          authSubmit('submitForgot', a.busy?'Enviando…':'Enviar link de recuperação', a.busy)+
          '<p style="margin:16px 0 0;font-size:13px;color:var(--muted);text-align:center;"><button data-action="goLogin" style="background:none;border:none;color:var(--teal-text);font-weight:700;font-size:13px;cursor:pointer;padding:0;">&lsaquo; Voltar para o login</button></p>'+
        '</div>'+
      '</section>'+
    '</div>';
  }
  function screenResetPassword(){
    var a=state.auth;
    return ''+
    '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;">'+
      '<section style="width:100%;max-width:400px;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
        authLogo()+
        '<div style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:28px;box-shadow:0 10px 30px rgba(16,42,51,.06);">'+
          '<h1 style="font:800 22px \'Bricolage Grotesque\';margin:0 0 4px;color:var(--ink);">Criar nova senha 🔑</h1>'+
          '<p style="margin:0 0 20px;font-size:13.5px;color:var(--muted);">Defina a nova senha de acesso da sua conta.</p>'+
          authFeedback()+
          authInput('rp-pass','password','mínimo 6 caracteres','Nova senha')+
          authInput('rp-pass2','password','repita a senha','Confirmar nova senha')+
          authSubmit('submitNewPassword', a.busy?'Salvando…':'Salvar nova senha', a.busy)+
        '</div>'+
      '</section>'+
    '</div>';
  }
  function screenWelcome(){
    function feat(icon, title, desc){
      return '<div style="display:flex;gap:13px;align-items:flex-start;text-align:left;">'+
        '<div style="width:40px;height:40px;border-radius:11px;background:var(--accent-bg);color:var(--accent-tx);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><span style="display:flex;transform:scale(.9);">'+icon+'</span></div>'+
        '<div><div style="font:700 14.5px \'Bricolage Grotesque\';color:var(--ink);">'+esc(title)+'</div>'+
        '<div style="font-size:13px;color:var(--muted-2);line-height:1.5;margin-top:2px;">'+esc(desc)+'</div></div>'+
      '</div>';
    }
    return ''+
    '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;">'+
      '<section style="width:100%;max-width:480px;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
        '<div style="text-align:center;margin-bottom:24px;">'+
          '<img src="logo-128.png" alt="Psico·Pato" width="62" height="62" style="width:62px;height:62px;border-radius:17px;object-fit:cover;display:inline-block;background:#fff;border:1px solid var(--border);">'+
          '<h1 style="font:800 30px \'Bricolage Grotesque\';color:var(--teal-text);letter-spacing:-.4px;margin:14px 0 8px;"><span class="notranslate">Psico<span style="color:#5BC0BE;">·</span>Pato</span></h1>'+
          '<p style="margin:0 auto;font-size:15px;color:var(--muted-2);line-height:1.55;max-width:400px;">Sua plataforma de <b>estudo e revisão do DSM-5-TR</b>: fichas-resumo, exercícios e estudos de caso, com progresso gamificado.</p>'+
        '</div>'+
        '<div style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:24px;box-shadow:0 10px 30px rgba(16,42,51,.06);">'+
          '<div style="display:flex;flex-direction:column;gap:16px;margin-bottom:22px;">'+
            feat(ICON.book2, 'Fichas do DSM-5-TR', 'Os transtornos das 20 categorias com critérios, especificadores e seções — em fichas-resumo.')+
            feat(ICON.pencil, 'Exercícios e casos', 'Flashcards, questionários, classificação de transtornos e estudos de caso clínicos.')+
            feat(ICON.trophy, 'Acompanhe seu progresso', 'Crie uma conta para salvar revisões, XP, medalhas e ranking em qualquer dispositivo.')+
          '</div>'+
          '<button data-action="goRegister" data-hover="background:#13647F;" data-active="transform:scale(.98);" style="width:100%;background:#0E4D64;border:none;border-radius:12px;padding:14px;font:700 15px \'Hanken Grotesk\';color:#fff;cursor:pointer;transition:all .18s ease;margin-bottom:10px;">Criar conta grátis</button>'+
          '<button data-action="enterGuest" data-hover="background:var(--surface-2);border-color:#5BC0BE;color:var(--teal-text);" data-active="transform:scale(.98);" style="width:100%;background:transparent;border:1px solid var(--border);border-radius:12px;padding:13px;font:700 14px \'Hanken Grotesk\';color:var(--muted-2);cursor:pointer;transition:all .18s ease;">Continuar como visitante</button>'+
          '<p style="margin:14px 0 0;font-size:13px;color:var(--muted);text-align:center;">Já tem conta? '+
            '<button data-action="goLogin" style="background:none;border:none;color:var(--teal-text);font-weight:700;font-size:13px;cursor:pointer;padding:0;">Entrar</button></p>'+
        '</div>'+
        pwaInstallBtn('welcome')+
        '<p style="margin:14px auto 0;font-size:11.5px;color:var(--muted);text-align:center;line-height:1.5;max-width:380px;">No modo visitante, seu histórico fica salvo só neste navegador. Crie uma conta a qualquer momento para não perdê-lo.</p>'+
      '</section>'+
    '</div>';
  }
  function authScreen(){
    if(state.screen==='register') return screenRegister();
    if(state.screen==='forgot')   return screenForgot();
    if(state.screen==='login')    return screenLogin();
    return screenWelcome();   // padrão para não autenticados
  }
  // loader de marca (emoji de cérebro pulsante) — usado em auth e onde houver espera
  function brandLoader(msg, full){
    return '<div class="brand-loader'+(full===false?' inline':'')+'">'+
      '<div class="bl-brain">🧠</div>'+
      '<div class="bl-msg">'+esc(msg||'Carregando…')+'</div>'+
      '<div class="bl-dots"><span></span><span></span><span></span></div>'+
    '</div>';
  }
  function authLoading(){ return brandLoader(state.auth.loadingMsg || 'Preparando seus estudos…'); }

  function guestBanner(){
    if(!(DB.ready && state.auth.guest)) return '';
    return '<div style="display:flex;align-items:center;gap:13px;background:var(--accent-bg);border:1px solid var(--accent-bd);border-radius:14px;padding:13px 16px;margin-bottom:22px;flex-wrap:wrap;">'+
      ICON.info+
      '<div style="flex:1;min-width:200px;">'+
        '<div style="font-weight:700;font-size:13.5px;color:var(--accent-tx);margin-bottom:2px;">Você está no modo visitante</div>'+
        '<p style="margin:0;font-size:13px;line-height:1.5;color:var(--body);">Seu histórico fica salvo só neste navegador. Para mantê-lo entre sessões e acessar de qualquer dispositivo, recomendamos criar uma conta.</p>'+
      '</div>'+
      '<button data-action="guestToRegister" data-hover="background:#0c6a66;" data-active="transform:scale(.98);" style="background:var(--accent-tx);border:none;border-radius:10px;padding:10px 16px;font:700 13px \'Hanken Grotesk\';color:#fff;cursor:pointer;white-space:nowrap;transition:background .18s ease;">Criar conta</button>'+
    '</div>';
  }

  function profileBlock(){
    if(DB.ready && state.auth.guest){
      return '<div class="side-profile" style="display:flex;align-items:center;gap:11px;padding:14px 6px 2px;margin-top:12px;border-top:1px solid var(--border);">'+
        '<div style="width:34px;height:34px;border-radius:50%;background:var(--surface-2);display:flex;align-items:center;justify-content:center;color:var(--muted-2);font:700 13px \'Hanken Grotesk\';flex-shrink:0;">V</div>'+
        '<div class="side-profile-text" style="line-height:1.25;min-width:0;">'+
          '<div style="font-size:13.5px;font-weight:700;">Visitante</div>'+
          '<button data-action="guestToRegister" data-hover="color:var(--teal-text);" style="background:none;border:none;padding:0;font-size:11px;color:var(--muted);font-weight:700;cursor:pointer;">Criar conta &rsaquo;</button>'+
        '</div>'+
      '</div>';
    }
    var p = (DB.ready && state.auth.profile) ? state.auth.profile : null;
    var nome = displayName() || 'Estudante';
    var sub  = (p && (p.curso||p.semestre||p.instituicao)) ? [p.curso,p.semestre,p.instituicao].filter(Boolean).join(' · ') : 'Psicologia · 6º sem';
    var logout = (DB.ready && state.auth.user)
      ? '<button data-action="logout" class="side-profile-logout" data-hover="color:#E5484D;" title="Sair da conta" style="margin-left:auto;background:none;border:none;color:var(--muted);cursor:pointer;font-size:12px;font-weight:700;padding:4px 2px;">Sair</button>'
      : '';
    return '<div class="side-profile" style="display:flex;align-items:center;gap:11px;padding:14px 6px 2px;margin-top:12px;border-top:1px solid var(--border);">'+
      '<button data-action="goPerfil" class="side-profile-main" title="Editar perfil" data-hover="opacity:.8;" style="flex:1;min-width:0;display:flex;align-items:center;gap:11px;background:none;border:none;padding:0;cursor:pointer;text-align:left;transition:opacity .15s ease;">'+
        userAvatar(34)+
        '<div class="side-profile-text" style="line-height:1.2;min-width:0;">'+
          '<div style="font-size:13.5px;font-weight:700;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+esc(nome)+'</div>'+
          '<div style="font-size:11px;color:var(--muted);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+esc(sub)+'</div>'+
        '</div>'+
      '</button>'+ logout +
    '</div>';
  }

  /* =========================================================
     TELA: MEU PERFIL (apelido + avatar)
     ========================================================= */
  function profileMsgHtml(){
    var m = state.profileMsg; if(!m) return '';
    var ok = m.type==='ok';
    return '<div style="margin:0 0 16px;padding:11px 14px;border-radius:12px;background:'+(ok?'var(--ok-bg)':'#FDECEC')+';color:'+(ok?'var(--ok-tx)':'#B4282C')+';font-size:13px;font-weight:600;animation:fadeUp .25s ease both;">'+esc(m.text)+'</div>';
  }
  function profileField(id,label,value,ph){
    return '<label style="display:block;margin-bottom:14px;">'+
      '<span style="display:block;font-size:12.5px;font-weight:700;color:var(--muted-2);margin-bottom:6px;">'+esc(label)+'</span>'+
      '<input id="'+id+'" class="pf-input" type="text" value="'+esc(value)+'" placeholder="'+esc(ph)+'" style="width:100%;padding:12px 14px;border:1px solid var(--border);border-radius:12px;background:var(--surface);color:var(--ink);font:500 14.5px \'Hanken Grotesk\';outline:none;">'+
    '</label>';
  }
  function screenPerfil(){
    var d = state.profileDraft || {};
    var gphoto = googlePhoto();
    var presets = PRESET_AVATARS.map(function(pa,i){
      var on = d.avatar==='preset:'+i;
      return '<button data-action="pickPreset" data-arg="'+i+'" class="av-preset'+(on?' on':'')+'" title="Avatar" style="background:'+pa.bg+';">'+pa.e+'</button>';
    }).join('');
    function btn(action,label,extra){
      return '<button data-action="'+action+'" data-hover="border-color:#5BC0BE;color:var(--teal-text);" style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:9px 14px;font:700 13px \'Hanken Grotesk\';color:'+(extra||'var(--muted-2)')+';cursor:pointer;transition:all .15s ease;">'+label+'</button>';
    }
    return ''+
    '<section style="max-width:680px;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      '<div style="font-size:13px;font-weight:600;color:var(--muted);margin-bottom:4px;">Conta</div>'+
      '<h1 style="font:800 28px \'Bricolage Grotesque\';letter-spacing:-.5px;margin:0 0 22px;color:var(--ink);">Meu perfil</h1>'+
      profileMsgHtml()+
      '<div style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:26px;">'+
        '<div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap;margin-bottom:18px;">'+
          '<div style="position:relative;">'+ avatarHtml(d.avatar, displayName(), 84, gphoto) +
            (state.profileUploading?'<div style="position:absolute;inset:0;border-radius:50%;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:700;">enviando…</div>':'')+
          '</div>'+
          '<div style="display:flex;flex-direction:column;gap:9px;min-width:200px;">'+
            '<div style="display:flex;gap:8px;flex-wrap:wrap;">'+
              btn('triggerAvatarUpload','Enviar foto')+
              (gphoto?btn('useGooglePhoto','Usar foto do Google'):'')+
              (d.avatar?btn('removeAvatar','Remover','var(--muted)'):'')+
            '</div>'+
            '<div style="font-size:11.5px;color:var(--muted);">PNG ou JPG até 3 MB. Ou escolha um avatar abaixo.</div>'+
          '</div>'+
          '<input type="file" id="avatar-file" accept="image/*" style="display:none;">'+
        '</div>'+
        '<div class="av-gallery">'+presets+'</div>'+
        '<div style="height:1px;background:var(--border);margin:22px 0;"></div>'+
        profileField('pf-apelido','Apelido', d.apelido||'', 'Como quer ser chamado(a)')+
        '<div style="font-size:11.5px;color:var(--muted);margin:-8px 0 16px;">É assim que você aparece na saudação da home e no ranking.</div>'+
        profileField('pf-nome','Nome completo', d.nome||'', 'Seu nome')+
        profileField('pf-inst','Instituição / Universidade', d.instituicao||'', 'Ex.: Universidade Federal…')+
        '<div style="display:flex;gap:12px;flex-wrap:wrap;">'+
          '<div style="flex:1;min-width:140px;">'+profileField('pf-curso','Curso', d.curso||'', 'Psicologia')+'</div>'+
          '<div style="flex:1;min-width:140px;">'+profileField('pf-sem','Semestre', d.semestre||'', '6º sem')+'</div>'+
        '</div>'+
        '<div style="display:flex;gap:10px;margin-top:8px;">'+
          '<button data-action="saveProfile" '+(state.profileSaving?'':'data-hover="background:#13647F;" data-active="transform:scale(.98);"')+' style="background:'+(state.profileSaving?'#3A6B7C':'#0E4D64')+';border:none;border-radius:12px;padding:12px 22px;font:700 14px \'Hanken Grotesk\';color:#fff;cursor:'+(state.profileSaving?'default':'pointer')+';transition:all .18s ease;">'+(state.profileSaving?'Salvando…':'Salvar alterações')+'</button>'+
          '<button data-action="goHome" data-hover="border-color:#5BC0BE;color:var(--teal-text);" style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:12px 22px;font:700 14px \'Hanken Grotesk\';color:var(--muted-2);cursor:pointer;transition:all .15s ease;">Voltar</button>'+
        '</div>'+
      '</div>'+
    '</section>';
  }

  /* =========================================================
     TELA: REFERÊNCIAS (índice completo de transtornos)
     ========================================================= */
  function screenIndice(){
    var total = CATS.reduce(function(s,c){ return s + visibleItems(c).length; }, 0);
    var blocks = CATS.map(function(c, ci){
      var visN = visibleItems(c).length;
      if(state.reduced && visN===0) return '';
      var items = c.items.map(function(d, di){
        if(hiddenReduced(d)) return '';
        var code = d.code || d.cid || d.dsm || '';
        return '<button data-action="openRef" data-arg="'+ci+':'+di+'" class="ref-item" data-hover="background:var(--surface-2);border-color:#5BC0BE;">'+
          '<span class="ref-dot" style="background:'+c.color+';"></span>'+
          '<span class="ref-name">'+esc(d.n)+'</span>'+
          (code ? '<span class="ref-code">'+esc(code)+'</span>' : '')+
        '</button>';
      }).join('');
      return '<div class="ref-cat">'+
        '<div class="ref-cat-head">'+
          '<span class="ref-cat-num" style="background:'+c.color+'1A;color:'+c.color+';">'+(ci+1)+'</span>'+
          '<span class="ref-cat-name">'+esc(c.name)+'</span>'+
          '<span class="ref-cat-count">'+visN+'</span>'+
        '</div>'+
        '<div class="ref-list">'+items+'</div>'+
      '</div>';
    }).join('');

    return ''+
    '<section style="max-width:1040px;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      '<div style="font-size:13px;font-weight:600;color:var(--muted);margin-bottom:8px;">Revisão</div>'+
      '<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;">'+revViewToggle('indice')+reducedToggle()+'</div>'+
      '<h1 style="font:800 28px \'Bricolage Grotesque\';letter-spacing:-.5px;margin:18px 0 6px;">Índice de transtornos</h1>'+
      '<p style="margin:0 0 24px;color:var(--muted-2);font-size:15px;max-width:640px;">'+(state.reduced?('Os '+total+' transtornos principais'):('Todos os '+total+' transtornos'))+' do DSM-5-TR, organizados pelas categorias. Toque em um item para abrir a ficha.</p>'+
      '<div class="ref-cats">'+blocks+'</div>'+
    '</section>';
  }

  /* =========================================================
     TELAS: Ranking, DSM-5-TR, Feedback (placeholders / iframe)
     ========================================================= */
  function placeholderScreen(kicker, title, icon, badge, bodyHtml){
    return ''+
    '<section style="max-width:760px;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      '<div style="font-size:13px;font-weight:600;color:var(--muted);margin-bottom:4px;">'+esc(kicker)+'</div>'+
      '<h1 style="font:800 28px \'Bricolage Grotesque\';letter-spacing:-.5px;margin:0 0 24px;">'+esc(title)+'</h1>'+
      '<div style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:42px 32px;text-align:center;">'+
        '<div style="width:60px;height:60px;border-radius:17px;background:var(--accent-bg);color:var(--accent-tx);display:flex;align-items:center;justify-content:center;margin:0 auto 18px;"><span style="transform:scale(1.55);display:flex;">'+icon+'</span></div>'+
        '<div style="display:inline-block;font-size:11px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;color:var(--accent-tx);background:var(--accent-bg);border:1px solid var(--accent-bd);border-radius:99px;padding:5px 13px;margin-bottom:14px;">'+esc(badge)+'</div>'+
        '<p style="margin:0 auto;max-width:460px;font-size:14.5px;line-height:1.6;color:var(--muted-2);">'+bodyHtml+'</p>'+
      '</div>'+
    '</section>';
  }
  var RANK_TABS = [['day','Diário'],['week','Semanal'],['month','Mensal'],['year','Anual']];
  var RANK_PERIOD_LABEL = {day:'Hoje', week:'Esta semana', month:'Este mês', year:'Este ano'};

  function rankTabs(){
    return '<div style="display:inline-flex;background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:4px;gap:2px;flex-wrap:wrap;">'+
      RANK_TABS.map(function(t){
        var on = state.rankPeriod === t[0];
        var sty = on ? 'background:var(--surface);color:var(--teal-text);box-shadow:0 1px 3px rgba(0,0,0,.08);'
                     : 'background:transparent;color:var(--muted);';
        return '<button data-action="setRankPeriod" data-arg="'+t[0]+'" '+(on?'':'data-hover="color:var(--ink);"')+' style="border:none;border-radius:9px;padding:8px 15px;font:700 13px \'Hanken Grotesk\';cursor:pointer;transition:color .15s ease;'+sty+'">'+t[1]+'</button>';
      }).join('')+
    '</div>';
  }

  function rankBadge(rnk){
    var medal = rnk===1 ? '#F2B705' : (rnk===2 ? '#9AA7B0' : (rnk===3 ? '#CD7F32' : null));
    if(medal){
      return '<div style="width:34px;height:34px;border-radius:50%;background:'+medal+';color:#fff;display:flex;align-items:center;justify-content:center;font:800 14px \'Bricolage Grotesque\';flex-shrink:0;box-shadow:0 3px 8px rgba(0,0,0,.15);">'+rnk+'</div>';
    }
    return '<div style="width:34px;height:34px;border-radius:50%;background:var(--surface-2);color:var(--muted-2);display:flex;align-items:center;justify-content:center;font:800 13px \'Bricolage Grotesque\';flex-shrink:0;">'+rnk+'</div>';
  }

  function rankRow(row, isMe){
    var L = levelForXP(row.xp);
    var initials = String(row.nome||'?').trim().split(/\s+/).slice(0,2).map(function(w){return w.charAt(0).toUpperCase();}).join('');
    var hl = isMe ? 'background:var(--accent-bg);border-color:var(--accent-bd);' : 'background:var(--surface);border-color:var(--border);';
    return '<div style="display:flex;align-items:center;gap:13px;border:1px solid;border-radius:14px;padding:11px 14px;'+hl+'">'+
      rankBadge(Number(row.rnk))+
      '<div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#5BC0BE,#0E4D64);color:#fff;display:flex;align-items:center;justify-content:center;font:700 12px \'Hanken Grotesk\';flex-shrink:0;">'+esc(initials||'·')+'</div>'+
      '<div style="flex:1;min-width:0;">'+
        '<div style="font-weight:700;font-size:14px;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+esc(row.nome||'Estudante')+(isMe?' <span style="font-size:11px;color:var(--teal-text);font-weight:800;">· você</span>':'')+'</div>'+
        '<div style="font-size:11.5px;color:var(--muted);font-weight:600;">Nível '+L+' · '+esc(levelTitle(L))+'</div>'+
      '</div>'+
      '<div style="font:800 15px \'Bricolage Grotesque\';color:var(--teal-text);flex-shrink:0;">'+row.xp+'<span style="font-size:11px;font-weight:700;color:var(--muted);"> XP</span></div>'+
    '</div>';
  }

  function rankSkeleton(){
    var row = '<div style="display:flex;align-items:center;gap:13px;border:1px solid var(--border);border-radius:14px;padding:11px 14px;background:var(--surface);">'+
      '<div style="width:34px;height:34px;border-radius:50%;background:var(--surface-2);"></div>'+
      '<div style="width:34px;height:34px;border-radius:50%;background:var(--surface-2);"></div>'+
      '<div style="flex:1;"><div style="height:11px;width:46%;background:var(--surface-2);border-radius:99px;margin-bottom:7px;"></div><div style="height:9px;width:30%;background:var(--surface-2);border-radius:99px;"></div></div>'+
      '<div style="width:48px;height:14px;background:var(--surface-2);border-radius:99px;"></div>'+
    '</div>';
    return '<div style="display:flex;flex-direction:column;gap:9px;opacity:.7;animation:pulse 1.4s ease-in-out infinite;">'+row+row+row+row+row+'</div>';
  }

  function rankMessage(emoji, title, sub){
    return '<div style="background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:40px 28px;text-align:center;">'+
      '<div style="font-size:38px;line-height:1;margin-bottom:12px;">'+emoji+'</div>'+
      '<div style="font:800 17px \'Bricolage Grotesque\';color:var(--ink);margin-bottom:6px;">'+esc(title)+'</div>'+
      '<p style="margin:0 auto;max-width:380px;font-size:13.5px;line-height:1.6;color:var(--muted-2);">'+esc(sub)+'</p>'+
    '</div>';
  }

  function rankInvite(){
    var btn = DB.ready
      ? '<button data-action="guestToRegister" data-hover="background:#0c6a66;transform:translateY(-2px);" data-active="transform:scale(.98);" style="margin-top:18px;background:var(--accent-tx);border:none;border-radius:12px;padding:12px 22px;font:700 14px \'Hanken Grotesk\';color:#fff;cursor:pointer;transition:background .18s ease,transform .18s ease;">Criar conta grátis</button>'
      : '<p style="margin:16px 0 0;font-size:13px;color:var(--muted);">Configure o Supabase para ativar contas e o ranking entre usuários.</p>';
    return ''+
    '<section style="max-width:620px;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      '<div style="font-size:13px;font-weight:600;color:var(--muted);margin-bottom:4px;">Ranking</div>'+
      '<h1 style="font:800 28px \'Bricolage Grotesque\';letter-spacing:-.5px;margin:0 0 22px;">Ranking de XP</h1>'+
      '<div style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:42px 32px;text-align:center;">'+
        '<div style="width:64px;height:64px;border-radius:18px;background:var(--accent-bg);color:var(--accent-tx);display:flex;align-items:center;justify-content:center;margin:0 auto 18px;"><span style="transform:scale(1.6);display:flex;">'+ICON.trophy+'</span></div>'+
        '<h2 style="font:800 20px \'Bricolage Grotesque\';margin:0 0 8px;color:var(--ink);">Entre na competição</h2>'+
        '<p style="margin:0 auto;max-width:420px;font-size:14.5px;line-height:1.6;color:var(--muted-2);">Crie uma conta para acumular XP, subir de nível e disputar o ranking <b>diário</b>, <b>semanal</b>, <b>mensal</b> e <b>anual</b> com outros estudantes.</p>'+
        btn+
      '</div>'+
    '</section>';
  }

  function screenRanking(){
    if(!canRank()) return rankInvite();

    var lv = levelInfo(userXP());
    var rows = state.leaderboard;
    var meId = state.auth.user ? state.auth.user.id : null;
    var periodLabel = RANK_PERIOD_LABEL[state.rankPeriod] || '';

    var body;
    if(state.rankLoading && !rows){
      body = rankSkeleton();
    } else if(state.rankError){
      body = rankMessage('⚠️', 'Não foi possível carregar o ranking', 'Verifique sua conexão. Se persistir, confirme que o gamification.sql foi executado no Supabase.');
    } else if(!rows || !rows.length){
      body = rankMessage('🏁', 'Ninguém pontuou ainda', 'Seja o primeiro a marcar presença neste período — revise fichas e faça exercícios para somar XP.');
    } else {
      body = '<div style="display:flex;flex-direction:column;gap:9px;'+(state.rankLoading?'opacity:.5;transition:opacity .2s;':'')+'">'+
        rows.map(function(r){ return rankRow(r, !!(meId && r.user_id === meId)); }).join('')+
      '</div>';
    }

    return ''+
    '<section style="max-width:760px;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      '<div style="font-size:13px;font-weight:600;color:var(--muted);margin-bottom:4px;">Ranking</div>'+
      '<h1 style="font:800 28px \'Bricolage Grotesque\';letter-spacing:-.5px;margin:0 0 6px;">Ranking de XP</h1>'+
      '<p style="margin:0 0 22px;color:var(--muted-2);font-size:14.5px;max-width:560px;">Sua posição entre os estudantes — XP por fichas revisadas, exercícios e dias ativos.</p>'+
      levelHeroCard(lv)+
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:18px;">'+
        rankTabs()+
        '<span style="font-size:12.5px;font-weight:700;color:var(--muted);">'+esc(periodLabel)+'</span>'+
      '</div>'+
      body+
    '</section>';
  }
  var FB_TIPOS = [['erro','Erro na ficha'],['sugestao','Sugestão'],['duvida','Dúvida'],['outro','Outro']];
  function screenFeedback(){
    var f = state.feedback;

    // modo demonstração (sem Supabase): mantém o fallback por e-mail
    if(!DB.ready){
      var mail='mailto:felipe.cb2511@gmail.com?subject='+encodeURIComponent('Psico·Pato — Feedback');
      return placeholderScreen('Feedback','Feedback',ICON.message,'Por e-mail',
        'Envie erros nas fichas e sugestões para <a href="'+mail+'" style="color:var(--teal-text);font-weight:700;text-decoration:none;">felipe.cb2511@gmail.com</a>.');
    }

    // estado de sucesso
    if(f.sent){
      return ''+
      '<section style="max-width:620px;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
        '<div style="font-size:13px;font-weight:600;color:var(--muted);margin-bottom:4px;">Feedback</div>'+
        '<h1 style="font:800 28px \'Bricolage Grotesque\';letter-spacing:-.5px;margin:0 0 22px;">Feedback</h1>'+
        '<div style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:40px 30px;text-align:center;">'+
          '<div style="width:56px;height:56px;border-radius:16px;background:var(--ok-bg);color:var(--ok-tx);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;"><span style="transform:scale(1.5);display:flex;">'+ICON.knowCheck+'</span></div>'+
          '<h2 style="font:800 19px \'Bricolage Grotesque\';margin:0 0 7px;color:var(--ink);">Feedback enviado!</h2>'+
          '<p style="margin:0 auto 20px;max-width:380px;font-size:14.5px;line-height:1.6;color:var(--muted-2);">Obrigado por ajudar a melhorar o conteúdo. Cada relato é revisado.</p>'+
          '<button data-action="goFeedback" data-hover="background:#0c6a66;transform:translateY(-2px);" style="background:var(--accent-tx);border:none;border-radius:12px;padding:11px 20px;font:700 14px \'Hanken Grotesk\';color:#fff;cursor:pointer;transition:background .18s,transform .18s;">Enviar outro</button>'+
        '</div>'+
      '</section>';
    }

    var tabs = '<div class="fb-tabs">'+ FB_TIPOS.map(function(t){
      var on = f.tipo===t[0];
      return '<button data-action="setFeedbackTipo" data-arg="'+t[0]+'" class="fb-tab'+(on?' on':'')+'">'+t[1]+'</button>';
    }).join('') +'</div>';

    var fichaChip = f.transtornoNome
      ? '<div class="fb-ficha"><span class="fb-ficha-lbl">Sobre a ficha</span><span class="fb-ficha-nome">'+esc(f.transtornoNome)+'</span><button data-action="clearFeedbackFicha" class="fb-ficha-x" title="Remover" aria-label="Remover ficha">×</button></div>'
      : '';

    var guestNote = state.auth.guest
      ? '<div class="fb-note">'+ICON.info+'<span>Você está como visitante — seu feedback será enviado de forma anônima.</span></div>'
      : '';

    var errBox = f.error ? '<div class="fb-error">'+esc(f.error)+'</div>' : '';

    return ''+
    '<section style="max-width:620px;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      '<div style="font-size:13px;font-weight:600;color:var(--muted);margin-bottom:4px;">Feedback</div>'+
      '<h1 style="font:800 28px \'Bricolage Grotesque\';letter-spacing:-.5px;margin:0 0 6px;">Feedback</h1>'+
      '<p style="margin:0 0 22px;color:var(--muted-2);font-size:14.5px;max-width:540px;">Relate erros nas fichas, mande sugestões ou tire dúvidas. Vai direto para a revisão do conteúdo.</p>'+
      '<div style="background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:20px;">'+
        '<div class="fb-label">Tipo</div>'+
        tabs+
        fichaChip+
        '<div class="fb-label" style="margin-top:16px;">Mensagem</div>'+
        '<textarea id="fb-msg" class="fb-textarea" rows="5" placeholder="Descreva o erro ou a sugestão. Se for um erro de ficha, diga em qual critério/seção.">'+esc(f.draft||'')+'</textarea>'+
        errBox+
        guestNote+
        '<button data-action="submitFeedback"'+(f.sending?' disabled':'')+' class="fb-submit"'+(f.sending?'':' data-hover="background:#0c6a66;transform:translateY(-2px);"')+'>'+(f.sending?'Enviando…':'Enviar feedback')+'</button>'+
      '</div>'+
    '</section>';
  }
  function screenDsm(){
    return ''+
    '<section style="animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      '<div style="display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:14px;">'+
        '<div>'+
          '<div style="font-size:13px;font-weight:600;color:var(--muted);margin-bottom:4px;">DSM-5-TR</div>'+
          '<h1 style="font:800 28px \'Bricolage Grotesque\';letter-spacing:-.5px;margin:0;">Manual na íntegra</h1>'+
        '</div>'+
        '<a href="DSM-5-TR.pdf" target="_blank" rel="noopener" data-hover="border-color:#5BC0BE;" style="text-decoration:none;background:var(--surface);border:1px solid var(--border);border-radius:11px;padding:9px 14px;font:700 13px \'Hanken Grotesk\';color:var(--teal-text);transition:border-color .18s ease;">Abrir em nova aba ↗</a>'+
      '</div>'+
      '<iframe class="dsm-frame" src="DSM-5-TR.pdf" title="DSM-5-TR — manual completo"></iframe>'+
    '</section>';
  }
  function screenSobre(){
    var total = CATS.reduce(function(s,c){ return s + c.items.length; }, 0);
    function card(icon, title, body){
      return '<div style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:20px;display:flex;gap:14px;align-items:flex-start;">'+
        '<div style="width:42px;height:42px;border-radius:12px;background:var(--accent-bg);color:var(--accent-tx);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><span style="transform:scale(1.15);display:flex;">'+icon+'</span></div>'+
        '<div><div style="font:700 15px \'Bricolage Grotesque\';color:var(--ink);margin-bottom:4px;">'+esc(title)+'</div>'+
        '<p style="margin:0;font-size:14px;line-height:1.6;color:var(--muted-2);">'+body+'</p></div>'+
      '</div>';
    }
    return ''+
    '<section style="max-width:780px;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      '<div style="font-size:13px;font-weight:600;color:var(--muted);margin-bottom:4px;">Sobre</div>'+
      '<h1 style="font:800 28px \'Bricolage Grotesque\';letter-spacing:-.5px;margin:0 0 8px;"><span class="notranslate">Psico<span style="color:#5BC0BE;">·</span>Pato</span></h1>'+
      '<p style="margin:0 0 24px;color:var(--muted-2);font-size:15px;line-height:1.6;max-width:620px;">Plataforma de estudos e revisão dos transtornos do DSM-5-TR — fichas-resumo com critérios diagnósticos, especificadores, seções narrativas e exercícios.</p>'+
      '<article class="sobre-ensaio">'+
        '<div class="se-kicker"><span>🧠</span> Reflexão</div>'+
        '<h2 class="se-title">Psicodiagnóstico: entre a classificação e a compreensão do sofrimento humano</h2>'+
        '<p>O psicodiagnóstico ocupa um papel importante na prática em saúde mental. Identificar padrões de funcionamento psicológico, reconhecer sintomas e formular hipóteses diagnósticas pode auxiliar na comunicação entre profissionais, no planejamento de intervenções, na produção de pesquisas e no acesso a serviços e direitos. Nesse contexto, sistemas classificatórios como o DSM-5-TR oferecem uma linguagem comum para descrever fenômenos clínicos e organizar o conhecimento científico disponível.</p>'+
        '<p>Entretanto, nenhum diagnóstico é capaz de capturar integralmente a complexidade de uma pessoa. O sofrimento psíquico emerge em contextos históricos, sociais, culturais, familiares e biográficos específicos que não podem ser reduzidos a uma lista de critérios. O diagnóstico deve ser entendido como uma ferramenta de compreensão e orientação clínica, e não como uma definição da identidade, do valor ou do potencial de alguém.</p>'+
        '<p>O uso ético e responsável do psicodiagnóstico exige que profissionais mantenham uma postura crítica diante dos sistemas classificatórios. As categorias diagnósticas são construções teóricas desenvolvidas para facilitar a observação e a comunicação clínica, mas estão sujeitas a revisões, mudanças conceituais e debates científicos. Ao longo da história, diferentes formas de comportamento e experiência humana foram classificadas, redefinidas ou removidas dos manuais diagnósticos, lembrando-nos de que o conhecimento em saúde mental está em constante transformação.</p>'+
        '<p>Por essa razão, o diagnóstico não deve ser utilizado de forma automática, descontextualizada ou exclusivamente baseada em sintomas isolados. Uma avaliação psicológica adequada envolve múltiplas fontes de informação, escuta qualificada, análise do contexto de vida, consideração das diferenças culturais e reflexão sobre os limites dos instrumentos utilizados. O raciocínio clínico vai além da simples correspondência entre critérios e categorias.</p>'+
        '<p>Esta plataforma foi desenvolvida como uma ferramenta de estudo e revisão do DSM-5-TR. Seu objetivo é facilitar o acesso ao conteúdo do manual e apoiar processos de aprendizagem. Contudo, conhecer critérios diagnósticos não equivale a desenvolver competência clínica. A formação profissional exige também reflexão ética, supervisão, experiência prática e compromisso com a singularidade de cada sujeito.</p>'+
        '<p class="se-fecho">Ao estudar psicopatologia, é importante lembrar que os diagnósticos existem para servir às pessoas — e não para que as pessoas sejam reduzidas aos seus diagnósticos.</p>'+
      '</article>'+
      '<div style="display:flex;flex-direction:column;gap:12px;">'+
        card(ICON.book2, 'Conteúdo', 'Os '+total+' transtornos das 20 categorias da Seção II do DSM-5-TR, com critérios, subtipos, especificadores e seções, além de tabelas recortadas do manual.')+
        card(ICON.info, 'Fonte e finalidade educativa', 'Conteúdo baseado no DSM-5-TR (Manual Diagnóstico e Estatístico de Transtornos Mentais, American Psychiatric Association; ed. brasileira Artmed / Grupo A), utilizado aqui <b>exclusivamente para fins de estudo e revisão de conteúdos</b>. Os trechos extraídos diretamente — em especial os <b>critérios diagnósticos</b> — foram mantidos fiéis ao texto original, prezando pela exatidão e evitando interpretações equivocadas de informações clínicas essenciais. Todos os direitos sobre o DSM-5-TR pertencem aos seus detentores. Veja o manual completo na aba DSM-5-TR.')+
        card(ICON.statShield, 'Aviso importante', 'Ferramenta de <b>estudo</b>, não de diagnóstico. O texto pode conter imprecisões da extração automática — sempre confirme no manual oficial. Não substitui avaliação clínica profissional.')+
        card(ICON.message, 'Encontrou um erro?', 'Use a aba <b>Feedback</b> para relatar erros nas fichas e enviar sugestões.')+
      '</div>'+
    '</section>';
  }

  /* =========================================================
     RENDER PRINCIPAL
     ========================================================= */
  function currentScreen(){
    switch(state.screen){
      case 'home':        return screenHome();
      case 'categorias':  return screenCategorias();
      case 'categoria':   return screenCategoria();
      case 'ficha':       return screenFicha();
      case 'exercicios':  return screenExercicios();
      case 'flashMode':   return screenFlashMode();
      case 'decks':       return screenDecks();
      case 'flashcards':  return screenFlashcards();
      case 'quizMode':    return screenQuizMode();
      case 'quizDecks':   return screenQuizDecks();
      case 'quiz':        return screenQuiz();
      case 'ligar':       return screenLigar();
      case 'caso':        return screenCaso();
      case 'indice':      return screenIndice();
      case 'ranking':     return screenRanking();
      case 'dsm':         return screenDsm();
      case 'feedback':    return screenFeedback();
      case 'sobre':       return screenSobre();
      case 'perfil':      return screenPerfil();
      default:            return screenHome();
    }
  }

  // chave de "conteúdo" da tela: muda quando navegamos para outro conteúdo,
  // mas NÃO quando só interagimos (toggle, flip, responder). Usada para tocar
  // a animação de entrada apenas em mudança real de tela.
  function renderKey(){
    var s = state.screen;
    if(s === 'ficha')     return 'ficha:'+state.activeCat+':'+state.activeDisorder;
    if(s === 'categoria') return 'categoria:'+state.activeCat;
    return s;
  }

  var root, lastKey = null;
  function render(){
    if(!root) root = document.getElementById('app');
    // gating de autenticação (apenas quando o Supabase está configurado)
    if(DB.ready && !state.auth.guest){
      if(state.auth.checking){ root.innerHTML = authLoading(); return; }
      // recuperação de senha: usuário voltou pelo link do e-mail -> definir nova senha
      if(state.auth.recovery){ root.innerHTML = screenResetPassword(); bindFx(root); return; }
      // entrando/cadastrando: mostra o loader de marca no lugar do formulário
      if(state.auth.busy && !state.auth.user && state.screen!=='forgot'){ root.innerHTML = brandLoader(state.auth.loadingMsg || 'Entrando…'); return; }
      if(!state.auth.user){ root.innerHTML = authScreen(); bindFx(root); return; }
    }
    var key = renderKey();
    var staticUpdate = (key === lastKey);   // re-render por interação (mesma tela)
    lastKey = key;
    root.innerHTML =
      '<div class="app-shell'+(state.sideCollapsed?' side-collapsed':'')+'">'+
        sidebar()+
        '<main class="main">'+
          topbar()+
          '<div class="content'+(staticUpdate ? ' static-update' : '')+'">'+guestBanner()+currentScreen()+'</div>'+
        '</main>'+
      '</div>'+
      bottomNav()+
      mobileMenuSheet();
    bindFx(root);
    bindSearch(root);
    bindClassify(root);
    // reaplica os efeitos de acessibilidade ao conteúdo recriado (SPA)
    if(window.A11Y && window.A11Y.reapply){ try{ window.A11Y.reapply(); }catch(e){} }
    applyTrDict();   // corrige termos que o tradutor automático erra (ex.: "Sobre")
    if(state.pendingScroll){
      var target = state.pendingScroll; state.pendingScroll = null;
      requestAnimationFrame(function(){
        var el = document.getElementById(target);
        if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
      });
    }
  }

  /* =========================================================
     Efeitos hover / active (substitui style-hover/style-active
     do runtime do Claude Design, que não existe aqui)
     ========================================================= */
  function bindFx(scope){
    var nodes = scope.querySelectorAll('[data-hover],[data-active]');
    Array.prototype.forEach.call(nodes, function(elm){
      var base = elm.getAttribute('style') || '';
      var hover = elm.getAttribute('data-hover') || '';
      var active = elm.getAttribute('data-active') || '';
      var hovering=false, pressing=false;
      function apply(){
        elm.setAttribute('style', base + (hovering?hover:'') + (pressing?active:''));
      }
      if(hover){
        elm.addEventListener('mouseenter', function(){ hovering=true; apply(); });
        elm.addEventListener('mouseleave', function(){ hovering=false; pressing=false; apply(); });
      }
      if(active){
        elm.addEventListener('mousedown', function(){ pressing=true; apply(); });
        window.addEventListener('mouseup', function(){ if(pressing){ pressing=false; apply(); } });
        elm.addEventListener('mouseleave', function(){ if(pressing){ pressing=false; apply(); } });
      }
    });
  }

  /* =========================================================
     Delegação de cliques
     ========================================================= */
  function handleClick(e){
    var t = e.target;
    while(t && t!==document){
      if(t.getAttribute && t.getAttribute('data-action')){
        var name = t.getAttribute('data-action');
        var arg = t.getAttribute('data-arg');
        // ação especial para abrir telas de exercício pelo hub
        if(name==='goScreen'){ go(arg); return; }
        var fn = actions[name];
        if(fn){
          if(arg!==null && arg!==undefined && arg!==''){
            var num = Number(arg);
            fn(isNaN(num) ? arg : num);
          } else {
            fn();
          }
        }
        return;
      }
      t = t.parentNode;
    }
  }

  /* =========================================================
     Navegação por teclado
     ========================================================= */
  function handleKeyNav(e){
    var tag = (e.target && e.target.tagName) || '';
    if(tag==='INPUT' || tag==='TEXTAREA' || e.metaKey || e.ctrlKey || e.altKey) return;
    // não atua nas telas de auth/loading
    if(DB.ready && !state.auth.guest && (!state.auth.user || state.auth.checking)) return;
    // Enter/Espaço num botão focado: deixa o navegador clicá-lo
    if((e.key==='Enter' || e.key===' ') && (tag==='BUTTON' || tag==='A')) return;

    var s = state.screen, k = e.key;
    function run(fn, arg){ if(fn){ arg===undefined?fn():fn(arg); e.preventDefault(); } }

    if(s==='ficha'){
      if(k==='ArrowLeft')  return run(actions.prevDisorder);
      if(k==='ArrowRight') return run(actions.nextDisorder);
      if(k==='Escape')     return run(actions.backToCategoria);
    } else if(s==='categoria'){
      if(k==='Escape')     return run(actions.goCategorias);
    } else if(s==='flashMode'){
      if(k==='Escape') return run(actions.goExercicios);
    } else if(s==='decks'){
      if(k==='Escape') return run(actions.goFlashMode);
    } else if(s==='flashcards'){
      if(k===' ' || k==='Enter') return run(actions.flip);
      if(k==='ArrowRight') return run(actions.fcKnow);
      if(k==='ArrowLeft')  return run(actions.fcPrev);
      if(k==='Escape')     return run(state.deckCat===-1 ? actions.goFlashMode : actions.goDecks);
    } else if(s==='quizMode'){
      if(k==='Escape') return run(actions.goExercicios);
    } else if(s==='quizDecks'){
      if(k==='Escape') return run(actions.goQuizMode);
    } else if(s==='quiz'){
      var qbackEsc = state.quizCat===-1 ? actions.goQuizMode : actions.goQuizDecks;
      if(k==='Escape') return run(qbackEsc);
      if(state.quizDone){ if(k==='Enter') return run(actions.quizRestart); return; }
      var q = state.quizSet && state.quizSet[state.quizIndex];
      if(q && !state.quizAnswered && k>='1' && k<='9'){ var qi=+k-1; if(qi<q.opts.length) return run(actions.quizSelect, qi); }
      if(k==='Enter' && state.quizAnswered) return run(actions.quizNext);
    } else if(s==='caso'){
      if(k>='1' && k<='9'){ var ci=+k-1; if(ci<currentCaso().opts.length) return run(actions.casoSelect, ci); }
      if(k==='Enter' && state.casoAnswered) return run(actions.casoNext);
      if(k==='Escape') return run(actions.goExercicios);
    } else if(s==='ligar'){
      if(k==='Escape') return run(actions.goExercicios);
    } else if(s==='indice'){
      if(k==='Escape') return run(actions.goCategorias);
    } else if(s==='categorias' || s==='exercicios' || s==='ranking' || s==='dsm' || s==='feedback' || s==='sobre'){
      if(k==='Escape') return run(actions.goHome);
    }
  }

  /* =========================================================
     Init
     ========================================================= */
  function init(){
    root = document.getElementById('app');
    var dark=false;
    try{ dark = localStorage.getItem('dsm-theme')==='dark'; }catch(e){}
    state.dark = dark;
    applyTheme(dark);
    try{ var lv=localStorage.getItem('dsm-last-viewed'); if(lv){ var pv=lv.split(':'); state.lastViewed={cat:+pv[0], dis:+pv[1]}; } }catch(e){}
    document.addEventListener('click', handleClick);
    // Enter envia o formulário de auth (não há <form> para evitar reload)
    document.addEventListener('keydown', function(e){
      if(e.key==='Enter' && e.target && e.target.classList && e.target.classList.contains('auth-input')){
        e.preventDefault();
        var act = state.auth.recovery ? 'submitNewPassword'
                : state.screen==='forgot'   ? 'submitForgot'
                : state.screen==='register' ? 'submitRegister'
                : 'submitLogin';
        if(actions[act]) actions[act]();
      }
    });
    document.addEventListener('keydown', handleKeyNav);
    resetSideMetricTimer();   // carrossel de métricas (auto + interação do usuário)
    // fecha o dropdown de busca ao clicar fora dele
    document.addEventListener('click', function(e){
      var box = document.getElementById('search-results');
      if(!box || box.style.display === 'none') return;
      var inside = e.target && e.target.closest && e.target.closest('.topbar-search');
      if(!inside){ box.style.display = 'none'; }
    });
    // fecha o mural de avisos ao clicar fora dele
    document.addEventListener('click', function(e){
      if(!state.notifOpen) return;
      var t = e.target;
      if(t && t.closest && t.closest('.notif-wrap')) return;   // dentro do sino/painel
      closeNotifPanel(); render();
    });
    // upload de avatar: dispara quando o usuário escolhe um arquivo
    document.addEventListener('change', function(e){
      if(e.target && e.target.id==='avatar-file'){
        var f = e.target.files && e.target.files[0];
        if(actions.avatarFileChosen) actions.avatarFileChosen(f);
      }
    });
    // primeiro acesso: abre o mural com a mensagem de boas-vindas
    if(notifUnreadCount()>0){ state.notifOpen=true; state.notifNew=notifUnreadIds(); }
    // histórico de navegação: back do navegador/celular restaura a tela anterior
    try { window.history.replaceState({psp:1, base:1}, ''); } catch(e){}
    window.addEventListener('popstate', function(){
      var hadNotif = state.notifOpen;
      if(hadNotif){ closeNotifPanel(); }           // fecha overlay aberto (marca como lido)
      if(!navPop() && hadNotif){ render(); }        // nada na pilha, mas havia overlay -> re-render
    });
    // atalho "/" foca o campo de busca
    document.addEventListener('keydown', function(e){
      if(e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      var tag = (e.target && e.target.tagName) || '';
      if(tag === 'INPUT' || tag === 'TEXTAREA') return;
      var input = document.getElementById('global-search');
      if(input){ e.preventDefault(); input.focus(); }
    });

    // PWA: re-renderiza para mostrar/ocultar o botão "Instalar app"
    window.__onPwaPrompt = function(){ try{ render(); }catch(e){} };
    // link de recuperação de senha: a URL volta com #...type=recovery...
    // marca já aqui para não cair na home antes do evento PASSWORD_RECOVERY.
    try { if(/type=recovery/.test(window.location.hash||'')) state.auth.recovery = true; } catch(e){}

    if(DB.ready){
      DB.onAuth(applySession);
      state.auth.checking = true;
      render();
      DB.currentSession().then(function(u){   // login automático via localStorage
        if(u){ DB.setGuest(false); state.auth.guest=false; applySession(u); }
        else if(DB.guest){ state.auth.guest=true; state.auth.checking=false; state.screen='home'; loadUserData().then(render); }
        else { state.auth.checking=false; setState({screen:'welcome'}); }
      }).catch(function(){
        state.auth.checking=false;
        if(DB.guest){ state.auth.guest=true; state.screen='home'; loadUserData().then(render); }
        else setState({screen:'welcome'});
      });
    } else {
      state.auth.checking = false;
      render();   // modo demonstração: comportamento original
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
