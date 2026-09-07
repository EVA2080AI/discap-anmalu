/* =====================================================================
   DATOS DE LA APP · DISCAP ANMALU
   ---------------------------------------------------------------------
   Aquí está todo el contenido: avatares, letras y videos de expresiones.
   Para agregar una expresión nueva: entra a /admin y súbela desde el celular.
   (O a mano: video en video/<categoria>/ y una línea en datos/expresiones.json.)
   ===================================================================== */

// Avatares disponibles (las carpetas están en img/avatares/<id>/)
const AVATARES = {
  ana:        { nombre: "Ana Lucía",   carpeta: "ana" },
  antonella:  { nombre: "Antonella",   carpeta: "antonella" },
  mariapaula: { nombre: "María Paula", carpeta: "mariapaula" },
};

// Letras del abecedario LSC. Las fotos de las avatares NO incluyen la Ñ,
// por eso para la Ñ se muestra solo la seña formal.
const LETRAS = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
const LETRAS_SIN_AVATAR = ["Ñ"];

// Nombre de archivo de cada letra. La Ñ se guarda como ENIE.jpg porque los
// nombres con Ñ dan problemas entre Mac, Windows y el servidor.
const ARCHIVO_LETRA = { "Ñ": "ENIE" };
function archivoLetra(letra) {
  return ARCHIVO_LETRA[letra] || letra;
}

// Las expresiones en video viven en datos/expresiones.json (la app lo carga con fetch).
// Se editan desde la zona de administración (/admin) o a mano en ese archivo.
