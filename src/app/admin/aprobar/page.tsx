import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { rolActual } from "@/lib/auth";
import { AVATARES, type AvatarId } from "@/lib/datos";
import { Aprobar, type Pendiente } from "@/components/admin-aprobar";

export default async function PaginaAprobar() {
  if ((await rolActual()) !== "admin") redirect("/admin/subir");
  const [fotos, videos] = await Promise.all([
    prisma.fotoLetra.findMany({ where: { estado: "pendiente" }, orderBy: { creadoEn: "desc" } }),
    prisma.expresion.findMany({ where: { estado: "pendiente" }, orderBy: { creadoEn: "desc" }, include: { categoria: true } }),
  ]);
  const pendientes: Pendiente[] = [
    ...fotos.map(f => ({ tipo: "foto" as const, id: f.id, titulo: `Foto de ${AVATARES[f.avatar as AvatarId]?.nombre ?? f.avatar} haciendo la ${f.letra}`, autor: f.autor ?? "alumna", fecha: f.creadoEn.toISOString(), url: f.url })),
    ...videos.map(v => ({ tipo: "video" as const, id: v.id, titulo: `Video «${v.nombre}» en ${v.categoria.titulo}`, autor: v.autor ?? "alumna", fecha: v.creadoEn.toISOString(), url: v.url })),
  ].sort((a, b) => b.fecha.localeCompare(a.fecha));
  return <Aprobar pendientes={pendientes} />;
}
