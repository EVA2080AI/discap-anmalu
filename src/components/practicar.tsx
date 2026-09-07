"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Trophy, Flame, RotateCcw, ArrowRight } from "lucide-react";
import { AVATARES, AVATAR_IDS, LETRAS, fotoOriginal, senaFormal, type AvatarId } from "@/lib/datos";
import { prefs } from "@/lib/preferencias";
import { sonidoAcierto, sonidoError, sonidoExito } from "@/lib/sonido";
import { cn } from "@/lib/utils";

type Reto = { letra: string; avatar: AvatarId; opciones: string[] };

function azar<T>(lista: readonly T[]) { return lista[Math.floor(Math.random() * lista.length)]; }

function nuevoReto(fotoDe: (a: AvatarId, l: string) => string | null, evitar?: string): Reto {
  // Repaso primero: la mitad de las veces sale una letra que se falló antes (si hay).
  const falladas = Object.keys(prefs.fallos()).filter(l => l !== evitar);
  let letra = falladas.length && Math.random() < 0.5 ? azar(falladas) : azar(LETRAS), avatar = azar(AVATAR_IDS), intentos = 0;
  while ((letra === evitar || !fotoDe(avatar, letra)) && intentos++ < 30) { letra = azar(LETRAS); avatar = azar(AVATAR_IDS); }
  const otras = LETRAS.filter(l => l !== letra).sort(() => Math.random() - 0.5).slice(0, 3);
  return { letra, avatar, opciones: [...otras, letra].sort(() => Math.random() - 0.5) };
}

/** Juego: aparece una seña sin la letra; hay que adivinarla entre cuatro. */
export function Practicar({ fotosExtra }: { fotosExtra: Record<string, string> }) {
  const fotoDe = useCallback((a: AvatarId, l: string) => fotosExtra[`${a}/${l}`] ?? fotoOriginal(a, l), [fotosExtra]);
  const [reto, setReto] = useState<Reto | null>(null);
  const [elegida, setElegida] = useState<string | null>(null);
  const [aciertos, setAciertos] = useState(0);
  const [intentos, setIntentos] = useState(0);
  const [racha, setRacha] = useState(0);
  const [mejor, setMejor] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => { setMejor(prefs.mejorRacha()); setReto(nuevoReto(fotoDe)); }, 0);
    return () => clearTimeout(t);
  }, [fotoDe]);

  const siguiente = useCallback(() => { setElegida(null); setReto(r => nuevoReto(fotoDe, r?.letra)); }, [fotoDe]);

  const responder = (l: string) => {
    if (!reto || elegida) return;
    setElegida(l);
    setIntentos(n => n + 1);
    if (l === reto.letra) {
      const nueva = racha + 1;
      setAciertos(n => n + 1); setRacha(nueva); prefs.registrarAcierto(reto.letra);
      if (nueva > mejor) { setMejor(nueva); prefs.setMejorRacha(nueva); }
      if (nueva % 5 === 0) sonidoExito(); else sonidoAcierto();
      setTimeout(siguiente, 900);
    } else {
      setRacha(0); prefs.registrarFallo(reto.letra);
      sonidoError();
    }
  };

  const foto = useMemo(() => (reto ? fotoDe(reto.avatar, reto.letra) : null), [reto, fotoDe]);
  const fallo = !!elegida && elegida !== reto?.letra;

  return (
    <div className="aparecer md:grid md:grid-cols-[1fr_minmax(300px,380px)] md:items-start md:gap-8">
      <div className="mb-3 md:order-last md:sticky md:top-20 md:mb-0">
        <div className="tarjeta relative mx-auto aspect-[3/4] max-h-[34vh] w-full overflow-hidden md:max-h-[55vh]">
          {foto && reto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={foto} src={foto} alt="Seña para adivinar" className="size-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-mist">Cargando…</div>
          )}
          {reto && <span className="absolute bottom-3 left-3 rounded-full bg-navy/85 px-3 py-1.5 text-sm font-bold text-white">{AVATARES[reto.avatar].nombre}</span>}
          <span className="absolute right-3 top-3 grid size-12 place-items-center rounded-full bg-sun font-display text-3xl font-extrabold text-navy-deep shadow-lift" aria-hidden="true">?</span>
        </div>
      </div>
      <div>
        <h1 className="mb-1 text-3xl font-extrabold text-navy">Practicar</h1>
        <p className="mb-2 text-sm text-mist md:mb-4 md:text-base">Mira la seña y toca la letra correcta. Las letras que falles vuelven a salir hasta que las domines.</p>

        <div className="mb-3 grid grid-cols-3 gap-2 text-center md:mb-5">
          <div className="tarjeta p-2 sm:p-3"><b className="block font-display text-xl text-navy sm:text-2xl">{aciertos}<span className="text-sm text-mist">/{intentos}</span></b><span className="text-xs font-bold text-mist">aciertos</span></div>
          <div className={cn("tarjeta p-2 sm:p-3", racha >= 3 && "bg-sun-soft")}><b className="flex items-center justify-center gap-1 font-display text-xl text-navy sm:text-2xl"><Flame className={cn("size-5", racha >= 3 ? "text-coral" : "text-mist")} aria-hidden="true" />{racha}</b><span className="text-xs font-bold text-mist">racha</span></div>
          <div className="tarjeta p-2 sm:p-3"><b className="flex items-center justify-center gap-1 font-display text-xl text-navy sm:text-2xl"><Trophy className="size-5 text-sun" aria-hidden="true" />{mejor}</b><span className="text-xs font-bold text-mist">mejor racha</span></div>
        </div>

        {reto && (
          <div className="grid grid-cols-2 gap-3" role="group" aria-label="Opciones">
            {reto.opciones.map(l => {
              const correcta = l === reto.letra;
              const estado = !elegida ? "" : correcta ? "bg-lime text-white border-lime" : l === elegida ? "bg-coral text-white border-coral animate-[sacudir_.4s]" : "opacity-50";
              return (
                <button key={l} type="button" disabled={!!elegida} onClick={() => responder(l)} className={cn("ficha h-20 font-display text-4xl", estado)} aria-label={`Letra ${l}`}>
                  {l}
                </button>
              );
            })}
          </div>
        )}

        {fallo && reto && (
          <div className="tarjeta mt-4 flex items-center gap-3 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={senaFormal(reto.letra)} alt={`Seña formal de la letra ${reto.letra}`} className="h-24 w-18 rounded-xl object-cover" />
            <p className="flex-1 text-sm">Era la <b className="font-display text-2xl text-navy">{reto.letra}</b>. Mira la seña formal y sigue.</p>
            <button type="button" onClick={siguiente} className="btn-principal px-4 py-3 text-base">Siguiente <ArrowRight className="size-5" aria-hidden="true" /></button>
          </div>
        )}

        <button type="button" onClick={() => { setAciertos(0); setIntentos(0); setRacha(0); siguiente(); }} className="mt-5 flex min-h-11 items-center gap-1.5 text-sm font-extrabold text-mist">
          <RotateCcw className="size-4" aria-hidden="true" /> Empezar de nuevo
        </button>
      </div>

    </div>
  );
}
