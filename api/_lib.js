/* =====================================================================
   Utilidades compartidas por las funciones de /api
   ---------------------------------------------------------------------
   - rolDe(req): "admin" | "alumna" | null según la clave enviada
   - gh(): llamadas a la API de GitHub (el repositorio es la fuente de verdad)
   - leerTickets()/guardarTickets(): buzón de ideas guardado en Vercel Blob
   ===================================================================== */
const { put, get } = require("@vercel/blob");
const crypto = require("crypto");

const REPO = process.env.GITHUB_REPO || "EVA2080AI/discap-anmalu";
const GH = "https://api.github.com";
const TICKETS_PATH = "buzon/tickets.json";

/** La clave solo se usa una vez, al entrar; a cambio se emite un token firmado
    que caduca a las 12 horas. El navegador nunca guarda la clave. */
function rolDeClave(clave) {
  clave = String(clave || "").trim();
  if (!clave) return null;
  if (process.env.ADMIN_CLAVE && clave === process.env.ADMIN_CLAVE) return "admin";
  if (process.env.ALUMNA_CLAVE && clave === process.env.ALUMNA_CLAVE) return "alumna";
  return null;
}

function secreto() {
  return crypto.createHash("sha256").update(`${process.env.ADMIN_CLAVE || ""}|${process.env.ALUMNA_CLAVE || ""}|${process.env.BLOB_READ_WRITE_TOKEN || ""}`).digest();
}

function emitirToken(rol) {
  const datos = `${rol}.${Date.now() + 12 * 3600 * 1000}`;
  const firma = crypto.createHmac("sha256", secreto()).update(datos).digest("base64url");
  return `${datos}.${firma}`;
}

function rolDeToken(token) {
  const [rol, exp, firma] = String(token || "").split(".");
  if (!rol || !exp || !firma) return null;
  const esperada = crypto.createHmac("sha256", secreto()).update(`${rol}.${exp}`).digest("base64url");
  if (firma.length !== esperada.length || !crypto.timingSafeEqual(Buffer.from(firma), Buffer.from(esperada))) return null;
  if (Number(exp) < Date.now()) return null;
  return ["admin", "alumna"].includes(rol) ? rol : null;
}

function rolDe(req) {
  return rolDeToken(req.headers["x-token"]);
}

function responder(res, codigo, datos) {
  res.statusCode = codigo;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(datos));
}

function cuerpo(req) {
  if (req.body && typeof req.body === "object") return req.body;
  try { return JSON.parse(req.body || "{}"); } catch { return {}; }
}

/** Convierte "Buenos días" en "buenos-dias" para nombres de archivo. */
function slug(texto) {
  return String(texto).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/ñ/g, "n").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}

// ---------- GitHub ----------
async function gh(ruta, opciones = {}) {
  const r = await fetch(GH + ruta, {
    ...opciones,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "discap-anmalu",
      "Content-Type": "application/json",
      ...(opciones.headers || {}),
    },
  });
  if (r.status === 404 && opciones.permitir404) return null;
  if (!r.ok) throw new Error(`GitHub ${r.status} en ${ruta}: ${(await r.text()).slice(0, 200)}`);
  return r.status === 204 ? null : r.json();
}

async function shaDeRama(rama) {
  const ref = await gh(`/repos/${REPO}/git/ref/heads/${rama}`);
  return ref.object.sha;
}

async function crearRama(nombre, desdeSha) {
  await gh(`/repos/${REPO}/git/refs`, { method: "POST", body: JSON.stringify({ ref: `refs/heads/${nombre}`, sha: desdeSha }) });
}

/** Lee un archivo del repo (o null si no existe). Devuelve { sha, contenido (Buffer) }. */
async function leerArchivo(ruta, rama) {
  const r = await gh(`/repos/${REPO}/contents/${ruta}?ref=${encodeURIComponent(rama)}`, { permitir404: true });
  if (!r) return null;
  return { sha: r.sha, contenido: Buffer.from(r.content || "", "base64") };
}

/** Crea o reemplaza un archivo en una rama. */
async function escribirArchivo(ruta, buffer, mensaje, rama) {
  const existente = await leerArchivo(ruta, rama);
  const body = { message: mensaje, content: buffer.toString("base64"), branch: rama };
  if (existente) body.sha = existente.sha;
  return gh(`/repos/${REPO}/contents/${ruta}`, { method: "PUT", body: JSON.stringify(body) });
}

// ---------- Buzón de ideas (Vercel Blob) ----------
async function leerTickets() {
  try {
    const r = await get(TICKETS_PATH, { access: "private", useCache: false });
    if (!r || r.statusCode !== 200) return [];
    const texto = await new Response(r.stream).text();
    return JSON.parse(texto || "[]");
  } catch (e) {
    if (String(e.message || e).includes("not found") || String(e.name || "").includes("NotFound")) return [];
    throw e;
  }
}

async function guardarTickets(lista) {
  await put(TICKETS_PATH, JSON.stringify(lista), {
    access: "private", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json",
  });
}

/** Descarga un archivo subido por el navegador al Blob. */
async function leerBlob(pathname) {
  const r = await get(pathname, { access: "private", useCache: false });
  if (!r || r.statusCode !== 200) throw new Error("No encontré el archivo subido");
  return Buffer.from(await new Response(r.stream).arrayBuffer());
}

module.exports = { REPO, rolDe, rolDeClave, rolDeToken, emitirToken, responder, cuerpo, slug, gh, shaDeRama, crearRama, leerArchivo, escribirArchivo, leerTickets, guardarTickets, leerBlob };
