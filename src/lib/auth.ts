import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

/* Sesión de la zona de subidas.
   Hay dos claves (ADMIN_CLAVE y ALUMNA_CLAVE). La clave se usa una sola vez al
   entrar; a cambio se guarda una cookie httpOnly con un JWT firmado que caduca
   en 12 horas. El navegador nunca guarda la clave. Mismo patrón que Faro. */

export type Rol = "admin" | "alumna";

const COOKIE = "anmalu_sesion";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? "solo-desarrollo");

export function rolDeClave(clave: string): Rol | null {
  const c = clave.trim();
  if (!c) return null;
  if (process.env.ADMIN_CLAVE && c === process.env.ADMIN_CLAVE) return "admin";
  if (process.env.ALUMNA_CLAVE && c === process.env.ALUMNA_CLAVE) return "alumna";
  return null;
}

export async function crearSesion(rol: Rol) {
  const jwt = await new SignJWT({ rol })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret);
  (await cookies()).set(COOKIE, jwt, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 12 * 3600,
  });
}

export async function cerrarSesion() {
  (await cookies()).delete(COOKIE);
}

export async function rolActual(): Promise<Rol | null> {
  try {
    const valor = (await cookies()).get(COOKIE)?.value;
    if (!valor) return null;
    const { payload } = await jwtVerify(valor, secret);
    return payload.rol === "admin" || payload.rol === "alumna" ? payload.rol : null;
  } catch {
    return null;
  }
}
