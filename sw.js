const CACHE_NAME = 'smoking-tracker-v4';
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(['./', './index.html', './manifest.json'])));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('ntfy.sh') || e.request.url.includes('smoking-sync') || e.request.url.includes('127.0.0.1')) return;
  e.respondWith(
    fetch(e.request, { cache: 'no-store' }).then((res) => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then((c) => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request).then((r) => r || caches.match('./index.html')))
  );
});
