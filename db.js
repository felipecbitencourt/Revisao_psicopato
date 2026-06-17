/* ============================================================
   db.js — camada de dados (DSM · Revisa)
   Encapsula o cliente Supabase. Expõe window.DB com métodos de
   autenticação e acesso aos dados. Se as chaves não estiverem
   configuradas (ou o SDK não carregar), DB.ready = false e o app
   roda em modo demonstração.
   ============================================================ */
(function () {
  'use strict';

  var cfg = (typeof window !== 'undefined' && window.SUPABASE_CONFIG) || {};
  var hasKeys = !!(cfg.url && /^https?:\/\//.test(cfg.url) &&
                   cfg.anonKey && cfg.anonKey.length > 20);
  var libOk = !!(typeof window !== 'undefined' && window.supabase &&
                 window.supabase.createClient);
  var ready = hasKeys && libOk;

  if (hasKeys && !libOk) {
    console.warn('[DB] SDK do Supabase não carregou (sem internet?). Modo demonstração.');
  }

  var sb = ready ? window.supabase.createClient(cfg.url, cfg.anonKey) : null;

  function uid() {
    if (!sb) return Promise.resolve(null);
    return sb.auth.getUser().then(function (r) {
      return r.data && r.data.user ? r.data.user.id : null;
    });
  }

  var DB = {
    ready: ready,
    client: sb,

    /* ---- auth ---- */
    onAuth: function (cb) {
      if (!sb) return;
      sb.auth.onAuthStateChange(function (_event, session) {
        cb(session ? session.user : null);
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
    logout: function () {
      return sb.auth.signOut();
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
    getProgress: function () {
      if (!sb) return Promise.resolve([]);
      return sb.from('progress').select('transtorno_id,status,revisado_em')
        .then(function (r) { return r.data || []; });
    },

    /* ---- métricas ---- */
    logEvent: function (tipo, acerto, payload) {
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
      if (!sb) return Promise.resolve({ revisados: 0, exercicios: 0, taxa: 0 });
      return Promise.all([
        sb.from('progress').select('transtorno_id', { count: 'exact', head: true }),
        sb.from('events').select('acerto')
      ]).then(function (res) {
        var revisados = res[0].count || 0;
        var ev = res[1].data || [];
        var comAcerto = ev.filter(function (e) { return e.acerto !== null; });
        var acertos = comAcerto.filter(function (e) { return e.acerto; }).length;
        var taxa = comAcerto.length ? Math.round(acertos / comAcerto.length * 100) : 0;
        return { revisados: revisados, exercicios: ev.length, taxa: taxa };
      });
    }
  };

  window.DB = DB;
})();
