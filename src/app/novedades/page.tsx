import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { NOVEDADES, VERSION } from "@/lib/contenido";

export const metadata: Metadata = { title: "Novedades" };

export default function Novedades() {
  return (
    <article className="aparecer mx-auto max-w-2xl">
      <h1 className="flex items-center gap-2 text-3xl font-extrabold text-navy"><Sparkles className="size-8" aria-hidden="true" /> Qué hay de nuevo</h1>
      <p className="mt-1 text-mist">Versión actual: <b className="text-ink">{VERSION}</b></p>
      <ol className="mt-6 grid gap-4">
        {NOVEDADES.map(n => (
          <li key={n.version} className="tarjeta p-5">
            <h2 className="flex items-baseline gap-2 font-display text-xl text-navy-deep">Versión {n.version} <span className="text-sm font-sans font-semibold text-mist">{n.fecha}</span></h2>
            <ul className="mt-2 grid list-disc gap-1 pl-5 text-[15px]">{n.cambios.map((c, i) => <li key={i}>{c}</li>)}</ul>
          </li>
        ))}
      </ol>
    </article>
  );
}
