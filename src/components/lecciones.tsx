"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Gamepad2, Eye, RotateCcw, ArrowRight, Trophy } from "lucide-react";
import { prefs } from "@/lib/preferencias";
import { sonidoAcierto, sonidoError, sonidoExito } from "@/lib/sonido";
import { cn } from "@/lib/utils";

type Item = { id: string; nombre: string; url: string; poster: string | null; color: string | null };
export type Leccion = { slug: string; titulo: string; emoji: string; items: Item[] };

function mezclar<T>(l: T[]) { return [...l].sort(() => Math.random() - 0.5); }

/** Lecciones: una por categoría. Ver → Practicar (¿qué seña es?) → Listo. Progreso en el dispositivo. */
export function Lecciones({ lecciones }: { lecciones: Leccion[] }) {
  const [completadas, setCompletadas] = useState<Record<string, string>>({});
  const [abierta, setAbierta] = useState<Leccion | null>(null);

  useEffect(() => { const t = setTimeout(() => setCompletadas(prefs.lecciones()), 0); return () => clearTimeout(t); }, []);

  if (abierta) {
    return <LeccionAbierta leccion={abierta} onSalir={() => setAbierta(null)} onCompletar={() => { prefs.completarLeccion(abierta.slug); setCompletadas(prefs.lecciones()); }} completada={!!completadas[abierta.slug]} />;
  }

  const hechas = lecciones.filter(l => completadas[l.slug]).length;
  return (
    <div className="aparecer">
      <h1 className="text-3xl font-extrabold text-navy">Aprender</h1>
      <p className="mt-1 text-mist">Una lección por tema: primero ves las señas, luego practicas y queda marcada. {hechas > 0 && <b className="text-ink">Llevas {hechas} de {lecciones.length}.</b>}</p>

      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-lime transition-[width]" style={{ width: `${lecciones.length ? (hechas / lecciones.length) * 100 : 0}%` }} /></div>

      <ol className="mt-5 grid gap-3 md:grid-cols-2">
        {lecciones.map((l, i) => {
          const hecha = !!completadas[l.slug];
          return (
            <li key={l.slug}>
              <button type="button" onClick={() => setAbierta(l)} className={cn("tarjeta flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-lime-soft", hecha && "border-[3px] border-lime")}>
                <span className="text-3xl" aria-hidden="true">{l.emoji}</span>
                <span className="flex-1">
                  <b className="font-display text-lg text-navy-deep">Lección {i + 1}: {l.titulo}</b>
                  <span className="block text-sm text-mist">{l.items.length} señas</span>
                </span>
                {hecha ? <CheckCircle2 className="size-7 text-lime" aria-label="Completada" /> : <Circle className="size-7 text-line" aria-hidden="true" />}
              </button>
            </li>
          );
        })}
      </ol>

      <Link href="/practicar" className="tarjeta mt-4 flex items-center gap-3 p-4 hover:bg-sun-soft">
        <span className="grid size-11 place-items-center rounded-xl bg-sun-soft text-navy"><Gamepad2 className="size-6" aria-hidden="true" /></span>
        <span className="flex-1"><b className="font-display text-lg text-navy-deep">Practicar el abecedario</b><span className="block text-sm text-mist">Adivina la letra. Repasa primero las que fallaste.</span></span>
        <ArrowRight className="size-5 text-mist" aria-hidden="true" />
      </Link>
    </div>
  );
}

function LeccionAbierta({ leccion, onSalir, onCompletar, completada }: { leccion: Leccion; onSalir: () => void; onCompletar: () => void; completada: boolean }) {
  const [fase, setFase] = useState<"ver" | "practicar" | "listo">("ver");
  const [visto, setVisto] = useState<Item | null>(leccion.items[0] ?? null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => { const v = video.current; if (v && visto) { v.load(); v.play().catch(() => {}); } }, [visto]);

  return (
    <div className="aparecer">
      <button type="button" onClick={onSalir} className="mb-3 text-sm font-extrabold text-navy">← Todas las lecciones</button>
      <h1 className="text-2xl font-extrabold text-navy">{leccion.emoji} {leccion.titulo}</h1>

      <div className="mt-3 flex gap-2" role="tablist">
        {(["ver", "practicar", "listo"] as const).map((f, i) => (
          <button key={f} type="button" role="tab" aria-selected={fase === f} onClick={() => f !== "listo" && setFase(f)} className={cn("ficha flex-row px-4 text-sm", fase === f && "activo")}>
            <span className="grid size-6 place-items-center rounded-full bg-sun-soft font-display text-navy">{i + 1}</span>
            {f === "ver" ? "Ver" : f === "practicar" ? "Practicar" : "Listo"}
          </button>
        ))}
      </div>

      {fase === "ver" && (
        <div className="mt-4 md:grid md:grid-cols-[minmax(240px,300px)_1fr] md:gap-5">
          {visto && (
            <div className="tarjeta mb-4 overflow-hidden bg-black md:sticky md:top-20">
              <video ref={video} playsInline muted controls loop preload="metadata" poster={visto.poster ?? undefined} className="mx-auto block max-h-[50vh] w-full bg-black"><source src={visto.url} type="video/mp4" /></video>
              <div className="bg-navy px-4 py-2 font-display text-lg text-white">{visto.nombre}</div>
              <p className="bg-navy-deep px-4 py-2 text-xs text-white/80">Mira la cara, no solo las manos: en LSC la expresión es parte de la seña.</p>
            </div>
          )}
          <div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {leccion.items.map(it => (
                <button key={it.id} type="button" onClick={() => setVisto(it)} className={cn("ficha flex-row justify-start gap-2 px-3 text-left", visto?.id === it.id && "border-navy")}>
                  {it.color ? <span className="size-5 shrink-0 rounded-full border-2 border-line" style={{ background: it.color }} /> : <Eye className="size-4 text-mist" aria-hidden="true" />}
                  {it.nombre}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setFase("practicar")} className="btn-principal mt-4 w-full">Ya las vi, ¡a practicar! <ArrowRight className="size-5" aria-hidden="true" /></button>
          </div>
        </div>
      )}

      {fase === "practicar" && <Quiz items={leccion.items} onTerminar={() => { onCompletar(); setFase("listo"); }} />}

      {fase === "listo" && (
        <div className="tarjeta mt-4 p-6 text-center">
          <Trophy className="mx-auto size-14 text-sun" aria-hidden="true" />
          <p className="mt-2 font-display text-2xl text-navy-deep">¡Lección completada!</p>
          <p className="text-mist">{completada ? "Ya la tienes marcada. Repasar nunca sobra." : "Quedó marcada en este celular."}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => setFase("practicar")} className="flex min-h-11 items-center gap-1.5 rounded-full bg-white px-4 font-extrabold text-navy shadow-soft"><RotateCcw className="size-4" aria-hidden="true" /> Repasar</button>
            <button type="button" onClick={onSalir} className="btn-principal px-5 py-3 text-base">Siguiente lección</button>
          </div>
        </div>
      )}
    </div>
  );
}

/** ¿Qué seña es? Se muestra el video y se elige el nombre entre cuatro. Hay que acertar todas una vez. */
function Quiz({ items, onTerminar }: { items: Item[]; onTerminar: () => void }) {
  const [pendientes, setPendientes] = useState<Item[]>(() => mezclar(items));
  const [elegida, setElegida] = useState<string | null>(null);
  const [aciertos, setAciertos] = useState(0);
  const video = useRef<HTMLVideoElement>(null);
  const actual = pendientes[0];

  const opciones = useMemo(() => {
    if (!actual) return [];
    const otras = mezclar(items.filter(i => i.id !== actual.id)).slice(0, 3);
    return mezclar([actual, ...otras]);
  }, [actual, items]);

  useEffect(() => { const v = video.current; if (v && actual) { v.load(); v.play().catch(() => {}); } }, [actual]);

  if (!actual) return null;
  const responder = (it: Item) => {
    if (elegida) return;
    setElegida(it.id);
    if (it.id === actual.id) {
      sonidoAcierto(); setAciertos(a => a + 1); prefs.sumarPalabra();
      setTimeout(() => {
        setElegida(null);
        const resto = pendientes.slice(1);
        if (resto.length === 0) { sonidoExito(); onTerminar(); } else setPendientes(resto);
      }, 800);
    } else {
      sonidoError();
      setTimeout(() => { setElegida(null); setPendientes(p => [...p.slice(1), p[0]]); }, 1300); // vuelve al final para repasar
    }
  };

  return (
    <div className="mt-4 md:grid md:grid-cols-[minmax(240px,300px)_1fr] md:gap-5">
      <div className="tarjeta mb-4 overflow-hidden bg-black md:sticky md:top-20">
        <video ref={video} playsInline muted loop autoPlay preload="auto" poster={actual.poster ?? undefined} className="mx-auto block max-h-[45vh] w-full bg-black"><source src={actual.url} type="video/mp4" /></video>
        <div className="bg-navy px-4 py-2 font-display text-lg text-white">¿Qué seña es?</div>
      </div>
      <div>
        <p className="mb-2 text-sm font-bold text-mist">{aciertos} de {items.length} · quedan {pendientes.length}</p>
        <div className="grid grid-cols-2 gap-3" role="group" aria-label="Opciones">
          {opciones.map(o => {
            const estado = !elegida ? "" : o.id === actual.id ? "bg-lime text-white border-lime" : o.id === elegida ? "bg-coral text-white border-coral animate-[sacudir_.4s]" : "opacity-50";
            return <button key={o.id} type="button" disabled={!!elegida} onClick={() => responder(o)} className={cn("ficha min-h-16 font-display text-xl", estado)}>{o.nombre}</button>;
          })}
        </div>
      </div>
    </div>
  );
}
