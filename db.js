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

  var sb = ready ? window.supabase.createClient(cfg.url, cfg.anonKey) : null;

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
    logEvent: function (tipo, acerto, payload) {
      if (this.guest) {
        var ev = lsGet(LS_EV, []);
        ev.push({ tipo: tipo, acerto: (acerto === undefined ? null : acerto), payload: payload || null, criado_em: new Date().toISOString() });
        lsSet(LS_EV, ev);
        return Promise.resolve();
      }
      return uid().then(function (id) {
        if (!id) return null;
        return sb.from('events').insert({
          user_id: id,
          tipo: tipo,
          acerto: (acerto === undefined ? null : acerto),
          payload: payload || null
        });
      });
    },
    getStats: function () {
      if (this.guest) {
        var p = lsGet(LS_PROG, {}), ev = lsGet(LS_EV, []);
        var ca = ev.filter(function (e) { return e.acerto !== null; });
        var ac = ca.filter(function (e) { return e.acerto; }).length;
        var datas = ev.map(function (e) { return e.criado_em; })
          .concat(Object.keys(p).map(function (k) { return p[k].revisado_em; }));
        var gmset = {}; ev.forEach(function (e) { if (e.payload) gmset[e.payload] = 1; });
        return Promise.resolve({
          revisados: Object.keys(p).length,
          exercicios: ev.length,
          acertos: ev.filter(function (e) { return e.acerto === true; }).length,
          ativos: activeDaysFrom(datas),
          taxa: ca.length ? Math.round(ac / ca.length * 100) : 0,
          streak: streakFrom(datas),
          byType: ev.reduce(function (o, e) { o[e.tipo] = (o[e.tipo] || 0) + 1; return o; }, {}),
          mastered: Object.keys(gmset)
        });
      }
      if (!sb) return Promise.resolve({ revisados: 0, exercicios: 0, acertos: 0, ativos: 0, taxa: 0, streak: 0, byType: {}, mastered: [] });
      return Promise.all([
        sb.from('progress').select('revisado_em'),
        sb.from('events').select('acerto,criado_em,tipo,payload')
      ]).then(function (res) {
        var prog = res[0].data || [];
        var ev = res[1].data || [];
        var comAcerto = ev.filter(function (e) { return e.acerto !== null; });
        var acertos = comAcerto.filter(function (e) { return e.acerto; }).length;
        var datas = ev.map(function (e) { return e.criado_em; })
          .concat(prog.map(function (r) { return r.revisado_em; }));
        var mset = {}; ev.forEach(function (e) { if (e.payload) mset[e.payload] = 1; });
        return {
          revisados: prog.length,
          exercicios: ev.length,
          acertos: acertos,
          ativos: activeDaysFrom(datas),
          taxa: comAcerto.length ? Math.round(acertos / comAcerto.length * 100) : 0,
          streak: streakFrom(datas),
          byType: ev.reduce(function (o, e) { o[e.tipo] = (o[e.tipo] || 0) + 1; return o; }, {}),
          mastered: Object.keys(mset)
        };
      });
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
