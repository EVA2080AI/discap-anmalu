import { NextResponse } from "next/server";
import { rolDeClave, crearSesion, cerrarSesion, rolActual } from "@/lib/auth";

/* POST { clave } → crea la cookie de sesión (12 h). DELETE → cierra sesión. GET → rol actual. */
export async function POST(req: Request) {
  const { clave } = await req.json().catch(() => ({}));
  const rol = rolDeClave(String(clave ?? ""));
  if (!rol) return NextResponse.json({ error: "Esa clave no es. Pídesela a tu profe o escribe a discap.amalu@gmail.com" }, { status: 401 });
  await crearSesion(rol);
  return NextResponse.json({ rol });
}

export async function DELETE() {
  await cerrarSesion();
  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ rol: await rolActual() }, { headers: { "Cache-Control": "no-store" } });
}
