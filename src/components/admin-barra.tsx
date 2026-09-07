"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Camera, Clapperboard, Mailbox, CheckCircle2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Rol } from "@/lib/auth";

export function AdminBarra({ rol, pendientes }: { rol: Rol; pendientes: number }) {
  const ruta = usePathname();
  const router = useRouter();
  const pestanas = [
    { href: "/admin/subir", texto: "Foto de letra", Icono: Camera, match: (r: string) => r === "/admin" || r === "/admin/subir" },
    { href: "/admin/subir/video", texto: "Video", Icono: Clapperboard, match: (r: string) => r === "/admin/subir/video" },
    { href: "/admin/ideas", texto: "Ideas", Icono: Mailbox, match: (r: string) => r.startsWith("/admin/ideas") },
    ...(rol === "admin" ? [{ href: "/admin/aprobar", texto: "Por aprobar", Icono: CheckCircle2, match: (r: string) => r.startsWith("/admin/aprobar") }] : []),
  ];

  const salir = async () => { await fetch("/api/sesion", { method: "DELETE" }); router.refresh(); };

  return (
    <div className="mb-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-bold text-navy-deep">
          Entraste como <span className={cn("rounded-full px-2.5 py-1 text-xs font-extrabold tracking-wider", rol === "admin" ? "bg-sun text-navy-deep" : "bg-lime-soft text-[#2e6b12]")}>{rol === "admin" ? "ADMIN" : "ALUMNA"}</span>
        </p>
        <button type="button" onClick={salir} className="flex min-h-11 items-center gap-1.5 rounded-full px-3 font-extrabold text-navy"><LogOut className="size-4" aria-hidden="true" /> Salir</button>
      </div>
      <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Secciones de la zona de subidas">
        {pestanas.map(({ href, texto, Icono, match }) => (
          <Link key={href} href={href} className={cn("ficha shrink-0 flex-row px-4", match(ruta) && "activo")}>
            <Icono className="size-5" aria-hidden="true" />
            {texto}
            {texto === "Por aprobar" && pendientes > 0 && <span className="rounded-full bg-coral px-2 py-0.5 text-xs text-white">{pendientes}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}
