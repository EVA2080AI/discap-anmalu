/* POST /api/publicar   (cabecera x-token)
   Toma un archivo ya subido al Blob y lo lleva al repositorio de GitHub.
     - admin  → se guarda directo en main (Vercel publica en ~1 min)
     - alumna → se crea una rama y un pull request para que un admin apruebe
   Cuerpo:
     { pathname, tipo: "foto", nina: "ana"|"antonella"|"mariapaula", letra: "A" }
     { pathname, tipo: "video", categoria: "saludos", nombre: "Gracias", emoji?, tituloCategoria? }
*/
const lib = require("./_lib");
const { responder, cuerpo, slug } = lib;

const NINAS = { ana: "Ana Lucía", antonella: "Antonella", mariapaula: "María Paula" };
const ARCHIVO_LETRA = { "Ñ": "ENIE" };

module.exports = async (req, res) => {
  if (req.method !== "POST") return responder(res, 405, { error: "Método no permitido" });
  const rol = lib.rolDe(req);
  if (!rol) return responder(res, 401, { error: "Clave incorrecta" });

  const d = cuerpo(req);
  const autor = String(d.autor || (rol === "admin" ? "admin" : "alumna")).slice(0, 40);
  try {
    if (!d.pathname || !/^subidas\//.test(d.pathname)) throw new Error("Falta el archivo subido");
    const archivo = await lib.leerBlob(d.pathname);

    // --- qué archivo va a dónde ---
    let ruta, mensaje, descripcion;
    if (d.tipo === "foto") {
      if (!NINAS[d.nina]) throw new Error("Elige quién hace la seña");
      const letra = String(d.letra || "").toUpperCase();
      if (!/^[A-ZÑ]$/.test(letra)) throw new Error("Elige una letra");
      ruta = `img/avatares/${d.nina}/${ARCHIVO_LETRA[letra] || letra}.jpg`;
      descripcion = `Foto de ${NINAS[d.nina]} haciendo la ${letra}`;
      mensaje = `${descripcion} (subida por ${autor})`;
    } else if (d.tipo === "video") {
      const categoria = slug(d.categoria || "");
      const nombre = String(d.nombre || "").trim().slice(0, 40);
      if (!categoria || !nombre) throw new Error("Falta la categoría o el nombre");
      ruta = `video/${categoria}/${slug(nombre)}.mp4`;
      descripcion = `Video «${nombre}» en ${categoria}`;
      mensaje = `${descripcion} (subido por ${autor})`;
    } else {
      throw new Error("Tipo desconocido");
    }

    // --- rama de trabajo ---
    const shaMain = await lib.shaDeRama("main");
    let rama = "main";
    if (rol !== "admin") {
      rama = `subida/${slug(descripcion)}-${Date.now().toString(36)}`;
      await lib.crearRama(rama, shaMain);
    }

    await lib.escribirArchivo(ruta, archivo, mensaje, rama);

    // --- videos: registrar en datos/expresiones.json ---
    if (d.tipo === "video") {
      const actual = await lib.leerArchivo("datos/expresiones.json", rama);
      const json = actual ? JSON.parse(actual.contenido.toString("utf8")) : {};
      const categoria = slug(d.categoria);
      if (!json[categoria]) {
        json[categoria] = { titulo: String(d.tituloCategoria || d.categoria).trim().slice(0, 30), emoji: String(d.emoji || "🎬").slice(0, 4), items: [] };
      }
      const nombre = String(d.nombre).trim().slice(0, 40);
      const archivoVideo = `${slug(nombre)}.mp4`;
      const items = json[categoria].items;
      const existente = items.find(i => i.archivo === archivoVideo);
      if (existente) existente.nombre = nombre; else items.push({ nombre, archivo: archivoVideo });
      await lib.escribirArchivo("datos/expresiones.json", Buffer.from(JSON.stringify(json, null, 2) + "\n"), `Registra ${descripcion}`, rama);
    }

    // --- fotos de la Ñ: cuando las tres niñas la tengan, la app deja de mostrar solo la seña formal ---
    if (d.tipo === "foto" && String(d.letra).toUpperCase() === "Ñ") {
      const todas = await Promise.all(Object.keys(NINAS).map(n => lib.leerArchivo(`img/avatares/${n}/ENIE.jpg`, rama)));
      if (todas.every(Boolean)) {
        const datos = await lib.leerArchivo("js/datos.js", rama);
        const texto = datos.contenido.toString("utf8").replace(/const LETRAS_SIN_AVATAR = \[[^\]]*\];/, "const LETRAS_SIN_AVATAR = [];");
        await lib.escribirArchivo("js/datos.js", Buffer.from(texto), "Ya hay fotos de la Ñ para las tres avatares", rama);
      }
    }

    if (rol === "admin") return responder(res, 200, { estado: "publicado", ruta, mensaje: "¡Publicado! En un minuto se ve en la app." });

    // --- alumna: pull request para revisión ---
    const pr = await lib.gh(`/repos/${lib.REPO}/pulls`, {
      method: "POST",
      body: JSON.stringify({
        title: `Subida: ${descripcion}`,
        head: rama, base: "main",
        body: `Subido desde la zona de administración por **${autor}**.\n\nArchivo: \`${ruta}\`\n\nAl aprobar este PR se publica solo en la app.`,
      }),
    });
    await lib.gh(`/repos/${lib.REPO}/issues/${pr.number}/labels`, { method: "POST", body: JSON.stringify({ labels: ["subida"] }) }).catch(() => {});
    responder(res, 200, { estado: "pendiente", ruta, pr: pr.number, mensaje: "¡Enviado! Cuando un admin lo apruebe, aparece en la app." });
  } catch (e) {
    responder(res, 400, { error: e.message || "No se pudo publicar" });
  }
};
