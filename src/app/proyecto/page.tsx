import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Target, BookMarked, FlaskConical, Trophy, HandHeart, ArrowRight, School, Sparkle } from "lucide-react";
import { fotoOriginal } from "@/lib/datos";
import {
  CREADORAS, COLEGIO, PROBLEMA, OBJETIVO_GENERAL, OBJETIVOS_ESPECIFICOS,
  MARCO_TEORICO, METODOLOGIA, HISTORIA, LOGRO_DESTACADO, BASTON,
} from "@/lib/contenido";

export const metadata: Metadata = {
  title: "El proyecto",
  description: "La historia de DISCAP ANMALU: el problema, los objetivos, la metodología y cómo tres niñas lo llevaron de una idea de clase a una app real.",
};

export default function Proyecto() {
  return (
    <div className="aparecer">
      {/* ---------- Portada ---------- */}
      <section className="overflow-hidden rounded-card bg-gradient-to-br from-navy via-navy to-[#2f63c9] px-6 py-10 text-center text-white shadow-lift md:py-14">
        <p className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-sun">El proyecto</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold md:text-5xl">
          DISCAP <span className="text-lime">ANMALU</span>
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-lg text-white/90">Soluciones para personas con discapacidad</p>
        <div className="mx-auto mt-6 flex max-w-xs justify-center" aria-hidden="true">
          {CREADORAS.map((c, i) => (
            <Image
              key={c.avatar}
              src={fotoOriginal(c.avatar, "A") ?? ""}
              alt=""
              width={96}
              height={96}
              className="size-20 rounded-full border-4 border-white object-cover object-top shadow-lift md:size-24"
              style={{ marginLeft: i === 0 ? 0 : -16, zIndex: i === 1 ? 1 : 0 }}
            />
          ))}
        </div>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/80">
          Una idea de {CREADORAS.map(c => c.nombre).join(", ").replace(/, ([^,]*)$/, " y $1")}, alumnas del {COLEGIO}.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/traductor" className="btn-principal bg-sun text-navy-deep shadow-[0_6px_0_#b98f00]">
            Probar la app <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
          <a href="#historia" className="flex min-h-11 items-center gap-1.5 rounded-full bg-white/15 px-5 font-extrabold text-white">
            Ver la historia
          </a>
        </div>
      </section>

      {/* ---------- Logro destacado ---------- */}
      <section className="mt-6 flex flex-col items-center gap-3 rounded-card bg-sun-soft p-5 text-center sm:flex-row sm:text-left">
        <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-sun text-navy-deep"><Trophy className="size-9" aria-hidden="true" /></span>
        <p className="text-[15px]">
          <b className="font-display text-2xl text-navy-deep">{LOGRO_DESTACADO.puntos} puntos.</b>{" "}
          Eso lograron en la {LOGRO_DESTACADO.contexto.toLowerCase()}, la primera vez que presentaron el proyecto fuera del colegio.
        </p>
      </section>

      {/* ---------- El problema ---------- */}
      <section className="mt-10 grid gap-6 md:grid-cols-[1fr_1.3fr] md:items-center">
        <div>
          <p className="font-display text-sm font-extrabold uppercase tracking-widest text-coral">El problema</p>
          <h2 className="mt-1 text-2xl font-extrabold text-navy-deep md:text-3xl">Todos merecen poder comunicarse</h2>
        </div>
        <p className="tarjeta p-5 text-[17px] leading-relaxed">{PROBLEMA}</p>
      </section>

      {/* ---------- Objetivos ---------- */}
      <section className="mt-10">
        <p className="font-display text-sm font-extrabold uppercase tracking-widest text-navy">
          <Target className="mr-1.5 inline size-4" aria-hidden="true" /> Qué se propusieron
        </p>
        <h2 className="mt-1 text-2xl font-extrabold text-navy-deep md:text-3xl">Objetivo general</h2>
        <p className="tarjeta mt-3 p-5 text-[17px] leading-relaxed">{OBJETIVO_GENERAL}</p>
        <h3 className="mb-2 mt-5 font-display text-lg text-navy-deep">Objetivos específicos</h3>
        <ul className="grid gap-2 sm:grid-cols-3">
          {OBJETIVOS_ESPECIFICOS.map((o, i) => (
            <li key={i} className="tarjeta flex gap-2 p-4 text-sm">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-lime-soft font-display font-extrabold text-navy">{i + 1}</span>
              {o}
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Marco teórico y metodología ---------- */}
      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="tarjeta p-5">
          <h2 className="mb-3 flex items-center gap-2 font-display text-xl text-navy-deep"><BookMarked className="size-6 text-navy" aria-hidden="true" /> En qué se basaron</h2>
          <ul className="grid gap-3">
            {MARCO_TEORICO.map(m => (
              <li key={m.autor} className="border-l-4 border-lime bg-lime-soft/60 py-1 pl-3 text-[15px]">
                <b className="text-navy-deep">{m.autor}</b> · {m.idea}
              </li>
            ))}
          </ul>
        </div>
        <div className="tarjeta p-5">
          <h2 className="mb-3 flex items-center gap-2 font-display text-xl text-navy-deep"><FlaskConical className="size-6 text-navy" aria-hidden="true" /> Cómo investigaron</h2>
          <p className="text-[15px]"><b className="text-navy-deep">{METODOLOGIA.tipo}</b>, {METODOLOGIA.tipoDetalle}</p>
          <p className="mt-2 text-[15px]"><b className="text-navy-deep">Alcance {METODOLOGIA.alcance.toLowerCase()}</b>: {METODOLOGIA.alcanceDetalle}</p>
        </div>
      </section>

      {/* ---------- Historia ---------- */}
      <section id="historia" className="mt-12 scroll-mt-20">
        <p className="font-display text-sm font-extrabold uppercase tracking-widest text-navy">Nuestra historia</p>
        <h2 className="mt-1 text-2xl font-extrabold text-navy-deep md:text-3xl">De una idea de clase a una app real</h2>
        <ol className="relative mt-6 grid gap-6 border-l-4 border-lime-soft pl-6 md:pl-8">
          {HISTORIA.map(h => (
            <li key={h.anio} className="relative">
              <span className="absolute -left-[34px] top-0.5 grid size-8 place-items-center rounded-full bg-navy font-display text-sm font-extrabold text-white md:-left-[42px]">{h.anio.slice(2)}</span>
              <div className="tarjeta p-5">
                <h3 className="font-display text-xl text-navy-deep">{h.anio} · {h.titulo}</h3>
                <ul className="mt-2 grid list-disc gap-1.5 pl-5 text-[15px]">
                  {h.items.map((it, i) => <li key={i}>{it}</li>)}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- El bastón (segundo prototipo) ---------- */}
      <section className="tarjeta mt-10 flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
        <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-navy-soft text-navy"><HandHeart className="size-9" aria-hidden="true" /></span>
        <div>
          <h2 className="font-display text-xl text-navy-deep">{BASTON.titulo}</h2>
          <p className="mt-1 text-[15px] text-mist">{BASTON.texto}</p>
        </div>
      </section>

      {/* ---------- Equipo ---------- */}
      <section className="mt-12">
        <p className="font-display text-sm font-extrabold uppercase tracking-widest text-navy">Quiénes lo hicieron</p>
        <h2 className="mt-1 text-2xl font-extrabold text-navy-deep md:text-3xl">Creadoras de una gran idea</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {CREADORAS.map(c => (
            <div key={c.avatar} className="tarjeta p-5 text-center">
              <Image src={fotoOriginal(c.avatar, "A") ?? ""} alt="" width={96} height={96} className="mx-auto size-24 rounded-full object-cover object-top shadow-soft" />
              <p className="mt-3 font-display text-lg text-navy-deep">{c.nombre}</p>
              <p className="text-sm text-mist">{c.apellidos}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-sm text-mist"><School className="size-4" aria-hidden="true" /> {COLEGIO}</p>
      </section>

      {/* ---------- Cierre ---------- */}
      <section className="mt-12 rounded-card bg-gradient-to-br from-lime to-[#5a9d1c] p-8 text-center text-white shadow-lift">
        <Sparkle className="mx-auto size-8" aria-hidden="true" />
        <h2 className="mt-2 font-display text-2xl font-extrabold md:text-3xl">Y esto apenas empieza</h2>
        <p className="mx-auto mt-2 max-w-md text-white/90">Prueba la app, aprende una seña nueva y cuéntanos qué te gustaría ver después.</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link href="/traductor" className="btn-principal bg-white text-navy shadow-[0_6px_0_var(--color-line)]">Ir al traductor</Link>
          <Link href="/ideas" className="flex min-h-11 items-center gap-1.5 rounded-full bg-white/15 px-5 font-extrabold text-white">Dejar una idea</Link>
        </div>
      </section>
    </div>
  );
}
