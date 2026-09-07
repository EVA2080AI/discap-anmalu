import type { Metadata } from "next";
import { rolActual } from "@/lib/auth";
import { AdminEntrar } from "@/components/admin-entrar";
import { AdminBarra } from "@/components/admin-barra";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Zona de subidas", robots: { index: false } };
export const dynamic = "force-dynamic";

/** Todo lo que cuelga de /admin exige sesión. Sin sesión, se muestra el formulario de entrada. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const rol = await rolActual();
  if (!rol) return <AdminEntrar />;
  const pendientes = rol === "admin"
    ? (await prisma.fotoLetra.count({ where: { estado: "pendiente" } })) + (await prisma.expresion.count({ where: { estado: "pendiente" } }))
    : 0;
  return (
    <div className="aparecer">
      <AdminBarra rol={rol} pendientes={pendientes} />
      {children}
    </div>
  );
}
