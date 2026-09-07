/* Service worker sencillo: guarda la app en caché para que abra sin internet.
   Las fotos y videos se guardan a medida que se van viendo. */
const CACHE = "anmalu-v1";
const BASE = ["./", "index.html", "css/style.css", "js/datos.js", "js/app.js", "manifest.json"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // fuentes externas: siempre red

  // Videos: red primero (son pesados), sin guardarlos en caché
  if (url.pathname.includes("/video/")) return;

  e.respondWith(
    caches.match(e.request).then(cacheado => {
      const red = fetch(e.request).then(resp => {
        if (resp.ok) caches.open(CACHE).then(c => c.put(e.request, resp.clone()));
        return resp;
      }).catch(() => cacheado);
      return cacheado || red;
    })
  );
});
