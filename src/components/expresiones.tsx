"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type Item = { id: string; nombre: string; url: string; poster: string | null; color: string | null };
export type Categoria = { id: string; slug: string; titulo: string; emoji: string; items: Item[] };

export function Expresiones({ categorias }: { categorias: Categoria[] }) {
  const [activa, setActiva] = useState(categorias[0]?.slug ?? "");
  const [busqueda, setBusqueda] = useState("");
  const [actual, setActual] = useState<(Item & { categoria: string }) | null>(null);
  const video = useRef<HTMLVideoElement>(null);

  const buscando = busqueda.trim().length > 0;
  const lista = useMemo(() => {
    if (buscando) {
      const q = busqueda.trim().toLowerCase();
      return categorias.flatMap(c => c.items.filter(i => i.nombre.toLowerCase().includes(q)).map(i => ({ ...i, categoria: c.titulo, emoji: c.emoji })));
    }
    const c = categorias.find(x => x.slug === activa);
    return c ? c.items.map(i => ({ ...i, categoria: c.titulo, emoji: c.emoji })) : [];
  }, [categorias, activa, busqueda, buscando]);

  useEffect(() => {
    if (!actual || !video.current) return;
    video.current.load();
    video.current.play().catch(() => {});
  }, [actual]);

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
        </div>
      )}

      <div className="md:grid md:grid-cols-[minmax(260px,320px)_1fr] md:items-start md:gap-6">
        {actual && (
          <div className="tarjeta mb-4 overflow-hidden bg-black md:sticky md:top-20">
            <video ref={video} playsInline muted controls preload="metadata" poster={actual.poster ?? undefined} className="mx-auto block max-h-[60vh] w-full bg-black">
              <source src={actual.url} type="video/mp4" />
            </video>
            <div className="bg-navy px-4 py-2.5 font-display text-xl text-white">{actual.nombre}</div>
          </div>
        )}

        <div className={cn("grid gap-3", actual ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4")}>
          {lista.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActual(item)}
              className={cn("ficha flex-row justify-start gap-3 px-3 py-3 text-left text-base", actual?.id === item.id && "border-navy")}
            >
              {item.color ? (
                <span className="size-6 shrink-0 rounded-full border-2 border-line" style={{ background: item.color }} aria-hidden="true" />
              ) : (
                <span className="text-xl" aria-hidden="true">{item.emoji}</span>
              )}
              <span>
                {item.nombre}
                {buscando && <small className="block text-xs font-semibold text-mist">{item.categoria}</small>}
              </span>
            </button>
          ))}
          {!lista.length && <p className="col-span-full py-6 text-center text-mist">No encontré esa seña. ¿La grabamos? Déjala en el buzón de ideas.</p>}
        </div>
      </div>
    </div>
  );
}
