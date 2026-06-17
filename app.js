/* ============================================================
   Plataforma DSM · Revisa
   Recriação fiel do protótipo do Claude Design em JS vanilla.
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

  var ACHIEVEMENTS = [
    {emoji:'🔥', title:'Streak de 12 dias', sub:'Continue assim!', bg:'#FFEDE3'},
    {emoji:'🎯', title:'Ansiedade dominada', sub:'Categoria 85%', bg:'#E6F6EE'},
    {emoji:'⚡', title:'50 flashcards', sub:'Em um só dia', bg:'#E8ECFB'},
    {emoji:'🧠', title:'100 questões', sub:'Marco atingido', bg:'#F3E8FB'},
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

  var CASO = {opts:['Transtorno depressivo maior','Transtorno de ansiedade generalizada','Transtorno de pânico','Transtorno bipolar tipo II'], correct:2};

  var CRITERIA = [
    {letter:'A', text:'Conteúdo ilustrativo. Critério principal do quadro — presença dos sintomas centrais por um período mínimo definido.'},
    {letter:'B', text:'Os sintomas causam sofrimento clinicamente significativo ou prejuízo no funcionamento social, profissional ou em outras áreas.'},
    {letter:'C', text:'A perturbação não é atribuível aos efeitos fisiológicos de uma substância ou a outra condição médica.'},
    {letter:'D', text:'A perturbação não é mais bem explicada por outro transtorno mental.'},
  ];

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
    about:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
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
    {key:'flashcards', title:'Flashcards', desc:'Memorize critérios e definições virando os cartões.', chipText:'120 cartões', screen:'flashcards', color:'#FF7A45', bg:'#FFEDE3'},
    {key:'quiz', title:'Questionário', desc:'Múltipla escolha com correção e explicação imediata.', chipText:'12 questões', screen:'quiz', color:'#4361EE', bg:'#E8ECFB'},
    {key:'ligar', title:'Ligar transtorno → categoria', desc:'Associe cada transtorno ao seu capítulo do DSM.', chipText:'5 pares', screen:'ligar', color:'#06915A', bg:'#E6F6EE'},
    {key:'caso', title:'Estudo de caso', desc:'Leia a vinheta clínica e escolha o diagnóstico.', chipText:'12 casos', screen:'caso', color:'#8338EC', bg:'#F3E8FB'},
  ];

  /* ---------------------------------------------------------
     Estado
     --------------------------------------------------------- */
  var state = {
    screen:'home', activeCat:4, activeDisorder:0, fichaOpen:{},
    fcIndex:0, fcFlipped:false,
    quizIndex:0, quizSelected:null, quizAnswered:false,
    matchLeftSel:null, matches:{},
    casoSelected:null, casoAnswered:false,
    dark:false,
    auth:{user:null, profile:null, checking:false, error:'', info:'', busy:false, guest:false},
    progress:{}, stats:null, pendingScroll:null,
  };

  var REV_SCREENS = ['categorias','indice','categoria','ficha'];
  var EX_SCREENS  = ['exercicios','flashcards','quiz','ligar','caso'];

  /* registro de ações (delegação de cliques) */
  var actions = {
    goHome:        function(){ go('home'); },
    goCategorias:  function(){ go('categorias'); },
    goExercicios:  function(){ go('exercicios'); },
    goIndice:      function(){ go('indice'); },
    goRanking:     function(){ go('ranking'); },
    goDsm:         function(){ go('dsm'); },
    goFeedback:    function(){ go('feedback'); },
    goSobre:       function(){ go('sobre'); },
    openRef:       function(arg){ var p=String(arg).split(':'); var ci=+p[0], di=+p[1]; setState({screen:'ficha', activeCat:ci, activeDisorder:di, fichaOpen:initOpen(ci,di)}); recordRevised(); scrollTop(); },
    goFlashcards:  function(){ go('flashcards'); },
    toggleTheme:   function(){ toggleTheme(); },
    openCat:       function(i){ setState({screen:'categoria', activeCat:i}); scrollTop(); },
    openDisorder:  function(i){ setState({screen:'ficha', activeDisorder:i, fichaOpen:initOpen(state.activeCat, i)}); recordRevised(); scrollTop(); },
    backToCategoria:function(){ setState({screen:'categoria'}); scrollTop(); },
    prevDisorder:  function(){ var i=Math.max(0, state.activeDisorder-1); setState({activeDisorder:i, fichaOpen:initOpen(state.activeCat, i)}); recordRevised(); scrollTop(); },
    nextDisorder:  function(){ var c=CATS[state.activeCat]; var i=Math.min(c.items.length-1, state.activeDisorder+1); setState({activeDisorder:i, fichaOpen:initOpen(state.activeCat, i)}); recordRevised(); scrollTop(); },
    toggleSec:     function(i){ var o=Object.assign({}, state.fichaOpen); o[i]=!o[i]; setState({fichaOpen:o}); },
    // flashcards
    flip:    function(){ setState({fcFlipped:!state.fcFlipped}); },
    fcPrev:  function(){ var n=(state.fcIndex-1+FLASHCARDS.length)%FLASHCARDS.length; setState({fcIndex:n, fcFlipped:false}); },
    fcAgain: function(){ logExercise('flashcard', false); var n=(state.fcIndex+1)%FLASHCARDS.length; setState({fcIndex:n, fcFlipped:false}); },
    fcKnow:  function(){ logExercise('flashcard', true); var n=(state.fcIndex+1)%FLASHCARDS.length; setState({fcIndex:n, fcFlipped:false}); },
    // quiz
    quizSelect: function(i){ if(state.quizAnswered) return; var ok=(i===QUIZ[state.quizIndex].correct); setState({quizSelected:i, quizAnswered:true}); logExercise('quiz', ok); },
    quizNext:   function(){ if(state.quizIndex<QUIZ.length-1) setState({quizIndex:state.quizIndex+1, quizSelected:null, quizAnswered:false}); else setState({quizIndex:0, quizSelected:null, quizAnswered:false}); },
    // matching
    matchLeft:  function(i){ setState({matchLeftSel:i}); },
    matchRight: function(j){ if(state.matchLeftSel===null) return; var m=Object.assign({}, state.matches); m[state.matchLeftSel]=j; var full=Object.keys(m).length===ML.length; var allCorrect=full && ML.every(function(l,i){ return MR[m[i]]===l.cat; }); setState({matches:m, matchLeftSel:null}); if(full) logExercise('ligar', allCorrect); },
    matchReset: function(){ setState({matches:{}, matchLeftSel:null}); },
    // caso
    casoSelect: function(i){ if(state.casoAnswered) return; var ok=(i===CASO.correct); setState({casoSelected:i, casoAnswered:true}); logExercise('caso', ok); },
  };

  /* ações de autenticação (registradas à parte) */
  actions.goLogin    = function(){ state.auth.error=''; state.auth.info=''; setState({screen:'login'}); };
  actions.goRegister = function(){ state.auth.error=''; state.auth.info=''; setState({screen:'register'}); };
  actions.logout     = function(){ if(DB.ready) DB.logout(); };
  actions.submitLogin = function(){
    var email=val('auth-email'), pass=rawVal('auth-pass');
    state.auth.error=''; state.auth.info='';
    if(!email||!pass){ state.auth.error='Preencha e-mail e senha.'; render(); return; }
    state.auth.busy=true; render();
    DB.login(email,pass).then(function(res){
      state.auth.busy=false;
      if(res && res.error){ state.auth.error=traduzErro(res.error); render(); return; }
      /* sucesso: onAuth dispara applySession e troca de tela */
    }).catch(function(){ state.auth.busy=false; state.auth.error='Erro de conexão. Tente de novo.'; render(); });
  };
  actions.submitRegister = function(){
    var nome=val('reg-nome'), curso=val('reg-curso'), sem=val('reg-sem');
    var email=val('reg-email'), pass=rawVal('reg-pass');
    state.auth.error=''; state.auth.info='';
    if(!nome||!email||!pass){ state.auth.error='Preencha nome, e-mail e senha.'; render(); return; }
    if(pass.length<6){ state.auth.error='A senha precisa de ao menos 6 caracteres.'; render(); return; }
    state.auth.busy=true; render();
    DB.register(email,pass,{nome:nome,curso:curso,semestre:sem}).then(function(res){
      state.auth.busy=false;
      if(res && res.error){ state.auth.error=traduzErro(res.error); render(); return; }
      if(res && res.data && res.data.session){ /* já logado: onAuth dispara */ }
      else { state.auth.info='Conta criada! Confirme pelo link no seu e-mail e depois entre.'; setState({screen:'login'}); }
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
  function isRevised(catIndex, d){ return !!state.progress[disorderId(catIndex, d)]; }
  function totalDisorders(){ return CATS.reduce(function(s,c){ return s + (c.items ? c.items.length : 0); }, 0); }
  function totalRevised(){ return Object.keys(state.progress).length; }
  function catRevisedCount(catIndex){
    var c = CATS[catIndex]; if(!c || !c.items) return 0;
    var n = 0; c.items.forEach(function(d){ if(isRevised(catIndex, d)) n++; }); return n;
  }
  function catProgress(catIndex){
    var c = CATS[catIndex]; if(!c) return 0;
    if(tracking()){ var t = c.items.length || 1; return catRevisedCount(catIndex) / t; }
    return c.prog || 0;
  }
  function greetName(){
    if(!tracking()) return 'Ana';
    if(state.auth.guest) return '';
    var nome = (state.auth.profile && state.auth.profile.nome) || '';
    return nome.split(/\s+/)[0] || '';
  }
  function todayLabel(){
    try{
      var s = new Date().toLocaleDateString('pt-BR', {weekday:'long', day:'numeric', month:'long'});
      return s.charAt(0).toUpperCase() + s.slice(1);
    }catch(e){ return ''; }
  }
  function recordRevised(){
    if(!tracking()) return;
    var cat = CATS[state.activeCat]; if(!cat) return;
    var d = cat.items[state.activeDisorder]; if(!d) return;
    var id = disorderId(state.activeCat, d);
    if(state.progress[id]) return;          // já revisado
    state.progress[id] = true;
    render();                               // reflete já na sidebar/listas
    DB.markRevised(id).then(refreshStats).catch(function(){});
  }
  function logExercise(tipo, acerto){
    if(!tracking()) return;
    DB.logEvent(tipo, acerto).then(refreshStats).catch(function(){});
  }
  function refreshStats(){
    if(!tracking()) return Promise.resolve();
    return DB.getStats().then(function(s){ state.stats = s; render(); }).catch(function(){});
  }
  function loadUserData(){
    if(!tracking()){ return Promise.resolve(); }
    return Promise.all([DB.getProgress(), DB.getStats()]).then(function(res){
      var prog = {}; (res[0] || []).forEach(function(row){ prog[row.transtorno_id] = true; });
      state.progress = prog;
      state.stats = res[1] || {revisados:0, exercicios:0, taxa:0, streak:0};
    }).catch(function(){ state.progress = {}; state.stats = {revisados:0, exercicios:0, taxa:0, streak:0}; });
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
     setState + render
     --------------------------------------------------------- */
  function setState(patch){ Object.assign(state, patch); render(); }

  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  // preserva quebras de linha (critérios com sub-itens) como <br>
  function escMl(s){ return esc(s).replace(/\n/g,'<br>'); }
  // pequeno helper de letra A, B, C...
  function letter(i){ return String.fromCharCode(65+i); }

  /* =========================================================
     SIDEBAR
     ========================================================= */
  function navBtn(item){
    if(item.active){
      return '<button data-action="'+item.action+'" style="display:flex;align-items:center;gap:12px;width:100%;padding:11px 14px;border:none;border-radius:12px;cursor:pointer;font:600 15px \'Hanken Grotesk\';text-align:left;background:#0E4D64;color:#fff;">'+item.icon+'<span>'+item.label+'</span></button>';
    }
    return '<button data-action="'+item.action+'" data-hover="background:#EEF4F5;color:var(--teal-text);" data-active="transform:scale(.98);" style="display:flex;align-items:center;gap:12px;width:100%;padding:11px 14px;border:none;border-radius:12px;cursor:pointer;font:600 15px \'Hanken Grotesk\';text-align:left;background:transparent;color:#41595F;transition:background .18s ease,color .18s ease;">'+item.icon+'<span>'+item.label+'</span></button>';
  }

  function navItems(){
    var s=state;
    return [
      {label:'Início',    icon:ICON.home, action:'goHome',       active:s.screen==='home', primary:true},
      {label:'Revisão',   icon:ICON.book, action:'goCategorias', active:REV_SCREENS.indexOf(s.screen)>=0, primary:true},
      {label:'Exercícios',icon:ICON.check,action:'goExercicios', active:EX_SCREENS.indexOf(s.screen)>=0, primary:true},
      {label:'Ranking',   icon:ICON.trophy,  action:'goRanking',  active:s.screen==='ranking'},
      {label:'DSM-5-TR',  icon:ICON.bookOpen,action:'goDsm',      active:s.screen==='dsm'},
      {label:'Feedback',  icon:ICON.message, action:'goFeedback', active:s.screen==='feedback'},
      {label:'Sobre',     icon:ICON.about,   action:'goSobre',    active:s.screen==='sobre'},
    ];
  }

  function sidebar(){
    var its = navItems();
    var navPrim = its.filter(function(i){ return i.primary; }).map(navBtn).join('');
    var navSec  = its.filter(function(i){ return !i.primary; }).map(navBtn).join('');
    var nav = navPrim + '<div style="height:1px;background:var(--border);margin:9px 8px;"></div>' + navSec;
    var ovTotal = tracking() ? totalDisorders() : 90;
    var ovRev   = tracking() ? totalRevised()   : 38;
    var ovPct   = ovTotal ? Math.round(ovRev/ovTotal*100) : 0;
    return ''+
    '<aside class="sidebar">'+
      '<div style="display:flex;align-items:center;gap:11px;padding:4px 6px 22px;">'+
        '<img src="logo-128.png" alt="DSM·Revisa" width="38" height="38" style="width:38px;height:38px;border-radius:11px;object-fit:cover;display:block;background:#fff;border:1px solid var(--border);">'+
        '<div>'+
          '<div style="font:800 17px \'Bricolage Grotesque\';color:var(--teal-text);letter-spacing:-.3px;">DSM<span style="color:#5BC0BE;">·</span>Revisa</div>'+
          '<div style="font-size:11px;color:var(--muted);font-weight:600;letter-spacing:.3px;">guia de estudos</div>'+
        '</div>'+
      '</div>'+
      '<nav style="display:flex;flex-direction:column;gap:4px;">'+nav+'</nav>'+
      '<div style="margin-top:auto;background:var(--bg);border-radius:16px;padding:16px;">'+
        '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;">'+
          '<span style="font-size:12px;font-weight:700;color:var(--muted-2);">Progresso geral</span>'+
          '<span style="font:800 14px \'Bricolage Grotesque\';color:var(--teal-text);">'+ovPct+'%</span>'+
        '</div>'+
        '<div style="height:8px;background:var(--track);border-radius:99px;overflow:hidden;">'+
          '<div style="width:'+ovPct+'%;height:100%;background:linear-gradient(90deg,#0E4D64,#3F95A3,#5BC0BE,#3F95A3,#0E4D64);background-size:200% 100%;border-radius:99px;animation:slide 4s linear infinite;"></div>'+
        '</div>'+
        '<div style="font-size:11.5px;color:var(--muted);margin-top:9px;font-weight:600;">'+ovRev+' de '+ovTotal+' transtornos revisados</div>'+
      '</div>'+
      profileBlock()+
    '</aside>';
  }

  /* =========================================================
     TOPBAR
     ========================================================= */
  function topbar(){
    var themeIcon = state.dark ? ICON.sun : ICON.moon;
    return ''+
    '<header class="topbar">'+
      '<div class="topbar-search" style="flex:1;display:flex;align-items:center;gap:10px;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:9px 14px;max-width:420px;">'+
        ICON.search+
        '<span style="color:var(--muted);font-size:14px;font-weight:500;">Buscar transtorno, categoria ou código…</span>'+
      '</div>'+
      '<div style="display:flex;align-items:center;gap:7px;background:var(--surface);border:1px solid #FFD9C2;border-radius:99px;padding:7px 14px 7px 11px;">'+
        ICON.flame+
        '<span style="font:800 14px \'Bricolage Grotesque\';color:#E8590C;">12</span>'+
        '<span style="font-size:12.5px;font-weight:600;color:#C2410C;">dias</span>'+
      '</div>'+
      '<button data-action="toggleTheme" title="Alternar tema" data-hover="border-color:#5BC0BE;color:var(--teal-text);" data-active="transform:scale(.9) rotate(-15deg);" style="width:40px;height:40px;border-radius:12px;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--muted-2);transition:transform .18s ease,border-color .18s ease,color .18s ease;">'+themeIcon+'</button>'+
      '<button data-hover="background:var(--surface-2);" style="width:40px;height:40px;border-radius:12px;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--muted-2);transition:background .18s ease;">'+ICON.bell+'</button>'+
    '</header>';
  }

  /* =========================================================
     BARRA DE NAVEGAÇÃO INFERIOR (mobile)
     ========================================================= */
  function bottomNav(){
    return '<nav class="bottom-nav">'+ navItems().filter(function(i){ return i.primary; }).map(function(item){
      var col = item.active ? 'var(--teal-text)' : 'var(--muted)';
      var bgw = item.active ? 'background:var(--accent-bg);' : '';
      return '<button data-action="'+item.action+'" style="color:'+col+';'+bgw+'">'+item.icon+'<span>'+item.label+'</span></button>';
    }).join('') +'</nav>';
  }

  /* =========================================================
     TELA: HOME
     ========================================================= */
  function statCard(iconWrapExtra, bg, icon, value, label){
    return '<div data-hover="transform:translateY(-3px);box-shadow:0 12px 26px rgba(16,42,51,.08);border-color:var(--accent-bd);" style="background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:18px 18px 16px;transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease;">'+
      '<div style="width:36px;height:36px;border-radius:10px;background:'+bg+';display:flex;align-items:center;justify-content:center;margin-bottom:12px;'+iconWrapExtra+'">'+icon+'</div>'+
      '<div style="font:800 26px \'Bricolage Grotesque\';color:var(--ink);">'+value+'</div>'+
      '<div style="font-size:13px;font-weight:600;color:var(--muted);">'+label+'</div>'+
    '</div>';
  }

  function screenHome(){
    var st = tracking() ? (state.stats || {streak:0, revisados:0, exercicios:0, taxa:0})
                        : {streak:12, revisados:38, exercicios:154, taxa:87};
    var gname = greetName();
    var greeting = gname ? ('Bom te ver de novo, '+esc(gname)+'.') : 'Bom te ver de novo!';
    var dataHoje = tracking() ? todayLabel() : 'Quarta-feira, 10 de junho';
    var conq = ACHIEVEMENTS.map(function(a){
      return '<div data-hover="transform:translateY(-3px);box-shadow:0 12px 24px rgba(16,42,51,.08);border-color:#9DD9D2;" style="background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:18px;transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease;cursor:default;">'+
        '<div style="width:42px;height:42px;border-radius:12px;background:'+a.bg+';display:flex;align-items:center;justify-content:center;font-size:21px;">'+a.emoji+'</div>'+
        '<div style="font-weight:700;font-size:14px;margin-top:10px;color:var(--ink);">'+esc(a.title)+'</div>'+
        '<div style="font-size:12px;color:var(--muted);font-weight:500;">'+esc(a.sub)+'</div>'+
      '</div>';
    }).join('');

    return ''+
    '<section style="max-width:1080px;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      '<div style="font-size:14px;font-weight:600;color:var(--muted);margin-bottom:2px;">'+esc(dataHoje)+'</div>'+
      '<h1 style="font:800 30px \'Bricolage Grotesque\';letter-spacing:-.6px;margin:0 0 24px;color:var(--ink);">'+greeting+'</h1>'+

      '<div class="stat-grid">'+
        statCard('animation:ringPulse 2.6s ease-out infinite;', '#FFEDE3', ICON.flameOrange, String(st.streak), 'dias de streak')+
        statCard('', '#E3F3F2', ICON.statBook, String(st.revisados), 'transtornos revisados')+
        statCard('', '#E8ECFB', ICON.statCheck, String(st.exercicios), 'exercícios feitos')+
        statCard('', '#E6F6EE', ICON.statShield, st.taxa+'%', 'de acerto médio')+
      '</div>'+

      '<div class="home-mid">'+
        '<div style="background:linear-gradient(125deg,#0E4D64,#15677F);border-radius:20px;padding:26px;color:#fff;position:relative;overflow:hidden;">'+
          '<div style="position:absolute;right:-30px;top:-30px;width:160px;height:160px;border-radius:50%;background:rgba(91,192,190,.18);animation:floatY 7s ease-in-out infinite;"></div>'+
          '<div style="position:absolute;right:60px;bottom:-46px;width:110px;height:110px;border-radius:50%;background:rgba(157,217,210,.12);animation:floatY 9s ease-in-out infinite reverse;"></div>'+
          '<div style="position:relative;">'+
            '<span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#9DD9D2;">Continue de onde parou</span>'+
            '<h2 style="font:700 22px \'Bricolage Grotesque\';margin:8px 0 4px;">Transtornos de Ansiedade</h2>'+
            '<p style="margin:0 0 18px;color:#B7D7DD;font-size:14px;">Você estava revisando o Transtorno de Pânico.</p>'+
            '<button data-action="goCategorias" data-hover="background:#7BD0CE;transform:translateY(-2px);box-shadow:0 8px 18px rgba(91,192,190,.4);" data-active="transform:translateY(0) scale(.97);" style="background:#5BC0BE;color:#06343F;border:none;border-radius:12px;padding:12px 20px;font-weight:700;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:background .18s ease,transform .18s ease,box-shadow .18s ease;">Retomar revisão '+ICON.arrowR+'</button>'+
          '</div>'+
        '</div>'+
        '<div style="display:flex;flex-direction:column;gap:16px;">'+
          '<button data-action="goCategorias" data-hover="border-color:#5BC0BE;transform:translateY(-3px);box-shadow:0 12px 26px rgba(14,77,100,.10);" data-active="transform:translateY(-1px) scale(.99);" style="flex:1;text-align:left;background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:20px;cursor:pointer;display:flex;gap:14px;align-items:center;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease;">'+
            '<div style="width:46px;height:46px;border-radius:13px;background:#E3F3F2;display:flex;align-items:center;justify-content:center;flex-shrink:0;">'+ICON.book2+'</div>'+
            '<div><div style="font:700 16px \'Bricolage Grotesque\';">Revisão</div><div style="font-size:13px;color:var(--muted);font-weight:500;">20 categorias · fichas-resumo</div></div>'+
          '</button>'+
          '<button data-action="goExercicios" data-hover="border-color:#5BC0BE;transform:translateY(-3px);box-shadow:0 12px 26px rgba(14,77,100,.10);" data-active="transform:translateY(-1px) scale(.99);" style="flex:1;text-align:left;background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:20px;cursor:pointer;display:flex;gap:14px;align-items:center;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease;">'+
            '<div style="width:46px;height:46px;border-radius:13px;background:#FFEDE3;display:flex;align-items:center;justify-content:center;flex-shrink:0;">'+ICON.pencil+'</div>'+
            '<div><div style="font:700 16px \'Bricolage Grotesque\';">Exercícios</div><div style="font-size:13px;color:var(--muted);font-weight:500;">4 modos · flashcards e quiz</div></div>'+
          '</button>'+
        '</div>'+
      '</div>'+

      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'+
        '<h3 style="font:700 18px \'Bricolage Grotesque\';margin:0;">Conquistas recentes</h3>'+
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

  function screenCategorias(){
    var cards = CATS.map(function(c,i){
      var pct = Math.round(catProgress(i)*100);
      var cardStyle = "display:flex;flex-direction:column;align-items:flex-start;background:var(--surface);border:1px solid var(--border);border-top:3px solid "+c.color+";border-radius:18px;padding:18px;cursor:pointer;text-align:left;transition:transform .2s ease,box-shadow .2s ease;animation:popIn .45s cubic-bezier(.2,.7,.3,1) both;animation-delay:"+(i*0.035).toFixed(3)+"s;";
      var tileStyle = "width:40px;height:40px;border-radius:11px;background:"+c.color+"1A;color:"+c.color+";font:800 17px 'Bricolage Grotesque';display:flex;align-items:center;justify-content:center;";
      var countChip = "font-size:11.5px;font-weight:700;color:var(--muted);background:var(--surface-2);border-radius:7px;padding:4px 9px;";
      var barStyle  = "width:"+pct+"%;height:100%;background:"+c.color+";border-radius:99px;";
      return '<button data-action="openCat" data-arg="'+i+'" data-hover="transform:translateY(-3px);box-shadow:0 12px 26px rgba(16,42,51,.10);" style="'+cardStyle+'">'+
        '<div style="display:flex;align-items:center;justify-content:space-between;width:100%;">'+
          '<div style="'+tileStyle+'">'+(i+1)+'</div>'+
          '<span style="'+countChip+'">'+c.items.length+'</span>'+
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
      revViewToggle('categorias')+
      '<h1 style="font:800 28px \'Bricolage Grotesque\';letter-spacing:-.5px;margin:18px 0 6px;">As 20 categorias do DSM-5-TR</h1>'+
      '<p style="margin:0 0 24px;color:var(--muted-2);font-size:15px;max-width:620px;">Escolha um capítulo para ver os transtornos e suas fichas-resumo.</p>'+
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
          '<p style="margin:0;color:var(--muted-2);font-size:14.5px;">'+cat.items.length+' transtornos nesta categoria · conteúdo ilustrativo</p>'+
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
  // renderiza um array de linhas (prosa + listas) — usado nos critérios
  function renderRich(lines){
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
    var criteria;
    if(critList){
      criteria = '<div class="crit-timeline">'+ critList.map(function(cr){
        return '<div class="crit-item">'+
          '<span class="crit-badge">'+esc(cr.letter)+'</span>'+
          '<div class="crit-card" data-hover="box-shadow:0 6px 18px rgba(16,42,51,.08);transform:translateX(2px);">'+renderRich(cr.text.split('\n'))+'</div>'+
        '</div>';
      }).join('') +'</div>';
    } else {
      criteria = '<div class="crit-empty">'+ICON.book+'<div>Esta é uma categoria residual ou de referência cruzada — não traz um conjunto próprio de critérios A–E no DSM-5-TR. Veja o resumo acima e as seções abaixo.</div></div>';
    }

    // texto introdutório dos critérios
    var critIntro = disorder.criteriaIntro
      ? '<p style="margin:0 0 14px;font-size:14px;line-height:1.55;color:var(--muted-2);">'+esc(disorder.criteriaIntro)+'</p>' : '';

    // bloco(s) de especificador / subtipos — estruturado em blocos com opções
    var spec = disorder.specifier || [];
    var specBlock = spec.length
      ? '<div class="spec-wrap">'+ spec.map(function(blk){
          var opts = (blk.items||[]).map(function(o){
            return '<li>'+(o.label?'<span class="spec-opt-label">'+esc(o.label)+'</span> ':'')+(o.desc?esc(o.desc):'')+'</li>';
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
        var cap = sec.caption ? '<div class="sec-caption">'+esc(sec.caption)+'</div>' : '';
        body = '<div class="sec-acc-body">'+paras+imgs+cap+'</div>';
      }
      return '<div id="'+secId(i)+'">'+head+body+'</div>';
    }).join('');
    var secControls = sections.length>1
      ? '<div class="sec-controls"><button data-action="expandAll" class="sec-ctl-btn" data-hover="border-color:var(--cat);color:var(--cat);">Expandir tudo</button><button data-action="collapseAll" class="sec-ctl-btn" data-hover="border-color:var(--cat);color:var(--cat);">Recolher tudo</button></div>'
      : '';
    var accordionsBlock = sections.length
      ? '<h3 class="ficha-h3 mt"><span class="bar"></span>Mais sobre o transtorno</h3>'+ secControls +
        '<div style="display:flex;flex-direction:column;gap:10px;">'+accordions+'</div>' : '';

    var summaryText = disorder.summary || 'Resumo não disponível para este quadro.';

    // ---- chips de código primário (header — visíveis em qualquer tela) ----
    var chips = '<div class="ficha-code-chips">'+
      (primary.cid ? '<span class="code-chip"><span class="lbl">CID-10</span><b>'+esc(primary.cid)+'</b></span>' : '')+
      (primary.dsm ? '<span class="code-chip"><span class="lbl">DSM-5-TR</span><b>'+esc(primary.dsm)+'</b></span>' : '')+
    '</div>';

    // ---- rail: índice de seções (quick-jump) ----
    var indexCard = sections.length
      ? '<div class="rail-card"><div class="rail-label">Nesta ficha</div><div class="ficha-index">'+
        sections.map(function(sec,i){
          return '<button class="ficha-index-item" data-action="jumpToSection" data-arg="'+i+'" data-hover="background:var(--surface-2);color:var(--ink);">'+sectionIcon(sec.title)+'<span>'+esc(sec.title)+'</span></button>';
        }).join('')+
      '</div></div>' : '';

    // ---- rail: card de códigos (mini-tabela + copiar) ----
    function copyBtn(label){
      return '<button class="code-copy" data-action="copyCode" data-arg="'+esc(label)+'" data-hover="border-color:var(--cat);color:var(--cat);" title="Copiar código">'+copyIco+'</button>';
    }
    function codeRow(lbl, val, copyLabel){
      return '<div class="codes-row"><span class="ct-label">'+lbl+'</span><span class="ct-val"><span class="ct-code">'+esc(val||'—')+'</span>'+(val?copyBtn(copyLabel):'')+'</span></div>';
    }
    var codesInner;
    if(codes.length>1){
      codesInner = '<div class="rail-label">Códigos por '+(codes.length>2?'tipo':'variante')+'</div>'+
        codes.map(function(c){
          return (c.label?'<div class="codes-var-label">'+esc(c.label)+'</div>':'')+
            '<div class="codes-table">'+codeRow('CID-10', c.cid, 'CID '+c.cid)+codeRow('DSM-5-TR', c.dsm, 'DSM '+c.dsm)+'</div>';
        }).join('');
    } else {
      var c0 = codes[0];
      codesInner = '<div class="rail-label">Códigos</div><div class="codes-table">'+codeRow('CID-10', c0.cid, 'CID '+c0.cid)+codeRow('DSM-5-TR', c0.dsm, 'DSM '+c0.dsm)+'</div>';
    }
    var codesCard = '<div class="rail-card">'+codesInner+'</div>';

    // ---- rail: selo de revisão (integra o progresso) ----
    var revisedCard = '';
    if(tracking()){
      revisedCard = isRevised(state.activeCat, disorder)
        ? '<div class="revised-badge"><span class="rb-icon">'+ICON.knowCheck+'</span><span class="rb-text">Revisado</span><button data-action="toggleRevised" class="rb-toggle">desmarcar</button></div>'
        : '<button data-action="toggleRevised" class="revise-cta" data-hover="border-color:var(--cat);color:var(--cat);">'+ICON.knowCheck+'Marcar como revisado</button>';
    }

    // ---- navegação anterior/próximo (próximo nomeado) ----
    var prevItem = cat.items[state.activeDisorder-1];
    var nextItem = cat.items[state.activeDisorder+1];
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

          '<div style="background:var(--accent-bg);border:1px solid var(--accent-bd);border-radius:16px;padding:18px 20px;margin-bottom:24px;display:flex;gap:14px;">'+
            ICON.info+
            '<div><div style="font-weight:700;font-size:13.5px;color:var(--accent-tx);margin-bottom:4px;">Resumo rápido</div><p style="margin:0;font-size:14.5px;line-height:1.55;color:var(--body);">'+esc(summaryText)+'</p></div>'+
          '</div>'+

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
        '</aside>'+
      '</div>'+
    '</section>';
  }

  /* =========================================================
     TELA: EXERCÍCIOS (hub)
     ========================================================= */
  function screenExercicios(){
    var cards = EX_MODES.map(function(m){
      var iconWrap = "width:52px;height:52px;border-radius:14px;background:"+m.bg+";display:flex;align-items:center;justify-content:center;";
      var chip = "font-size:11.5px;font-weight:700;color:"+m.color+";background:"+m.bg+";border-radius:8px;padding:5px 11px;white-space:nowrap;";
      return '<button data-action="goScreen" data-arg="'+m.screen+'" data-hover="border-color:#5BC0BE;transform:translateY(-3px);box-shadow:0 12px 28px rgba(16,42,51,.09);" data-active="transform:translateY(-1px) scale(.99);" style="text-align:left;background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:24px;cursor:pointer;display:flex;flex-direction:column;gap:0;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease;">'+
        '<div style="display:flex;align-items:center;justify-content:space-between;width:100%;margin-bottom:16px;">'+
          '<div style="'+iconWrap+'">'+EX_ICON[m.key]+'</div>'+
          '<span style="'+chip+'">'+m.chipText+'</span>'+
        '</div>'+
        '<div style="font:700 18px \'Bricolage Grotesque\';color:var(--ink);">'+esc(m.title)+'</div>'+
        '<p style="margin:6px 0 0;font-size:13.5px;color:var(--muted);font-weight:500;line-height:1.45;">'+esc(m.desc)+'</p>'+
      '</button>';
    }).join('');

    return ''+
    '<section style="max-width:1000px;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      '<div style="font-size:13px;font-weight:600;color:var(--muted);margin-bottom:4px;">Exercícios</div>'+
      '<h1 style="font:800 28px \'Bricolage Grotesque\';letter-spacing:-.5px;margin:0 0 6px;">Coloque seu conhecimento à prova</h1>'+
      '<p style="margin:0 0 26px;color:var(--muted-2);font-size:15px;max-width:620px;">Quatro modos de praticar o conteúdo do DSM-5-TR.</p>'+
      '<div class="ex-grid">'+cards+'</div>'+
    '</section>';
  }

  function backToEx(label){
    return '<button data-action="goExercicios" data-hover="color:var(--teal-text);" style="background:none;border:none;color:var(--muted);font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;padding:0;margin-bottom:20px;">'+ICON.back+(label||'Exercícios')+'</button>';
  }

  /* =========================================================
     TELA: FLASHCARDS
     ========================================================= */
  function screenFlashcards(){
    var fc = FLASHCARDS[state.fcIndex];
    var pct = Math.round((state.fcIndex+1)/FLASHCARDS.length*100);
    var bar = '<div style="width:'+pct+'%;height:100%;background:linear-gradient(90deg,#FF7A45,#FFA06B);border-radius:99px;transition:width .5s cubic-bezier(.2,.7,.3,1);"></div>';

    var face;
    if(state.fcFlipped){
      face = '<div style="position:absolute;inset:0;background:var(--accent-bg);border:1.5px solid #9DD9D2;border-radius:24px;"></div>'+
        '<span style="position:absolute;top:18px;left:20px;font-size:10.5px;font-weight:800;letter-spacing:.8px;color:#5BC0BE;z-index:1;">RESPOSTA</span>'+
        '<div style="position:relative;z-index:1;font:600 19px \'Bricolage Grotesque\';text-align:center;line-height:1.5;color:var(--teal-text);text-wrap:balance;animation:popIn .32s cubic-bezier(.2,.7,.3,1) both;">'+esc(fc.back)+'</div>';
    } else {
      face = '<div style="position:absolute;inset:0;background:var(--surface);border:1.5px solid var(--border);border-radius:24px;"></div>'+
        '<span style="position:absolute;top:18px;left:20px;font-size:10.5px;font-weight:800;letter-spacing:.8px;color:var(--muted);z-index:1;">TERMO</span>'+
        '<div style="position:relative;z-index:1;font:700 24px \'Bricolage Grotesque\';text-align:center;line-height:1.3;color:var(--ink);text-wrap:balance;animation:popIn .32s cubic-bezier(.2,.7,.3,1) both;">'+esc(fc.front)+'</div>';
    }

    return ''+
    '<section style="max-width:640px;margin:0 auto;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      backToEx()+
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'+
        '<h1 style="font:800 22px \'Bricolage Grotesque\';margin:0;">Flashcards</h1>'+
        '<span style="font-weight:700;font-size:14px;color:var(--muted);">'+(state.fcIndex+1)+' / '+FLASHCARDS.length+'</span>'+
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
    var qz = QUIZ[state.quizIndex];
    var pct = Math.round((state.quizIndex+1)/QUIZ.length*100);
    var bar = '<div style="width:'+pct+'%;height:100%;background:linear-gradient(90deg,#0E4D64,#5BC0BE);border-radius:99px;transition:width .5s cubic-bezier(.2,.7,.3,1);"></div>';
    var opts = qz.opts.map(function(o,i){ return mcOption(o, i, state.quizAnswered, state.quizSelected, qz.correct, 'quizSelect'); }).join('');

    var feedback = '';
    var nextBtn = '';
    if(state.quizAnswered){
      var correct = state.quizSelected===qz.correct;
      feedback = '<div style="margin-top:18px;padding:14px 16px;border-radius:13px;background:'+(correct?'#E6F6EE':'#FDECEC')+';color:'+(correct?'#06694A':'#B4282C')+';animation:fadeUp .3s ease both;">'+
        '<div style="font-weight:700;font-size:14px;margin-bottom:3px;">'+(correct?'Correto!':'Quase lá')+'</div>'+
        '<p style="margin:0;font-size:13.5px;line-height:1.5;opacity:.9;">Conteúdo ilustrativo — aqui entra a explicação da resposta correta com a referência ao critério do DSM.</p>'+
      '</div>';
      var nextLabel = state.quizIndex<QUIZ.length-1 ? 'Próxima questão' : 'Recomeçar';
      nextBtn = '<button data-action="quizNext" data-hover="background:#13647F;" style="display:inline-flex;align-items:center;gap:8px;background:#0E4D64;border:none;border-radius:12px;padding:12px 20px;font-weight:700;font-size:14px;color:#fff;cursor:pointer;animation:fadeUp .3s ease both;">'+nextLabel+ICON.arrowR+'</button>';
    }

    return ''+
    '<section style="max-width:680px;margin:0 auto;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      backToEx()+
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'+
        '<h1 style="font:800 22px \'Bricolage Grotesque\';margin:0;">Questionário</h1>'+
        '<span style="font-weight:700;font-size:14px;color:var(--muted);">Questão '+(state.quizIndex+1)+' / '+QUIZ.length+'</span>'+
      '</div>'+
      '<div style="height:6px;background:var(--track);border-radius:99px;overflow:hidden;margin-bottom:24px;">'+bar+'</div>'+
      '<div style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:28px;">'+
        '<div style="font:700 20px \'Bricolage Grotesque\';line-height:1.35;margin-bottom:22px;text-wrap:pretty;">'+esc(qz.q)+'</div>'+
        '<div style="display:flex;flex-direction:column;gap:11px;">'+opts+'</div>'+
        feedback+
      '</div>'+
      '<div style="display:flex;justify-content:flex-end;margin-top:20px;">'+nextBtn+'</div>'+
    '</section>';
  }

  /* =========================================================
     TELA: LIGAR transtorno → categoria
     ========================================================= */
  function screenLigar(){
    var s = state;
    var left = ML.map(function(l,i){
      var matchedRight = s.matches[i];
      var isSel = s.matchLeftSel===i;
      var done = matchedRight!==undefined;
      var correct = done && MR[matchedRight]===l.cat;
      var bg='var(--surface)', border='var(--border)';
      if(isSel){ border='var(--teal-text)'; bg='var(--accent-bg)'; }
      if(done){ bg = correct?'#E6F6EE':'#FDECEC'; border = correct?'#06D6A0':'#E5484D'; }
      var style = "display:flex;align-items:center;gap:10px;width:100%;padding:14px 16px;border-radius:14px;cursor:pointer;text-align:left;background:"+bg+";border:1.5px solid "+border+";transition:all .15s;";
      var badge='';
      if(done){
        badge = '<span style="width:24px;height:24px;border-radius:7px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;color:#fff;background:'+(correct?'#06915A':'#E5484D')+';">'+(correct?'✓':'✕')+'</span>';
      }
      return '<button data-action="matchLeft" data-arg="'+i+'" style="'+style+'">'+
        '<span style="flex:1;text-align:left;font-size:14px;font-weight:600;line-height:1.3;">'+esc(l.n)+'</span>'+badge+
      '</button>';
    }).join('');

    var usedRights = {};
    Object.keys(s.matches).forEach(function(k){ usedRights[s.matches[k]]=true; });
    var right = MR.map(function(catIdx,j){
      var c = CATS[catIdx];
      var used = !!usedRights[j];
      var style = "display:flex;align-items:center;gap:10px;width:100%;padding:14px 16px;border-radius:14px;cursor:pointer;text-align:left;background:"+(used?'var(--bg)':'var(--surface)')+";border:1.5px solid var(--border);"+(used?'opacity:.55;':'')+"transition:all .15s;";
      var dot = "width:12px;height:12px;border-radius:50%;flex-shrink:0;background:"+c.color+";";
      return '<button data-action="matchRight" data-arg="'+j+'" style="'+style+'">'+
        '<span style="'+dot+'"></span>'+
        '<span style="flex:1;text-align:left;font-size:14px;font-weight:600;line-height:1.3;">'+esc(c.name)+'</span>'+
      '</button>';
    }).join('');

    var matchedCount = Object.keys(s.matches).length;
    var allCorrect = matchedCount===ML.length && ML.every(function(l,i){ return MR[s.matches[i]]===l.cat; });
    var status, color;
    if(matchedCount===0){ status='Selecione um transtorno para começar'; color='var(--muted)'; }
    else if(matchedCount<ML.length){ status=matchedCount+' de '+ML.length+' ligados'; color='var(--muted-2)'; }
    else if(allCorrect){ status='Tudo certo! 5 de 5 corretos 🎉'; color='#06915A'; }
    else { status='Algumas ligações estão incorretas'; color='#E5484D'; }

    return ''+
    '<section style="max-width:860px;margin:0 auto;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      backToEx()+
      '<h1 style="font:800 22px \'Bricolage Grotesque\';margin:0 0 6px;">Ligar transtorno → categoria</h1>'+
      '<p style="margin:0 0 24px;color:var(--muted-2);font-size:14.5px;">Toque em um transtorno e depois na categoria correspondente.</p>'+
      '<div class="match-grid">'+
        '<div style="display:flex;flex-direction:column;gap:12px;">'+
          '<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--muted);margin-bottom:2px;">Transtornos</div>'+left+
        '</div>'+
        '<div style="display:flex;flex-direction:column;gap:12px;">'+
          '<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--muted);margin-bottom:2px;">Categorias</div>'+right+
        '</div>'+
      '</div>'+
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:26px;gap:12px;">'+
        '<span style="font-size:14px;font-weight:700;color:'+color+';">'+status+'</span>'+
        '<button data-action="matchReset" data-hover="border-color:#5BC0BE;" style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:10px 16px;font-weight:700;font-size:13.5px;color:var(--muted-2);cursor:pointer;display:flex;align-items:center;gap:8px;flex-shrink:0;">'+ICON.redoSm+'Reiniciar</button>'+
      '</div>'+
    '</section>';
  }

  /* =========================================================
     TELA: ESTUDO DE CASO
     ========================================================= */
  function screenCaso(){
    var opts = CASO.opts.map(function(o,i){ return mcOption(o, i, state.casoAnswered, state.casoSelected, CASO.correct, 'casoSelect'); }).join('');
    return ''+
    '<section style="max-width:740px;margin:0 auto;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      backToEx()+
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">'+
        '<span style="background:#E8ECFB;color:#4361EE;font-size:12px;font-weight:700;border-radius:8px;padding:5px 11px;">Estudo de caso</span>'+
        '<span style="font-size:13px;color:var(--muted);font-weight:600;">Caso 3 de 12</span>'+
      '</div>'+
      '<div style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:28px;margin-bottom:20px;">'+
        '<div style="display:flex;gap:14px;align-items:flex-start;">'+
          '<div style="width:44px;height:44px;border-radius:50%;background:#EEF4F5;display:flex;align-items:center;justify-content:center;flex-shrink:0;">'+ICON.user+'</div>'+
          '<div>'+
            '<div style="font-weight:700;font-size:15px;margin-bottom:2px;">Paciente, 27 anos</div>'+
            '<div style="font-size:13px;color:var(--muted);font-weight:600;">Encaminhada pela atenção primária</div>'+
          '</div>'+
        '</div>'+
        '<p style="margin:18px 0 0;font-size:15px;line-height:1.65;color:var(--body);text-wrap:pretty;">Conteúdo ilustrativo. Aqui entra a vinheta clínica: descrição dos sintomas, tempo de evolução, prejuízo funcional e dados relevantes da história. O estudante lê o caso e identifica a hipótese diagnóstica mais provável entre as alternativas abaixo.</p>'+
      '</div>'+
      '<div style="font-weight:700;font-size:15.5px;margin-bottom:14px;">Qual a hipótese diagnóstica mais provável?</div>'+
      '<div style="display:flex;flex-direction:column;gap:11px;">'+opts+'</div>'+
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

  function applySession(user){
    if(!user){
      state.auth.user=null; state.auth.profile=null; state.auth.checking=false;
      setState({screen:'login'});
      return;
    }
    state.auth.user=user; state.auth.checking=false;
    DB.setGuest(false); state.auth.guest=false;
    DB.getProfile().then(function(p){
      state.auth.profile=p||{};
      return loadUserData();
    }).then(function(){
      if(state.screen==='login'||state.screen==='register') state.screen='home';
      render();
    }).catch(function(){
      state.auth.profile=state.auth.profile||{};
      if(state.screen==='login'||state.screen==='register') state.screen='home';
      render();
    });
  }

  function authLogo(){
    return '<div style="display:flex;align-items:center;gap:11px;justify-content:center;margin-bottom:20px;">'+
      '<img src="logo-128.png" alt="DSM·Revisa" width="42" height="42" style="width:42px;height:42px;border-radius:12px;object-fit:cover;display:block;background:#fff;border:1px solid var(--border);">'+
      '<div style="font:800 20px \'Bricolage Grotesque\';color:var(--teal-text);letter-spacing:-.3px;">DSM<span style="color:#5BC0BE;">·</span>Revisa</div>'+
    '</div>';
  }
  function authFeedback(){
    var a=state.auth;
    if(a.error) return '<div style="margin-bottom:16px;padding:11px 14px;border-radius:12px;background:#FDECEC;color:#B4282C;font-size:13px;font-weight:600;animation:fadeUp .25s ease both;">'+esc(a.error)+'</div>';
    if(a.info)  return '<div style="margin-bottom:16px;padding:11px 14px;border-radius:12px;background:#E6F6EE;color:#06694A;font-size:13px;font-weight:600;animation:fadeUp .25s ease both;">'+esc(a.info)+'</div>';
    return '';
  }
  function authInput(id,type,placeholder,label){
    return '<label style="display:block;margin-bottom:14px;">'+
      '<span style="display:block;font-size:12.5px;font-weight:700;color:var(--muted-2);margin-bottom:6px;">'+esc(label)+'</span>'+
      '<input id="'+id+'" class="auth-input" type="'+type+'" placeholder="'+esc(placeholder)+'" style="width:100%;padding:12px 14px;border:1px solid var(--border);border-radius:12px;background:var(--surface);color:var(--ink);font:500 14.5px \'Hanken Grotesk\';outline:none;" />'+
    '</label>';
  }
  function authSubmit(action,label,busy){
    return '<button data-action="'+action+'" '+(busy?'':'data-hover="background:#13647F;" data-active="transform:scale(.98);" ')+'style="width:100%;margin-top:6px;background:'+(busy?'#3A6B7C':'#0E4D64')+';border:none;border-radius:12px;padding:13px;font:700 14.5px \'Hanken Grotesk\';color:#fff;cursor:'+(busy?'default':'pointer')+';transition:all .18s ease;">'+esc(label)+'</button>';
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
          authSubmit('submitLogin', a.busy?'Entrando…':'Entrar', a.busy)+
          '<p style="margin:16px 0 0;font-size:13px;color:var(--muted);text-align:center;">Não tem conta? '+
            '<button data-action="goRegister" style="background:none;border:none;color:var(--teal-text);font-weight:700;font-size:13px;cursor:pointer;padding:0;">Criar conta</button></p>'+
          '<div style="display:flex;align-items:center;gap:10px;margin:18px 0 14px;"><div style="flex:1;height:1px;background:var(--border);"></div><span style="font-size:11px;color:var(--muted);font-weight:700;letter-spacing:.5px;">OU</span><div style="flex:1;height:1px;background:var(--border);"></div></div>'+
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
          '<div style="display:flex;gap:12px;">'+
            '<div style="flex:1;">'+authInput('reg-curso','text','Psicologia','Curso (opcional)')+'</div>'+
            '<div style="flex:1;">'+authInput('reg-sem','text','6º sem','Semestre (opcional)')+'</div>'+
          '</div>'+
          authInput('reg-email','email','voce@email.com','E-mail')+
          authInput('reg-pass','password','mínimo 6 caracteres','Senha')+
          authSubmit('submitRegister', a.busy?'Criando…':'Criar conta', a.busy)+
          '<p style="margin:16px 0 0;font-size:13px;color:var(--muted);text-align:center;">Já tem conta? '+
            '<button data-action="goLogin" style="background:none;border:none;color:var(--teal-text);font-weight:700;font-size:13px;cursor:pointer;padding:0;">Entrar</button></p>'+
        '</div>'+
      '</section>'+
    '</div>';
  }

  function authScreen(){ return state.screen==='register' ? screenRegister() : screenLogin(); }
  function authLoading(){
    return '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;color:var(--muted);font:600 14px \'Hanken Grotesk\';">Carregando…</div>';
  }

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
      return '<div style="display:flex;align-items:center;gap:11px;padding:14px 6px 2px;margin-top:12px;border-top:1px solid var(--border);">'+
        '<div style="width:34px;height:34px;border-radius:50%;background:var(--surface-2);display:flex;align-items:center;justify-content:center;color:var(--muted-2);font:700 13px \'Hanken Grotesk\';flex-shrink:0;">V</div>'+
        '<div style="line-height:1.25;min-width:0;">'+
          '<div style="font-size:13.5px;font-weight:700;">Visitante</div>'+
          '<button data-action="guestToRegister" data-hover="color:var(--teal-text);" style="background:none;border:none;padding:0;font-size:11px;color:var(--muted);font-weight:700;cursor:pointer;">Criar conta &rsaquo;</button>'+
        '</div>'+
      '</div>';
    }
    var p = (DB.ready && state.auth.profile) ? state.auth.profile : null;
    var nome = (p && p.nome) ? p.nome : 'Ana Souza';
    var sub  = (p && (p.curso||p.semestre)) ? [p.curso,p.semestre].filter(Boolean).join(' · ') : 'Psicologia · 6º sem';
    var initials = nome.split(/\s+/).slice(0,2).map(function(w){return w.charAt(0).toUpperCase();}).join('');
    var logout = (DB.ready && state.auth.user)
      ? '<button data-action="logout" data-hover="color:#E5484D;" title="Sair da conta" style="margin-left:auto;background:none;border:none;color:var(--muted);cursor:pointer;font-size:12px;font-weight:700;padding:4px 2px;">Sair</button>'
      : '';
    return '<div style="display:flex;align-items:center;gap:11px;padding:14px 6px 2px;margin-top:12px;border-top:1px solid var(--border);">'+
      '<div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#5BC0BE,#0E4D64);display:flex;align-items:center;justify-content:center;color:#fff;font:700 13px \'Hanken Grotesk\';flex-shrink:0;">'+esc(initials||'·')+'</div>'+
      '<div style="line-height:1.2;min-width:0;">'+
        '<div style="font-size:13.5px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+esc(nome)+'</div>'+
        '<div style="font-size:11px;color:var(--muted);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+esc(sub)+'</div>'+
      '</div>'+ logout +
    '</div>';
  }

  /* =========================================================
     TELA: REFERÊNCIAS (índice completo de transtornos)
     ========================================================= */
  function screenIndice(){
    var total = CATS.reduce(function(s,c){ return s + c.items.length; }, 0);
    var blocks = CATS.map(function(c, ci){
      var items = c.items.map(function(d, di){
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
          '<span class="ref-cat-count">'+c.items.length+'</span>'+
        '</div>'+
        '<div class="ref-list">'+items+'</div>'+
      '</div>';
    }).join('');

    return ''+
    '<section style="max-width:1040px;animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      '<div style="font-size:13px;font-weight:600;color:var(--muted);margin-bottom:8px;">Revisão</div>'+
      revViewToggle('indice')+
      '<h1 style="font:800 28px \'Bricolage Grotesque\';letter-spacing:-.5px;margin:18px 0 6px;">Índice de transtornos</h1>'+
      '<p style="margin:0 0 24px;color:var(--muted-2);font-size:15px;max-width:640px;">Todos os '+total+' transtornos do DSM-5-TR, organizados pelas 20 categorias. Toque em um item para abrir a ficha.</p>'+
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
  function screenRanking(){
    return placeholderScreen('Ranking', 'Ranking', ICON.trophy, 'Em breve',
      'Acompanhe sua posição entre outros estudantes — pontos por transtornos revisados, exercícios feitos e dias de streak. Funcionalidade em desenvolvimento.');
  }
  function screenFeedback(){
    var mail = 'mailto:felipe.cb2511@gmail.com?subject='+encodeURIComponent('DSM·Revisa — Feedback');
    return placeholderScreen('Feedback', 'Feedback', ICON.message, 'Em breve',
      'Envie erros encontrados nas fichas, sugestões de melhoria e outras observações. Funcionalidade em desenvolvimento — por enquanto, escreva para <a href="'+mail+'" style="color:var(--teal-text);font-weight:700;text-decoration:none;">felipe.cb2511@gmail.com</a>.');
  }
  function screenDsm(){
    return ''+
    '<section style="animation:rise .5s cubic-bezier(.2,.7,.3,1) both;">'+
      '<div style="display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:14px;">'+
        '<div>'+
          '<div style="font-size:13px;font-weight:600;color:var(--muted);margin-bottom:4px;">DSM-5-TR</div>'+
          '<h1 style="font:800 28px \'Bricolage Grotesque\';letter-spacing:-.5px;margin:0;">Manual na íntegra</h1>'+
        '</div>'+
        '<a href="DSM-V.pdf" target="_blank" rel="noopener" data-hover="border-color:#5BC0BE;" style="text-decoration:none;background:var(--surface);border:1px solid var(--border);border-radius:11px;padding:9px 14px;font:700 13px \'Hanken Grotesk\';color:var(--teal-text);transition:border-color .18s ease;">Abrir em nova aba ↗</a>'+
      '</div>'+
      '<iframe class="dsm-frame" src="DSM-V.pdf" title="DSM-5-TR — manual completo"></iframe>'+
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
      '<h1 style="font:800 28px \'Bricolage Grotesque\';letter-spacing:-.5px;margin:0 0 8px;">DSM<span style="color:#5BC0BE;">·</span>Revisa</h1>'+
      '<p style="margin:0 0 24px;color:var(--muted-2);font-size:15px;line-height:1.6;max-width:620px;">Plataforma de estudos e revisão dos transtornos do DSM-5-TR — fichas-resumo com critérios diagnósticos, especificadores, seções narrativas e exercícios.</p>'+
      '<div style="display:flex;flex-direction:column;gap:12px;">'+
        card(ICON.book2, 'Conteúdo', 'Os '+total+' transtornos das 20 categorias da Seção II do DSM-5-TR, com critérios, subtipos, especificadores e seções, além de tabelas recortadas do manual.')+
        card(ICON.info, 'Fonte', 'Conteúdo extraído do DSM-5-TR (Manual Diagnóstico e Estatístico de Transtornos Mentais, American Psychiatric Association; ed. brasileira Artmed). Veja o manual completo na aba DSM-5-TR.')+
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
      case 'flashcards':  return screenFlashcards();
      case 'quiz':        return screenQuiz();
      case 'ligar':       return screenLigar();
      case 'caso':        return screenCaso();
      case 'indice':      return screenIndice();
      case 'ranking':     return screenRanking();
      case 'dsm':         return screenDsm();
      case 'feedback':    return screenFeedback();
      case 'sobre':       return screenSobre();
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
      if(!state.auth.user){ root.innerHTML = authScreen(); bindFx(root); return; }
    }
    var key = renderKey();
    var staticUpdate = (key === lastKey);   // re-render por interação (mesma tela)
    lastKey = key;
    root.innerHTML =
      '<div class="app-shell">'+
        sidebar()+
        '<main class="main">'+
          topbar()+
          '<div class="content'+(staticUpdate ? ' static-update' : '')+'">'+guestBanner()+currentScreen()+'</div>'+
        '</main>'+
      '</div>'+
      bottomNav();
    bindFx(root);
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
    } else if(s==='flashcards'){
      if(k===' ' || k==='Enter') return run(actions.flip);
      if(k==='ArrowRight') return run(actions.fcKnow);
      if(k==='ArrowLeft')  return run(actions.fcPrev);
      if(k==='Escape')     return run(actions.goExercicios);
    } else if(s==='quiz'){
      var q = QUIZ[state.quizIndex];
      if(q && k>='1' && k<='9'){ var qi=+k-1; if(qi<q.opts.length) return run(actions.quizSelect, qi); }
      if(k==='Enter' && state.quizAnswered) return run(actions.quizNext);
      if(k==='Escape') return run(actions.goExercicios);
    } else if(s==='caso'){
      if(k>='1' && k<='9'){ var ci=+k-1; if(ci<CASO.opts.length) return run(actions.casoSelect, ci); }
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
    document.addEventListener('click', handleClick);
    // Enter envia o formulário de auth (não há <form> para evitar reload)
    document.addEventListener('keydown', function(e){
      if(e.key==='Enter' && e.target && e.target.classList && e.target.classList.contains('auth-input')){
        e.preventDefault();
        var act = state.screen==='register' ? 'submitRegister' : 'submitLogin';
        if(actions[act]) actions[act]();
      }
    });
    document.addEventListener('keydown', handleKeyNav);

    if(DB.ready){
      DB.onAuth(applySession);
      state.auth.checking = true;
      render();
      DB.currentUser().then(function(u){
        if(u){ DB.setGuest(false); state.auth.guest=false; applySession(u); }
        else if(DB.guest){ state.auth.guest=true; state.auth.checking=false; state.screen='home'; loadUserData().then(render); }
        else { state.auth.checking=false; setState({screen:'login'}); }
      }).catch(function(){
        state.auth.checking=false;
        if(DB.guest){ state.auth.guest=true; state.screen='home'; loadUserData().then(render); }
        else setState({screen:'login'});
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
