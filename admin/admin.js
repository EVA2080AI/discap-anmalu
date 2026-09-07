/* =====================================================================
   ZONA DE SUBIDAS · DISCAP ANMALU
   ---------------------------------------------------------------------
   1. Entrar: la clave se envía una sola vez a /api/sesion y a cambio
      llega un token firmado que caduca en 12 h. Solo se guarda el token.
   2. Subir foto de letra / video de expresión:
        navegador → Vercel Blob (directo) → /api/publicar → GitHub → app
   3. Ideas del buzón (cambiar estado y responder: solo admin)
   4. Por aprobar (solo admin): subidas de alumnas esperando revisión
   ===================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const sesion = { token: sessionStorage.getItem("sesion") || "", rol: sessionStorage.getItem("rol") || "" };
let EXPRESIONES = {};

async function api(ruta, opciones = {}) {
  const r = await fetch(ruta, { ...opciones, headers: { "Content-Type": "application/json", "x-token": sesion.token, ...(opciones.headers || {}) } });
  const datos = await r.json().catch(() => ({}));
  if (r.status === 401 && sesion.token) { sessionStorage.clear(); location.reload(); }
  if (!r.ok) throw new Error(datos.error || `Error ${r.status}`);
  return datos;
}

function autor() { return ($("#autor").value || "").trim() || (sesion.rol === "admin" ? "admin" : "alumna"); }
$("#autor").value = localStorage.getItem("autor") || "";
$("#autor").addEventListener("input", () => localStorage.setItem("autor", $("#autor").value));

// =====================================================================
// 1. ENTRAR
// =====================================================================
$("#formEntrar").addEventListener("submit", async e => {
  e.preventDefault();
  const err = $("#errorEntrar"); err.hidden = true;
  try {
    const { rol, token } = await api("/api/sesion", { method: "POST", body: JSON.stringify({ clave: $("#clave").value }) });
    $("#clave").value = "";
    sesion.token = token; sesion.rol = rol;
    sessionStorage.setItem("sesion", token); sessionStorage.setItem("rol", rol);
    abrirPanel();
  } catch (ex) { err.textContent = ex.message; err.hidden = false; }
});
$("#btnSalir").addEventListener("click", () => { sessionStorage.clear(); location.reload(); });

function abrirPanel() {
  $("#entrar").classList.remove("activa"); $("#panel").classList.add("activa");
  $("#badgeRol").textContent = sesion.rol === "admin" ? "ADMIN" : "ALUMNA";
  $$(".solo-admin").forEach(el => { el.hidden = sesion.rol !== "admin"; });
  cargarExpresiones();
  if (sesion.rol === "admin") cargarPendientes();
}

// pestañas
$$(".pestana").forEach(b => b.addEventListener("click", () => {
  $$(".pestana").forEach(x => x.classList.remove("activo")); b.classList.add("activo");
  $$(".seccion").forEach(s => s.classList.toggle("activo", s.id === "sec-" + b.dataset.pestana));
  if (b.dataset.pestana === "ideas") cargarIdeas();
  if (b.dataset.pestana === "aprobar") cargarPendientes();
}));

// =====================================================================
// 2. SUBIDAS
// =====================================================================
/** Sube un archivo al Blob mostrando progreso y devuelve su pathname. */
async function subirAlBlob(archivo, nombre, progreso) {
  progreso.hidden = false;
  const barra = $(".barra", progreso), texto = $("span", progreso);
  const r = await VercelBlob.upload(`subidas/${Date.now()}-${nombre}`, archivo, {
    access: "private",
    handleUploadUrl: "/api/subir-token",
    clientPayload: JSON.stringify({ token: sesion.token }),
    onUploadProgress: ev => { barra.style.width = ev.percentage + "%"; texto.textContent = `Subiendo… ${Math.round(ev.percentage)}%`; },
  });
  texto.textContent = "Guardando en la app…"; barra.style.width = "100%";
  return r.pathname;
}

function mostrarResultado(el, texto, ok) {
  el.textContent = texto; el.className = "resultado " + (ok ? "ok" : "mal"); el.hidden = false;
}

// --- Foto de letra ---
const foto = { nina: "", letra: "", blob: null };
$$("#ninas .avatar").forEach(b => b.addEventListener("click", () => {
  $$("#ninas .avatar").forEach(x => x.classList.remove("activo")); b.classList.add("activo");
  foto.nina = b.dataset.nina; revisarFoto();
}));
LETRAS.forEach(l => {
  const b = document.createElement("button"); b.type = "button"; b.className = "tecla"; b.textContent = l;
  b.addEventListener("click", () => { $$("#letras .tecla").forEach(x => x.classList.remove("activo")); b.classList.add("activo"); foto.letra = l; revisarFoto(); });
  $("#letras").appendChild(b);
});
$("#archivoFoto").addEventListener("change", async e => {
  const f = e.target.files[0]; if (!f) return;
  // Reducimos a 800 px de lado mayor y JPEG al 80 %: de 5 MB pasa a ~50 KB.
  const img = await createImageBitmap(f).catch(() => null);
  if (!img) { mostrarResultado($("#resFoto"), "No pude leer esa imagen. Prueba con otra.", false); return; }
  const escala = Math.min(1, 800 / Math.max(img.width, img.height));
  const c = $("#lienzo"); c.width = Math.round(img.width * escala); c.height = Math.round(img.height * escala);
  c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
  foto.blob = await new Promise(res => c.toBlob(res, "image/jpeg", 0.8));
  $("#previaFoto").hidden = false;
  $("#infoFoto").textContent = `${c.width}×${c.height} px · ${Math.round(foto.blob.size / 1024)} KB`;
  revisarFoto();
});
function revisarFoto() { $("#btnSubirFoto").disabled = !(foto.nina && foto.letra && foto.blob); }

$("#btnSubirFoto").addEventListener("click", async () => {
  const btn = $("#btnSubirFoto"), res = $("#resFoto"); btn.disabled = true; res.hidden = true;
  try {
    const pathname = await subirAlBlob(foto.blob, `${foto.nina}-${foto.letra === "Ñ" ? "ENIE" : foto.letra}.jpg`, $("#progFoto"));
    const r = await api("/api/publicar", { method: "POST", body: JSON.stringify({ pathname, tipo: "foto", nina: foto.nina, letra: foto.letra, autor: autor() }) });
    mostrarResultado(res, "🎉 " + r.mensaje, true);
    foto.blob = null; $("#previaFoto").hidden = true; $("#archivoFoto").value = "";
  } catch (ex) { mostrarResultado(res, "😕 " + ex.message, false); btn.disabled = false; }
  finally { $("#progFoto").hidden = true; }
});

// --- Video ---
const video = { categoria: "", archivo: null };
async function cargarExpresiones() {
  try { EXPRESIONES = await (await fetch("../datos/expresiones.json", { cache: "no-store" })).json(); } catch { EXPRESIONES = {}; }
  const cont = $("#categoriasAdmin"); cont.innerHTML = "";
  Object.entries(EXPRESIONES).forEach(([id, cat]) => {
    const b = document.createElement("button"); b.type = "button"; b.className = "chip-cat"; b.textContent = `${cat.emoji} ${cat.titulo}`;
    b.addEventListener("click", () => elegirCategoria(id, b));
    cont.appendChild(b);
  });
  if (sesion.rol === "admin") {
    const b = document.createElement("button"); b.type = "button"; b.className = "chip-cat"; b.textContent = "＋ Nueva";
    b.addEventListener("click", () => { elegirCategoria("__nueva__", b); $("#nuevaCategoria").hidden = false; $("#catTitulo").focus(); });
    cont.appendChild(b);
  }
}
function elegirCategoria(id, boton) {
  $$(".chip-cat").forEach(x => x.classList.remove("activo")); boton.classList.add("activo");
  video.categoria = id; if (id !== "__nueva__") $("#nuevaCategoria").hidden = true; revisarVideo();
}
$("#catTitulo").addEventListener("input", revisarVideo);
$("#nombreVideo").addEventListener("input", revisarVideo);
$("#archivoVideo").addEventListener("change", e => {
  const f = e.target.files[0]; if (!f) return;
  video.archivo = f;
  const v = $("#videoPrevia"); v.src = URL.createObjectURL(f); $("#previaVideo").hidden = false;
  const mb = f.size / 1024 / 1024;
  $("#infoVideo").textContent = `${mb.toFixed(1)} MB` + (mb > 12 ? " · Muy pesado: graba máximo 3 segundos" : "");
  revisarVideo();
});
function revisarVideo() {
  const cat = video.categoria === "__nueva__" ? $("#catTitulo").value.trim() : video.categoria;
  const pesoOk = video.archivo && video.archivo.size <= 25 * 1024 * 1024;
  $("#btnSubirVideo").disabled = !(cat && $("#nombreVideo").value.trim() && pesoOk);
}
$("#btnSubirVideo").addEventListener("click", async () => {
  const btn = $("#btnSubirVideo"), res = $("#resVideo"); btn.disabled = true; res.hidden = true;
  const esNueva = video.categoria === "__nueva__";
  const categoria = esNueva ? $("#catTitulo").value.trim() : video.categoria;
  try {
    const pathname = await subirAlBlob(video.archivo, video.archivo.name.replace(/[^a-zA-Z0-9.]+/g, "-"), $("#progVideo"));
    const r = await api("/api/publicar", { method: "POST", body: JSON.stringify({
      pathname, tipo: "video", categoria, nombre: $("#nombreVideo").value.trim(), autor: autor(),
      tituloCategoria: esNueva ? categoria : undefined, emoji: esNueva ? ($("#catEmoji").value.trim() || "🎬") : undefined,
    }) });
    mostrarResultado(res, "🎉 " + r.mensaje, true);
    video.archivo = null; $("#previaVideo").hidden = true; $("#archivoVideo").value = ""; $("#nombreVideo").value = "";
    if (esNueva) cargarExpresiones();
  } catch (ex) { mostrarResultado(res, "😕 " + ex.message, false); btn.disabled = false; }
  finally { $("#progVideo").hidden = true; }
});

// =====================================================================
// 3. IDEAS DEL BUZÓN
// =====================================================================
const TIPO_EMOJI = { error: "🐞", idea: "💡", gusto: "⭐" };
const ESTADO_TEXTO = { nueva: "Nueva", "en-proceso": "En proceso", lista: "¡Lista!" };
async function cargarIdeas() {
  const cont = $("#listaIdeasAdmin");
  try {
    const lista = await api("/api/tickets");
    cont.innerHTML = lista.length ? "" : '<p class="ayuda">Todavía no hay ideas. 🌱</p>';
    lista.forEach(t => {
      const el = document.createElement("article"); el.className = "idea";
      el.innerHTML = `<header><span class="tipo">${TIPO_EMOJI[t.tipo] || "💬"}</span><span class="nombre"></span><span class="estado ${t.estado}">${ESTADO_TEXTO[t.estado] || t.estado}</span><span class="fecha">${new Date(t.fecha).toLocaleDateString("es-CO")}</span></header><p class="mensaje"></p>`;
      $(".nombre", el).textContent = t.nombre; $(".mensaje", el).textContent = t.mensaje;
      if (t.respuesta) { const r = document.createElement("div"); r.className = "respuesta"; r.textContent = "Respuesta: " + t.respuesta; el.appendChild(r); }
      if (sesion.rol === "admin") {
        const acc = document.createElement("div"); acc.className = "acciones";
        acc.innerHTML = `<select aria-label="Estado"><option value="nueva">Nueva</option><option value="en-proceso">En proceso</option><option value="lista">¡Lista!</option></select><input type="text" placeholder="Responder (opcional)" maxlength="300"><button type="button" class="btn-mini">Guardar</button><button type="button" class="btn-mini no" title="Borrar esta idea">🗑</button>`;
        $("select", acc).value = t.estado; $("input", acc).value = t.respuesta || "";
        $("button", acc).addEventListener("click", async () => {
          $("button", acc).disabled = true;
          try { await api("/api/tickets", { method: "PATCH", body: JSON.stringify({ id: t.id, estado: $("select", acc).value, respuesta: $("input", acc).value }) }); cargarIdeas(); }
          catch (ex) { mostrarResultado(el.appendChild(document.createElement("p")), ex.message, false); $("button", acc).disabled = false; }
        });
        $(".no", acc).addEventListener("click", async () => {
          if (!confirm("¿Borrar esta idea del buzón?")) return;
          try { await api("/api/tickets", { method: "DELETE", body: JSON.stringify({ id: t.id }) }); cargarIdeas(); }
          catch (ex) { mostrarResultado(el.appendChild(document.createElement("p")), ex.message, false); }
        });
        el.appendChild(acc);
      }
      cont.appendChild(el);
    });
  } catch (ex) { cont.innerHTML = `<p class="error">${ex.message}</p>`; }
}

// =====================================================================
// 4. POR APROBAR (admin)
// =====================================================================
async function cargarPendientes() {
  const cont = $("#listaPendientes");
  try {
    const lista = await api("/api/pendientes");
    $("#contadorAprobar").textContent = lista.length; $("#contadorAprobar").hidden = !lista.length;
    cont.innerHTML = lista.length ? "" : '<p class="ayuda">Nada pendiente. ✨</p>';
    lista.forEach(p => {
      const el = document.createElement("article"); el.className = "pendiente";
      const medios = p.archivos.map(a => /\.(mp4|webm|mov)$/i.test(a.ruta) ? `<video src="${a.url}" playsinline muted controls></video>` : `<img src="${a.url}" alt="">`).join("");
      el.innerHTML = `<div class="titulo"></div><div class="pista"></div><div class="medios">${medios}</div><div class="acciones"><button type="button" class="btn-mini ok">✅ Aprobar</button><button type="button" class="btn-mini no">✖ Rechazar</button></div>`;
      $(".titulo", el).textContent = p.titulo; $(".pista", el).textContent = `Subido por ${p.autor} · ${new Date(p.fecha).toLocaleDateString("es-CO")}`;
      $$(".btn-mini", el).forEach(b => b.addEventListener("click", async () => {
        $$(".btn-mini", el).forEach(x => x.disabled = true);
        try { const r = await api("/api/revisar", { method: "POST", body: JSON.stringify({ numero: p.numero, accion: b.classList.contains("ok") ? "aprobar" : "rechazar" }) }); el.innerHTML = `<div class="resultado ok">${r.mensaje}</div>`; setTimeout(cargarPendientes, 1500); }
        catch (ex) { mostrarResultado(el.appendChild(document.createElement("p")), ex.message, false); $$(".btn-mini", el).forEach(x => x.disabled = false); }
      }));
      cont.appendChild(el);
    });
  } catch (ex) { cont.innerHTML = `<p class="error">${ex.message}</p>`; }
}

// =====================================================================
// Arranque
// =====================================================================
if (sesion.token && sesion.rol) abrirPanel();
