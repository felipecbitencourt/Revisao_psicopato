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
        return Promise.resolve({
          revisados: Object.keys(p).length,
          exercicios: ev.length,
          taxa: ca.length ? Math.round(ac / ca.length * 100) : 0,
          streak: streakFrom(datas)
        });
      }
      if (!sb) return Promise.resolve({ revisados: 0, exercicios: 0, taxa: 0, streak: 0 });
      return Promise.all([
        sb.from('progress').select('revisado_em'),
        sb.from('events').select('acerto,criado_em')
      ]).then(function (res) {
        var prog = res[0].data || [];
        var ev = res[1].data || [];
        var comAcerto = ev.filter(function (e) { return e.acerto !== null; });
        var acertos = comAcerto.filter(function (e) { return e.acerto; }).length;
        var datas = ev.map(function (e) { return e.criado_em; })
          .concat(prog.map(function (r) { return r.revisado_em; }));
        return {
          revisados: prog.length,
          exercicios: ev.length,
          taxa: comAcerto.length ? Math.round(acertos / comAcerto.length * 100) : 0,
          streak: streakFrom(datas)
        };
      });
    }
  };

  window.DB = DB;
})();
