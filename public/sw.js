/* Service worker · DISCAP ANMALU
   - Fotos de letras y señas formales: se guardan todas al instalar (unos 5 MB)
     para que el traductor funcione completo sin internet (feria sin wifi).
   - Páginas y código: red primero; si no hay red, lo último que se vio.
   - Videos, /api y /admin: siempre red. */
const CACHE = "anmalu-next-v1";
const LETRAS = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
const AVATARES = ["ana", "antonella", "mariapaula"];
const archivo = l => (l === "Ñ" ? "ENIE" : l);

const FOTOS = [];
LETRAS.forEach(l => {
  FOTOS.push(`/img/senas/${archivo(l)}.jpg`);
  if (l !== "Ñ") AVATARES.forEach(a => FOTOS.push(`/img/avatares/${a}/${archivo(l)}.jpg`));
});
const BASE = ["/", "/traductor", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(async c => {
      await Promise.all([...BASE, ...FOTOS].map(f => c.add(f).catch(() => {})));
    }).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/admin") || url.pathname.includes("/video/")) return;

  // Fotos e íconos: caché primero
  if (url.pathname.startsWith("/img/") || url.pathname.startsWith("/icons/")) {
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(resp => {
        if (resp.ok) caches.open(CACHE).then(c => c.put(e.request, resp.clone()));
        return resp;
      })),
    );
    return;
  }

  // Todo lo demás: red primero, caché si no hay red
  e.respondWith(
    fetch(e.request).then(resp => {
      if (resp.ok && (e.request.mode === "navigate" || url.pathname.startsWith("/_next/static/"))) {
        caches.open(CACHE).then(c => c.put(e.request, resp.clone()));
      }
      return resp;
    }).catch(() => caches.match(e.request).then(hit => hit || (e.request.mode === "navigate" ? caches.match("/") : undefined))),
  );
});
