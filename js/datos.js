/* =====================================================================
   DATOS DE LA APP · DISCAP ANMALU
   ---------------------------------------------------------------------
   Aquí está todo el contenido: avatares, letras y videos de expresiones.
   Para agregar una expresión nueva solo hay que:
     1. Poner el video en  video/<categoria>/<nombre>.mp4
     2. Agregar una línea en EXPRESIONES con su nombre y archivo.
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

// Expresiones en video (los archivos están en video/<categoria>/)
const EXPRESIONES = {
  saludos: {
    titulo: "Saludos",
    emoji: "👋",
    items: [
      { nombre: "Hola",           archivo: "hola.mp4" },
      { nombre: "Saludos",        archivo: "saludos.mp4" },
      { nombre: "Buenos días",    archivo: "buenos-dias.mp4" },
      { nombre: "Buenas tardes",  archivo: "buenas-tardes.mp4" },
      { nombre: "Buenas noches",  archivo: "buenas-noches.mp4" },
      { nombre: "Feliz día",      archivo: "feliz-dia.mp4" },
      { nombre: "Adiós",          archivo: "adios.mp4" },
    ],
  },
  familia: {
    titulo: "Familia",
    emoji: "👨‍👩‍👧",
    items: [
      { nombre: "Mamá",  archivo: "mama.mp4" },
      { nombre: "Papá",  archivo: "papa.mp4" },
      { nombre: "Hija",  archivo: "hija.mp4" },
      { nombre: "Hijo",  archivo: "hijo.mp4" },
      { nombre: "Amigo", archivo: "amigo.mp4" },
    ],
  },
  colores: {
    titulo: "Colores",
    emoji: "🎨",
    items: [
      { nombre: "Rojo",         archivo: "rojo.mp4",         color: "#e2231a" },
      { nombre: "Azul",         archivo: "azul.mp4",         color: "#1c3f8f" },
      { nombre: "Amarillo",     archivo: "amarillo.mp4",     color: "#f5c400" },
      { nombre: "Verde",        archivo: "verde.mp4",        color: "#3aa655" },
      { nombre: "Naranja",      archivo: "naranja.mp4",      color: "#f47b20" },
      { nombre: "Morado",       archivo: "morado.mp4",       color: "#7b3fa0" },
      { nombre: "Rosado",       archivo: "rosado.mp4",       color: "#f08cc0" },
      { nombre: "Café",         archivo: "cafe.mp4",         color: "#7a4a2a" },
      { nombre: "Negro",        archivo: "negro.mp4",        color: "#222222" },
      { nombre: "Blanco",       archivo: "blanco.mp4",       color: "#ffffff" },
      { nombre: "Oscuro",       archivo: "oscuro.mp4",       color: "#3b3b4f" },
      { nombre: "Transparente", archivo: "transparente.mp4", color: "transparent" },
    ],
  },
};
