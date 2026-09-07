"use client";

import { useEffect, useRef, useState } from "react";
import { Settings2, X } from "lucide-react";
import { prefs, type Accesibilidad } from "@/lib/preferencias";
import { cn } from "@/lib/utils";

/** Botón de ajustes en la cabecera: accesibilidad y sonido. Se guarda en el dispositivo. */
export function Ajustes() {
  const [abierto, setAbierto] = useState(false);
  const [a, setA] = useState<Accesibilidad>({ contraste: false, textoGrande: false, sinAnimaciones: false });
  const [silencio, setSilencio] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => { setA(prefs.accesibilidad()); setSilencio(prefs.silencio()); }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!abierto) return;
    const cerrar = (e: MouseEvent) => { if (!panel.current?.contains(e.target as Node)) setAbierto(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setAbierto(false); };
    document.addEventListener("mousedown", cerrar); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", cerrar); document.removeEventListener("keydown", esc); };
  }, [abierto]);

  const cambiar = (clave: keyof Accesibilidad) => { const n = { ...a, [clave]: !a[clave] }; setA(n); prefs.setAccesibilidad(n); };

  return (
    <div ref={panel} className="relative">
      <button type="button" onClick={() => setAbierto(o => !o)} aria-expanded={abierto} aria-label="Ajustes de accesibilidad y sonido" className="grid size-11 place-items-center rounded-full bg-white/15 text-white">
        <Settings2 className="size-5" />
      </button>
      {abierto && (
        <div role="dialog" aria-label="Ajustes" className="absolute right-0 top-12 z-30 w-72 rounded-2xl bg-white p-4 text-ink shadow-lift">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-display text-lg text-navy">Ajustes</p>
            <button type="button" onClick={() => setAbierto(false)} aria-label="Cerrar" className="grid size-9 place-items-center rounded-full text-mist"><X className="size-4" /></button>
          </div>
          <Interruptor texto="Alto contraste" activo={a.contraste} onChange={() => cambiar("contraste")} />
          <Interruptor texto="Texto grande" activo={a.textoGrande} onChange={() => cambiar("textoGrande")} />
          <Interruptor texto="Sin animaciones" activo={a.sinAnimaciones} onChange={() => cambiar("sinAnimaciones")} />
          <Interruptor texto="Sonidos" activo={!silencio} onChange={() => { const v = !silencio; setSilencio(v); prefs.setSilencio(v); }} />
          <p className="mt-2 text-xs text-mist">Se guarda en este dispositivo.</p>
        </div>
      )}
    </div>
  );
}

function Interruptor({ texto, activo, onChange }: { texto: string; activo: boolean; onChange: () => void }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 font-bold">
      {texto}
      <button type="button" role="switch" aria-checked={activo} onClick={onChange} className={cn("relative h-7 w-12 rounded-full transition-colors", activo ? "bg-lime" : "bg-line")}>
        <span className={cn("absolute top-0.5 size-6 rounded-full bg-white shadow transition-transform", activo ? "left-0.5 translate-x-5" : "left-0.5")} />
      </button>
    </label>
  );
}
