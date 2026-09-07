import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rolActual } from "@/lib/auth";

/* POST /api/revisar { tipo: "foto"|"video", id, accion: "aprobar"|"rechazar" } — solo admin */
const Entrada = z.object({ tipo: z.enum(["foto", "video"]), id: z.string(), accion: z.enum(["aprobar", "rechazar"]) });

export async function POST(req: Request) {
  if ((await rolActual()) !== "admin") return NextResponse.json({ error: "Solo admin" }, { status: 401 });
  const datos = Entrada.safeParse(await req.json().catch(() => ({})));
  if (!datos.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  const { tipo, id, accion } = datos.data;
  const nuevo = accion === "aprobar" ? "publicada" : "rechazada";

  if (tipo === "foto") {
    const f = await prisma.fotoLetra.findUnique({ where: { id } });
    if (!f) return NextResponse.json({ error: "No existe" }, { status: 404 });
    if (nuevo === "publicada") await prisma.fotoLetra.updateMany({ where: { avatar: f.avatar, letra: f.letra, estado: "publicada" }, data: { estado: "reemplazada" } });
    await prisma.fotoLetra.update({ where: { id }, data: { estado: nuevo } });
    revalidatePath("/traductor");
  } else {
    const e = await prisma.expresion.findUnique({ where: { id } });
    if (!e) return NextResponse.json({ error: "No existe" }, { status: 404 });
    if (nuevo === "publicada") await prisma.expresion.updateMany({ where: { categoriaId: e.categoriaId, slug: e.slug, estado: "publicada" }, data: { estado: "reemplazada" } });
    await prisma.expresion.update({ where: { id }, data: { estado: nuevo } });
    revalidatePath("/expresiones");
  }
  return NextResponse.json({ ok: true, mensaje: accion === "aprobar" ? "Aprobado. Ya está en la app." : "Rechazado." });
}
