"use client";

import { fotoOriginal, senaFormal, type AvatarId } from "@/lib/datos";
import { cn } from "@/lib/utils";

export type Video = { nombre: string; url: string; poster: string | null };
/** Un paso es una letra o, si la palabra tiene seña propia, un video completo. */
export type PasoTira = { letra: string; avatar: AvatarId; video?: Video };

/** La palabra entera de un vistazo: una foto pequeña por letra, con la letra encima.
    Sirve en el traductor (tocar = ir a esa letra) y debajo de los videos de Expresiones. */
export function TiraLetras({
  pasos, actual, onElegir, fotoDe, tamano = "md",
}: {
  pasos: PasoTira[];
  actual?: number;
  onElegir?: (i: number) => void;
  fotoDe?: (a: AvatarId, l: string) => string | null;
  tamano?: "sm" | "md";
}) {
  const foto = fotoDe ?? fotoOriginal;
  const ancho = tamano === "sm" ? "w-11" : "w-14";
  return (
    <div className="flex flex-wrap justify-center gap-1.5" role={onElegir ? "listbox" : undefined} aria-label="Letras de la palabra">
      {pasos.map((p, i) => {
        const esEspacio = p.letra === " ";
        const src = esEspacio ? null : p.video ? p.video.poster : foto(p.avatar, p.letra) ?? senaFormal(p.letra);
        const Comp = onElegir ? "button" : "div";
        return (
          <Comp
            key={i}
            type={onElegir ? "button" : undefined}
            onClick={onElegir ? () => onElegir(i) : undefined}
            role={onElegir ? "option" : undefined}
            aria-selected={onElegir ? i === actual : undefined}
            aria-label={esEspacio ? "espacio" : p.video ? `seña ${p.video.nombre}` : `letra ${p.letra}`}
            className={cn(
              "relative aspect-[3/4] shrink-0 overflow-hidden rounded-xl border-[3px] bg-white transition-transform",
              p.video ? (tamano === "sm" ? "w-16" : "w-20") : ancho,
              esEspacio ? "border-dashed border-line" : "border-line",
              p.video && "border-lime",
              i === actual && "scale-110 border-sun shadow-lift",
            )}
          >
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt="" className="size-full object-cover object-top" loading="lazy" />
            ) : (
              <span className="grid size-full place-items-center text-mist">·</span>
            )}
            {!esEspacio && (
              <span className={cn("absolute bottom-0 left-0 right-0 bg-white/85 text-center font-display font-extrabold leading-tight text-navy", tamano === "sm" ? "text-xs" : "text-sm", p.video && "bg-lime/90 text-white")}>{p.video ? p.video.nombre : p.letra}</span>
            )}
          </Comp>
        );
      })}
    </div>
  );
}
