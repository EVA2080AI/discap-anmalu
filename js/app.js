/* =====================================================================
   LÓGICA DE LA APP · DISCAP ANMALU
   ---------------------------------------------------------------------
   Sin frameworks: HTML + CSS + JavaScript puro para que sea fácil de
   entender y mejorar. Tres partes:
     1. Navegación entre pantallas (#inicio, #traductor, #expresiones)
     2. Traductor: texto → secuencia de letras con foto + seña formal
     3. Expresiones: categorías → botones → video
   ===================================================================== */

// ---------- Utilidades ----------
const $ = (sel, raiz = document) => raiz.querySelector(sel);
const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];

/** Quita tildes y deja solo letras del abecedario LSC y espacios. */
function normalizar(texto) {
  return texto
    .toUpperCase()
    .replace(/\u00d1/g, "\u0001")                       // proteger la Ñ (en NFD también se descompone)
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")   // quitar tildes: á→A, ü→U
    .replace(/\u0001/g, "\u00d1")
    .replace(/[^A-Z\u00d1 ]/g, "")                        // solo letras del abecedario y espacios
    .replace(/\s+/g, " ")
    .trim();
}

function elegirAleatorio(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

// =====================================================================
// 1. NAVEGACIÓN
// =====================================================================
const PANTALLAS = ["inicio", "traductor", "expresiones", "ideas"];

function mostrarPantalla(id) {
  if (!PANTALLAS.includes(id)) id = "inicio";
  $$(".pantalla").forEach(p => p.classList.toggle("activa", p.id === id));
  $("#btnAtras").hidden = id === "inicio";
  window.scrollTo({ top: 0 });
  if (id !== "expresiones") pausarVideo();
  if (id !== "traductor") detenerReproduccion();
  if (id === "ideas") cargarIdeas();
}

window.addEventListener("hashchange", () => mostrarPantalla(location.hash.slice(1)));
$("#btnAtras").addEventListener("click", () => { location.hash = "#inicio"; });

// =====================================================================
// 2. TRADUCTOR
// =====================================================================
const estado = {
  avatar: "ana",          // "ana" | "antonella" | "mariapaula" | "aleatorio"
  secuencia: [],          // [{ letra, avatar }] — un elemento por letra/espacio
  indice: 0,
  reproduciendo: false,
  temporizador: null,
};

// --- Selección de avatar ---
$$(".avatar").forEach(btn => {
  btn.addEventListener("click", () => {
    $$(".avatar").forEach(b => { b.classList.remove("activo"); b.setAttribute("aria-checked", "false"); });
    btn.classList.add("activo");
    btn.setAttribute("aria-checked", "true");
    estado.avatar = btn.dataset.avatar;
    // Si ya hay una palabra, la volvemos a armar con el nuevo avatar
    if (estado.secuencia.length) traducir($("#texto").value);
  });
});

// --- Formulario ---
$("#formTraducir").addEventListener("submit", e => {
  e.preventDefault();
  traducir($("#texto").value);
});
$$(".chip").forEach(chip => chip.addEventListener("click", () => {
  $("#texto").value = chip.dataset.texto;
  traducir(chip.dataset.texto);
}));

/** Convierte el texto en una secuencia y la muestra. */
function traducir(texto) {
  const limpio = normalizar(texto);
  if (!limpio) { $("#texto").focus(); return; }

  estado.secuencia = limpio.split("").map(ch => ({
    letra: ch,
    avatar: estado.avatar === "aleatorio" ? elegirAleatorio(Object.keys(AVATARES)) : estado.avatar,
  }));
  estado.indice = 0;
  precargarSecuencia();
  $("#escenario").hidden = false;
  pintarProgreso();
  mostrarLetra(0);
  iniciarReproduccion();
  $("#escenario").scrollIntoView({ behavior: "smooth", block: "start" });
  registrarEvento("traducir", { letras: estado.secuencia.length, avatar: estado.avatar });
}

/** Evento de analítica (Vercel Web Analytics). No hace nada si no está activo. */
function registrarEvento(nombre, datos) {
  if (window.va) window.va("event", { name: nombre, data: datos });
}

/** Descarga por adelantado todas las fotos de la palabra para que no parpadee. */
function precargarSecuencia() {
  estado.secuencia.forEach(({ letra, avatar }) => {
    if (letra === " ") return;
    new Image().src = `img/senas/${archivoLetra(letra)}.jpg`;
    if (!LETRAS_SIN_AVATAR.includes(letra)) new Image().src = `img/avatares/${AVATARES[avatar].carpeta}/${archivoLetra(letra)}.jpg`;
  });
}

/** Dibuja la palabra con la letra actual resaltada. */
function pintarProgreso() {
  const cont = $("#palabraProgreso");
  cont.innerHTML = "";
  estado.secuencia.forEach((item, i) => {
    const s = document.createElement("button");
    s.type = "button";
    s.className = "letra-chip" + (item.letra === " " ? " espacio" : "");
    s.textContent = item.letra === " " ? "·" : item.letra;
    s.addEventListener("click", () => { detenerReproduccion(); mostrarLetra(i); });
    cont.appendChild(s);
  });
}

/** Muestra la letra en la posición i de la secuencia. */
function mostrarLetra(i) {
  if (!estado.secuencia.length) return;
  estado.indice = Math.max(0, Math.min(i, estado.secuencia.length - 1));
  const { letra, avatar } = estado.secuencia[estado.indice];

  $$("#palabraProgreso .letra-chip").forEach((c, j) => c.classList.toggle("actual", j === estado.indice));

  const esEspacio = letra === " ";
  $("#avisoPausa").hidden = !esEspacio;
  $(".tarjeta-sena").classList.toggle("pausa", esEspacio);
  if (esEspacio) return; // tarjeta neutra entre palabras

  pintarSena(letra, avatar);
}

/** Pinta una letra concreta con un avatar concreto (también la usa el abecedario). */
function pintarSena(letra, avatarId) {
  const avatar = AVATARES[avatarId] || AVATARES.ana;
  const tarjeta = $(".tarjeta-sena");
  const sinAvatar = LETRAS_SIN_AVATAR.includes(letra);

  tarjeta.classList.toggle("solo-formal", sinAvatar);
  $("#letraGrande").textContent = letra;
  $("#fotoFormal").src = `img/senas/${archivoLetra(letra)}.jpg`;
  $("#fotoFormal").alt = `Seña formal de la letra ${letra}`;

  if (sinAvatar) {
    $("#fotoAvatar").removeAttribute("src");
    $("#nombreAvatar").textContent = "Seña formal (sin foto de avatar)";
  } else {
    $("#fotoAvatar").onerror = () => { tarjeta.classList.add("solo-formal"); $("#nombreAvatar").textContent = `Falta la foto de ${avatar.nombre} para la ${letra}`; };
    $("#fotoAvatar").src = `img/avatares/${avatar.carpeta}/${archivoLetra(letra)}.jpg`;
    $("#fotoAvatar").alt = `${avatar.nombre} haciendo la letra ${letra}`;
    $("#nombreAvatar").textContent = avatar.nombre;
  }
}

// Tocar el recuadro de la seña formal lo amplía (y vuelve a reducir)
$(".recuadro-formal").addEventListener("click", () => {
  const t = $(".tarjeta-sena");
  if (!t.classList.contains("solo-formal")) t.classList.toggle("ampliada");
});

// --- Reproducción automática ---
function iniciarReproduccion() {
  detenerReproduccion();
  estado.reproduciendo = true;
  $("#btnPlay").textContent = "⏸";
  $("#btnPlay").setAttribute("aria-label", "Pausar");
  programarSiguiente();
}

function programarSiguiente() {
  // El deslizador va de 400 a 2500: a la derecha más rápido, así que invertimos la escala.
  const ms = 2900 - Number($("#velocidad").value);
  estado.temporizador = setTimeout(() => {
    if (!estado.reproduciendo) return;
    if (estado.indice >= estado.secuencia.length - 1) { detenerReproduccion(); return; }
    mostrarLetra(estado.indice + 1);
    programarSiguiente();
  }, ms);
}

function detenerReproduccion() {
  estado.reproduciendo = false;
  clearTimeout(estado.temporizador);
  const btn = $("#btnPlay");
  btn.textContent = "▶";
  btn.setAttribute("aria-label", "Reproducir");
}

$("#btnPlay").addEventListener("click", () => {
  if (estado.reproduciendo) { detenerReproduccion(); return; }
  if (estado.indice >= estado.secuencia.length - 1) mostrarLetra(0);
  iniciarReproduccion();
});
$("#btnAnterior").addEventListener("click", () => { detenerReproduccion(); mostrarLetra(estado.indice - 1); });
$("#btnSiguiente").addEventListener("click", () => { detenerReproduccion(); mostrarLetra(estado.indice + 1); });

// --- Abecedario completo ---
(function pintarAbecedario() {
  const cont = $("#abecedario");
  LETRAS.forEach(letra => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "tecla";
    b.textContent = letra;
    b.addEventListener("click", () => {
      detenerReproduccion();
      const avatarId = estado.avatar === "aleatorio" ? elegirAleatorio(Object.keys(AVATARES)) : estado.avatar;
      estado.secuencia = [{ letra, avatar: avatarId }];
      estado.indice = 0;
      $("#escenario").hidden = false;
      pintarProgreso();
      mostrarLetra(0);
      $("#escenario").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    cont.appendChild(b);
  });
})();

// =====================================================================
// 3. EXPRESIONES
// =====================================================================
// El contenido vive en datos/expresiones.json; se carga al arrancar.
let EXPRESIONES = {};
let categoriaActual = "";

async function cargarExpresiones() {
  try {
    EXPRESIONES = await (await fetch("datos/expresiones.json")).json();
  } catch { EXPRESIONES = {}; }
  const cont = $("#categorias");
  cont.innerHTML = "";
  Object.entries(EXPRESIONES).forEach(([id, cat], i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "categoria" + (i === 0 ? " activo" : "");
    b.dataset.categoria = id;
    b.innerHTML = `<span class="emoji" aria-hidden="true">${cat.emoji || "🎬"}</span>${cat.titulo}`;
    b.addEventListener("click", () => {
      $$(".categoria").forEach(x => x.classList.remove("activo"));
      b.classList.add("activo");
      categoriaActual = id;
      pintarExpresiones();
    });
    cont.appendChild(b);
  });
  cont.style.setProperty("--n", Math.min(4, Object.keys(EXPRESIONES).length || 1));
  categoriaActual = Object.keys(EXPRESIONES)[0] || "";
  pintarExpresiones();
}

function pintarExpresiones() {
  const cat = EXPRESIONES[categoriaActual];
  const cont = $("#listaExpresiones");
  cont.innerHTML = "";
  if (!cat) return;
  cat.items.forEach(item => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "expresion";
    if (item.color) {
      b.style.setProperty("--color-muestra", item.color);
      b.classList.add("con-color");
    }
    b.innerHTML = `<span class="muestra" aria-hidden="true"></span><span>${item.nombre}</span>`;
    b.addEventListener("click", () => reproducirExpresion(item));
    cont.appendChild(b);
  });
}

function reproducirExpresion(item) {
  const video = $("#video");
  const rep = $("#reproductor");
  rep.hidden = false;
  $("#videoTitulo").textContent = `${EXPRESIONES[categoriaActual].emoji} ${item.nombre}`;
  video.src = `video/${categoriaActual}/${item.archivo}`;
  video.poster = `video/${categoriaActual}/${item.archivo.replace(/\.mp4$/, ".jpg")}`; // póster: primer cuadro
  video.load();
  video.play().catch(() => {/* el usuario puede darle play manualmente */});
  registrarEvento("video", { categoria: categoriaActual, nombre: item.nombre });
  rep.scrollIntoView({ behavior: "smooth", block: "start" });
  $$(".expresion").forEach(b => b.classList.toggle("activo", b.textContent.trim() === item.nombre));
}

function pausarVideo() {
  const v = $("#video");
  if (v && !v.paused) v.pause();
}

cargarExpresiones();

// =====================================================================
// 4. BUZÓN DE IDEAS
// =====================================================================
const TIPO_EMOJI = { idea: "💡", error: "🐞", gusto: "⭐" };
const ESTADO_TEXTO = { nueva: "🌱 Nueva", "en-proceso": "🛠️ En proceso", lista: "✅ ¡Lista!" };
let tipoIdea = "idea";

$$(".tipo-idea").forEach(b => b.addEventListener("click", () => {
  $$(".tipo-idea").forEach(x => { x.classList.remove("activo"); x.setAttribute("aria-checked", "false"); });
  b.classList.add("activo"); b.setAttribute("aria-checked", "true");
  tipoIdea = b.dataset.tipo;
}));

$("#formIdea").addEventListener("submit", async e => {
  e.preventDefault();
  const btn = $(".btn-enviar"), res = $("#resultadoIdea");
  btn.disabled = true; res.hidden = true;
  try {
    const r = await fetch("api/tickets", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: tipoIdea, nombre: $("#ideaNombre").value, mensaje: $("#ideaMensaje").value }) });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || "No se pudo enviar");
    res.textContent = "🎉 ¡Gracias! Tu idea ya está en el buzón.";
    res.className = "resultado-idea ok"; res.hidden = false;
    $("#ideaMensaje").value = "";
    registrarEvento("idea", { tipo: tipoIdea });
    cargarIdeas();
  } catch (ex) {
    res.textContent = "😕 " + ex.message; res.className = "resultado-idea mal"; res.hidden = false;
  } finally { btn.disabled = false; }
});

async function cargarIdeas() {
  const cont = $("#listaIdeas");
  try {
    const lista = await (await fetch("api/tickets", { cache: "no-store" })).json();
    cont.innerHTML = lista.length ? "" : '<p class="ayuda">Sé la primera persona en dejar una idea. 🌱</p>';
    lista.forEach(t => {
      const el = document.createElement("article");
      el.className = "idea";
      el.innerHTML = `<header><span class="tipo" aria-hidden="true">${TIPO_EMOJI[t.tipo] || "💬"}</span><span class="nombre"></span><span class="estado ${t.estado}">${ESTADO_TEXTO[t.estado] || t.estado}</span></header><p class="mensaje"></p>`;
      $(".nombre", el).textContent = t.nombre;
      $(".mensaje", el).textContent = t.mensaje;
      if (t.respuesta) { const r = document.createElement("p"); r.className = "respuesta"; r.textContent = "💬 " + t.respuesta; el.appendChild(r); }
      cont.appendChild(el);
    });
  } catch { cont.innerHTML = '<p class="ayuda">No pude cargar las ideas. ¿Hay internet?</p>'; }
}

// =====================================================================
// Arranque
// =====================================================================
mostrarPantalla(location.hash.slice(1) || "inicio");

// PWA: registrar el service worker para que funcione sin internet
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
