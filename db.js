/* ============================================================
   db.js — camada de dados (Psico · Pato)
   Encapsula o cliente Supabase. Expõe window.DB com métodos de
   autenticação e acesso aos dados. Se as chaves não estiverem
   configuradas (ou o SDK não carregar), DB.ready = false e o app
   roda em modo demonstração.
   ============================================================ */
(function () {
  'use strict';

  var cfg = (typeof window !== 'undefined' && window.SUPABASE_CONFIG) || {};
  function isPlaceholder(v){ return !v || /^COLE_/.test(v); }
  var hasKeys = !!(cfg.url && /^https?:\/\//.test(cfg.url) && !isPlaceholder(cfg.url) &&
                   cfg.anonKey && cfg.anonKey.length > 20 && !isPlaceholder(cfg.anonKey));
  var libOk = !!(typeof window !== 'undefined' && window.supabase &&
                 window.supabase.createClient);
  var ready = hasKeys && libOk;

  if (hasKeys && !libOk) {
    console.warn('[DB] SDK do Supabase não carregou (sem internet?). Modo demonstração.');
  }

  // Login automático: a sessão é guardada no localStorage e o token é renovado
  // sozinho, então o usuário continua logado entre reloads/sessões.
  var sb = ready ? window.supabase.createClient(cfg.url, cfg.anonKey, {
    auth: {
      persistSession: true,       // mantém a sessão no localStorage
      autoRefreshToken: true,     // renova o token antes de expirar
      detectSessionInUrl: true,   // processa o retorno do OAuth/recuperação de senha
      // storageKey: mantém o padrão do Supabase (já namespaced pelo ref do projeto),
      // para não deslogar quem já tem sessão ativa.
    }
  }) : null;

  /* ---- modo visitante (persistência em localStorage) ---- */
  var LS_PROG = 'dsm-guest-progress', LS_EV = 'dsm-guest-events', LS_GUEST = 'dsm-guest-mode';
  function lsGet(k, def){ try { return JSON.parse(localStorage.getItem(k)) || def; } catch(e){ return def; } }
  function lsSet(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
  function guestOn(){ try { return localStorage.getItem(LS_GUEST) === '1'; } catch(e){ return false; } }

  // streak = dias consecutivos com atividade, terminando hoje (ou ontem)
  function streakFrom(isoDates){
    var days = {};
    isoDates.forEach(function (d) { if (d) days[String(d).slice(0, 10)] = true; });
    if (!Object.keys(days).length) return 0;
    function key(dt){ return dt.toISOString().slice(0, 10); }
    var cur = new Date();
    if (!days[key(cur)]) { cur.setDate(cur.getDate() - 1); if (!days[key(cur)]) return 0; }
    var streak = 0;
    while (days[key(cur)]) { streak++; cur.setDate(cur.getDate() - 1); }
    return streak;
  }

  // total de dias distintos com qualquer atividade (base do XP de "dias ativos")
  function activeDaysFrom(isoDates){
    var days = {};
    isoDates.forEach(function (d) { if (d) days[String(d).slice(0, 10)] = true; });
    return Object.keys(days).length;
  }

  // Série temporal de atividade por dia para as últimas `nDias` (incluindo hoje).
  // Recebe uma lista de datas ISO (de events.criado_em + progress.revisado_em),
  // conta quantas caem em cada dia e devolve [{dia:'YYYY-MM-DD', total:N}] em
  // ordem cronológica crescente — dias sem atividade vêm com total 0.
  function activityByDayFrom(isoDates, nDias){
    nDias = nDias || 70;
    var counts = {};
    isoDates.forEach(function (d) {
      if (!d) return;
      var key = String(d).slice(0, 10);
      counts[key] = (counts[key] || 0) + 1;
    });
    var out = [];
    var cur = new Date();
    cur.setHours(0, 0, 0, 0);
    for (var i = nDias - 1; i >= 0; i--) {
      var dt = new Date(cur.getTime() - i * 86400000);
      var k = dt.toISOString().slice(0, 10);
      out.push({ dia: k, total: counts[k] || 0 });
    }
    return out;
  }

  // Agrega a tabela `events` (que agora também guarda erros, acerto=false).
  //  - dominados/byType/mastered: SÓ acerto===true (1ª vez de cada item),
  //    preservando o significado de "exercícios/cartões dominados". Como a
  //    trava anti-farm grava cada acerto uma única vez, contar os eventos
  //    com acerto===true equivale a contar os itens dominados.
  //  - taxa real e taxaPorModo: sobre TODAS as tentativas (acerto !== null),
  //    incluindo os erros recém-gravados.
  // O XP é derivado de `dominados`/`acertos` (só acertos), então os erros
  // gravados NÃO inflam XP nem ranking.
  function statsFromEvents(ev) {
    var attempts = ev.filter(function (e) { return e.acerto !== null && e.acerto !== undefined; });
    // Itens DOMINADOS = payloads distintos com pelo menos um acerto.
    // Deduplica por payload (item) para que repetir um acerto já dominado
    // não infle dominados/acertos/byType/XP.
    var mset = {};      // payload -> tipo do 1º acerto SEM dica
    ev.forEach(function (e) {
      // domínio/XP: só acertos SEM dica contam. Acertos com dica entram na taxa
      // (abaixo, em attempts), mas não dominam o item nem dão XP global.
      if (e.acerto === true && !e.com_dica && e.payload && !mset.hasOwnProperty(e.payload)) {
        mset[e.payload] = e.tipo;
      }
    });
    var mastered = Object.keys(mset);
    var byType = mastered.reduce(function (o, k) {
      var t = mset[k]; o[t] = (o[t] || 0) + 1; return o;
    }, {});
    var dominados = mastered.length;
    // taxa por modo (quiz/caso/flashcard/ligar): acertos/tentativas por tipo,
    // sobre TODAS as tentativas (inclui erros e repetições).
    var agg = {};
    attempts.forEach(function (e) {
      var a = agg[e.tipo] || (agg[e.tipo] = { ok: 0, n: 0 });
      a.n++; if (e.acerto === true) a.ok++;
    });
    var taxaPorModo = {};
    var totalOk = 0;
    Object.keys(agg).forEach(function (t) {
      taxaPorModo[t] = agg[t].n ? Math.round(agg[t].ok / agg[t].n * 100) : 0;
      totalOk += agg[t].ok;
    });
    return {
      dominados: dominados,
      acertos: dominados,
      taxa: attempts.length ? Math.round(totalOk / attempts.length * 100) : 0,
      taxaPorModo: taxaPorModo,
      byType: byType,
      mastered: mastered
    };
  }

  // Pesos de XP — DEVEM espelhar gamification.sql (função leaderboard).
  var XP = { ficha: 25, exercicio: 10, acerto: 5, diaAtivo: 15 };
  function xpFromCounts(c){
    return (c.revisados || 0) * XP.ficha +
           (c.exercicios || 0) * XP.exercicio +
           (c.acertos || 0) * XP.acerto +
           (c.ativos || 0) * XP.diaAtivo;
  }

  function uid() {
    if (!sb) return Promise.resolve(null);
    return sb.auth.getUser().then(function (r) {
      return r.data && r.data.user ? r.data.user.id : null;
    });
  }

  var DB = {
    ready: ready,
    client: sb,
    guest: guestOn(),
    setGuest: function (on) {
      this.guest = !!on;
      try { on ? localStorage.setItem(LS_GUEST, '1') : localStorage.removeItem(LS_GUEST); } catch (e) {}
    },

    /* ---- auth ---- */
    onAuth: function (cb) {
      if (!sb) return;
      sb.auth.onAuthStateChange(function (event, session) {
        cb(session ? session.user : null, event);
      });
    },
    currentUser: function () {
      if (!sb) return Promise.resolve(null);
      return sb.auth.getUser().then(function (r) {
        return (r.data && r.data.user) || null;
      });
    },
    // login automático: lê a sessão do localStorage (sem rede) e a renova se
    // preciso; devolve o usuário na hora, ou null se não houver sessão salva.
    currentSession: function () {
      if (!sb) return Promise.resolve(null);
      return sb.auth.getSession().then(function (r) {
        return (r.data && r.data.session && r.data.session.user) || null;
      }).catch(function () { return null; });
    },
    register: function (email, password, profile) {
      return sb.auth.signUp({
        email: email,
        password: password,
        options: { data: profile || {} }
      });
    },
    login: function (email, password) {
      return sb.auth.signInWithPassword({ email: email, password: password });
    },
    // OAuth com Google. Redireciona o navegador para o Google e volta para
    // a própria página; ao voltar, onAuthStateChange dispara applySession.
    // Requer: provider Google habilitado no Supabase + esta URL na lista de
    // "Redirect URLs" do projeto.
    loginGoogle: function () {
      var back = (typeof window !== 'undefined')
        ? window.location.href.split('#')[0].split('?')[0]
        : undefined;
      return sb.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: back }
      });
    },
    logout: function () {
      return sb.auth.signOut();
    },
    // envia o e-mail de recuperação; o link volta para a própria página com
    // um token de recuperação (dispara o evento PASSWORD_RECOVERY no onAuth).
    resetPassword: function (email) {
      var back = (typeof window !== 'undefined')
        ? window.location.href.split('#')[0].split('?')[0]
        : undefined;
      return sb.auth.resetPasswordForEmail(email, { redirectTo: back });
    },
    // define a nova senha (válido enquanto a sessão de recuperação está ativa).
    updatePassword: function (password) {
      return sb.auth.updateUser({ password: password });
    },

    /* ---- perfil ---- */
    getProfile: function () {
      return uid().then(function (id) {
        if (!id) return null;
        return sb.from('profiles').select('*').eq('id', id).single()
          .then(function (r) { return r.data; });
      });
    },
    // salva campos do perfil (apelido, avatar, nome, curso, semestre).
    updateProfile: function (fields) {
      return uid().then(function (id) {
        if (!id) return { error: 'sem usuário' };
        var row = Object.assign({ id: id }, fields || {});
        return sb.from('profiles').upsert(row, { onConflict: 'id' })
          .select().single()
          .then(function (r) { return r.error ? { error: r.error } : { data: r.data }; });
      });
    },
    // envia a imagem para o Storage ("avatars/<uid>/avatar.ext") e devolve a URL pública.
    uploadAvatar: function (file) {
      return uid().then(function (id) {
        if (!id) return { error: 'sem usuário' };
        var ext = ((file && file.name && file.name.split('.').pop()) || 'png').toLowerCase().replace(/[^a-z0-9]/g, '');
        var path = id + '/avatar.' + (ext || 'png');
        return sb.storage.from('avatars').upload(path, file, { upsert: true, cacheControl: '3600', contentType: file.type || undefined })
          .then(function (res) {
            if (res.error) return { error: res.error };
            var pub = sb.storage.from('avatars').getPublicUrl(path);
            var url = pub && pub.data && pub.data.publicUrl;
            return { url: url + '?t=' + Date.now() };   // cache-bust (mesma URL, nova imagem)
          });
      });
    },

    /* ---- progresso ---- */
    markRevised: function (transtornoId) {
      if (this.guest) {
        var p = lsGet(LS_PROG, {});
        p[transtornoId] = { status: 'revisado', revisado_em: new Date().toISOString() };
        lsSet(LS_PROG, p);
        return Promise.resolve();
      }
      return uid().then(function (id) {
        if (!id) return null;
        return sb.from('progress').upsert({
          user_id: id,
          transtorno_id: transtornoId,
          status: 'revisado',
          revisado_em: new Date().toISOString()
        }, { onConflict: 'user_id,transtorno_id' });
      });
    },
    unmarkRevised: function (transtornoId) {
      if (this.guest) {
        var p = lsGet(LS_PROG, {});
        delete p[transtornoId];
        lsSet(LS_PROG, p);
        return Promise.resolve();
      }
      return uid().then(function (id) {
        if (!id) return null;
        return sb.from('progress').delete()
          .eq('user_id', id).eq('transtorno_id', transtornoId);
      });
    },
    getProgress: function () {
      if (this.guest) {
        var p = lsGet(LS_PROG, {});
        return Promise.resolve(Object.keys(p).map(function (k) {
          return { transtorno_id: k, status: p[k].status, revisado_em: p[k].revisado_em };
        }));
      }
      if (!sb) return Promise.resolve([]);
      return sb.from('progress').select('transtorno_id,status,revisado_em')
        .then(function (r) { return r.data || []; });
    },

    /* ---- métricas ---- */
    logEvent: function (tipo, acerto, payload, comDica) {
      if (this.guest) {
        var ev = lsGet(LS_EV, []);
        ev.push({ tipo: tipo, acerto: (acerto === undefined ? null : acerto), payload: payload || null, com_dica: !!comDica, criado_em: new Date().toISOString() });
        lsSet(LS_EV, ev);
        return Promise.resolve();
      }
      return uid().then(function (id) {
        if (!id) return null;
        var row = {
          user_id: id,
          tipo: tipo,
          acerto: (acerto === undefined ? null : acerto),
          payload: payload || null
        };
        // só envia com_dica quando true; assim inserts normais não dependem da
        // coluna existir (compatível antes de aplicar a migração do schema).
        if (comDica) row.com_dica = true;
        return sb.from('events').insert(row);
      });
    },
    getStats: function () {
      if (this.guest) {
        var p = lsGet(LS_PROG, {}), ev = lsGet(LS_EV, []);
        var datas = ev.map(function (e) { return e.criado_em; })
          .concat(Object.keys(p).map(function (k) { return p[k].revisado_em; }));
        var gstats = statsFromEvents(ev);
        return Promise.resolve({
          revisados: Object.keys(p).length,
          exercicios: gstats.dominados,
          acertos: gstats.acertos,
          ativos: activeDaysFrom(datas),
          taxa: gstats.taxa,
          taxaPorModo: gstats.taxaPorModo,
          streak: streakFrom(datas),
          byType: gstats.byType,
          mastered: gstats.mastered
        });
      }
      if (!sb) return Promise.resolve({ revisados: 0, exercicios: 0, acertos: 0, ativos: 0, taxa: 0, taxaPorModo: {}, streak: 0, byType: {}, mastered: [] });
      return Promise.all([
        sb.from('progress').select('revisado_em'),
        sb.from('events').select('*')
      ]).then(function (res) {
        var prog = res[0].data || [];
        var ev = res[1].data || [];
        var datas = ev.map(function (e) { return e.criado_em; })
          .concat(prog.map(function (r) { return r.revisado_em; }));
        var gstats = statsFromEvents(ev);
        return {
          revisados: prog.length,
          exercicios: gstats.dominados,
          acertos: gstats.acertos,
          ativos: activeDaysFrom(datas),
          taxa: gstats.taxa,
          taxaPorModo: gstats.taxaPorModo,
          streak: streakFrom(datas),
          byType: gstats.byType,
          mastered: gstats.mastered
        };
      });
    },

    // série de atividade por dia (últimas ~10 semanas) para o gráfico de
    // evolução temporal do perfil. Junta events.criado_em + progress.revisado_em.
    // Devolve [{dia:'YYYY-MM-DD', total:N}] em ordem cronológica.
    getActivityByDay: function (nDias) {
      nDias = nDias || 70;
      if (this.guest) {
        var p = lsGet(LS_PROG, {}), ev = lsGet(LS_EV, []);
        var datas = ev.map(function (e) { return e.criado_em; })
          .concat(Object.keys(p).map(function (k) { return p[k].revisado_em; }));
        return Promise.resolve(activityByDayFrom(datas, nDias));
      }
      if (!sb) return Promise.resolve(activityByDayFrom([], nDias));
      var sinceIso = new Date(Date.now() - nDias * 86400000).toISOString();
      return Promise.all([
        sb.from('events').select('criado_em').gte('criado_em', sinceIso),
        sb.from('progress').select('revisado_em').gte('revisado_em', sinceIso)
      ]).then(function (res) {
        var ev = (res[0] && res[0].data) || [];
        var prog = (res[1] && res[1].data) || [];
        var datas = ev.map(function (e) { return e.criado_em; })
          .concat(prog.map(function (r) { return r.revisado_em; }));
        return activityByDayFrom(datas, nDias);
      }).catch(function () { return activityByDayFrom([], nDias); });
    },

    /* ---- gamificação ---- */
    // pesos de XP e helper de cálculo (espelham gamification.sql)
    XP: XP,
    xpFromCounts: xpFromCounts,

    // ranking entre usuários — só faz sentido logado (precisa da RPC do banco).
    // period: 'day' | 'week' | 'month' | 'year' | 'all'
    getLeaderboard: function (period, lim) {
      if (!sb || this.guest) return Promise.resolve(null);
      return sb.rpc('leaderboard', { period: period || 'all', lim: lim || 100 })
        .then(function (r) { return r.error ? null : (r.data || []); })
        .catch(function () { return null; });
    },

    /* ---- amigos (follow) + perfis de outros ---- */
    // Tudo exige login (RPCs SECURITY DEFINER). Visitante/sem Supabase → null.
    // procura um usuário pelo código de identificação.
    findByCode: function (code) {
      if (!sb || this.guest) return Promise.resolve(null);
      return sb.rpc('find_by_code', { p_code: String(code || '') })
        .then(function (r) { return r.error ? null : ((r.data && r.data[0]) || null); })
        .catch(function () { return null; });
    },
    // segue um usuário; devolve a nova relação ('following'|'mutual'|...).
    followAdd: function (targetId) {
      if (!sb || this.guest) return Promise.resolve(null);
      return sb.rpc('follow_add', { p_target: targetId })
        .then(function (r) { return r.error ? null : r.data; })
        .catch(function () { return null; });
    },
    // deixa de seguir; devolve a nova relação.
    followRemove: function (targetId) {
      if (!sb || this.guest) return Promise.resolve(null);
      return sb.rpc('follow_remove', { p_target: targetId })
        .then(function (r) { return r.error ? null : r.data; })
        .catch(function () { return null; });
    },
    // lista 'following' (padrão) ou 'followers'.
    followList: function (kind) {
      if (!sb || this.guest) return Promise.resolve(null);
      return sb.rpc('follow_list', { p_kind: kind || 'following' })
        .then(function (r) { return r.error ? null : (r.data || []); })
        .catch(function () { return null; });
    },
    // cartão de perfil de um usuário (respeita privacidade). null = falhou.
    profileCard: function (targetId) {
      if (!sb || this.guest) return Promise.resolve(null);
      return sb.rpc('profile_card', { p_target: targetId })
        .then(function (r) { return r.error ? null : ((r.data && r.data[0]) || null); })
        .catch(function () { return null; });
    },

    /* ---- notificações push (Web Push) ---- */
    // chave pública VAPID (não é segredo) — vem do supabase-config.js.
    pushPublicKey: (cfg && cfg.vapidPublicKey) || '',
    // salva/atualiza a inscrição deste dispositivo.
    savePushSubscription: function (sub, ua) {
      if (!sb || this.guest) return Promise.resolve({ error: 'no db' });
      return uid().then(function (id) {
        if (!id) return { error: 'no user' };
        var j = sub.toJSON ? sub.toJSON() : sub;
        var keys = j.keys || {};
        return sb.from('push_subscriptions').upsert({
          user_id: id, endpoint: j.endpoint || sub.endpoint,
          p256dh: keys.p256dh, auth: keys.auth,
          user_agent: ua || ''
        }, { onConflict: 'endpoint' });
      });
    },
    // remove a inscrição (ao desativar).
    removePushSubscription: function (endpoint) {
      if (!sb) return Promise.resolve();
      return sb.from('push_subscriptions').delete().eq('endpoint', endpoint).catch(function () {});
    },
    // dispara o envio do push de "novo seguidor" para o alvo (Edge Function).
    // OBS.: o slug real da função no Supabase é "swift-action" (o painel gerou
    // esse slug aleatório na criação e ele não pode ser renomeado depois). O
    // nome de exibição é "notify-follow"; o código é o de
    // supabase/functions/notify-follow/index.ts.
    notifyFollow: function (target) {
      if (!sb || this.guest || !target) return Promise.resolve();
      return sb.functions.invoke('swift-action', { body: { target: target } }).catch(function () {});
    },

    // ADMIN (modo dev): lista todos os feedbacks. null = sem permissão/erro.
    // Requer estar logado como o e-mail admin (feedback.sql → is_admin/feedback_list).
    getFeedbackList: function (lim) {
      if (!sb || this.guest) return Promise.resolve(null);
      return sb.rpc('feedback_list', { lim: lim || 300 })
        .then(function (r) { return r.error ? null : (r.data || []); })
        .catch(function () { return null; });
    },
    // ADMIN: apaga um feedback. Devolve true/false.
    deleteFeedback: function (id) {
      if (!sb || this.guest) return Promise.resolve(false);
      return sb.rpc('feedback_delete', { p_id: id })
        .then(function (r) { return !r.error; })
        .catch(function () { return false; });
    },

    // estatísticas dos estudos de caso (modo dev): % de acerto por caso entre
    // TODOS os usuários (1ª tentativa de cada um). Requer caso_stats.sql aplicado.
    // null = sem Supabase ou RPC não aplicada; [] = aplicada mas sem dados.
    getCasoStats: function () {
      if (!sb) return Promise.resolve(null);
      return sb.rpc('caso_stats')
        .then(function (r) { return r.error ? null : (r.data || []); })
        .catch(function () { return null; });
    },

    /* ---- feedback ---- */
    // Envia um feedback. Logado -> user_id próprio; visitante -> user_id nulo
    // (anônimo). Requer o feedback.sql aplicado no Supabase.
    sendFeedback: function (fb) {
      if (!sb) return Promise.resolve({ error: 'offline' });
      return uid().then(function (id) {
        return sb.from('feedback').insert({
          user_id: id,
          tipo: (fb && fb.tipo) || 'erro',
          transtorno_id: (fb && fb.transtorno_id) || null,
          mensagem: (fb && fb.mensagem) || '',
          contexto: (fb && fb.contexto) || null
        });
      });
    }
  };

  window.DB = DB;
})();
