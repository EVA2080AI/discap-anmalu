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

/* =====================================================================
   LA HISTORIA DEL PROYECTO (para /proyecto)
   Contenido tomado del sitio de presentación del proyecto (Canva) que
   Ana Lucía, Antonella y María Paula prepararon para la feria escolar.
   Editar aquí para actualizar la landing sin tocar componentes.
   ===================================================================== */

export const CREADORAS = [
  { nombre: "Ana Lucía", apellidos: "Gamba Alarcón", avatar: "ana" as const },
  { nombre: "Antonella", apellidos: "Rueda Ayala", avatar: "antonella" as const },
  { nombre: "María Paula", apellidos: "Serrano Alfonso", avatar: "mariapaula" as const },
];

export const COLEGIO = "Gimnasio Superior Empresarial Bilingüe";

export const PROBLEMA =
  "Las personas con discapacidades auditivas, especialmente los niños, no se pueden comunicar, o no pueden interactuar fácilmente con los demás.";

export const OBJETIVO_GENERAL =
  "Desarrollar productos o aplicaciones que faciliten la inclusión de las personas con discapacidades en los diferentes entornos, como los salones de clases.";

export const OBJETIVOS_ESPECIFICOS = [
  "Promover el aprendizaje del lenguaje de señas en los niños.",
  "Facilitar el desplazamiento autónomo para personas con discapacidad visual.",
  "Reconocer la importancia de promover la inclusión en los niños y en los jóvenes.",
];

export const MARCO_TEORICO = [
  { autor: "Jan Van Dijk", idea: "Teoría de la comunicación basada en el tacto: DISCAP ANMALU busca crear soluciones que hagan del mundo un lugar menos impredecible para las personas que no ven ni oyen." },
  { autor: "Vic Finkelstein y Mike Oliver", idea: "Modelo social de la discapacidad: el proyecto busca eliminar barreras sociales y ambientales, no «arreglar» a la persona." },
];

export const METODOLOGIA = {
  tipo: "Cualitativa",
  tipoDetalle: "porque el objetivo es comprender la experiencia de vida, la comunicación y la interacción con el entorno.",
  alcance: "Descriptivo-exploratorio",
  alcanceDetalle: "se busca describir cómo la persona percibe su entorno y explorar nuevas formas de cerrar la brecha de comunicación con las personas cercanas.",
};

export type HitoHistoria = { anio: string; titulo: string; items: string[] };
export const HISTORIA: HitoHistoria[] = [
  {
    anio: "2025",
    titulo: "La idea y los primeros prototipos",
    items: [
      "Propuesta: una aplicación que enseñe lengua de señas de forma fácil y divertida, y un bastón de mano con sensor de proximidad para la movilidad autónoma.",
      "Primeros prototipos: la aplicación para aprender lengua de señas y el bastón con sensor.",
      "Imagen corporativa: primer boceto, primer empaque y el manejo de la imagen dentro de la app.",
      "Por invitación del colegio, participaron en una feria de niños investigadores y lograron 96 puntos.",
      "Presentaron el proyecto en Inspírate 2025, la feria de emprendimiento del colegio.",
    ],
  },
  {
    anio: "2026",
    titulo: "La app se vuelve web y crece",
    items: [
      "Mejoraron la aplicación: ahora es una app web completa en discap-anmalu.vercel.app.",
      "Se puede traducir palabras, consultar expresiones, aprender con lecciones y sugerir mejoras.",
      "Mantienen el bastón de mano con sensor de proximidad como su segundo prototipo.",
      "Presentaron los avances en Inspírate 2026.",
    ],
  },
];

export const LOGRO_DESTACADO = { puntos: 96, contexto: "Feria de niños investigadores, por invitación del colegio" };

export const BASTON = {
  titulo: "Bastón de mano con sensor de proximidad",
  texto: "El segundo prototipo de DISCAP ANMALU: un bastón pensado para facilitar el desplazamiento autónomo de personas con discapacidad visual, detectando obstáculos antes de que la persona los toque. Es un desarrollo físico, aparte de esta app.",
};
