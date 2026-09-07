"use client";

/* Preferencias que viven solo en el dispositivo (localStorage):
   favoritos, silencio, mis ideas, racha de práctica, aviso de instalación, modo feria.
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

  mejorRacha: () => leer<number>("mejorRacha", 0),
  setMejorRacha: (v: number) => guardar("mejorRacha", v),

  avisoInstalarVisto: () => leer<boolean>("avisoInstalarVisto", false),
  setAvisoInstalarVisto: () => guardar("avisoInstalarVisto", true),

  modoFeria: () => { try { return sessionStorage.getItem("modoFeria") === "1"; } catch { return false; } },
  setModoFeria: (v: boolean) => { try { v ? sessionStorage.setItem("modoFeria", "1") : sessionStorage.removeItem("modoFeria"); } catch {} },
};
