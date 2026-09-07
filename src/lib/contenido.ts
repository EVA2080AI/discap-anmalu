/* Textos y datos que el equipo edita a mano: versión, novedades, quién revisó las
   señas y las fuentes. Sin base de datos: cambiar aquí y publicar. */

export const VERSION = "2.1";

export const NOVEDADES: { version: string; fecha: string; cambios: string[] }[] = [
  {
    version: "2.1",
    fecha: "7 de septiembre de 2026",
    cambios: [
      "Lecciones por categoría con práctica y repaso.",
      "Practicar repasa primero las letras que fallaste.",
      "Tarjeta con tu nombre en señas para compartir o imprimir.",
      "Ajustes de accesibilidad: alto contraste, texto grande, sin animaciones.",
      "Modo docente: proyectar, retos y tarjetas del abecedario para imprimir.",
      "Política de privacidad y formato de autorización de imagen.",
      "Diccionario A–Z en Expresiones.",
    ],
  },
  {
    version: "2.0",
    fecha: "7 de septiembre de 2026",
    cambios: [
      "Nueva base: Next.js, base de datos y zona de subidas para las alumnas.",
      "Traductor por palabras: si una seña existe en Expresiones, muestra el video.",
      "Modo Feria con QR, Practicar, favoritos, cámara lenta, espejo y bucle.",
      "Buzón de ideas para el público.",
    ],
  },
  {
    version: "1.0",
    fecha: "7 de septiembre de 2026",
    cambios: ["Primera versión: traductor letra por letra y expresiones en video."],
  },
];

/** Quién revisó las señas. Vacío = todavía sin revisión certificada (la app lo dice con honestidad). */
export const REVISION = {
  nombre: "",           // ej. "Nombre Apellido, intérprete de LSC"
  entidad: "",          // ej. "Asociación de Sordos de Santander"
  fecha: "",            // ej. "septiembre de 2026"
};

export const FUENTES = [
  { nombre: "INSOR · Instituto Nacional para Sordos", url: "https://www.insor.gov.co", que: "Entidad oficial de Colombia. Diccionario básico de LSC y orientaciones pedagógicas." },
  { nombre: "FENASCOL · Federación Nacional de Sordos de Colombia", url: "https://fenascol.org.co", que: "Comunidad sorda organizada. Cursos y material de LSC." },
  { nombre: "Inclusión al día", url: "", que: "Material de las señas formales del abecedario usadas en la app." },
];

/** Frases que una persona sorda necesita primero de un oyente. Se graban desde la zona de subidas en la categoría «Frases útiles». */
export const FRASES_PENDIENTES = ["Necesito ayuda", "No entiendo", "¿Dónde está el baño?", "Gracias", "Por favor", "Lo siento", "¿Cómo te llamas?", "Me llamo…", "¿Puedes repetir?", "Escríbelo, por favor"];
