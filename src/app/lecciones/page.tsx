import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Lecciones } from "@/components/lecciones";

export const metadata: Metadata = { title: "Lecciones" };
export const dynamic = "force-dynamic";

export default async function PaginaLecciones() {
  const categorias = await prisma.categoria.findMany({
    orderBy: { orden: "asc" },
    include: { expresiones: { where: { estado: "publicada" }, orderBy: [{ orden: "asc" }, { creadoEn: "asc" }], select: { id: true, nombre: true, url: true, poster: true, color: true } } },
  });
  return <Lecciones lecciones={categorias.filter(c => c.expresiones.length).map(c => ({ slug: c.slug, titulo: c.titulo, emoji: c.emoji, items: c.expresiones }))} />;
}
