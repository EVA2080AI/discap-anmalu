import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Practicar } from "@/components/practicar";

export const metadata: Metadata = { title: "Practicar" };
export const dynamic = "force-dynamic";

export default async function PaginaPracticar() {
  const fotos = await prisma.fotoLetra.findMany({ where: { estado: "publicada" }, orderBy: { creadoEn: "desc" }, select: { avatar: true, letra: true, url: true } });
  const extra: Record<string, string> = {};
  for (const f of fotos) { const k = `${f.avatar}/${f.letra}`; if (!extra[k]) extra[k] = f.url; }
  return <Practicar fotosExtra={extra} />;
}
