/* POST /api/sesion  { clave }  →  { rol: "admin" | "alumna", token }  (token firmado, 12 h) */
const { rolDeClave, emitirToken, responder, cuerpo } = require("./_lib");

module.exports = async (req, res) => {
  if (req.method !== "POST") return responder(res, 405, { error: "Método no permitido" });
  const { clave } = cuerpo(req);
  const rol = rolDeClave(String(clave || ""));
  if (!rol) return responder(res, 401, { error: "Esa clave no es. Pídesela a tu profe o a Guido." });
  responder(res, 200, { rol, token: emitirToken(rol) });
};
