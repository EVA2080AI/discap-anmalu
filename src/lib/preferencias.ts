"use client";

/* Preferencias que viven solo en el dispositivo (localStorage):
   favoritos, silencio, mis ideas, racha y fallos de práctica, lecciones, accesibilidad,
   aviso de instalación, modo feria.
   Todo con try/catch: en modo privado o sin permiso, la app sigue funcionando. */

function leer<T>(clave: string, porDefecto: T): T {
  try {
    const v = localStorage.getItem(clave);
    return v === null ? porDefecto : (JSON.parse(v) as T);
  } catch {
    return porDefecto;
  }
}

function guardar(clave: string, valor: unknown) {
  try { localStorage.setItem(clave, JSON.stringify(valor)); } catch {}
}

export type Accesibilidad = { contraste: boolean; textoGrande: boolean; sinAnimaciones: boolean };

export const prefs = {
  favoritos: () => leer<string[]>("favoritos", []),
  alternarFavorito(id: string) {
    const lista = prefs.favoritos();
    const nueva = lista.includes(id) ? lista.filter(x => x !== id) : [...lista, id];
    guardar("favoritos", nueva);
    return nueva;
  },

  silencio: () => leer<boolean>("silencio", false),
  setSilencio: (v: boolean) => guardar("silencio", v),

  misIdeas: () => leer<string[]>("misIdeas", []),
  agregarIdea(id: string) { guardar("misIdeas", [...prefs.misIdeas(), id]); },

  // Practicar: mejor racha y letras falladas (repaso primero)
  mejorRacha: () => leer<number>("mejorRacha", 0),
  setMejorRacha: (v: number) => guardar("mejorRacha", v),
  fallos: () => leer<Record<string, number>>("fallosLetras", {}),
  registrarFallo(letra: string) { const f = prefs.fallos(); f[letra] = (f[letra] ?? 0) + 2; guardar("fallosLetras", f); },
  registrarAcierto(letra: string) { const f = prefs.fallos(); if (f[letra]) { f[letra] -= 1; if (f[letra] <= 0) delete f[letra]; guardar("fallosLetras", f); } },

  // Lecciones completadas (slug de categoría → fecha)
  lecciones: () => leer<Record<string, string>>("lecciones", {}),
  completarLeccion(slug: string) { guardar("lecciones", { ...prefs.lecciones(), [slug]: new Date().toISOString() }); },
  palabrasPracticadas: () => leer<number>("palabrasPracticadas", 0),
  sumarPalabra() { guardar("palabrasPracticadas", prefs.palabrasPracticadas() + 1); },

  // Accesibilidad (se aplica como atributos en <html>; ver aplicarAccesibilidad)
  accesibilidad: () => leer<Accesibilidad>("accesibilidad", { contraste: false, textoGrande: false, sinAnimaciones: false }),
  setAccesibilidad(a: Accesibilidad) { guardar("accesibilidad", a); aplicarAccesibilidad(a); },

  avisoInstalarVisto: () => leer<boolean>("avisoInstalarVisto", false),
  setAvisoInstalarVisto: () => guardar("avisoInstalarVisto", true),

  modoFeria: () => { try { return sessionStorage.getItem("modoFeria") === "1"; } catch { return false; } },
  setModoFeria: (v: boolean) => { try { v ? sessionStorage.setItem("modoFeria", "1") : sessionStorage.removeItem("modoFeria"); } catch {} },
};

export function aplicarAccesibilidad(a: Accesibilidad) {
  const h = document.documentElement;
  h.toggleAttribute("data-contraste", a.contraste);
  h.toggleAttribute("data-texto-grande", a.textoGrande);
  h.toggleAttribute("data-sin-animaciones", a.sinAnimaciones);
}

/** Se inyecta en <head> para aplicar la accesibilidad antes de pintar (sin parpadeo). */
export const SCRIPT_ACCESIBILIDAD = `try{var a=JSON.parse(localStorage.getItem("accesibilidad")||"{}");var h=document.documentElement;if(a.contraste)h.setAttribute("data-contraste","");if(a.textoGrande)h.setAttribute("data-texto-grande","");if(a.sinAnimaciones)h.setAttribute("data-sin-animaciones","");}catch(e){}`;
