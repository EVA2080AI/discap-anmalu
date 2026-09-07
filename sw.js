/* Service worker sencillo: guarda la app en caché para que abra sin internet.
   Las fotos y videos se guardan a medida que se van viendo. */
const CACHE = "anmalu-v5";
importScripts("js/datos.js"); // trae LETRAS, AVATARES y archivoLetra()
const BASE = ["./", "index.html", "css/style.css", "js/datos.js", "js/app.js", "manifest.json", "icons/icon-192.png", "icons/icon-512.png"];

// Todas las fotos (unos 5 MB) para que el traductor funcione completo sin internet.
const FOTOS = [];
LETRAS.forEach(l => {
  FOTOS.push(`img/senas/${archivoLetra(l)}.jpg`);
  if (!LETRAS_SIN_AVATAR.includes(l)) Object.values(AVATARES).forEach(a => FOTOS.push(`img/avatares/${a.carpeta}/${archivoLetra(l)}.jpg`));
});

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(async c => {
      await c.addAll(BASE);
      // Las fotos se bajan una a una: si alguna falla no rompe la instalación.
      await Promise.all(FOTOS.map(f => c.add(f).catch(() => {})));
    }).then(() => self.skipWaiting())
  );
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

  // Videos: red directa, sin guardarlos en caché (son pesados)
  if (url.pathname.includes("/video/")) return;
  // API y zona de subidas: siempre red, nunca caché
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/admin")) return;

  // Fotos: caché primero (no cambian), y si no está, red
  if (url.pathname.includes("/img/") || url.pathname.includes("/icons/")) {
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(resp => {
        if (resp.ok) caches.open(CACHE).then(c => c.put(e.request, resp.clone()));
        return resp;
      }))
    );
    return;
  }

  // Código (html, css, js): RED PRIMERO para que las mejoras se vean al instante;
  // la caché solo se usa si no hay internet.
  e.respondWith(
    fetch(e.request).then(resp => {
      if (resp.ok) caches.open(CACHE).then(c => c.put(e.request, resp.clone()));
      return resp;
    }).catch(() => caches.match(e.request))
  );
});
