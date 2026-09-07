/* POST /api/subir-token
   Autoriza al navegador a subir un archivo directamente a Vercel Blob
   (así no pasamos por el límite de 4,5 MB de las funciones).
   El token de sesión viaja en clientPayload; solo admin y alumnas pueden subir. */
const { handleUpload } = require("@vercel/blob/client");
const { rolDeToken, responder, cuerpo } = require("./_lib");

module.exports = async (req, res) => {
  if (req.method !== "POST") return responder(res, 405, { error: "Método no permitido" });
  try {
    const respuesta = await handleUpload({
      body: cuerpo(req),
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let datos = {};
        try { datos = JSON.parse(clientPayload || "{}"); } catch {}
        const rol = rolDeToken(datos.token);
        if (!rol) throw new Error("Tu sesión caducó. Vuelve a entrar.");
        if (!/^subidas\//.test(pathname)) throw new Error("Ruta no permitida");
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/quicktime", "video/webm"],
          maximumSizeInBytes: 25 * 1024 * 1024,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ rol }),
        };
      },
      onUploadCompleted: async () => { /* la publicación la pide el navegador en /api/publicar */ },
    });
    responder(res, 200, respuesta);
  } catch (e) {
    responder(res, 400, { error: e.message || "No se pudo autorizar la subida" });
  }
};
