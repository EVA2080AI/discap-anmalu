"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, BookOpenCheck, Star, Hand } from "lucide-react";
import { prefs } from "@/lib/preferencias";

/** Tarjeta del inicio con lo que la persona lleva hecho (vive en su celular). */
export function TuProgreso() {
  const [datos, setDatos] = useState<{ racha: number; lecciones: number; favoritos: number; palabras: number } | null>(null);
  useEffect(() => {
    const t = setTimeout(() => setDatos({ racha: prefs.mejorRacha(), lecciones: Object.keys(prefs.lecciones()).length, favoritos: prefs.favoritos().length, palabras: prefs.palabrasPracticadas() }), 0);
    return () => clearTimeout(t);
  }, []);
  if (!datos || (datos.racha === 0 && datos.lecciones === 0 && datos.favoritos === 0 && datos.palabras === 0)) return null;
  const casillas = [
    { Icono: Flame, valor: datos.racha, texto: "mejor racha", href: "/practicar" },
    { Icono: BookOpenCheck, valor: datos.lecciones, texto: "lecciones", href: "/lecciones" },
    { Icono: Hand, valor: datos.palabras, texto: "señas acertadas", href: "/lecciones" },
    { Icono: Star, valor: datos.favoritos, texto: "favoritos", href: "/expresiones" },
  ];
  return (
    <section className="tarjeta mt-4 p-4" aria-label="Tu progreso">
      <p className="mb-2 font-display text-lg text-navy-deep">Tu progreso</p>
      <div className="grid grid-cols-4 gap-2 text-center">
        {casillas.map(({ Icono, valor, texto, href }) => (
          <Link key={texto} href={href} className="rounded-xl bg-cream p-2">
            <Icono className="mx-auto size-5 text-navy" aria-hidden="true" />
            <b className="block font-display text-xl text-navy">{valor}</b>
            <span className="text-[11px] font-bold text-mist">{texto}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
