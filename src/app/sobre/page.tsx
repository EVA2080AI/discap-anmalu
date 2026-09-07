import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Hand, Clapperboard, Gamepad2, Mailbox, Smartphone, Sparkles } from "lucide-react";

export const metadata: Metadata = { title: "Qué es y cómo se usa" };

const PASOS = [
  {
    Icono: Hand, titulo: "Traductor", color: "bg-navy",
    pasos: ["Elige quién hace las señas: Ana Lucía, Antonella, María Paula o al azar.", "Escribe una palabra (o tu nombre) con el teclado o tocando el abecedario.", "Mira la palabra letra por letra: la foto grande es la seña y el recuadro es la seña formal. Toca el recuadro para agrandarlo."],
    extra: "Con «Repetir» la palabra da vueltas sola para que la imites. Con «Espejo» la ves como si la hicieras tú.",
  },
  {
    Icono: Clapperboard, titulo: "Expresiones", color: "bg-[#5a9d1c]",
    pasos: ["Elige una categoría: saludos, familia, colores…", "Toca una seña y el video se reproduce solo, en bucle.", "Usa «Cámara lenta» para verla despacio y la ⭐ para guardarla en favoritos."],
    extra: "Debajo del video aparece la palabra deletreada con las fotos.",
  },
  {
    Icono: Gamepad2, titulo: "Practicar", color: "bg-coral",
    pasos: ["Aparece una seña sin la letra.", "Toca la letra correcta entre cuatro.", "Suma aciertos y cuida tu racha. Si fallas, te mostramos la seña formal."],
    extra: "Tu mejor racha se guarda en tu celular.",
  },
  {
    Icono: Mailbox, titulo: "Buzón de ideas", color: "bg-sun",
    pasos: ["Elige si es una idea, algo que no funciona o algo que te gustó.", "Escribe tu nombre (si quieres) y tu mensaje.", "Tu idea aparece en la lista con su estado. Cuando el equipo la haga, se marca ✅."],
    extra: "No necesitas cuenta ni correo.",
  },
];

export default function Sobre() {
  return (
    <div className="aparecer">
      <section className="text-center">
        <div className="mb-3 flex justify-center" aria-hidden="true">
          <Image src="/img/avatares/ana/A.jpg" alt="" width={72} height={72} className="-mr-2 size-18 rounded-full border-4 border-white object-cover object-top shadow-soft" />
          <Image src="/img/avatares/antonella/N.jpg" alt="" width={84} height={84} className="z-10 size-21 rounded-full border-4 border-white object-cover object-top shadow-soft" />
          <Image src="/img/avatares/mariapaula/M.jpg" alt="" width={72} height={72} className="-ml-2 size-18 rounded-full border-4 border-white object-cover object-top shadow-soft" />
        </div>
        <h1 className="text-3xl font-extrabold text-navy md:text-4xl">¿Qué es DISCAP ANMALU?</h1>
        <p className="mx-auto mt-3 max-w-xl text-mist md:text-lg">
          Es una app para <strong className="text-ink">aprender y usar la Lengua de Señas Colombiana (LSC)</strong>. Escribes una palabra y la ves en señas, letra por letra, con las fotos de tres niñas que las hacen. También tiene videos de saludos, familia y colores, un juego para practicar y un buzón para que nos cuentes tus ideas.
        </p>
        <p className="mx-auto mt-3 max-w-xl text-mist">
          La hicieron <strong className="text-ink">Ana Lucía, Antonella y María Paula</strong> como proyecto escolar para la <strong className="text-ink">Feria Inspírate 2026</strong>, con el apoyo de Guido Gamba. Es la evolución de la app que presentaron el año pasado. La idea es sencilla: que cualquier persona pueda decir algo con las manos a alguien que no oye.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-extrabold text-navy">¿Cómo se usa?</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {PASOS.map(({ Icono, titulo, color, pasos, extra }) => (
            <article key={titulo} className="tarjeta p-5">
              <h3 className="mb-3 flex items-center gap-2 font-display text-xl text-navy-deep">
                <span className={`grid size-10 place-items-center rounded-xl text-white ${color}`}><Icono className="size-5" aria-hidden="true" /></span>
                {titulo}
              </h3>
              <ol className="grid gap-2 text-[15px]">
                {pasos.map((p, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sun-soft font-display font-extrabold text-navy">{i + 1}</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-3 border-l-4 border-lime bg-lime-soft px-3 py-2 text-sm">{extra}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="tarjeta mt-8 p-5">
        <h2 className="mb-2 flex items-center gap-2 text-xl font-extrabold text-navy"><Smartphone className="size-6" aria-hidden="true" /> Llévala en tu celular</h2>
        <p className="text-[15px]">Funciona sin instalar nada, pero si la agregas a tu pantalla de inicio abre a pantalla completa y el traductor funciona sin internet.</p>
        <ul className="mt-2 grid gap-1 text-[15px]">
          <li><b>Android:</b> Chrome → menú ⋮ → <b>Instalar app</b> o <b>Agregar a pantalla de inicio</b>.</li>
          <li><b>iPhone:</b> Safari → botón compartir → <b>Agregar a inicio</b>.</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="mb-2 flex items-center gap-2 text-xl font-extrabold text-navy"><Sparkles className="size-6" aria-hidden="true" /> Cosas para saber</h2>
        <ul className="grid gap-2 text-[15px]">
          <li className="tarjeta p-3">El traductor <b>deletrea</b> (dactilología). En LSC muchas palabras tienen su propia seña: esas están en <Link href="/expresiones" className="font-bold text-navy underline">Expresiones</Link>, y cada video nuevo hace crecer la app.</li>
          <li className="tarjeta p-3">Las fotos muestran a las niñas de frente, así que su mano derecha queda a tu izquierda. Usa <b>Espejo</b> en el traductor para copiar la seña más fácil.</li>
          <li className="tarjeta p-3">Las señas formales vienen del material «Inclusión al día». Las fotos y videos son de uso exclusivo de esta app.</li>
        </ul>
      </section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link href="/traductor" className="btn-principal">Probar el traductor</Link>
        <Link href="/ideas" className="btn-principal bg-white text-navy shadow-[0_6px_0_var(--color-line)]">Dejar una idea</Link>
      </div>
    </div>
  );
}
