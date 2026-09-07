import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Expresiones } from "@/components/expresiones";

export const metadata: Metadata = { title: "Expresiones" };
export const dynamic = "force-dynamic";

export default async function PaginaExpresiones() {
  const categorias = await prisma.categoria.findMany({
    orderBy: { orden: "asc" },
    include: {
      expresiones: { where: { estado: "publicada" }, orderBy: [{ orden: "asc" }, { creadoEn: "asc" }], select: { id: true, nombre: true, url: true, poster: true, color: true } },
    },
  });
  return <Expresiones categorias={categorias.filter(c => c.expresiones.length).map(c => ({ id: c.id, slug: c.slug, titulo: c.titulo, emoji: c.emoji, items: c.expresiones }))} />;
}
