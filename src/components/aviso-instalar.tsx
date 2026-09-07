"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { prefs } from "@/lib/preferencias";

type EventoInstalar = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

/** Cartel de una sola vez: "Agrégame a tu pantalla de inicio", con el paso exacto por sistema. */
export function AvisoInstalar() {
  const [visible, setVisible] = useState(false);
  const [evento, setEvento] = useState<EventoInstalar | null>(null);
  const [esIOS, setEsIOS] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone;
    if (standalone || prefs.avisoInstalarVisto()) return;
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const alPrompt = (e: Event) => { e.preventDefault(); setEvento(e as EventoInstalar); };
    window.addEventListener("beforeinstallprompt", alPrompt);
    // aparece tras 25 s de uso, no al abrir
    const t = setTimeout(() => { setEsIOS(ios); setVisible(true); }, 25_000);
    return () => { clearTimeout(t); window.removeEventListener("beforeinstallprompt", alPrompt); };
  }, []);

  if (!visible) return null;
  const cerrar = () => { prefs.setAvisoInstalarVisto(); setVisible(false); };
  const instalar = async () => { if (evento) { await evento.prompt(); await evento.userChoice.catch(() => null); } cerrar(); };

  return (
    <div role="dialog" aria-label="Instalar la app" className="fixed inset-x-3 bottom-20 z-30 mx-auto max-w-md rounded-2xl bg-navy-deep p-4 text-white shadow-lift md:bottom-6">
      <button type="button" onClick={cerrar} aria-label="Cerrar" className="absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-white/10"><X className="size-4" /></button>
      <p className="pr-8 font-display text-lg">🤟 Llévame en tu celular</p>
      {evento ? (
        <>
          <p className="mt-1 text-sm text-white/85">Abre a pantalla completa y el traductor funciona sin internet.</p>
          <button type="button" onClick={instalar} className="mt-3 flex min-h-11 items-center gap-2 rounded-xl bg-sun px-4 font-extrabold text-navy-deep"><Download className="size-5" aria-hidden="true" /> Instalar</button>
        </>
      ) : esIOS ? (
        <p className="mt-1 text-sm text-white/85">En Safari toca <b>compartir</b> (el cuadrito con la flecha) y luego <b>Agregar a inicio</b>.</p>
      ) : (
        <p className="mt-1 text-sm text-white/85">En el menú del navegador toca <b>Instalar app</b> o <b>Agregar a pantalla de inicio</b>.</p>
      )}
    </div>
  );
}
