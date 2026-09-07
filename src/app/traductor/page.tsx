import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { Traductor } from "@/components/traductor";

export const metadata: Metadata = { title: "Traductor" };
export const dynamic = "force-dynamic";

export default async function PaginaTraductor() {
  // Fotos subidas desde la zona de subidas que reemplazan (o agregan, como la Ñ) a las originales.
  const fotos = await prisma.fotoLetra.findMany({
    where: { estado: "publicada" },
    orderBy: { creadoEn: "desc" },
    select: { avatar: true, letra: true, url: true },
  });
  const extra: Record<string, string> = {};
  for (const f of fotos) {
    const clave = `${f.avatar}/${f.letra}`;
    if (!extra[clave]) extra[clave] = f.url; // la más reciente gana
  }
  return (
    <Suspense>
      <Traductor fotosExtra={extra} />
    </Suspense>
  );
}
