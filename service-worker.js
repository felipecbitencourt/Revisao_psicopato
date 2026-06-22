/* ============================================================
   Psico·Pato — Service Worker (PWA)
   Estratégia:
   - HTML (navegação): network-first → cai no cache offline.
   - Demais GET same-origin (assets versionados ?v=N): cache-first
     (cada ?v= novo é uma URL nova = busca fresca; o antigo só fica
     guardado até a próxima troca de versão do cache).
   - Cross-origin (Supabase, CDN, fontes): passa direto (sem cache).
   ============================================================ */
var CACHE = 'psicopato-v2';
var CORE = ['/', '/index.html', '/manifest.json', '/logo-128.png', '/favicon-48.png', '/icon-192.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // deixa Supabase/CDN/fontes passarem

  // navegação (HTML) → network-first (pega versões novas), fallback offline
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put('/index.html', copy); });
        return res;
      }).catch(function () {
        return caches.match('/index.html').then(function (r) { return r || caches.match('/'); });
      })
    );
    return;
  }

  // demais GET same-origin → cache-first + popula o cache
  e.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      });
    })
  );
});

/* ---- Notificações push (Web Push) ---- */
self.addEventListener('push', function (e) {
  var data = {};
  try { data = e.data ? e.data.json() : {}; }
  catch (_) { data = { body: (e.data && e.data.text()) || '' }; }
  var title = data.title || 'Psico·Pato';
  var opts = {
    body: data.body || '',
    icon: '/icon-192.png',
    badge: '/favicon-48.png',
    tag: data.tag || undefined,         // mesma tag = substitui (não empilha)
    data: { url: data.url || '/' }
  };
  e.waitUntil(self.registration.showNotification(title, opts));
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (wins) {
      for (var i = 0; i < wins.length; i++) {
        var w = wins[i];
        if (w.url.indexOf(self.location.origin) === 0 && 'focus' in w) {
          w.focus();
          if (w.navigate) { try { w.navigate(url); } catch (_) {} }
          return;
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
