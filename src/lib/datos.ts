/* Datos fijos de la app: avatares, letras y utilidades de texto.
   (Sirven tanto en el servidor como en el navegador.) */

export const AVATARES = {
  ana: { nombre: "Ana Lucía", carpeta: "ana" },
  antonella: { nombre: "Antonella", carpeta: "antonella" },
  mariapaula: { nombre: "María Paula", carpeta: "mariapaula" },
} as const;

export type AvatarId = keyof typeof AVATARES;
export const AVATAR_IDS = Object.keys(AVATARES) as AvatarId[];

export const LETRAS = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

/** La Ñ se guarda como ENIE.jpg: los nombres con Ñ fallan entre Mac, Windows y el servidor. */
export function archivoLetra(letra: string) {
  return letra === "Ñ" ? "ENIE" : letra;
}

/** Foto original de una letra (las que vinieron del Drive). La Ñ no tiene foto original. */
export function fotoOriginal(avatar: AvatarId, letra: string): string | null {
  if (letra === "Ñ") return null;
  return `/img/avatares/${AVATARES[avatar].carpeta}/${archivoLetra(letra)}.jpg`;
}

export function senaFormal(letra: string) {
  return `/img/senas/${archivoLetra(letra)}.jpg`;
}

/** Quita tildes y deja solo letras del abecedario LSC y espacios. */
export function normalizar(texto: string) {
  return texto
    .toUpperCase()
    .replace(/\u00d1/g, "\u0001") // proteger la Ñ (en NFD también se descompone)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar tildes: á→A, ü→U
    .replace(/\u0001/g, "\u00d1")
    .replace(/[^A-Z\u00d1 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** "Buenos días" → "buenos-dias" */
export function slug(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export const TIPOS_IDEA = {
  idea: { emoji: "💡", texto: "Tengo una idea" },
  error: { emoji: "🐞", texto: "Algo no funciona" },
  gusto: { emoji: "⭐", texto: "Me gustó" },
} as const;
export type TipoIdea = keyof typeof TIPOS_IDEA;

export const ESTADOS_IDEA = {
  nueva: "🌱 Nueva",
  "en-proceso": "🛠️ En proceso",
  lista: "✅ ¡Lista!",
} as const;
export type EstadoIdea = keyof typeof ESTADOS_IDEA;
