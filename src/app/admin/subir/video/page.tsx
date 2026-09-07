import { prisma } from "@/lib/prisma";
import { rolActual } from "@/lib/auth";
import { SubirVideo } from "@/components/admin-subir";

export default async function PaginaSubirVideo() {
  const [categorias, rol] = await Promise.all([
    prisma.categoria.findMany({ orderBy: { orden: "asc" }, select: { slug: true, titulo: true, emoji: true } }),
    rolActual(),
  ]);
  return <SubirVideo categorias={categorias} esAdmin={rol === "admin"} />;
}
