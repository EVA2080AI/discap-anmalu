import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { rolActual } from "@/lib/auth";

/* Autoriza al navegador a subir un archivo directamente a Vercel Blob
   (así no pasamos por el límite de tamaño de las funciones). Solo con sesión. */
export async function POST(req: Request) {
  const body = (await req.json()) as HandleUploadBody;
  try {
    const respuesta = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async pathname => {
        const rol = await rolActual();
        if (!rol) throw new Error("Tu sesión caducó. Vuelve a entrar.");
        if (!/^subidas\//.test(pathname)) throw new Error("Ruta no permitida");
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/quicktime", "video/webm"],
          maximumSizeInBytes: 25 * 1024 * 1024,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ rol }),
        };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(respuesta);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
