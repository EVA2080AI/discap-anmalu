import type { Metadata } from "next";
import Link from "next/link";
import { Presentation, Gamepad2, Printer, BookOpenCheck, Hand, ArrowRight } from "lucide-react";
import { FRASES_PENDIENTES } from "@/lib/contenido";

export const metadata: Metadata = { title: "Modo docente" };

const HERRAMIENTAS = [
  { href: "/feria", Icono: Presentation, titulo: "Proyectar", texto: "Demo automática a pantalla completa con QR. Ideal para el tablero o el televisor del salón." },
  { href: "/traductor", Icono: Hand, titulo: "Mostrar una palabra", texto: "Escribe la palabra del día y proyéctala con «Repetir» para que todos la imiten." },
  { href: "/practicar", Icono: Gamepad2, titulo: "Reto al grupo", texto: "Adivinar la letra entre cuatro. Se puede jugar por equipos: cada acierto, un punto." },
  { href: "/lecciones", Icono: BookOpenCheck, titulo: "Lecciones", texto: "Una por categoría: ver, practicar y repasar. Sirve como guía de una clase de 20 minutos." },
  { href: "/tarjetas", Icono: Printer, titulo: "Tarjetas del abecedario", texto: "Seña formal y foto por letra, listas para imprimir, recortar y pegar en el salón." },
];

export default function Docente() {
  return (
    <div className="aparecer">
      <h1 className="text-3xl font-extrabold text-navy">Modo docente</h1>
      <p className="mt-1 text-mist">Herramientas para usar la app en clase. No necesitan clave.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {HERRAMIENTAS.map(({ href, Icono, titulo, texto }) => (
          <Link key={href} href={href} className="tarjeta group flex items-start gap-3 p-4 transition-colors hover:bg-lime-soft">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-navy-soft text-navy"><Icono className="size-6" aria-hidden="true" /></span>
            <span>
              <b className="flex items-center gap-1 font-display text-lg text-navy-deep">{titulo} <ArrowRight className="size-4 opacity-50 transition-transform group-hover:translate-x-1" aria-hidden="true" /></b>
              <span className="text-sm text-mist">{texto}</span>
            </span>
          </Link>
        ))}
      </div>

      <section className="tarjeta mt-6 p-5">
        <h2 className="text-xl font-extrabold text-navy-deep">Plan de una clase de 20 minutos</h2>
        <ol className="mt-2 grid list-decimal gap-1.5 pl-5 text-[15px]">
          <li><b>5 min</b> · Proyecta la demo. Pregunta: ¿qué letras reconocen?</li>
          <li><b>5 min</b> · Cada quien escribe su nombre en el traductor y lo hace con la mano, con Espejo activado.</li>
          <li><b>5 min</b> · Una lección: Saludos. Ver los videos y repetirlos mirando la cara, no solo las manos.</li>
          <li><b>5 min</b> · Reto por equipos en Practicar.</li>
        </ol>
      </section>

      <section className="tarjeta mt-4 p-5">
        <h2 className="text-xl font-extrabold text-navy-deep">Frases que faltan por grabar</h2>
        <p className="mt-1 text-sm text-mist">Son las que una persona sorda necesita primero de un oyente. Se suben desde la zona de subidas en la categoría «Frases útiles».</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {FRASES_PENDIENTES.map(f => <li key={f} className="rounded-full bg-sun-soft px-3 py-1.5 text-sm font-bold text-navy-deep">{f}</li>)}
        </ul>
      </section>
    </div>
  );
}
