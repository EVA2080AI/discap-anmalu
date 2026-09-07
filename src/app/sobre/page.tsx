import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Hand, Clapperboard, Gamepad2, Mailbox, Smartphone, Sparkles, BadgeCheck, BookMarked } from "lucide-react";
import { FUENTES, REVISION, VERSION } from "@/lib/contenido";

export const metadata: Metadata = { title: "Qué es y cómo se usa" };

const PASOS = [
  {
    Icono: Hand, titulo: "Traductor", color: "bg-navy",
    pasos: ["Elige quién hace las señas: Ana Lucía, Antonella, María Paula o al azar.", "Escribe una palabra (o tu nombre) con el teclado o tocando el abecedario.", "Mira la palabra: si tiene seña propia verás el video; si no, va letra por letra con la foto grande y el recuadro de la seña formal."],
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
          La hicieron <strong className="text-ink">Ana Lucía, Antonella y María Paula</strong> como proyecto escolar para la <strong className="text-ink">Feria Inspírate 2026</strong>. Es la evolución de la app que presentaron el año pasado. La idea es sencilla: que cualquier persona pueda decir algo con las manos a alguien que no oye.
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
          <li className="tarjeta p-3">Si una palabra tiene <b>seña propia</b> (como «hola» o «mamá»), el traductor muestra su video; si no, la <b>deletrea</b> letra por letra. Las señas propias salen de <Link href="/expresiones" className="font-bold text-navy underline">Expresiones</Link>: cada video nuevo hace crecer el traductor.</li>
          <li className="tarjeta p-3"><b>La cara también habla.</b> En LSC la expresión facial es parte de la gramática: la misma seña con las cejas levantadas es una pregunta. Por eso los videos muestran la cara y las manos. Imita las dos cosas.</li>
          <li className="tarjeta p-3"><b>La LSC tiene su propia gramática.</b> No sigue el orden del español ni usa artículos: el verbo suele ir al final y el tema primero. Cuando escribes varias palabras, la app las muestra una por una; eso sirve para aprender vocabulario, no es una frase en LSC. Para hablar de verdad hay que aprender con personas sordas.</li>
          <li className="tarjeta p-3">Las fotos muestran a las niñas de frente, así que su mano derecha queda a tu izquierda. Usa <b>Espejo</b> en el traductor para copiar la seña más fácil.</li>
          <li className="tarjeta p-3">Las fotos y videos son de uso exclusivo de esta app, con autorización de las familias. Lee la <Link href="/privacidad" className="font-bold text-navy underline">política de privacidad</Link>.</li>
        </ul>
      </section>

      <section className="tarjeta mt-8 p-5">
        <h2 className="mb-2 flex items-center gap-2 text-xl font-extrabold text-navy"><BadgeCheck className="size-6" aria-hidden="true" /> Revisión de las señas</h2>
        {REVISION.nombre ? (
          <p className="text-[15px]">Las señas de esta app fueron revisadas por <b>{REVISION.nombre}</b>{REVISION.entidad && <> ({REVISION.entidad})</>}{REVISION.fecha && <> en {REVISION.fecha}</>}.</p>
        ) : (
          <p className="text-[15px]">Las señas las aprendieron y grabaron las niñas a partir de material de LSC. <b>Todavía no han sido revisadas por una persona sorda o un intérprete certificado.</b> Estamos buscando esa revisión: si eres intérprete o parte de la comunidad sorda y quieres ayudar, escríbenos en el <Link href="/ideas" className="font-bold text-navy underline">buzón</Link>.</p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-2 flex items-center gap-2 text-xl font-extrabold text-navy"><BookMarked className="size-6" aria-hidden="true" /> Fuentes</h2>
        <ul className="grid gap-2 text-[15px]">
          {FUENTES.map(f => (
            <li key={f.nombre} className="tarjeta p-3">
              {f.url ? <a href={f.url} target="_blank" rel="noopener" className="font-bold text-navy underline">{f.nombre}</a> : <b className="text-navy">{f.nombre}</b>}
              <span className="block text-sm text-mist">{f.que}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-mist">Versión {VERSION} · <Link href="/novedades" className="underline">qué hay de nuevo</Link></p>
      </section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link href="/traductor" className="btn-principal">Probar el traductor</Link>
        <Link href="/ideas" className="btn-principal bg-white text-navy shadow-[0_6px_0_var(--color-line)]">Dejar una idea</Link>
      </div>
    </div>
  );
}
