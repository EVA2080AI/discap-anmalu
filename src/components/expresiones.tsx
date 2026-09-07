"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Star, Repeat, Turtle } from "lucide-react";
import { normalizar } from "@/lib/datos";
import { prefs } from "@/lib/preferencias";
import { TiraLetras } from "@/components/tira-letras";
import { cn } from "@/lib/utils";

export type Item = { id: string; nombre: string; url: string; poster: string | null; color: string | null };
export type Categoria = { id: string; slug: string; titulo: string; emoji: string; items: Item[] };

export function Expresiones({ categorias }: { categorias: Categoria[] }) {
  const [activa, setActiva] = useState(categorias[0]?.slug ?? "");
  const [busqueda, setBusqueda] = useState("");
  const [actual, setActual] = useState<(Item & { categoria: string }) | null>(null);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [bucle, setBucle] = useState(true);
  const [lento, setLento] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => { const t = setTimeout(() => setFavoritos(prefs.favoritos()), 0); return () => clearTimeout(t); }, []);

  const todas = useMemo(() => categorias.flatMap(c => c.items.map(i => ({ ...i, categoria: c.titulo, emoji: c.emoji }))), [categorias]);
  const buscando = busqueda.trim().length > 0;
  const lista = useMemo(() => {
    if (buscando) { const q = busqueda.trim().toLowerCase(); return todas.filter(i => i.nombre.toLowerCase().includes(q)); }
    if (activa === "__favoritos__") return todas.filter(i => favoritos.includes(i.id));
    if (activa === "__todas__") return [...todas].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    const c = categorias.find(x => x.slug === activa);
    return c ? c.items.map(i => ({ ...i, categoria: c.titulo, emoji: c.emoji })) : [];
  }, [categorias, todas, activa, busqueda, buscando, favoritos]);

  // Al cambiar de video: cargar y reproducir. load() reinicia la velocidad, por eso
  // la cámara lenta se aplica aparte y también al cargar los metadatos.
  useEffect(() => {
    const v = video.current;
    if (!actual || !v) return;
    v.load();
    v.play().catch(() => {});
  }, [actual]);
  useEffect(() => {
    const v = video.current;
    if (v) { v.defaultPlaybackRate = lento ? 0.5 : 1; v.playbackRate = lento ? 0.5 : 1; }
  }, [lento, actual]);

  const alternarFavorito = (id: string) => setFavoritos(prefs.alternarFavorito(id));

  // Deletreo del nombre debajo del video, con las fotos de Ana Lucía
  const deletreo = useMemo(() => (actual ? normalizar(actual.nombre).split("").map(letra => ({ letra, avatar: "ana" as const })) : []), [actual]);

  return (
    <div className="aparecer">
      <h1 className="mb-4 text-3xl font-extrabold text-navy">Expresiones</h1>

      <label className="mb-4 flex items-center gap-2 rounded-2xl border-2 border-line bg-white px-4 py-2 focus-within:border-navy">
        <Search className="size-5 text-mist" aria-hidden="true" />
        <input type="search" value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar una seña…" className="min-w-0 flex-1 bg-transparent py-1.5 text-lg outline-none" aria-label="Buscar una seña" />
      </label>

      {!buscando && (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Categorías">
          {categorias.map(c => (
            <button key={c.slug} type="button" role="tab" aria-selected={activa === c.slug} onClick={() => setActiva(c.slug)} className={cn("ficha shrink-0 flex-row px-4 text-base", activa === c.slug && "activo")}>
              <span className="text-2xl" aria-hidden="true">{c.emoji}</span>
              {c.titulo}
            </button>
          ))}
          <button type="button" role="tab" aria-selected={activa === "__todas__"} onClick={() => setActiva("__todas__")} className={cn("ficha shrink-0 flex-row px-4 text-base", activa === "__todas__" && "activo")}>
            <span className="font-display text-xl" aria-hidden="true">A–Z</span>
            Todas ({todas.length})
          </button>
          <button type="button" role="tab" aria-selected={activa === "__favoritos__"} onClick={() => setActiva("__favoritos__")} className={cn("ficha sol shrink-0 flex-row px-4 text-base", activa === "__favoritos__" && "activo")}>
            <Star className="size-6 fill-sun text-sun" aria-hidden="true" />
            Favoritos{favoritos.length ? ` (${favoritos.length})` : ""}
          </button>
        </div>
      )}

      <div className="md:grid md:grid-cols-[minmax(260px,320px)_1fr] md:items-start md:gap-6">
        {actual && (
          <div className="mb-4 md:sticky md:top-20">
            <div className="tarjeta overflow-hidden bg-black">
              <video ref={video} playsInline muted controls loop={bucle} preload="metadata" poster={actual.poster ?? undefined} onLoadedMetadata={e => { e.currentTarget.playbackRate = lento ? 0.5 : 1; }} className="mx-auto block max-h-[55vh] w-full bg-black">
                <source src={actual.url} type="video/mp4" />
              </video>
              <div className="flex items-center gap-2 bg-navy px-4 py-2.5 text-white">
                <span className="font-display text-xl">{actual.nombre}</span>
                <button type="button" onClick={() => alternarFavorito(actual.id)} aria-pressed={favoritos.includes(actual.id)} aria-label="Favorito" className="ml-auto grid size-10 place-items-center rounded-full bg-white/15">
                  <Star className={cn("size-5", favoritos.includes(actual.id) && "fill-sun text-sun")} />
                </button>
              </div>
            </div>
            <p className="mt-2 text-center text-xs text-mist">Mira la cara, no solo las manos: en LSC la expresión es parte de la seña.</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <button type="button" onClick={() => setBucle(b => !b)} aria-pressed={bucle} className={cn("flex min-h-11 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-extrabold text-navy shadow-soft", bucle && "bg-sun text-navy-deep")}><Repeat className="size-4" aria-hidden="true" /> Repetir</button>
              <button type="button" onClick={() => setLento(l => !l)} aria-pressed={lento} className={cn("flex min-h-11 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-extrabold text-navy shadow-soft", lento && "bg-sun text-navy-deep")}><Turtle className="size-4" aria-hidden="true" /> Cámara lenta</button>
            </div>
            {deletreo.length > 0 && (
              <div className="mt-3">
                <p className="mb-1.5 text-center text-xs font-bold text-mist">Letra por letra</p>
                <TiraLetras pasos={deletreo} tamano="sm" />
              </div>
            )}
          </div>
        )}

        <div className={cn("grid gap-3", actual ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4")}>
          {lista.map(item => (
            <div key={item.id} className="relative">
              <button
                type="button"
                onClick={() => setActual(item)}
                className={cn("ficha w-full flex-row justify-start gap-3 px-3 py-3 pr-11 text-left text-base", actual?.id === item.id && "border-navy")}
              >
                {item.color ? (
                  <span className="size-6 shrink-0 rounded-full border-2 border-line" style={{ background: item.color }} aria-hidden="true" />
                ) : (
                  <span className="text-xl" aria-hidden="true">{item.emoji}</span>
                )}
                <span>
                  {item.nombre}
                  {(buscando || activa === "__favoritos__" || activa === "__todas__") && <small className="block text-xs font-semibold text-mist">{item.categoria}</small>}
                </span>
              </button>
              <button type="button" onClick={() => alternarFavorito(item.id)} aria-pressed={favoritos.includes(item.id)} aria-label={`Favorito: ${item.nombre}`} className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-mist">
                <Star className={cn("size-5", favoritos.includes(item.id) && "fill-sun text-sun")} />
              </button>
            </div>
          ))}
          {!lista.length && (
            <p className="col-span-full py-6 text-center text-mist">
              {activa === "__favoritos__" && !buscando ? "Toca la ⭐ de una seña para guardarla aquí." : "No encontré esa seña. ¿La grabamos? Déjala en el buzón de ideas."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
