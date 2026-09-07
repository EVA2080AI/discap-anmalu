/* Buzón de ideas
   GET   /api/tickets                → lista pública (sin datos sensibles)
   POST  /api/tickets  { tipo, nombre, mensaje }   → cualquiera puede escribir
   PATCH /api/tickets  { id, estado, respuesta }   → solo admin (x-token)
   DELETE /api/tickets { id }                       → solo admin (quita una idea inapropiada)
   Se guarda en Vercel Blob y se copia a GitHub como issue para el equipo. */
const lib = require("./_lib");
const { responder, cuerpo } = lib;

const TIPOS = { error: "🐞 Algo no funciona", idea: "💡 Tengo una idea", gusto: "⭐ Me gustó" };
const ESTADOS = ["nueva", "en-proceso", "lista"];
const ETIQUETA = { error: "error", idea: "mejora", gusto: "pregunta" };

module.exports = async (req, res) => {
  try {
    if (req.method === "GET") {
      const lista = await lib.leerTickets();
      return responder(res, 200, lista.slice(-100).reverse().map(t => ({ id: t.id, tipo: t.tipo, nombre: t.nombre, mensaje: t.mensaje, estado: t.estado, fecha: t.fecha, respuesta: t.respuesta || "" })));
    }

    if (req.method === "POST") {
      const d = cuerpo(req);
      const tipo = TIPOS[d.tipo] ? d.tipo : "idea";
      const nombre = String(d.nombre || "").trim().slice(0, 40) || "Anónimo";
      const mensaje = String(d.mensaje || "").trim().slice(0, 400);
      if (mensaje.length < 3) return responder(res, 400, { error: "Cuéntanos un poquito más 🙂" });
      const lista = await lib.leerTickets();
      const ticket = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), tipo, nombre, mensaje, estado: "nueva", fecha: new Date().toISOString(), respuesta: "" };
      // copia para el equipo en GitHub (si falla, el buzón sigue funcionando)
      try {
        const issue = await lib.gh(`/repos/${lib.REPO}/issues`, { method: "POST", body: JSON.stringify({ title: `${TIPOS[tipo]}: ${mensaje.slice(0, 60)}`, body: `**De:** ${nombre}\n**Buzón de ideas de la app**\n\n${mensaje}`, labels: [ETIQUETA[tipo]] }) });
        ticket.issue = issue.number;
      } catch {}
      lista.push(ticket);
      await lib.guardarTickets(lista);
      return responder(res, 200, { ok: true, id: ticket.id });
    }

    if (req.method === "PATCH") {
      if (lib.rolDe(req) !== "admin") return responder(res, 401, { error: "Solo admin" });
      const d = cuerpo(req);
      const lista = await lib.leerTickets();
      const t = lista.find(x => x.id === d.id);
      if (!t) return responder(res, 404, { error: "No existe" });
      if (ESTADOS.includes(d.estado)) t.estado = d.estado;
      if (typeof d.respuesta === "string") t.respuesta = d.respuesta.trim().slice(0, 300);
      await lib.guardarTickets(lista);
      if (t.issue) {
        const cerrar = t.estado === "lista";
        // Se esperan: en una función serverless lo que no se espera puede no ejecutarse.
        await lib.gh(`/repos/${lib.REPO}/issues/${t.issue}`, { method: "PATCH", body: JSON.stringify({ state: cerrar ? "closed" : "open" }) }).catch(() => {});
        if (t.respuesta) await lib.gh(`/repos/${lib.REPO}/issues/${t.issue}/comments`, { method: "POST", body: JSON.stringify({ body: `Respuesta desde la app: ${t.respuesta}` }) }).catch(() => {});
      }
      return responder(res, 200, { ok: true });
    }

    if (req.method === "DELETE") {
      if (lib.rolDe(req) !== "admin") return responder(res, 401, { error: "Solo admin" });
      const { id } = cuerpo(req);
      const lista = await lib.leerTickets();
      const t = lista.find(x => x.id === id);
      if (!t) return responder(res, 404, { error: "No existe" });
      await lib.guardarTickets(lista.filter(x => x.id !== id));
      if (t.issue) await lib.gh(`/repos/${lib.REPO}/issues/${t.issue}`, { method: "PATCH", body: JSON.stringify({ state: "closed", state_reason: "not_planned" }) }).catch(() => {});
      return responder(res, 200, { ok: true });
    }

    responder(res, 405, { error: "Método no permitido" });
  } catch (e) {
    responder(res, 500, { error: e.message });
  }
};
