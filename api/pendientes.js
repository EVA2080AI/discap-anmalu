/* GET /api/pendientes   (solo admin)
   Lista las subidas de alumnas que esperan aprobación (pull requests con etiqueta "subida"). */
const lib = require("./_lib");
const { responder } = lib;

module.exports = async (req, res) => {
  if (lib.rolDe(req) !== "admin") return responder(res, 401, { error: "Solo admin" });
  try {
    const prs = await lib.gh(`/repos/${lib.REPO}/pulls?state=open&per_page=50`);
    const subidas = prs.filter(p => p.labels.some(l => l.name === "subida"));
    const lista = await Promise.all(subidas.map(async p => {
      const archivos = await lib.gh(`/repos/${lib.REPO}/pulls/${p.number}/files`);
      const media = archivos.filter(a => /\.(jpg|jpeg|png|webp|mp4|webm|mov)$/i.test(a.filename))
        .map(a => ({ ruta: a.filename, url: `https://raw.githubusercontent.com/${lib.REPO}/${p.head.ref}/${a.filename}` }));
      const autor = (p.body.match(/por \*\*(.+?)\*\*/) || [])[1] || "alumna";
      return { numero: p.number, titulo: p.title.replace(/^Subida: /, ""), autor, fecha: p.created_at, archivos: media };
    }));
    responder(res, 200, lista);
  } catch (e) {
    responder(res, 500, { error: e.message });
  }
};
