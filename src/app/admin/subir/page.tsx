import { prisma } from "@/lib/prisma";
import { AVATAR_IDS, LETRAS } from "@/lib/datos";
import { SubirFoto } from "@/components/admin-subir";

export const dynamic = "force-dynamic";

export default async function PaginaSubirFoto() {
  // Letras con foto por niña: las 26 originales (sin Ñ) más las publicadas desde aquí.
  const publicadas = await prisma.fotoLetra.findMany({ where: { estado: "publicada" }, select: { avatar: true, letra: true } });
  const progreso = Object.fromEntries(AVATAR_IDS.map(a => {
    const letras = new Set(LETRAS.filter(l => l !== "Ñ"));
    publicadas.filter(p => p.avatar === a).forEach(p => letras.add(p.letra));
    return [a, letras.size];
  })) as Record<(typeof AVATAR_IDS)[number], number>;
  return <SubirFoto letrasConFoto={progreso} total={LETRAS.length} />;
}
