// Semilla: carga las categorías y los 24 videos originales (que viven en /public/video).
// Se puede correr varias veces: no duplica.
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";

const prisma = new PrismaClient();
const semilla = JSON.parse(readFileSync(new URL("./expresiones-semilla.json", import.meta.url), "utf8"));

let orden = 0;
for (const [slug, cat] of Object.entries(semilla)) {
  const categoria = await prisma.categoria.upsert({
    where: { slug },
    update: { titulo: cat.titulo, emoji: cat.emoji, orden },
    create: { slug, titulo: cat.titulo, emoji: cat.emoji, orden },
  });
  let i = 0;
  for (const item of cat.items) {
    const itemSlug = item.archivo.replace(/\.mp4$/, "");
    const existente = await prisma.expresion.findFirst({ where: { categoriaId: categoria.id, slug: itemSlug, estado: "publicada" } });
    const datos = {
      nombre: item.nombre,
      slug: itemSlug,
      url: `/video/${slug}/${item.archivo}`,
      poster: `/video/${slug}/${itemSlug}.jpg`,
      color: item.color ?? null,
      orden: i++,
      estado: "publicada",
      autor: "semilla",
    };
    if (existente) await prisma.expresion.update({ where: { id: existente.id }, data: datos });
    else await prisma.expresion.create({ data: { ...datos, categoriaId: categoria.id } });
  }
  orden++;
  console.log(`✓ ${cat.titulo}: ${cat.items.length} videos`);
}
await prisma.$disconnect();
