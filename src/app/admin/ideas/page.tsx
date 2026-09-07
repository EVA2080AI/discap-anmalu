import { prisma } from "@/lib/prisma";
import { rolActual } from "@/lib/auth";
import { AdminIdeas } from "@/components/admin-ideas";
import type { IdeaPublica } from "@/components/buzon-ideas";

export default async function PaginaAdminIdeas() {
  const [ideas, rol] = await Promise.all([
    prisma.idea.findMany({ orderBy: { creadoEn: "desc" }, take: 200 }),
    rolActual(),
  ]);
  const lista: IdeaPublica[] = ideas.map(i => ({ id: i.id, tipo: i.tipo as IdeaPublica["tipo"], nombre: i.nombre, mensaje: i.mensaje, estado: i.estado as IdeaPublica["estado"], respuesta: i.respuesta, creadoEn: i.creadoEn.toISOString() }));
  return <AdminIdeas ideas={lista} esAdmin={rol === "admin"} />;
}
