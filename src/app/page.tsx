import Link from "next/link";
import Image from "next/image";
import { Hand, Clapperboard, Mailbox, ArrowRight } from "lucide-react";

export default function Inicio() {
  return (
    <div className="aparecer">
      {/* Portada */}
      <section className="pt-2 text-center md:pt-6">
        <div className="mb-4 flex justify-center" aria-hidden="true">
          <Image src="/img/avatares/ana/A.jpg" alt="" width={96} height={96} className="-mr-3 size-24 rounded-full border-4 border-white object-cover object-top shadow-soft" />
          <Image src="/img/avatares/antonella/N.jpg" alt="" width={116} height={116} className="z-10 size-29 rounded-full border-4 border-white object-cover object-top shadow-soft" priority />
          <Image src="/img/avatares/mariapaula/M.jpg" alt="" width={96} height={96} className="-ml-3 size-24 rounded-full border-4 border-white object-cover object-top shadow-soft" />
        </div>
        <h1 className="text-4xl font-extrabold text-navy-deep md:text-5xl">
          Hablemos con las <span className="text-lime">manos</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-mist md:text-lg">
          Traductor de <strong className="text-ink">Lengua de Señas Colombiana</strong> hecho por Ana Lucía, Antonella y María Paula.
        </p>
      </section>

      {/* Menú principal */}
      <nav className="mt-8 grid gap-4 md:grid-cols-2" aria-label="Menú principal">
        <Link href="/traductor" className="group grid grid-cols-[64px_1fr] items-center gap-4 rounded-card bg-gradient-to-br from-navy to-[#2f63c9] p-5 text-white shadow-soft transition-transform active:scale-[.98]">
          <span className="grid size-16 place-items-center rounded-2xl bg-white/15"><Hand className="size-9" aria-hidden="true" /></span>
          <span>
            <span className="flex items-center gap-2 font-display text-2xl font-extrabold">Traductor <ArrowRight className="size-5 opacity-70 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
            <span className="text-sm text-white/90">Escribe una palabra y mírala letra por letra en señas</span>
          </span>
        </Link>
        <Link href="/expresiones" className="group grid grid-cols-[64px_1fr] items-center gap-4 rounded-card bg-gradient-to-br from-[#5a9d1c] to-lime p-5 text-white shadow-soft transition-transform active:scale-[.98]">
          <span className="grid size-16 place-items-center rounded-2xl bg-white/15"><Clapperboard className="size-9" aria-hidden="true" /></span>
          <span>
            <span className="flex items-center gap-2 font-display text-2xl font-extrabold">Expresiones <ArrowRight className="size-5 opacity-70 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
            <span className="text-sm text-white/90">Saludos, familia y colores en video</span>
          </span>
        </Link>
      </nav>

      <Link href="/ideas" className="mt-4 flex items-center gap-4 rounded-card border-[3px] border-transparent bg-white p-4 shadow-soft transition-colors active:border-sun">
        <span className="grid size-12 place-items-center rounded-2xl bg-sun-soft text-navy"><Mailbox className="size-7" aria-hidden="true" /></span>
        <span>
          <b className="font-display text-lg text-navy">Buzón de ideas</b>
          <br />
          <small className="text-mist">Cuéntanos qué te gustó o qué mejorarías</small>
        </span>
      </Link>

      <p className="mt-8 text-center text-sm text-mist">Proyecto escolar · Feria Inspírate 2026</p>
    </div>
  );
}
