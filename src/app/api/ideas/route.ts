import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rolActual } from "@/lib/auth";

/* Buzón de ideas
   GET    → lista pública (últimas 100)
   POST   → cualquiera puede escribir (niños incluidos, sin cuenta)
   PATCH  → solo admin: estado y respuesta
   DELETE → solo admin: quita una idea inapropiada */

const seleccion = { id: true, tipo: true, nombre: true, mensaje: true, estado: true, respuesta: true, creadoEn: true } as const;

export async function GET() {
  const ideas = await prisma.idea.findMany({ orderBy: { creadoEn: "desc" }, take: 100, select: seleccion });
  return NextResponse.json(ideas, { headers: { "Cache-Control": "no-store" } });
}

const Nueva = z.object({
  tipo: z.enum(["idea", "error", "gusto"]).catch("idea"),
  nombre: z.string().trim().max(40).transform(v => v || "Anónimo"),
  mensaje: z.string().trim().min(3, "Cuéntanos un poquito más 🙂").max(400),
});

export async function POST(req: Request) {
  const datos = Nueva.safeParse(await req.json().catch(() => ({})));
  if (!datos.success) return NextResponse.json({ error: datos.error.issues[0]?.message ?? "Revisa el mensaje" }, { status: 400 });
  const idea = await prisma.idea.create({ data: datos.data, select: seleccion });
  return NextResponse.json(idea);
}

const Cambio = z.object({
  id: z.string(),
  estado: z.enum(["nueva", "en-proceso", "lista"]).optional(),
  respuesta: z.string().trim().max(300).optional(),
});

export async function PATCH(req: Request) {
  if ((await rolActual()) !== "admin") return NextResponse.json({ error: "Solo admin" }, { status: 401 });
  const datos = Cambio.safeParse(await req.json().catch(() => ({})));
  if (!datos.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  const { id, ...cambios } = datos.data;
  const idea = await prisma.idea.update({ where: { id }, data: cambios, select: seleccion }).catch(() => null);
  if (!idea) return NextResponse.json({ error: "No existe" }, { status: 404 });
  return NextResponse.json(idea);
}

export async function DELETE(req: Request) {
  if ((await rolActual()) !== "admin") return NextResponse.json({ error: "Solo admin" }, { status: 401 });
  const { id } = await req.json().catch(() => ({}));
  await prisma.idea.delete({ where: { id: String(id) } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
