import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rolActual } from "@/lib/auth";
import { AVATARES, slug } from "@/lib/datos";

/* POST /api/publicar — registra un archivo ya subido al Blob.
     admin  → queda publicado de inmediato
     alumna → queda pendiente hasta que un admin lo apruebe */
const Foto = z.object({
  tipo: z.literal("foto"),
  url: z.string().url(),
  avatar: z.enum(["ana", "antonella", "mariapaula"]),
  letra: z.string().regex(/^[A-ZÑ]$/),
  autor: z.string().trim().max(40).optional(),
});
const Video = z.object({
  tipo: z.literal("video"),
  url: z.string().url(),
  categoria: z.string().trim().min(1).max(30), // slug existente o título nuevo
  nombre: z.string().trim().min(1).max(40),
  emoji: z.string().trim().max(4).optional(),
  autor: z.string().trim().max(40).optional(),
});
const Entrada = z.discriminatedUnion("tipo", [Foto, Video]);

export async function POST(req: Request) {
  const rol = await rolActual();
  if (!rol) return NextResponse.json({ error: "Tu sesión caducó. Vuelve a entrar." }, { status: 401 });
  const datos = Entrada.safeParse(await req.json().catch(() => ({})));
  if (!datos.success) return NextResponse.json({ error: "Faltan datos: revisa la niña, la letra o el nombre." }, { status: 400 });
  if (!/\.public\.blob\.vercel-storage\.com\//.test(datos.data.url)) return NextResponse.json({ error: "Archivo no válido" }, { status: 400 });

  const d = datos.data;
  const estado = rol === "admin" ? "publicada" : "pendiente";
  const autor = d.autor || (rol === "admin" ? "admin" : "alumna");

  if (d.tipo === "foto") {
    if (estado === "publicada") {
      await prisma.fotoLetra.updateMany({ where: { avatar: d.avatar, letra: d.letra, estado: "publicada" }, data: { estado: "reemplazada" } });
    }
    await prisma.fotoLetra.create({ data: { avatar: d.avatar, letra: d.letra, url: d.url, estado, autor } });
    revalidatePath("/traductor");
    return NextResponse.json(respuesta(estado, `Foto de ${AVATARES[d.avatar].nombre} haciendo la ${d.letra}`));
  }

  // video: categoría existente (por slug) o nueva (solo admin)
  const catSlug = slug(d.categoria);
  let categoria = await prisma.categoria.findUnique({ where: { slug: catSlug } });
  if (!categoria) {
    if (rol !== "admin") return NextResponse.json({ error: "Esa categoría no existe. Pídele a un admin que la cree." }, { status: 400 });
    const orden = await prisma.categoria.count();
    categoria = await prisma.categoria.create({ data: { slug: catSlug, titulo: d.categoria, emoji: d.emoji || "🎬", orden } });
  }
  const itemSlug = slug(d.nombre);
  if (estado === "publicada") {
    await prisma.expresion.updateMany({ where: { categoriaId: categoria.id, slug: itemSlug, estado: "publicada" }, data: { estado: "reemplazada" } });
  }
  const orden = await prisma.expresion.count({ where: { categoriaId: categoria.id } });
  await prisma.expresion.create({ data: { categoriaId: categoria.id, nombre: d.nombre, slug: itemSlug, url: d.url, estado, autor, orden } });
  revalidatePath("/expresiones");
  return NextResponse.json(respuesta(estado, `Video «${d.nombre}» en ${categoria.titulo}`));
}

function respuesta(estado: string, que: string) {
  return estado === "publicada"
    ? { estado, mensaje: `¡Publicado! ${que} ya está en la app.` }
    : { estado, mensaje: `¡Enviado! ${que} aparece en la app cuando un admin lo apruebe.` };
}
