/* POST /api/revisar   (solo admin)   { numero, accion: "aprobar" | "rechazar" } */
const lib = require("./_lib");
const { responder, cuerpo } = lib;

module.exports = async (req, res) => {
  if (req.method !== "POST") return responder(res, 405, { error: "Método no permitido" });
  if (lib.rolDe(req) !== "admin") return responder(res, 401, { error: "Solo admin" });
  const { numero, accion } = cuerpo(req);
  try {
    const pr = await lib.gh(`/repos/${lib.REPO}/pulls/${Number(numero)}`);
    if (accion === "aprobar") {
      await lib.gh(`/repos/${lib.REPO}/pulls/${pr.number}/merge`, { method: "PUT", body: JSON.stringify({ merge_method: "squash", commit_title: pr.title }) });
    } else if (accion === "rechazar") {
      await lib.gh(`/repos/${lib.REPO}/pulls/${pr.number}`, { method: "PATCH", body: JSON.stringify({ state: "closed" }) });
    } else {
      throw new Error("Acción desconocida");
    }
    await lib.gh(`/repos/${lib.REPO}/git/refs/heads/${pr.head.ref}`, { method: "DELETE" }).catch(() => {});
    responder(res, 200, { ok: true, mensaje: accion === "aprobar" ? "Aprobado. En un minuto se ve en la app." : "Rechazado." });
  } catch (e) {
    responder(res, 500, { error: e.message });
  }
};
