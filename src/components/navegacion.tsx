"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Hand, Clapperboard, BookOpenCheck, Mailbox } from "lucide-react";
import { VigilanteFeria } from "@/components/feria";
import { Ajustes } from "@/components/ajustes";
import { cn } from "@/lib/utils";

const RUTAS = [
  { href: "/", texto: "Inicio", Icono: Home },
  { href: "/traductor", texto: "Traductor", Icono: Hand },
  { href: "/expresiones", texto: "Expresiones", Icono: Clapperboard },
  { href: "/lecciones", texto: "Aprender", Icono: BookOpenCheck },
  { href: "/ideas", texto: "Ideas", Icono: Mailbox },
];

/** Cabecera arriba y, en el celular, barra de pestañas abajo (donde llega el pulgar). */
export function Navegacion() {
  const ruta = usePathname();
  const esAdmin = ruta.startsWith("/admin");
  const esFeria = ruta === "/feria";
  const activa = (href: string) => (href === "/" ? ruta === "/" : href === "/lecciones" ? ruta.startsWith("/lecciones") || ruta.startsWith("/practicar") : ruta.startsWith(href));

  if (esFeria) return null;

  return (
    <>
      <VigilanteFeria ruta={ruta} />
      <header className="sticky top-0 z-20 bg-navy text-white shadow-[0_4px_18px_rgba(0,0,0,.15)]">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-2.5 md:px-6">
          <Link href="/" className="flex items-center gap-2" aria-label="Inicio">
            <span className="text-2xl" aria-hidden="true">🤟</span>
            <span className="font-display text-xl font-extrabold tracking-wide">
              DISCAP <b className="text-lime">ANMALU</b>
            </span>
          </Link>
          <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Secciones">
            {RUTAS.map(({ href, texto, Icono }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3.5 py-2 font-bold transition-colors",
                  activa(href) ? "bg-white/15 text-sun" : "text-white/85 hover:bg-white/10",
                )}
              >
                <Icono className="size-4" aria-hidden="true" />
                {texto}
              </Link>
            ))}
          </nav>
          <Link href="/sobre" className="ml-auto rounded-full bg-sun px-3 py-1 text-xs font-extrabold tracking-widest text-navy-deep md:ml-2" aria-label="Qué es y cómo se usa">
            {esAdmin ? "SUBIDAS" : "¿QUÉ ES?"}
          </Link>
          <Ajustes />
        </div>
      </header>

      {!esAdmin && (
        <nav
          className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white/95 backdrop-blur md:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          aria-label="Secciones"
        >
          <ul className="mx-auto grid max-w-md grid-cols-5">
            {RUTAS.map(({ href, texto, Icono }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-extrabold transition-colors",
                    activa(href) ? "text-navy" : "text-mist",
                  )}
                  aria-current={activa(href) ? "page" : undefined}
                >
                  <span className={cn("rounded-2xl px-3.5 py-1 transition-colors", activa(href) && "bg-sun-soft")}>
                    <Icono className="size-6" aria-hidden="true" />
                  </span>
                  {texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
