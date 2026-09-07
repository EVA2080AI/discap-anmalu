import type { Metadata } from "next";
import { LETRAS, AVATAR_IDS, AVATARES, fotoOriginal, senaFormal } from "@/lib/datos";
import { BotonImprimir } from "@/components/boton-imprimir";

export const metadata: Metadata = { title: "Tarjetas del abecedario" };

/** Abecedario para imprimir: seña formal + foto de una niña por letra. Para el salón. */
export default function Tarjetas({ searchParams }: { searchParams: Promise<{ quien?: string }> }) {
  return <TarjetasContenido searchParams={searchParams} />;
}

async function TarjetasContenido({ searchParams }: { searchParams: Promise<{ quien?: string }> }) {
  const { quien } = await searchParams;
  const avatar = AVATAR_IDS.includes(quien as (typeof AVATAR_IDS)[number]) ? (quien as (typeof AVATAR_IDS)[number]) : "ana";
  return (
    <div className="aparecer">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Tarjetas del abecedario</h1>
          <p className="text-sm text-mist">Para imprimir, recortar y pegar en el salón. Elige quién hace las señas:</p>
          <div className="mt-2 flex gap-2">
            {AVATAR_IDS.map(id => (
              <a key={id} href={`/tarjetas?quien=${id}`} className={`ficha flex-row px-3 text-sm ${id === avatar ? "activo" : ""}`}>{AVATARES[id].nombre}</a>
            ))}
          </div>
        </div>
        <BotonImprimir texto="Imprimir tarjetas" />
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 print:grid-cols-4 print:gap-2">
        {LETRAS.map(l => {
          const foto = fotoOriginal(avatar, l);
          return (
            <div key={l} className="tarjeta overflow-hidden border border-line p-2 print:break-inside-avoid print:shadow-none">
              <div className="flex gap-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={senaFormal(l)} alt={`Seña formal de la letra ${l}`} className="aspect-[3/4] w-1/2 rounded-lg object-cover" />
                {foto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={foto} alt={`${AVATARES[avatar].nombre} haciendo la ${l}`} className="aspect-[3/4] w-1/2 rounded-lg object-cover object-top" />
                ) : (
                  <div className="grid aspect-[3/4] w-1/2 place-items-center rounded-lg bg-cream text-xs text-mist">sin foto</div>
                )}
              </div>
              <p className="mt-1 text-center font-display text-3xl font-extrabold text-navy">{l}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-center text-xs text-mist print:mt-2">DISCAP ANMALU · Lengua de Señas Colombiana · discap-anmalu.vercel.app</p>
    </div>
  );
}
